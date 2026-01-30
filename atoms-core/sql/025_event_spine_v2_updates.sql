/*
# 025_event_spine_v2_updates.sql

## Description
Updates the Event Spine V2 schema with normalized timeline fields and context scope.
Worker C - Kickoff Prompt

## Changes
- Adds `sequence_id` (monotonic per run) to `event_spine_v2_events`.
- Adds `normalized_timestamp` (server time) to `event_spine_v2_events`.
- Adds `context_scope` (whiteboard/blackboard) to `event_spine_v2_events`.
*/

-- Add normalized_timestamp (server time)
alter table public.event_spine_v2_events
add column if not exists normalized_timestamp timestamptz not null default now();

-- Add sequence_id (monotonic ordering helper, expected to be provided by client or generator, but defaults to 0 if missing)
-- Realistically, this should probably be handled by a sequence or just client-provided for now.
alter table public.event_spine_v2_events
add column if not exists sequence_id bigint default 0;

-- Add context_scope with validation
alter table public.event_spine_v2_events
add column if not exists context_scope text default 'blackboard';

alter table public.event_spine_v2_events
drop constraint if exists check_context_scope;

alter table public.event_spine_v2_events
add constraint check_context_scope
check (context_scope in ('whiteboard', 'blackboard'));

-- Update Indexes for sorting
create index if not exists idx_event_spine_timeline
on public.event_spine_v2_events(tenant_id, run_id, normalized_timestamp, sequence_id);

-- Add filter indexes
create index if not exists idx_event_spine_node on public.event_spine_v2_events(node_id);
create index if not exists idx_event_spine_canvas on public.event_spine_v2_events(canvas_id);
create index if not exists idx_event_spine_agent on public.event_spine_v2_events(agent_id);
