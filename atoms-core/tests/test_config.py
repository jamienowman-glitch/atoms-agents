from fastapi.testclient import TestClient
from src.core.main import app

client = TestClient(app)

def test_config_status():
    response = client.get("/api/v1/config/status")
    assert response.status_code == 200
    data = response.json()
    assert "SUPABASE_URL" in data
    assert "SUPABASE_ANON_KEY" in data
    assert "OPENAI_API_KEY" in data
    assert "GSM_CONNECTED" in data
    
    # Check masking
    assert data["SUPABASE_URL"].startswith("LOADED") or data["SUPABASE_URL"] == "****"
    assert data["GSM_CONNECTED"] is False
