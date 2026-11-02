import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendHttpSms } from '../../src/lib/sms/httpsms-client.ts';

const config = { baseUrl: 'https://sms.example.test/api', apiKey: 'secret', timeoutMs: 1000 };
const message = { from: '+18005550199', to: '+18005550100', content: 'hello', requestId: 'request-1' };

test('sends the documented httpSMS contract and returns acceptance, not delivery', async () => {
  let calls = 0;
  const result = await sendHttpSms(config, message, async (url, init) => {
    calls++;
    assert.equal(String(url), 'https://sms.example.test/api/v1/messages/send');
    assert.equal(init.method, 'POST');
    assert.equal(init.redirect, 'error');
    assert.equal(init.headers['x-api-key'], 'secret');
    assert.deepEqual(JSON.parse(init.body), { from: message.from, to: message.to, content: 'hello', request_id: 'request-1' });
    return Response.json({ data: { id: 'provider-id' }, status: 'success' });
  });
  assert.deepEqual(result, { id: 'provider-id', status: 'accepted' });
  assert.equal(calls, 1);
});

test('invalid configuration and messages fail before transport', async () => {
  let calls = 0;
  const transport = async () => { calls++; throw new Error('unexpected'); };
  for (const [cfg, msg] of [
    [{ ...config, baseUrl: 'http://example.test' }, message],
    [{ ...config, baseUrl: 'https://name:password@example.test' }, message],
    [{ ...config, apiKey: '' }, message],
    [config, { ...message, to: '555' }],
    [config, { ...message, content: ' ' }],
    [config, { ...message, requestId: 'bad id' }],
  ]) await assert.rejects(sendHttpSms(cfg, msg, transport));
  assert.equal(calls, 0);
});

test('handles provider errors and ambiguous outcomes without retry or leaking response', async () => {
  for (const [transport, kind, status] of [
    [async () => new Response('secret', { status: 401 }), 'provider', 401],
    [async () => new Response('secret', { status: 503 }), 'unknown_outcome', 503],
    [async () => new Response('not json'), 'unknown_outcome', undefined],
    [async () => Response.json({ data: {} }), 'unknown_outcome', undefined],
    [async () => { throw new Error('secret'); }, 'unknown_outcome', undefined],
  ]) {
    let calls = 0;
    await assert.rejects(sendHttpSms(config, message, async (...args) => { calls++; return transport(...args); }), (error) => {
      assert.equal(error.kind, kind); assert.equal(error.status, status);
      assert.ok(!error.message.includes('secret'));
      return true;
    });
    assert.equal(calls, 1);
  }
});
