Northstar CORE (v0)

Purpose:
- Single source of truth for cards and registries:
  - Apps, federations, clusters, agents, patterns, safety profiles.
- NO execution logic here.
- ENGINES repos read these cards and execute them via Roots Manuva.

Hard rules:
- All topology (apps/federations/clusters/agents) is defined as cards.
- Orchestration intent (patterns, allowed_backends, defaults) lives on cards.
- Safety primitives (Firearms, Strategy Lock hooks, 3-Wise) are referenced from cards.
