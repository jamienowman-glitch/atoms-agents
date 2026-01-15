import argparse
import sys
import boto3
import os
import vertexai
from vertexai.generative_models import GenerativeModel

def chat_bedrock():
    print("--- LIVE CHAT WITH AWS BEDROCK ---")
    print("Type 'quit' to exit. No background processes will remain.")
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    model_id = "amazon.nova-2-lite-v1:0"

    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ["quit", "exit"]:
                print("Exiting...")
                break
                
            response = client.converse(
                modelId=model_id,
                messages=[{"role": "user", "content": [{"text": user_input}]}]
            )
            print(f"Bedrock ({model_id}): {response['output']['message']['content'][0]['text']}")
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {e}")

def chat_adk():
    print("--- LIVE CHAT WITH GOOGLE ADK (VERTEX) ---")
    print("Type 'quit' to exit. No background processes will remain.")
    
    project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
    location = os.environ.get("GCP_REGION", "us-central1")
    
    try:
        vertexai.init(project=project_id, location=location)
        model = GenerativeModel("gemini-2.5-flash")
        chat = model.start_chat()
        
        while True:
            try:
                user_input = input("\nYou: ")
                if user_input.lower() in ["quit", "exit"]:
                    print("Exiting...")
                    break
                    
                response = chat.send_message(user_input)
                print(f"Gemini: {response.text}")
                
            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"Error: {e}")
                
    except Exception as e:
        print(f"Initialization Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("provider", choices=["bedrock", "adk"], help="Provider to chat with")
    args = parser.parse_args()
    
    if args.provider == "bedrock":
        chat_bedrock()
    elif args.provider == "adk":
        chat_adk()
