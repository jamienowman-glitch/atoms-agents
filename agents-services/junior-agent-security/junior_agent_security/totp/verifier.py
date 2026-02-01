"""
TOTP Verifier Module.
Ports layout from atoms-app/src/app/api/firearms/verify/route.ts
"""
import time
import jwt
import pyotp
import json
import hashlib
from datetime import datetime, timedelta
from ..db.sqlite import get_db

# Secret for signing JWTs (Auto-generated/rotated in prod, or static for local dev)
JWT_SECRET = "local-dev-secret-do-not-use-in-cloud" 

class TOTPError(Exception):
    pass

def verify_totp_and_grant(totp_code: str, license_key: str, agent_id: str, user_id: str = "local_developer"):
    """
    Verifies a TOTP code and issues a signed JWT ticket.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Fetch User Secret
    cursor.execute(
        "SELECT encrypted_secret FROM human_totp_secrets WHERE user_id = ? AND is_active = 1", 
        (user_id,)
    )
    row = cursor.fetchone()
    
    if not row:
        raise TOTPError("TOTP not set up. Run 'junior-agent-security setup' first.")
    
    # 2. Validate Code (Using pyotp)
    # TODO: Add real encryption/decryption. For now, assuming storage is secure on local disk.
    secret = row['encrypted_secret'] 
    totp = pyotp.TOTP(secret)
    
    if not totp.verify(totp_code, valid_window=1):
        raise TOTPError("Invalid or expired TOTP code.")
        
    # 3. Create JWT Ticket
    expires_at_dt = datetime.utcnow() + timedelta(minutes=15)
    payload = {
        "agent_id": agent_id,
        "license_key": license_key,
        "granted_by": user_id,
        "exp": expires_at_dt,
        "iat": datetime.utcnow(),
        "iss": "junior-agent-security"
    }
    
    ticket = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    # 4. Merkle Audit
    # Compute SHA-256 hash of the grant details
    merkle_data = f"{agent_id}|{license_key}|{user_id}|{expires_at_dt.isoformat()}"
    merkle_hash = hashlib.sha256(merkle_data.encode()).hexdigest()
    
    # 5. Record Grant
    import uuid
    grant_id = str(uuid.uuid4())
    
    cursor.execute("""
        INSERT INTO agent_firearms_grants 
        (grant_id, agent_id, license_key, granted_by, expires_at, ticket_jwt, merkle_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (grant_id, agent_id, license_key, user_id, expires_at_dt.isoformat(), ticket, merkle_hash))
    
    # 6. Update usage stats
    cursor.execute(
        "UPDATE human_totp_secrets SET last_used_at = ? WHERE user_id = ?",
        (datetime.utcnow().isoformat(), user_id)
    )
    
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "ticket": ticket,
        "expires_at": expires_at_dt.isoformat(),
        "merkle_hash": merkle_hash
    }
