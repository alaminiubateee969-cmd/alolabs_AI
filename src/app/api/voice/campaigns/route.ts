import { db } from '@/lib/db'
import { readJson, requireString, optionalString, optionalNumber, withCompany } from '@/lib/voice/api-helpers'
import { prepareCampaignCall, dialCampaignCall } from '@/lib/voice/campaigns'

export const dynamic = 'force-dynamic'

/**
 * Outbound campaign management (Module F) with structural compliance:
 * POST /prepare runs every contact through DNC → attempt caps → calling hours
 * BEFORE any dialing, and POST /dial only dials contacts that passed.
 */
export async function GET() {
  return withCompany(async (auth) => {
    const campaigns = await db.campaign.findMany({
      where: { companyId: auth.companyId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { campaignCalls: { orderBy: { createdAt: 'desc' }, take: 25 } },
    })
    return { data: campaigns, total: campaigns.length }
  })
}

export async function POST(request: Request) {
  return withCompany(async (auth) => {
    const body = await readJson(request)
    if (!body) throw new Error('Invalid request: JSON body required')
    const name = requireString(body, 'name')
    const campaign = await db.campaign.create({
      data: {
        companyId: auth.companyId,
        name,
        description: optionalString(body, 'description'),
        type: optionalString(body, 'type') ?? 'follow_up',
        script: optionalString(body, 'script'),
        voiceAgentId: optionalString(body, 'voiceAgentId'),
        phoneNumberId: optionalString(body, 'phoneNumberId'),
        // Compliance defaults: Bangladesh calling hours, DNC respected.
        respectDnc: body.respectDnc !== false,
        recordingDisclosure: optionalString(body, 'recordingDisclosure'),
      },
    })
    return { data: campaign }
  })
}

/**
 * POST { action: 'prepare', campaignId, contacts: [{contactId?, destinationNumber}] }
 * POST { action: 'dial', campaignCallId }
 */
export async function PATCH(request: Request) {
  return withCompany(async (auth) => {
    const body = await readJson(request)
    if (!body) throw new Error('Invalid request: JSON body required')
    const action = requireString(body, 'action')

    if (action === 'prepare') {
      const campaignId = requireString(body, 'campaignId')
      const campaign = await db.campaign.findFirst({
        where: { id: campaignId, companyId: auth.companyId },
      })
      if (!campaign) throw new Error(`campaign ${campaignId} not found for this tenant`)
      const contacts = Array.isArray(body.contacts) ? body.contacts : []
      if (contacts.length === 0) throw new Error('Invalid request: contacts array required')
      const results = []
      for (const raw of contacts) {
        const c = raw as Record<string, unknown>
        const number = typeof c.destinationNumber === 'string' ? c.destinationNumber : null
        if (!number) continue
        results.push(
          await prepareCampaignCall({
            campaignId: campaign.id,
            companyId: auth.companyId,
            destinationNumber: number,
            contactId: typeof c.contactId === 'string' ? c.contactId : null,
            respectDnc: campaign.respectDnc,
            callingHoursRaw: campaign.callingHours,
            maxAttemptsPerContact: campaign.maxAttemptsPerContact,
            minGapMinutesPerContact: campaign.minGapMinutesPerContact,
          }),
        )
      }
      return { data: results }
    }

    if (action === 'dial') {
      const campaignCallId = requireString(body, 'campaignCallId')
      const cc = await db.campaignCall.findFirst({
        where: { id: campaignCallId, companyId: auth.companyId },
        include: { campaign: true },
      })
      if (!cc) throw new Error(`campaign call ${campaignCallId} not found for this tenant`)
      const number = cc.campaign.phoneNumberId
        ? await db.phoneNumber.findFirst({
            where: { id: cc.campaign.phoneNumberId, companyId: auth.companyId },
            select: { e164: true, provider: true },
          })
        : null
      const result = await dialCampaignCall({
        campaignCallId: cc.id,
        companyId: auth.companyId,
        provider: number?.provider ?? 'sandbox',
        fromNumber: number?.e164 ?? '+8800000000000',
        voiceAgentId: cc.campaign.voiceAgentId ?? undefined,
      })
      return {
        data: result,
        notice: result.simulated
          ? 'Simulated dial (sandbox) — no real telephone network was contacted.'
          : 'Dial handed to the configured telephony provider.',
      }
    }

    throw new Error('Invalid request: action must be "prepare" or "dial"')
  })
}
