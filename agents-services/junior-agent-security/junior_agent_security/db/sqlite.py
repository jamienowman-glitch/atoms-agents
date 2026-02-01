"""
Database connection module (SQLite).
"""
import os
import sqlite3
from pathlib import Path

DB_PATH = Path("~/.junior-agent-security/junior_agent_security.db").expanduser()

def get_db():
    """Returns a connection to the SQLite database."""
    if not DB_PATH.parent.exists():
        DB_PATH.parent.mkdir(parents=True)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Human Secrets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS human_totp_secrets (
        user_id TEXT PRIMARY KEY,
        encrypted_secret TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_used_at TEXT,
        is_active INTEGER DEFAULT 1
    );
    """)
    
    # Firearms Grants Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_firearms_grants (
        grant_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        license_key TEXT NOT NULL,
        granted_by TEXT NOT NULL,
        granted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL,
        ticket_jwt TEXT NOT NULL,
        scope_context TEXT DEFAULT '{}',
        merkle_hash TEXT,
        revoked_at TEXT
    );
    """)
    
    # Firearms Licenses Registry
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS firearms_licenses (
        license_key TEXT PRIMARY KEY,
        description TEXT
    );
    """)
    
    # Seed default licenses
    cursor.execute("INSERT OR IGNORE INTO firearms_licenses (license_key, description) VALUES ('VAULT_WRITE', 'Allows writing secrets to different Vaults')")
    
    conn.commit()
    conn.close()
