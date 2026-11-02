# Phase 0 — proposed roadmap and approval gates

**Stop here. No phase below is authorized by producing this report.** The supplied objective is broader than the available evidence; unresolved resource research must be completed before declaring Phase 0 complete.

1. **Finish discovery**: access and review blocked sites and unresolved URLs, inspect per-repo licences/versions, dependencies, runtime/hardware requirements and security boundaries. Read-only inventory actual production topology and DB only with appropriate access and authority. Review existing uncommitted work and historical reports. Produce evidence and unresolved list.
2. **Phase 1: architecture review** (after owner approval): define threat model, task contracts, permission/approval matrix, tenancy, data design and explicit compatibility tests. Do not run migrations. Prepare measured capacity plan, local-first model selection and recovery design. Owner approves the resulting implementation scope separately.
3. **Phase 2: foundation**: close authorization, audit, durable queue and recovery gaps on disposable infrastructure; test negative access, approval replay and worker interruption. Preserve existing data.
4. **Phase 3: authorized inspection**: implement scoped repository/browser/API analysis first, then evaluate isolated Android and Ghidra adapters. Proof of isolation and authorization is a release gate.
5. **Phase 4: software factory**: bounded coding tasks, tests, diffs, PR creation only with scoped authorization; explicit human merge/deploy approval. Session-specific branch restrictions remain in force.
6. **Phase 5: QA/security**: reproducible unit/API/browser tests, vulnerability scanning, regression and isolation tests. Results and environment recorded, not inferred from build.
7. **Phase 6: memory / optional studio**: tenant/project provenance, retention and deletion, injection tests. Creative tools independently reviewed and disabled unless approved.
8. **Phase 7: readiness**: approved staging topology, actual backup and isolated restore, load/failure recovery, telemetry and security review. Separate approval before any production deployment or migration.

## Gates for acceptance

Require per-capability tests and evidence for live local inference, permission boundaries, restart recovery, effect reconciliation, sandbox isolation, tenant controls, licence clearance and restoration. UI must distinguish unavailable/experimental from verified. Missing evidence is BLOCKED/UNVERIFIED, not success. Production data preservation cannot be certified without an authorized baseline and verified restore.
