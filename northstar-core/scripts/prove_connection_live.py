import boto3
import os
import uuid
import datetime
import vertexai
from vertexai.generative_models import GenerativeModel

def prove_bedrock():
    print(f"\n--- PROVING AWS BEDROCK CONNECTIVITY ---")
    current_time = datetime.datetime.now().isoformat()
    random_id = str(uuid.uuid4())[:8]
    prompt = f"Please repeat this exact code: ALPHA-{random_id}-OMEGA. Current time is {current_time}."
    
    print(f"1. Sending Challenge: '{prompt}'")
    
    try:
        client = boto3.client("bedrock-runtime", region_name="us-east-1")
        response = client.converse(
            modelId="amazon.nova-micro-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt}]}]
        )
        output = response["output"]["message"]["content"][0]["text"]
        print(f"2. LIVE Bedrock Response: '{output}'")
        
        if f"ALPHA-{random_id}-OMEGA" in output:
            print(">>> PROOF VERIFIED: Model echoed dynamic run-time ID.")
        else:
            print(">>> VERIFICATION FAILED: Model did not echo ID.")
            
    except Exception as e:
        print(f">>> CONNECTION FAILED: {e}")

def prove_adk():
    print(f"\n--- PROVING GOOGLE ADK (VERTEX) CONNECTIVITY ---")
    current_time = datetime.datetime.now().isoformat()
    random_id = str(uuid.uuid4())[:8]
    prompt = f"Please repeat this exact code: GEMINI-{random_id}-LIVE. Current time is {current_time}."
    
    print(f"1. Sending Challenge: '{prompt}'")
    
    # Auto-detect project/region from env or default
    project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
    location = os.environ.get("GCP_REGION", "us-central1")
    
    try:
        vertexai.init(project=project_id, location=location)
        model = GenerativeModel("gemini-1.5-flash-001")
        response = model.generate_content(prompt)
        
        output = response.text
        print(f"2. LIVE ADK Response: '{output}'")
        
        if f"GEMINI-{random_id}-LIVE" in output:
             print(">>> PROOF VERIFIED: Model echoed dynamic run-time ID.")
        else:
             print(">>> VERIFICATION FAILED: Model did not echo ID.")

    except Exception as e:
        print(f">>> CONNECTION FAILED: {e}")

if __name__ == "__main__":
    print(f"Initiating Proof of Life sequence... Time: {datetime.datetime.now()}")
    prove_bedrock()
    prove_adk()
