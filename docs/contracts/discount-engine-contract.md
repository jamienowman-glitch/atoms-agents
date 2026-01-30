# Discount Engine Contract v1

This contract defines the data shapes, RPCs, and events for discount governance.

```yaml
# ---------- Entities ----------
DiscountPolicy:
  policy_id: uuid
  tenant_id: text
  surface_id: text
  status: active|inactive
  min_discount_pct: decimal   # 0.10 = 10%
  max_discount_pct: decimal   # 0.20 = 20%
  monthly_discount_cap_pct_of_turnover: decimal
  rolling_window_days: int    # default 30
  kpi_ceiling: jsonb          # {"discount_rate": 0.20}
  kpi_floor: jsonb            # {"discount_rate": 0.10}
  created_at: timestamptz
  updated_at: timestamptz

DiscountCode:
  code_id: uuid
  tenant_id: text
  surface_id: text
  channel: internal|shopify|wix|custom
  code: text
  discount_type: percent|fixed
  discount_value: decimal     # percent (0.10) or fixed amount
  currency: text|null
  status: active|paused|expired|revoked
  valid_from: timestamptz
  valid_to: timestamptz
  max_redemptions: int|null
  times_redeemed: int
  issued_by: uuid|null
  meta: jsonb                 # no PII
  created_at: timestamptz
  updated_at: timestamptz

DiscountRedemption:
  redemption_id: uuid
  code_id: uuid
  tenant_id: text
  surface_id: text
  channel: internal|shopify|wix|custom
  external_ref: text|null     # order_id / checkout_id
  discount_amount: decimal
  currency: text
  redeemed_at: timestamptz
  meta: jsonb

DiscountKpiSnapshot:
  snapshot_id: uuid
  tenant_id: text
  surface_id: text
  kpi_slug: text              # discount_rate
  value: decimal
  window_days: int
  created_at: timestamptz

# ---------- RPCs (Supabase) ----------
create_discount_code:
  input:
    tenant_id: text
    surface_id: text
    channel: string
    code: text
    discount_type: percent|fixed
    discount_value: decimal
    currency: text|null
    valid_from: timestamptz|null
    valid_to: timestamptz|null
    max_redemptions: int|null
    meta: jsonb|null
  output:
    code_id: uuid
    status: active
  errors:
    - policy_missing
    - policy_inactive
    - discount_out_of_bounds
    - code_exists

validate_discount_code:
  input:
    tenant_id: text
    surface_id: text
    code: text
    channel: string
    order_amount: decimal|null
    currency: text|null
  output:
    valid: boolean
    discount_type: percent|fixed
    discount_value: decimal
    currency: text|null
    reason: text|null          # "expired", "policy_block"
    projected_discount_pct: decimal|null
  errors:
    - code_not_found
    - expired
    - max_redemptions_reached
    - policy_block

redeem_discount_code:
  input:
    tenant_id: text
    surface_id: text
    code: text
    channel: string
    order_amount: decimal
    currency: text
    external_ref: text|null
    meta: jsonb|null
  output:
    redemption_id: uuid
    discount_amount: decimal
    currency: text
    times_redeemed: int
  errors:
    - code_not_found
    - expired
    - max_redemptions_reached
    - policy_block
    - kpi_ceiling_exceeded
    - turnover_cap_exceeded

compute_discount_eligibility:
  input:
    tenant_id: text
    surface_id: text
    proposed_discount_pct: decimal
  output:
    allowed: boolean
    reason: text|null
    headroom_pct: decimal|null

# ---------- Events (Event V2 Stub) ----------
discount.redeemed:
  payload:
    tenant_id: text
    surface_id: text
    code_id: uuid
    channel: string
    discount_amount: decimal
    currency: text
    external_ref: text|null
  pii: false

# ---------- KPI Mapping ----------
Standard KPI slug:
  discount_rate:
    description: "Total discounts ÷ gross turnover for window"
    source: connector mappings (Shopify/Wix/etc.)
    used_by: policy ceilings/floors
```
