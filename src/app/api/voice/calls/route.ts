import { db } from '@/lib/db'
import { readJson, requireString, optionalString, optionalNumber, withCompany } from '@/lib/voice/api-helpers'
import { startCall, answerCall, endCall, holdCall, transferCall } from '@/lib/voice/call-service'
import { isCallState } from '@/lib/voice/call-state'
import { CALL_STATES } from '@/lib/voice/call-state'

export const dynamic = 'force-dynamic'

/**
 * Call management (Modules A, E, F).
 * GET  — tenant-scoped call history with pagination + status filter.
 * POST — start a call (inbound simulation via sandbox or outbound dial).
 * PATCH — drive the lifecycle of one call: answer / hold / resume / transfer / end.
 */
export async function GET(request: Request) {
  return withCompany(async (auth) => {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const direction = searchParams.get('direction')
    const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '50') || 50))
    const where = {
      companyId: auth.companyId,
      ...(status ? { status } : {}),
      ...(direction ? { direction } : {}),
    }
    const [total, data] = await Promise.all([
      db.callSession.count({ where }),
      db.callSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { events: { orderBy: { createdAt: 'asc' }, take: 20 } },
      }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  })
}

export async function POST(request: Request) {
  return withCompany(async (auth) => {
    const body = await readJson(request)
    if (!body) throw new Error('Invalid request: JSON body required')
    const from = requireString(body, 'from')
    const to = requireString(body, 'to')
    const direction = optionalString(body, 'direction') === 'inbound' ? 'inbound' : 'outbound'

    // Resolve the provider from the tenant's number when possible, so sandbox
    // vs real adapter selection is a property of the number, not the caller.
    let provider = optionalString(body, 'provider')
    if (!provider && body.phoneNumberId) {
      const number = await db.phoneNumber.findFirst({
        where: { id: String(body.phoneNumberId), companyId: auth.companyId },
        select: { provider: true },
      })
      provider = number?.provider
    }
    if (!provider) {
      const activeNumber = await db.phoneNumber.findFirst({
        where: { companyId: auth.companyId, status: 'active' },
        orderBy: { createdAt: 'desc' },
        select: { provider: true },
      })
      provider = activeNumber?.provider ?? 'sandbox'
    }

    const started = await startCall({
      companyId: auth.companyId,
      direction,
      from,
      to,
      provider,
      phoneNumberId: optionalString(body, 'phoneNumberId'),
      voiceAgentId: optionalString(body, 'voiceAgentId'),
      agentType: (optionalString(body, 'agentType') as 'ai' | 'human' | 'ivr') ?? 'ai',
      assignedUserId: optionalString(body, 'assignedUserId') ?? auth.userId,
      sandboxBehavior: optionalString(body, 'sandboxBehavior') as never,
    })
    return {
      data: started,
      notice: started.simulated
        ? 'Simulated call (sandbox adapter) — no real telephone network was contacted.'
        : 'Call handed to the configured telephony provider.',
    }
  })
}

const ACTIONS = new Set(['answer', 'hold', 'resume', 'transfer', 'end'])

export async function PATCH(request: Request) {
  return withCompany(async (auth) => {
    const body = await readJson(request)
    if (!body) throw new Error('Invalid request: JSON body required')
    const callId = requireString(body, 'callId')
    const action = requireString(body, 'action')
    if (!ACTIONS.has(action)) {
      throw new Error(`Invalid request: action must be one of ${[...ACTIONS].join(', ')}`)
    }

    switch (action) {
      case 'answer':
        await answerCall(callId, auth.companyId)
        return { data: { ok: true, action } }
      case 'hold':
        await holdCall(callId, auth.companyId, true)
        return { data: { ok: true, action } }
      case 'resume':
        await holdCall(callId, auth.companyId, false)
        return { data: { ok: true, action } }
      case 'transfer': {
        const target = requireString(body, 'target')
        await transferCall(callId, auth.companyId, target, optionalString(body, 'reason'))
        return { data: { ok: true, action, target } }
      }
      case 'end': {
        const finalState = optionalString(body, 'finalState') ?? 'completed'
        if (!isCallState(finalState)) {
          throw new Error(`Invalid request: finalState must be one of ${CALL_STATES.join(', ')}`)
        }
        const result = await endCall(callId, auth.companyId, finalState, optionalString(body, 'reason'))
        return { data: { ok: true, action, ...result } }
      }
      default:
        throw new Error('Invalid request: unsupported action')
    }
  })
}
