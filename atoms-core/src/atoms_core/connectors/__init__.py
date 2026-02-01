# atoms_core.connectors

"""
Connector Registry Module

This is the ENFORCEMENT GATEWAY for all external connections.
Every agent MUST use this module for credential references.

See AGENTS.md for The Connector Law.
"""

from .registry import (
    get_canonical_key_name,
    get_vault_key_path,
    check_key_exists,
    load_key,
    list_all_keys,
    validate_firearms_ticket,
    require_firearm,
    check_provider_exists,
    list_provider_scopes,
    log_key_access,
)

__all__ = [
    'get_canonical_key_name',
    'get_vault_key_path',
    'check_key_exists',
    'load_key',
    'list_all_keys',
    'validate_firearms_ticket',
    'require_firearm',
    'check_provider_exists',
    'list_provider_scopes',
    'log_key_access',
]
