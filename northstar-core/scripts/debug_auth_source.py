
import os
import boto3
import google.auth
import sys

def check_aws():
    print("\n--- AWS AUTH PROBE ---")
    session = boto3.Session()
    creds = session.get_credentials()
    
    if not creds:
        print("AWS: No credentials found.")
        return

    # Force lazy load
    frozen = creds.get_frozen_credentials()
    
    print(f"Method: {creds.method}")
    print(f"Profile: {session.profile_name}")
    print(f"Region: {session.region_name}")
    
    # Check Env Vars
    print(f"Env AWS_PROFILE: {os.environ.get('AWS_PROFILE', 'unset')}")
    print(f"Env AWS_ACCESS_KEY_ID: {'set' if os.environ.get('AWS_ACCESS_KEY_ID') else 'unset'}")
    
    # Check Config Files
    aws_dir = os.path.expanduser("~/.aws")
    if os.path.exists(aws_dir):
        print(f"Found ~/.aws: Yes")
        if os.path.exists(os.path.join(aws_dir, "credentials")):
            print(f"Found ~/.aws/credentials: Yes")
        if os.path.exists(os.path.join(aws_dir, "config")):
            print(f"Found ~/.aws/config: Yes")
    else:
        print(f"Found ~/.aws: No")

def check_gcp():
    print("\n--- GCP AUTH PROBE ---")
    try:
        creds, project = google.auth.default()
        print(f"Source: {creds.__class__.__name__}")
        print(f"Project: {project}")
        print(f"Service Account File: {getattr(creds, 'service_account_email', 'N/A')}")
        
        # Check specific attributes usually found in service account creds
        if hasattr(creds, "filename"):
             print(f"Key File: {creds.filename}")
             
    except Exception as e:
        print(f"GCP Error: {e}")

    print(f"Env GOOGLE_APPLICATION_CREDENTIALS: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'unset')}")
    print(f"Env GCP_PROJECT_ID: {os.environ.get('GCP_PROJECT_ID', 'unset')}")
    print(f"Env GCLOUD_PROJECT: {os.environ.get('GCLOUD_PROJECT', 'unset')}")

    # Check gcloud config
    gcloud_dir = os.path.expanduser("~/.config/gcloud")
    if os.path.exists(gcloud_dir):
        print(f"Found ~/.config/gcloud: Yes")
        adc_path = os.path.join(gcloud_dir, "application_default_credentials.json")
        if os.path.exists(adc_path):
            print(f"Found User ADC JSON: Yes ({adc_path})")
    else:
        print(f"Found ~/.config/gcloud: No")

if __name__ == "__main__":
    check_aws()
    check_gcp()
