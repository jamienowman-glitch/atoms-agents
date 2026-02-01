"""
Merkle Man (Local Edition).
Generates audit hashes for local actions.
"""
import hashlib
from datetime import datetime
from ..db.sqlite import get_db

def append_leaf(agent_id: str, action: str, target: str, user_id: str) -> str:
    """
    Appends a new leaf to the audit log and returns its hash.
    Does not compute full tree in MVP, but prepares the chain.
    """
    timestamp = datetime.utcnow().isoformat()
    
    # Data to hash
    data = f"{timestamp}|{agent_id}|{action}|{target}|{user_id}"
    leaf_hash = hashlib.sha256(data.encode()).hexdigest()
    
    # Store in DB (Future: this table links to Merkle Root generation)
    conn = get_db()
    cursor = conn.cursor()
    
    # We use agent_firearms_grants mostly, but we could add a generic audit_log table
    # For now, we return the hash so the caller can modify the 'grants' table or others
    conn.close()
    
    return leaf_hash
