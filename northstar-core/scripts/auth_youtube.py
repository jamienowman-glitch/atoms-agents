import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

# Define Scopes
SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
    'https://www.googleapis.com/auth/youtube.readonly'
]

KEY_DIR = os.path.expanduser("~/northstar-keys")
CLIENT_SECRET_FILE = os.path.join(KEY_DIR, "client_secret.json")
TOKEN_FILE = os.path.join(KEY_DIR, "youtube_token.json")

def authenticate_youtube():
    creds = None
    
    # 1. Check for existing token
    if os.path.exists(TOKEN_FILE):
        print(f"[INFO] Found existing token: {TOKEN_FILE}")
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        
    # 2. Refresh or Login
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[INFO] Refreshing expired token...")
            creds.refresh(Request())
        else:
            print("[INFO] Starting new OAuth Flow...")
            if not os.path.exists(CLIENT_SECRET_FILE):
                print(f"[ERROR] Missing Client Secret: {CLIENT_SECRET_FILE}")
                print("Please download 'OAuth 2.0 Client ID' JSON from Google Cloud Console and save it here.")
                return None
                
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            
        # 3. Save Token
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
            print(f"[SUCCESS] Saved new token to: {TOKEN_FILE}")
            
    return creds

if __name__ == "__main__":
    creds = authenticate_youtube()
    if creds:
        print("\nAuthentication Successful!")
        print(f"Token Scopes: {creds.scopes}")
