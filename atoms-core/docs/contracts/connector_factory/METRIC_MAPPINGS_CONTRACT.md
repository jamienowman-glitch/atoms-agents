# Metric Mappings Contract (Connector Factory)

## Purpose
Normalize raw platform metrics into internal standard metrics with human approval only. This is the required schema for `metric_mappings`.

## Table: `metric_mappings`
Required columns:
1. `mapping_id` (PK, uuid)
2. `provider_slug` (text, indexed, not null)
3. `raw_metric_name` (text, not null)
   - Exact field from external API (e.g., `reach_total`, `open_rate_float`).
4. `standard_metric_slug` (text, nullable until approved)
   - Internal standard metric (e.g., `reach`, `email_opens`, `roas`).
5. `aggregation_method` (text/enum, not null)
   - Allowed values: `sum`, `avg`, `max`.
6. `is_approved` (boolean, not null, default false)
   - Only humans can approve.

## Approval Flow (Required)
- Connectors may ingest `provider_slug` + `raw_metric_name`.
- Humans assign `standard_metric_slug` and set `is_approved=true`.
- Until approved, the metric is not used in standardized reporting.

## Rationale
Prevents agents from redefining metrics. Ensures cross-platform consistency.
