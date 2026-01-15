# Phase 04: Shopify Template

## shopify_v1.yaml
```yaml
id: shopify
version: 1.0.0
provider: Shopify
auth_scheme:
  type: oauth2
  fields:
    - key: shop_url
      label: "Shop URL (e.g. my-shop.myshopify.com)"
      secret: false
    - key: access_token
      label: "Admin Access Token"
      secret: true  # Must be stored in GSM

operations:
  # --- PRODUCTS ---
  get_products:
    description: "List products with filtering"
    inputs:
      type: object
      properties:
        limit: { type: integer, default: 50 }
        title: { type: string }
    outputs:
      type: object # Array of products
    strategy_lock_action: "shopify:read_products"
    dataset_event:
      enabled: true
      train_ok: true
    usage_event:
      tool_type: "api_call"
      default_cost: "0.00"

  update_product:
    description: "Update product details or variants"
    inputs:
      type: object
      required: ["product_id", "fields"]
      properties:
        product_id: { type: string }
        fields: { type: object }
    outputs: { type: object }
    strategy_lock_action: "shopify:update_product"
    firearms_action: "shopify:write" # Requires explicit licence
    dataset_event:
      enabled: true
      train_ok: true # Business data usually OK
    usage_event:
      tool_type: "api_call_write"

  delete_product:
    description: "Delete a product permanently"
    inputs:
      type: object
      required: ["product_id"]
    outputs: { type: object }
    strategy_lock_action: "shopify:delete_product"
    firearms_action: "shopify:delete" # High risk
    dataset_event:
      enabled: true
      train_ok: false # Deletion events maybe less useful?
    usage_event:
      tool_type: "api_call_write"

  # --- ORDERS (PII SENSITIVE) ---
  get_orders:
    description: "Retrieve orders"
    inputs:
      type: object
      properties:
        status: { type: string }
    outputs: { type: object }
    strategy_lock_action: "shopify:read_orders"
    dataset_event:
      enabled: true
      train_ok: false # PII Risk: Customer data
      pii_flags:
        customer_email: true
        address: true
    usage_event:
      tool_type: "api_call"

# --- BUNDLES (For easier checking) ---
# Notes on bundles (not part of schema but useful for validation logic later)
# marketing_bundle: [get_products]
# ops_bundle: [get_products, update_product, get_orders]
# godmode: [*, delete_product]

```

## Gaps / TODOs
- [ ] **Firearms Action Mapping**: We defined `shopify:write` and `shopify:delete` as firearms actions. We need to ensure the Firearms engine has a policy mapping these string actions to `LicenceLevel` (e.g., `shopify:delete` -> `high`).
