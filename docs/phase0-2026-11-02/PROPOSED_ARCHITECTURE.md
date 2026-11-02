# Phase 0 — conceptual target architecture (proposal only)

**Not an implementation approval or production design.** Existing code and historical evidence are in [repository audit](REPOSITORY_AUDIT.md). Phase 1 must validate this concept, produce detailed contracts and obtain owner approval before implementation. Do not infer availability from the diagram.

```text
Owner / Super Admin UI [real evidence-backed status only]
   │ authenticated, tenant-scoped requests
   ▼
Policy / approval / audit boundary ◄──── human review of privileged actions
   │ action-bound, expiring decisions; default deny
   ▼
Durable orchestrator + task ledger / outbox ──► artifact & provenance store
   │ structured tasks, leases, cancellation       │ tenant/project ACL, retention
   ├──► local model gateway ──► optional local model processes
   ├──► optional external provider adapters (disabled by default)
   ├──► research/QA workers ──► disposable isolated sandbox + restricted egress
   ├──► coding workers ────────► session branch, test and diff review
   └──► optional creative / communications workers behind explicit approval
```

Specialized agents should be capability profiles over the same controlled runtime, not 20 separately trusted services. Proposed profiles: orchestrator, research, repository audit, architecture, reverse engineering, browser, API, Android, binary, database analysis, UX, coding, frontend, backend, database engineering, security, QA, DevOps, documentation and review. Every task contract should include tenant/project ownership, unique task and agent IDs, objective, immutable input references and provenance, permission scope, expected output schema, limits/deadline, state, retry and idempotency policy, approval policy and audit correlation. Effectful actions must be intercepted at the tool boundary, not merely described in a prompt. Review any existing implementation before extending it.

## Conceptual boundaries

- **Orchestration**: persist state transitions, leases and attempts. No claim of exactly-once external effects; use a transactional outbox where feasible, provider-specific idempotency and reconciliation. Verify restart/concurrency/fencing using disposable infrastructure.
- **Authorization**: tenant/project-scoped identity, read-only default, explicit per-effect approval bound to action, arguments and resource with expiry; no implicit inheritance of production credentials. Signed audit event design and replay defense require threat modeling and key lifecycle review.
- **Research lab**: verify written authorization and permitted targets. No DRM/access-control bypass; static/dynamic binary and Android work only in isolated disposable sandboxes with CPU/memory/disk/time quotas and no production credentials. Containers alone are not an established hostile-code boundary; evaluate VM/microVM isolation, egress policy and artifact scanning.
- **Software factory**: this Arena session is tied to its existing branch; do not create/switch branches here. Future independent workers may use isolated approved branches under their own scoped credentials, not `main`. Human approval is required for PR merge and production deployment. Tests and findings must accompany each proposed diff.
- **Memory**: records require owner, project, source reference/hash, timestamp, confidence, retention and access controls; retrieved documents are untrusted data, not tool instructions. Tenant isolation and deletion/retention tests required.
- **QA**: local reproducible unit/API/browser suites and accessibility, visual, performance and security checks; untrusted inputs sandboxed; actual run result and environment recorded. Optional commercial services remain optional.
- **Creative**: separate opt-in workers and model dependencies; consent and rights checks, human-controlled external publication, CPU/GPU budgets and separate licence verification.
- **Dashboard**: show implemented, partial, experimental, planned, blocked and approval-required states sourced from actual run/health evidence, never static demo success.

## Model strategy

The existing Ollama-compatible adapter and local inference compose are code/config evidence only. Validate a real configured model in staging before calling it operational. Specify model version, health, task budget, context/token limit, timeout, rate/queue limits and output provenance. External APIs are optional and disabled unless explicitly approved; a local alternative may not cover every model capability or hardware profile.

## Conceptual data model and change control

Prefer existing run/task/approval/audit models where appropriate; examine schema and actual production engine first. Conceptual additions or changes are **not approved migrations**. Enumerate keys, tenant ownership, constraints, indexes, backfills and rollback on an isolated database copy. Verify backup and restore before any migration; obtain explicit owner approval. SQLite, MySQL and PostgreSQL are not interchangeable.

## Capacity planning — rough hypotheses, not requirements or validated measurements

A minimal control-plane staging trial could begin with approximately 4 vCPU / 8–16 GiB RAM and SSD, excluding model/media execution. A small local LLM can require several GiB of RAM or VRAM depending on model/quantization/context; larger vision/audio/video jobs may require substantially more and must be separately benchmarked. Disk budget must include model weights, artifacts, temporary files and encrypted backup copies. These are planning starting points, not deployment recommendations or claims about the owner's hardware.
