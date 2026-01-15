# Dev Keys Setup

To run the Feed Engines in development, you must configure local disposable secrets. These files are gitignored and strictly for local dev.

## Directory
`<repo_root>/jaynowman/northstar-keys/`

Ensure this directory exists.

## Files

### 1. YouTube (`youtube.dev.json`)
```json
{
  "YOUTUBE_API_KEY": "AIzaSy..."
}
```

### 2. Shopify (`shopify.dev.json`)
```json
{
  "SHOPIFY_SHOP_DOMAIN": "your-shop.myshopify.com",
  "SHOPIFY_STOREFRONT_TOKEN": "public_access_token",
  "SHOPIFY_API_VERSION": "2024-01"
}
```
*Note: `SHOPIFY_API_VERSION` is optional (defaults to 2024-01).*

## Troubleshooting

- **Missing File**: Ensure the file is named exactly `*.dev.json` in the keys directory.
- **Missing Key**: Ensure the JSON structure matches above.
- **Permissions**: These are local files, ensure your user can read them.

> [!WARNING]
> DO NOT commit these files to git. They contain sensitive credentials.
