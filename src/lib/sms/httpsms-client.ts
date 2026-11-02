/** Server-side httpSMS send adapter. A provider acceptance is not delivery. */
export interface HttpSmsSend {
  from: string;
  to: string;
  content: string;
  requestId?: string;
}

export interface HttpSmsConfig {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export class HttpSmsError extends Error {
  readonly kind: 'configuration' | 'validation' | 'provider' | 'unknown_outcome';
  readonly status?: number;
  constructor(message: string, kind: HttpSmsError['kind'], status?: number) {
    super(message);
    this.name = 'HttpSmsError';
    this.kind = kind;
    this.status = status;
  }
}

/**
 * Configuration is server-controlled, not taken from incoming requests. Do not
 * automatically retry: timeouts and malformed success responses may follow a
 * successful provider submission. request_id is correlation, not guaranteed
 * idempotency. No delivery or webhook state is inferred here.
 */
export async function sendHttpSms(config: HttpSmsConfig, message: HttpSmsSend, transport: typeof fetch = fetch): Promise<{ id: string; status: 'accepted' }> {
  let base: URL;
  try { base = new URL(config.baseUrl); } catch { throw new HttpSmsError('Invalid httpSMS base URL', 'configuration'); }
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash || !config.apiKey?.trim()) {
    throw new HttpSmsError('httpSMS requires an HTTPS URL and API key', 'configuration');
  }
  if (!/^\+[1-9]\d{6,14}$/.test(message.from) || !/^\+[1-9]\d{6,14}$/.test(message.to) || !message.content?.trim() || message.content.length > 1600 || (message.requestId !== undefined && !/^[a-zA-Z0-9_-]{1,128}$/.test(message.requestId))) {
    throw new HttpSmsError('Invalid SMS parameters', 'validation');
  }
  const timeoutMs = config.timeoutMs ?? 10_000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 120_000) throw new HttpSmsError('Invalid timeout', 'configuration');
  const url = new URL(`${base.pathname.replace(/\/+$/, '')}/v1/messages/send`, base.origin);
  let response: Response;
  try {
    response = await transport(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
      headers: { 'x-api-key': config.apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ from: message.from, to: message.to, content: message.content, ...(message.requestId ? { request_id: message.requestId } : {}) }),
    });
  } catch {
    throw new HttpSmsError('httpSMS request failed; submission outcome is unknown', 'unknown_outcome');
  }
  if (!response.ok) {
    if (response.status >= 500 || response.status === 408) throw new HttpSmsError('httpSMS request failed; submission outcome is unknown', 'unknown_outcome', response.status);
    throw new HttpSmsError('httpSMS rejected the request', 'provider', response.status);
  }
  let payload: unknown;
  try { payload = await response.json(); } catch { throw new HttpSmsError('Invalid httpSMS response; submission outcome is unknown', 'unknown_outcome'); }
  const data = (payload as { data?: { id?: unknown } } | null)?.data;
  if (typeof data?.id !== 'string' || !data.id.trim()) throw new HttpSmsError('Missing httpSMS message ID; submission outcome is unknown', 'unknown_outcome');
  return { id: data.id, status: 'accepted' };
}
