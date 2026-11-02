import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

test('worker purges only legacy AgentOS caches and never serves cached pages', async () => {
  const handlers = new Map()
  const deleted = []
  let claimed = false
  const context = {
    self: { addEventListener: (name, callback) => handlers.set(name, callback), skipWaiting: async () => {}, clients: { claim: async () => { claimed = true } } },
    caches: { keys: async () => ['alo-agentos-v1', 'other-app-v1'], delete: async key => { deleted.push(key) } },
  }
  vm.runInNewContext(await readFile('public/sw.js', 'utf8'), context)
  assert.equal(handlers.has('fetch'), false)
  let pending
  handlers.get('activate')({ waitUntil: promise => { pending = promise } })
  await pending
  assert.deepEqual(deleted, ['alo-agentos-v1'])
  assert.equal(claimed, true)
})
