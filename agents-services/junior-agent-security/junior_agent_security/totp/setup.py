"""
TOTP Setup Module.
Generates secrets and QR codes.
"""
import pyotp
import qrcode
import io
from ..db.sqlite import get_db

def generate_new_secret(user_id: str = "local_developer", email: str = "dev@localhost"):
    """
    Generates a new TOTP secret and returns the QR code data.
    Does NOT save until verified.
    """
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    
    uri = totp.provisioning_uri(name=email, issuer_name="Junior Agent Security")
    
    # Generate QR Code
    qr = qrcode.QRCode()
    qr.add_data(uri)
    qr.make(fit=True)
    
    # For CLI output
    f = io.StringIO()
    qr.print_ascii(out=f)
    f.seek(0)
    ascii_qr = f.read()
    
    return {
        "secret": secret,
        "uri": uri,
        "ascii_qr": ascii_qr
    }

def save_verified_secret(user_id: str, secret: str, verification_code: str):
    """
    Verifies code against secret and saves if valid.
    """
    totp = pyotp.TOTP(secret)
    if not totp.verify(verification_code, valid_window=1):
        return False
        
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO human_totp_secrets 
        (user_id, encrypted_secret, is_active, last_used_at)
        VALUES (?, ?, 1, NULL)
    """, (user_id, secret))
    
    conn.commit()
    conn.close()
    return True
