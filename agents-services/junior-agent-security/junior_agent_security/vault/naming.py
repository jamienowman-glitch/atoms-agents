"""
Chemical Name Validator.
The ONLY source of truth for platform naming.
"""
import re

class ChemicalNameError(Exception):
    pass

def validate_chemical_name(platform: str) -> str:
    """
    Strict Validator: Platform name MUST be a single capitalized word.
    
    Valid: "Shopify", "Solana", "Meta", "Discord"
    Invalid: "Shopify_Store", "meta ads", "SOLANA", "shopify"
    """
    name = platform.strip()
    
    if not name:
        raise ChemicalNameError("Platform name cannot be empty.")
    
    if " " in name or "_" in name or "-" in name:
        raise ChemicalNameError(
            f"Platform name must be Chemical (e.g., 'Shopify', NOT '{name}'). "
            "No spaces, underscores, or hyphens allowed."
        )
    
    if not name[0].isupper():
        raise ChemicalNameError(
            f"Platform name must start with an uppercase letter (e.g., 'Solana', NOT '{name}')."
        )
    
    # Allow all caps if short (e.g. AWS), otherwise must be title case
    if len(name) > 3 and name.isupper():
        raise ChemicalNameError(
            f"Platform name must be capitalized, not all-caps (e.g., 'Solana', NOT '{name}')."
        )
    
    return name

def get_canonical_key_name(platform: str, field: str = "API_KEY") -> str:
    """
    Returns PROVIDER_{SLUG}_{FIELD}.
    """
    validated = validate_chemical_name(platform)
    
    # Double check slugify just in case
    slug = re.sub(r'[^A-Z0-9]', '_', validated.upper().strip())
    field_clean = re.sub(r'[^A-Z0-9]', '_', field.upper().strip())
    
    return f"PROVIDER_{slug}_{field_clean}"
