# Requested agent sources — 2026-11-02

GitHub repository metadata was checked on 2026-11-02. The truncated Claude, scientific and memory links were interpreted as the named repositories below; this is not verification of the exact truncated URLs. These are instruction documents, not executable integrations. Do not equate a catalog entry with the upstream product or feature parity.

| Source | Current state |
| --- | --- |
| morluto/rea | Existing 5 instruction documents, all quarantined. REA application not installed. |
| anthropics/claude-plugins-official | Existing 33 instruction documents, 25 advisory and 8 quarantined. Plugins/tools not installed. |
| ruvnet/ruflo | Added 3 selected instruction documents, quarantined. Swarm engine not installed. |
| android/skills | Existing 36 advisory instruction documents. Android tools not installed by the skill pack. |
| K-Dense-AI/scientific-agent-skills | Existing 177 advisory instruction documents; references/scripts not imported. |
| anomalyco/opencode | Added 7 upstream development instruction documents, quarantined; coding agent not installed. |
| HKUDS/CLI-Anything | Existing 151 instruction documents, quarantined. Desktop control harnesses not installed. |
| cursor/plugins | Added 2 create-plugin instructions under the MIT-licensed create-plugin directory, quarantined. Other Cursor plugins not imported. |
| akitaonrails/ai-memory | Existing 7 instruction documents, quarantined. Shared memory service not installed. |
| debpalash/VoiceStudio | Repository exists; GitHub reports AGPL-3.0. No integration, weights, voice cloning or consent workflow installed. |

New documents are pinned to commits, with licenses and hashes, in `src/lib/agent-skills/`. Quarantined documents cannot be selected for the Command Agent; advisory documents are guidance only, not tools or permissions. Companion scripts, references and dependencies are not included. `node scripts/verify-agent-skills.mjs` checks integrity and quarantine behavior. `node scripts/sync-agent-skills.mjs --source <id>` refreshes one pinned source while retaining other catalog entries.

The larger list remains assessed in `REQUESTED_LINKS_AUDIT_2026-11-02.md`; none of those unrelated applications were installed by this change. Full integration requires separate license and security review, implementation, deployment, credentials or infrastructure where applicable, and end-to-end tests. Self-hosted software still depends on hardware, operating systems, networks, model weights and, for external platforms, their services and policies.
