# Agent execution test — 2026-11-02

**Overall: BLOCKED for live AI success.** Isolated local SQLite and a temporary test user/company/agent were used; no production database, credentials or external model service was used. The test server was stopped after the check. A local model server was unavailable and no Ollama executable was found. No real model response was produced.

## HTTP journey (real application and database, no model stub)

A fresh isolated SQLite database was created from the current schema using `scripts/sqlite-push.ts`. The application worker and web server ran against that database with `LOCAL_ONLY=true`; the router logged that no providers were registered. Synthetic user/company/department/agent data was created only in that disposable database. Then:

| Step | Observed |
| --- | --- |
| Anonymous `GET /api/runs` | 401 |
| Test identity `POST /api/auth/login` | 200 |
| Authenticated `POST /api/runs` | 202, queued |
| Authenticated run detail | 200; worker processed run |
| Final state | `failed`; 0/4 steps completed, 1 failed, remaining 3 skipped |
| Failure | `Configuration required: no AI provider is configured or reachable. No model is currently authorized and capable for this company/profile. The request was deferred.` |
| Evidence | Run events include queued, plan created, run started, agent selected, task queued/started/failed, 3 skipped, artifact created and run failed. One diagnostic artifact was recorded. |

This is a real HTTP/worker/database **failure path**, not an end-to-end successful agent/model/tool execution. Only one synthetic agent was exercised; no claim can be made about all agents. Planning produced a four-step plan, but no generated answer or real provider call succeeded.

## Isolated test suites

Command: `npx vitest run __tests__/integration/job-queue-durability.test.ts __tests__/integration/run-resume.test.ts __tests__/unit/agentos-runs-pipeline.test.ts __tests__/unit/lib/tool-loop.test.ts`.

Result: **21/21 tests passed** across four files. Queue durability and run-resume use a disposable SQLite database. Run-resume stubs the execution engine, router and model-related calls, and supplies its own plan; it simulates interrupted work in-process rather than killing a real worker. Run-pipeline uses an in-memory fake database and stubbed components. Tool-loop tests use mocks. Concurrent idempotency testing deliberately causes unique constraint errors which are handled by the tested code. These tests do not verify live AI, actual process restart, external side-effect exactly-once semantics, all agents, production database compatibility, or full security.

## Remaining gate

A successful full test needs an authorized, configured, reachable model and an approved isolated test environment: real login → queued run → permitted agent → real model response → authorized tool → QC/artifact and scoped retrieval, with negative permission and tenant tests. Real worker termination/restart and external side-effect reconciliation require separate controlled fault tests. Local inference model availability, hardware, model licensing and provider configuration must be checked without exposing secrets; no production migration or deployment is authorized by this test.
