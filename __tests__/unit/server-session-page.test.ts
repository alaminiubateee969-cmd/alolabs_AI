import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  verify: vi.fn(),
  findUser: vi.fn(),
  redirect: vi.fn((target: string): never => { throw new Error(`redirect:${target}`) }),
}))
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => mocks.cookie ? { value: mocks.cookie } : undefined }) }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
vi.mock('@/lib/auth', () => ({ verifySessionToken: mocks.verify }))
vi.mock('@/lib/db', () => ({ db: { user: { findUnique: mocks.findUser } } }))

import { getServerSession, requireServerSession } from '@/lib/server-session'

describe('private page session gate', () => {
  beforeEach(() => { mocks.cookie = undefined; mocks.verify.mockReset(); mocks.findUser.mockReset() })
  it('redirects a visitor without a session before user lookup', async () => {
    await expect(requireServerSession('/dashboard')).rejects.toThrow('redirect:/login?next=%2Fdashboard')
    expect(mocks.verify).not.toHaveBeenCalled()
  })
  it('rejects forged, expired, or revoked sessions returned as invalid', async () => {
    mocks.cookie = 'forged'; mocks.verify.mockResolvedValue(null)
    await expect(requireServerSession('/dashboard')).rejects.toThrow('redirect:/login?next=%2Fdashboard')
    expect(mocks.findUser).not.toHaveBeenCalled()
  })
  it('rejects a deactivated user and accepts only an active user', async () => {
    mocks.cookie = 'live'; mocks.verify.mockResolvedValue({ userId: 'u1' })
    mocks.findUser.mockResolvedValue({ id: 'u1', email: 'x@example.test', name: 'Example', role: 'viewer', isActive: false })
    expect(await getServerSession()).toBeNull()
    mocks.findUser.mockResolvedValue({ id: 'u1', email: 'x@example.test', name: 'Example', role: 'viewer', isActive: true })
    expect((await getServerSession())?.user.id).toBe('u1')
  })
})
