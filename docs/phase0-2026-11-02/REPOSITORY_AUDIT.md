# Phase 0 — repository and evidence audit

Snapshot: 2026-11-02, branch `arena/7247eb38-alolabs-ai`. This is not a clean-tree baseline: pre-existing modifications include skill sync/catalog, link registry/tests, the untracked httpSMS client and two prior reports. They were present before this audit and were not changed or discarded in Phase 0. No production systems, live DB, credentials, schema, backups or network topology were accessed. No build or test suite was run in this phase; `node_modules` is absent. Existing reports describe previous checks, not new test results.

| Area | Source evidence | Current evidence status |
| --- | --- | --- |
| Web/API | `package.json`, `src/app/api`, `src/components` | Next.js/React/TypeScript code present; all endpoint security and UI state not verified. |
| Agent orchestration | `src/lib/agent-runtime/tool-loop.ts`, `src/lib/job-queue.ts`, `src/instrumentation.node.ts` | Tool loop, queue code and worker exist; restart/side-effect recovery not demonstrated here; see `ALO_LABS_QUEUE_RECOVERY_TEST.md`. |
| Governance | `src/app/api/approvals`, `src/app/api/agent-permissions`, `src/lib/tools` | Permission/approval surfaces exist; universal fail-closed privileged-action enforcement, signed audits and replay prevention not verified. |
| Skills | `src/lib/agent-skills/catalog.json`, `src/lib/agent-skills/index.ts`, `src/lib/agent-skills/THIRD_PARTY_NOTICES.md` | Instruction-only catalog, advisory/quarantine distinction; does not install upstream tools or guarantee safe guidance. Some entries came from pre-existing uncommitted changes. |
| Memory | `src/lib/memory`, `src/app/api/agent-memory`, `src/app/api/company-memory` | Surfaces exist; provenance, retention, scope isolation and injection controls not fully verified. |
| Local models | `src/lib/ai-router/ollama-provider.ts`, `docker-compose.inference.yml` | Local adapter/compose definitions exist; local model installed, available and working is not established. |
| Communications | `src/app/api/sms/route.ts`, `src/app/api/whatsapp/send/route.ts`, untracked `src/lib/sms/httpsms-client.ts` | SMS route stores pending messages; new adapter is not wired. Existing WhatsApp route is not proof of official API conformance or live operation. |
| QA | `__tests__`, `vitest.config.ts`, `package.json` | Vitest and test files exist. No Phase 0 test execution or coverage claim. |
| Data | `prisma/schema.prisma` uses SQLite; `prisma/schema.mysql.prisma` exists | Schema configuration is not evidence of actual production engine or data. PostgreSQL dependency is not proof of a supported Prisma PostgreSQL deployment. No DB operation occurred. |
| Sandbox | Existing security helpers, no demonstrated sandbox | Untrusted execution isolation, network egress, secret isolation and escape resistance unverified. |
| Operations | `docker-compose.yml`, `docker-compose.inference.yml`, `deploy/` | Topology is configuration only; Hostinger, office nodes, DNS, TLS, capacity, backups and recovery unverified. |

Prior `ALO_LABS_CURRENT_ARCHITECTURE.md`, `ALO_LABS_UNVERIFIED_CAPABILITIES.md`, `ALO_LABS_PRODUCTION_EVIDENCE_MATRIX.md`, `ALO_LABS_AI_ECOSYSTEM_MATRIX.md`, `ALO_LABS_DEPENDENCY_SECURITY.md` and `ALO_LABS_QUEUE_RECOVERY_TEST.md` provide useful historical evidence; timestamps, conditions and remediation must be rechecked before relying on their findings. In particular the old sandbox FK and dependency findings are historical and not proof of current production status.
