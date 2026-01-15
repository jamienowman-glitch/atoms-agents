# Engines — Memory/Blackboard + Save/Persistence wiring (need clarity + wiring now)

Team — quick reality check + blockers we need nailed while UI + agents proceed.

1) Memory still feels non-durable / not behaving like “project continuity”
- We need explicit statement of what is durable today vs lab-only vs enterprise/saas acceptable.
- Required continuity on project return:
  - chat continuity (thread state)
  - session state (blackboard/session KV)
  - run history (audit + timeline)
- If current implementations are filesystem/in-memory, we need the minimum wiring to make it “durable enough” for real demos.

2) Blackboard semantics: how should agents/UI write to it?
- Need canonical name + store and read/write contract.
- For node definitions, how to declare:
  - blackboard_reads
  - blackboard_writes
  - optional schema/typing
- Should blackboard writes be explicit engine API calls (preferred) or embedded in event stream/timeline?
- If a “blackboard note/card” shape exists, point to it; if not, please provide the recommended shape now.

3) “Save” semantics: where do saved flows/registries/user edits live?
- When a user clicks Save on AgentFlow/Builder state:
  - what store is authoritative?
  - scoping: tenant/mode/project/surface/app/user?
  - what persists: flow graph definition, node cards, lens overlays, strategy lock snapshots/approvals?
- Need the target write path (API + storage), even if v1.

4) Please wire “durable-by-default” paths now
- We don’t want to discover at drag/drop milestone that:
  - memory isn’t durable
  - blackboard isn’t persisted
  - saves are local only
  - analytics can’t attribute back to project runs
- Ask: confirm intended APIs + storage choices for:
  - session memory
  - blackboard/session KV
  - timeline/audit
  - saved flow definitions + overlays
- If UNKNOWN/not implemented, label it clearly with the minimum contract we can code against now.
