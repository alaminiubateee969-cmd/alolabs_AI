/**
 * Tool authorisation policy.
 *
 * Pure functions — no database, no I/O — so the decision can be unit-tested
 * exhaustively. The rule is deny-by-default:
 *
 *   1. the tool must exist in the registry;
 *   2. the agent must list it in `allowedTools`;
 *   3. the agent must not list it in `forbiddenTools` (forbidden wins);
 *   4. approval-required tools remain blocked until approval validation is implemented.
 * A caller-supplied approval ID alone is not proof of a human decision.
 *
 * `*` and prefix wildcards are deliberately NOT supported: a workforce of 2,000
 * agents should not be able to inherit a blanket grant by accident.
 */

import type { ToolAuthorisation, ToolDefinition } from './types';

export function parseToolList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    // Fall through to the pipe/comma form used by the workforce CSVs.
  }
  return trimmed
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export interface AgentToolPermissions {
  allowedTools: unknown;
  forbiddenTools: unknown;
}

export function authoriseTool(
  tool: Pick<ToolDefinition, 'name' | 'risk' | 'requiresApproval'> | undefined,
  permissions: AgentToolPermissions,
  _options: { approvalId?: string | null } = {},
): ToolAuthorisation {
  if (!tool) {
    return { allowed: false, reason: 'Tool is not registered' };
  }

  const allowed = parseToolList(permissions.allowedTools);
  const forbidden = parseToolList(permissions.forbiddenTools);

  if (forbidden.includes(tool.name)) {
    return { allowed: false, reason: `Tool "${tool.name}" is explicitly forbidden for this agent` };
  }
  if (!allowed.includes(tool.name)) {
    return { allowed: false, reason: `Tool "${tool.name}" is not in this agent's allowed tools` };
  }
  // An ID has not been checked for status, tenant, action, arguments, expiry or
  // replay. Until that binding exists, never allow privileged execution.
  if (tool.risk === 'high' || tool.requiresApproval) {
    return { allowed: false, reason: `Tool "${tool.name}" is blocked: verified human approval enforcement is unavailable` };
  }

  return { allowed: true, reason: 'Allowed' };
}
