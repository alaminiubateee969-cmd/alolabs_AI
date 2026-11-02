# Phase 0 — risk register

| Priority | Risk | Evidence / effect | Proposed gate (not implemented here) |
| --- | --- | --- | --- |
| Critical | Unauthorized side effects | Tool, route and approval surfaces exist; universal enforcement unverified | Default deny; approval bound to actor, tenant, action, resource, exact arguments and expiry; durable audit; negative tests. |
| Critical | Untrusted code / prompt injection | External repo and skill text may direct tool use | Disposable VM/microVM or equivalent evaluated isolation, no secrets, egress deny by default, quarantine and provenance; verify escapes. |
| Critical | Data loss or database corruption | Production engine/topology and current backup unverified | No migrations or writes; inventory, consistent backup, isolated restore, row/constraint comparison, explicit approval. |
| High | Cross-tenant data access | Route isolation not comprehensively tested; SMS data stored in shared settings | Tenant-aware authorization and negative tests across all paths before new provider wiring. |
| High | Duplicate SMS/external effects | Network failure may have unknown outcome | Approval, durable outbox, idempotency where provider supports it, reconciliation; no blind retry. |
| High | Queue recovery / duplicate execution | `ALO_LABS_QUEUE_RECOVERY_TEST.md` does not establish real restart correctness | Disposable worker kill/restart, concurrent lease/fencing and replay tests. |
| High | Licence and supply chain | Mixed/custom licences and unpinned dependencies/weights | Exact-version SBOM, licence/NOTICE and vulnerability review, pinned artifacts, scan before installation. |
| High | Sensitive data leakage | Shared memory/tool context and untrusted outputs | Provenance, tenant/project ownership, content boundaries, secret filtering and adversarial tests. |
| High | False operational readiness | Screens and prior reports may describe code rather than runtime | States tied to evidence timestamps, tests and actual service telemetry; unavailable must not display as live. |
| High | External services and hardware | Model weights, WhatsApp, telecom and voice/video hardware requirements | Explicit optional adapters, budget, permission, egress controls and measured capacity. |
| Medium | Infrastructure mismatch | Hostinger, Office A/B, networking, backup and restore not inspected | Read-only infrastructure assessment; separate approval for any change. |
