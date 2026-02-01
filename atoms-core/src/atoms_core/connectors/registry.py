"""
Connector Registry: The Enforcement Gateway

This module is the ONLY source of truth for:
1. Canonical key naming (PROVIDER_{SLUG}_{FIELD})
2. Duplication checks
3. Firearms license validation

ALL code that references external credentials MUST use this module.
"""

import os
import re
import hashlib
from typing import Optional, Dict, Any
from datetime import datetime

# Optional: For Supabase connection
try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False

# Vault path
VAULT_PATH = os.path.expanduser("~/northstar-keys")


def get_canonical_key_name(platform: str, field: str = "API_KEY") -> str:
    """
    The ONLY source of truth for key naming.
    
    Args:
        platform: The platform name (e.g., "Solana", "Shopify", "Meta")
        field: The field type (e.g., "API_KEY", "CLIENT_ID", "CLIENT_SECRET")
    
    Returns:
        Canonical key name: PROVIDER_{SLUG}_{FIELD}
    
    Example:
        get_canonical_key_name("Solana", "API_KEY") -> "PROVIDER_SOLANA_API_KEY"
        get_canonical_key_name("Meta Ads", "CLIENT_SECRET") -> "PROVIDER_META_ADS_CLIENT_SECRET"
    """
    # Normalize: uppercase, replace non-alphanumeric with underscore
    slug = re.sub(r'[^A-Z0-9]', '_', platform.upper().strip())
    slug = re.sub(r'_+', '_', slug).strip('_')  # Collapse multiple underscores
    
    field_clean = re.sub(r'[^A-Z0-9]', '_', field.upper().strip())
    field_clean = re.sub(r'_+', '_', field_clean).strip('_')
    
    return f"PROVIDER_{slug}_{field_clean}"


def get_vault_key_path(platform: str, field: str = "API_KEY") -> str:
    """
    Returns the full file path for a key in the Vault.
    
    Example:
        get_vault_key_path("Solana") -> "/Users/.../northstar-keys/PROVIDER_SOLANA_API_KEY.key"
    """
    name = get_canonical_key_name(platform, field)
    return os.path.join(VAULT_PATH, f"{name}.key")


def check_key_exists(platform: str, field: str = "API_KEY") -> bool:
    """
    Checks if a key already exists in the Vault.
    Used for de-duplication before creating new keys.
    """
    path = get_vault_key_path(platform, field)
    return os.path.exists(path)


def load_key(platform: str, field: str = "API_KEY") -> Optional[str]:
    """
    Loads a key from the Vault.
    
    Returns:
        The key contents, or None if not found.
    """
    path = get_vault_key_path(platform, field)
    if not os.path.exists(path):
        return None
    
    with open(path, 'r') as f:
        return f.read().strip()


def list_all_keys() -> list[str]:
    """
    Lists all keys in the Vault.
    
    Returns:
        List of key names (without .key extension).
    """
    if not os.path.exists(VAULT_PATH):
        return []
    
    keys = []
    for f in os.listdir(VAULT_PATH):
        if f.endswith('.key'):
            keys.append(f[:-4])
    return sorted(keys)


def validate_firearms_ticket(ticket_jwt: str, required_license: str) -> Dict[str, Any]:
    """
    Validates a Firearms JWT ticket.
    
    Args:
        ticket_jwt: The JWT ticket issued by /api/firearms/verify
        required_license: The license key needed for the action
    
    Returns:
        Dict with validation result:
        - valid: bool
        - error: str (if invalid)
        - agent_id: str (if valid)
        - license_key: str (if valid)
        - expires_at: str (if valid)
    
    Raises:
        ValueError: If ticket is invalid, expired, or doesn't match required license
    """
    try:
        import jwt
        
        # In production: Get this from Vault
        JWT_SECRET = os.environ.get('FIREARMS_JWT_SECRET', 'REPLACE_WITH_VAULT_SECRET')
        
        payload = jwt.decode(ticket_jwt, JWT_SECRET, algorithms=['HS256'])
        
        # Check license match
        if payload.get('license_key') != required_license:
            return {
                'valid': False,
                'error': f"Ticket is for {payload.get('license_key')}, not {required_license}"
            }
        
        return {
            'valid': True,
            'agent_id': payload.get('agent_id'),
            'license_key': payload.get('license_key'),
            'granted_by': payload.get('granted_by'),
            'expires_at': datetime.fromtimestamp(payload.get('exp', 0)).isoformat()
        }
        
    except jwt.ExpiredSignatureError:
        return {'valid': False, 'error': 'Ticket has expired'}
    except jwt.InvalidTokenError as e:
        return {'valid': False, 'error': f'Invalid ticket: {str(e)}'}
    except ImportError:
        return {'valid': False, 'error': 'PyJWT not installed'}


def require_firearm(license_key: str, ticket_jwt: Optional[str] = None):
    """
    Decorator for functions that require a Firearms license.
    
    Usage:
        @require_firearm("AD_SPEND_EXECUTE")
        def create_ad_campaign(ticket: str, ...):
            ...
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            ticket = ticket_jwt or kwargs.get('ticket_jwt') or (args[0] if args else None)
            
            if not ticket:
                raise PermissionError(f"Firearms license required: {license_key}. No ticket provided.")
            
            result = validate_firearms_ticket(ticket, license_key)
            if not result['valid']:
                raise PermissionError(f"Firearms validation failed: {result['error']}")
            
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ============================================================
# Supabase Integration (Optional)
# ============================================================

def get_supabase_client() -> Optional["Client"]:
    """
    Returns a Supabase client if credentials are available.
    """
    if not HAS_SUPABASE:
        return None
    
    url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        return None
    
    return create_client(url, key)


def check_provider_exists(platform_slug: str) -> bool:
    """
    Checks if a provider is registered in the database.
    """
    client = get_supabase_client()
    if not client:
        return False
    
    result = client.table('connector_providers').select('provider_id').eq('platform_slug', platform_slug.lower()).execute()
    return len(result.data) > 0


def list_provider_scopes(platform_slug: str) -> list[Dict[str, Any]]:
    """
    Lists all scopes for a provider, including Firearm requirements.
    """
    client = get_supabase_client()
    if not client:
        return []
    
    result = client.table('connector_scopes').select('*').eq('provider_id', platform_slug.lower()).execute()
    return result.data or []


def log_key_access(agent_id: str, key_name: str, action: str):
    """
    Logs a key access event for audit purposes.
    """
    client = get_supabase_client()
    if not client:
        return
    
    try:
        client.table('connector_key_audit_log').insert({
            'agent_id': agent_id,
            'key_name': key_name,
            'action': action,
            'accessed_at': datetime.now().isoformat()
        }).execute()
    except Exception as e:
        print(f"[Registry] Audit log failed: {e}")


# ============================================================
# Example Usage
# ============================================================

if __name__ == "__main__":
    # Test canonical naming
    print(get_canonical_key_name("Solana"))  # PROVIDER_SOLANA_API_KEY
    print(get_canonical_key_name("Meta Ads", "CLIENT_SECRET"))  # PROVIDER_META_ADS_CLIENT_SECRET
    print(get_canonical_key_name("Shopify Store", "API_KEY"))  # PROVIDER_SHOPIFY_STORE_API_KEY
    
    # Test path
    print(get_vault_key_path("Solana"))
    
    # Test existence
    print(f"Solana key exists: {check_key_exists('Solana')}")
    
    # List all
    print(f"All keys: {list_all_keys()}")
