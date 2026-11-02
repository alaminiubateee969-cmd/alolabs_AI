import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authoriseTool } from '../../../src/lib/tools/policy.ts';

const permission = { allowedTools: ['example'], forbiddenTools: [] };
test('high-risk and approval-required tools fail closed, even with an unverified ID', () => {
  for (const tool of [
    { name: 'example', risk: 'high', requiresApproval: false },
    { name: 'example', risk: 'low', requiresApproval: true },
  ]) {
    assert.equal(authoriseTool(tool, permission).allowed, false);
    assert.equal(authoriseTool(tool, permission, { approvalId: 'forged-or-other-tenant' }).allowed, false);
  }
});

test('read-only tools still require an explicit grant and forbidden wins', () => {
  const tool = { name: 'example', risk: 'low', requiresApproval: false };
  assert.equal(authoriseTool(tool, permission).allowed, true);
  assert.equal(authoriseTool(tool, { allowedTools: [], forbiddenTools: [] }).allowed, false);
  assert.equal(authoriseTool(tool, { allowedTools: ['example'], forbiddenTools: ['example'] }).allowed, false);
  assert.equal(authoriseTool(undefined, permission).allowed, false);
});
