import re

def normalize_slug(text: str) -> str:
    """
    Normalizes a string to a slug: lowercase, alphanumeric, dashes.
    Mimics the TS normalizePlatform logic.
    """
    if not text:
        return ""
    
    # Lowercase and trim
    text = text.strip().lower()
    # Replace non-alphanumeric with dashes
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Remove leading/trailing dashes
    text = text.strip('-')
    return text

def format_provider_key(platform_name: str, rule: str = "{{platform}}") -> str:
    """
    Ports formatProviderKey from naming-engine.ts
    """
    normalized = normalize_slug(platform_name)
    
    replacements = {
        "platform": normalized,
        "platform_name": platform_name.strip(),
        "platform_slug": normalized,
        "slug": normalized
    }
    
    def replacer(match):
        key = match.group(1).strip().lower()
        return replacements.get(key, replacements["platform"])
    
    # Replace {{ key }}
    formatted = re.sub(r'\{\{\s*([^}]+)\s*\}\}', replacer, rule)
    
    # Cleanup dashes
    formatted = re.sub(r'-{2,}', '-', formatted)
    formatted = formatted.strip('-')
    
    return formatted

def get_secret_name(tenant: str, provider: str, field: str) -> str:
    """
    Generates the strict secret key name for the Vault.
    Format: {{TENANT}}_{{PROVIDER}}_{{FIELD}}
    Example: DEFAULT_SHOPIFY_API_KEY
    """
    def sanitize(s):
        return re.sub(r'[^A-Z0-9]', '_', s.upper()).strip('_')
        
    t = sanitize(tenant) if tenant else "DEFAULT"
    p = sanitize(provider)
    f = sanitize(field)
    
    return f"{t}_{p}_{f}"
