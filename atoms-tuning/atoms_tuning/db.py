from supabase import create_client, Client
from atoms_tuning.config import get_settings

_client: Client = None

def get_supabase_client() -> Client:
    global _client
    if _client is None:
        settings = get_settings()
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return _client
