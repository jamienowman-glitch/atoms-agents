## Hydration / loading behaviour

- Fonts: rely on registry (Roboto Flex). Use `font-display: swap` guidance via token to avoid FOIT; permit `optional` if perf-critical.
- Initialize axis tokens before rendering text; gate render behind `typography_ready` flag to avoid FOUT on first paint.
- Provide fallback stack tokens (system sans) if Roboto Flex unavailable; swap back when ready without layout jump by matching metrics (opsz/size pairing).
- Cache preset selections per tenant/env; reapply on load prior to rendering to prevent preset flicker.
