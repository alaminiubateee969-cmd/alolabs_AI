# Phase 0 — infrastructure compatibility and deployment boundary

Owner-proposed roles: Hostinger Cloud for production app and primary database; Office A for replica or warm recovery; Office B for CI/staging/monitoring/backup; encrypted offsite backup. These are intentions, not verified topology. No connection, credentials, configuration, capacity measurement or production system access occurred.

| Item | Status | Read-only discovery needed |
| --- | --- | --- |
| Production/office CPU, RAM, GPU and storage | Unknown | Inventory actual available resources and peak usage. |
| Database engine/version and replication | Unknown | Identify each environment and test documented engine-specific replica/recovery semantics on disposable systems. |
| DNS/TLS/firewall/reverse proxy | Unknown | Review records, certificates, ingress/egress and network paths. |
| Backup encryption, offsite retention and restore | Unknown | Verify backups and independently restore into isolated environment; compare schema, counts and files. |
| CI/build/staging isolation | Unknown | Inspect permissions, credentials, supply-chain gates, network and resource quotas. |
| Local model endpoint | Not verified | Configure and test only in approved isolated staging with real model and budget. |

Existing compose files and deployment scripts are not evidence that production is configured or healthy. No production runbook execution is authorized. A later runbook must specify release artifact, preflight and capacity checks, tested backup, human approval, least-privilege rollout, observable health and rollback/restore; migrations require their own explicit approval. Never assume rollback of code reverses database changes.
