"""
Dashboard App (FastAPI).
Serves the 'God Mode Lite' UI.
"""
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from ..db.sqlite import get_db

app = FastAPI(title="Junior Agent Security Dashboard")

# Setup Templates
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

@app.get("/")
async def index(request: Request):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get Stats
    cursor.execute("SELECT COUNT(*) FROM human_totp_secrets") 
    # Actually keys are files, not db rows. Let's count files.
    from ..vault.writer import list_vault_keys
    keys_count = len(list_vault_keys())
    
    # Get Active Grants
    cursor.execute("""
        SELECT * FROM agent_firearms_grants 
        WHERE expires_at > datetime('now') 
        ORDER BY expires_at DESC
    """)
    grants = cursor.fetchall()
    
    # Get Audit Log (All grants)
    cursor.execute("""
        SELECT * FROM agent_firearms_grants 
        ORDER BY created_at DESC 
        LIMIT 50
    """)
    logs = cursor.fetchall()
    
    conn.close()
    
    return templates.TemplateResponse("index.html", {
        "request": request,
        "keys_count": keys_count,
        "grants": grants,
        "logs": logs
    })
