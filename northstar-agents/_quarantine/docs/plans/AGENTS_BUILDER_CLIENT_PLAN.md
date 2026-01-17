# Agents Builder Client Plan (Northstar Agents)

A production-ready plan to enable agents to interact with the Builder, Token Catalog, and Feeds.

## Sequencing (Sprints)

### Sprint 1: The Core Client
**Focus**: Tokens & Canvas State.
- **Goal**: Agents can safely read/write tokens and understand canvas state.
- **Tasks**:
    1.  **Engine Boundary Contract**: Implement `ENGINES_BOUNDARY_CONTRACT.md` as strict Types/Pydantic models.
    2.  **Snapshot & Replay**: Implement methods to fetch `get_canvas_snapshot` and `get_canvas_replay`.
    3.  **Token Operations**: Implement `get_token_catalog` and `set_token` (with validation).

### Sprint 2: Feeds Integration
**Focus**: Multi-21 / Feed Management.
- **Goal**: Agents can manage feeds on behalf of the user.
- **Tasks**:
    1.  **Feed CRUD**: Implement methods for `list_feeds`, `create_feed`, `refresh_feed`.
    2.  **Item Access**: Implement `get_feed_items` to allow agents to "see" what's in a feed.

### Sprint 3: Tests & Scenarios
**Focus**: Reliability.
- **Goal**: Verify agent capabilities in a realistic scenario.
- **Tasks**:
    1.  **Mocked E2E**: Scenario where an agent:
        - Reads catalog.
        - Checks existing feeds.
        - Creates a YouTube feed.
        - Sets the Multi-21 block's `feed.source.feed_id` to the new feed.

## Definition of Done
- Client encapsulates all HTTP calls.
- Typed inputs/outputs (no raw dicts exposed to agent logic).
- Tests cover success, 4xx, and 5xx cases.
