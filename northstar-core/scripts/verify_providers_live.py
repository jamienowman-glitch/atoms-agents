import boto3
import json
import os
import sys
import datetime
from typing import Dict, Any, List

TIMESTAMP = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
EVIDENCE_DIR_BEDROCK = "docs/evidence/providers/bedrock"

def log(msg):
    print(f"[Bedrock Gate] {msg}")

def fail(msg):
    print(f"[Gate] CRITICAL FAILURE: {msg}")
    sys.exit(1)

def phase_0a_identity():
    log("Phase 0A: Checking AWS Identity & Region...")
    try:
        session = boto3.Session()
        region = session.region_name
        if not region:
            fail("No AWS region found in session.")
        
        sts = session.client("sts")
        identity = sts.get_caller_identity()
        
        log(f"  Region: {region}")
        log(f"  Account: {identity['Account']}")
        log(f"  Arn: {identity['Arn']}")
        
        # Check clients
        try:
            boto3.client("bedrock", region_name=region)
            boto3.client("bedrock-runtime", region_name=region)
            log("  Clients constructed successfully.")
        except Exception as e:
            fail(f"Client construction failed: {e}")
            
        return region
    except Exception as e:
        fail(f"Identity check failed: {e}")

def phase_0b_discovery(region):
    log("Phase 0B: Discovering Foundation Models...")
    client = boto3.client("bedrock", region_name=region)
    
    try:
        # List all Amazon models
        response = client.list_foundation_models(byProvider="Amazon")
        models = response.get("modelSummaries", [])
        
        # Save Raw Models JSON
        models_path = f"{EVIDENCE_DIR_BEDROCK}/list_foundation_models.{TIMESTAMP}.json"
        with open(models_path, "w") as f:
            json.dump(models, f, indent=2, default=str)
        log(f"  Raw models saved to {models_path}")

        # List Inference Profiles (Required for Nova 2)
        profiles = []
        try:
            # Need to paginate or just get first page usually enough for main ones
            prof_resp = client.list_inference_profiles()
            profiles = prof_resp.get("inferenceProfileSummaries", [])
            profiles_path = f"{EVIDENCE_DIR_BEDROCK}/list_inference_profiles.{TIMESTAMP}.json"
            with open(profiles_path, "w") as f:
                json.dump(profiles, f, indent=2, default=str)
            log(f"  Inference Profiles saved to {profiles_path}")
        except Exception as e:
            log(f"  Warning: Could not list inference profiles: {e}")
        
        # Heuristic Selection
        selected = { "text": None, "stream": None, "vision": None }
        
        candidates = []
        
        for p in profiles:
             # Profiles often look like "us.amazon.nova-2-lite-v1:0"
             # Filter for active and Amazon
             if "amazon" in p.get("inferenceProfileId", "").lower() and p.get("status") == "ACTIVE":
                  candidates.append({
                      "id": p["inferenceProfileId"], 
                      "name": p.get("inferenceProfileName"), 
                      "type": "profile",
                      "models": p.get("models", [])
                  })

        for m in models:
            if m["modelLifecycle"]["status"] == "ACTIVE":
                candidates.append({
                    "id": m["modelId"],
                    "name": m["modelName"],
                    "type": "model",
                    "input": m.get("inputModalities", []),
                    "output": m.get("outputModalities", []),
                    "stream": m.get("responseStreamingSupported", False)
                })

        def score_candidate(c):
            cid = c["id"]
            score = 0
            
            # Prefer Profiles for Nova 2 to avoid "on-demand not supported" error
            if "nova-2" in cid: 
                score += 1000
                if c["type"] == "profile": score += 500 # Strongly prefer profile for Nova 2
            elif "nova" in cid: score += 500
            elif "titan" in cid: score += 100
            
            # Prefer Lite/Micro
            if "micro" in cid: score += 10
            elif "lite" in cid: score += 20
            
            return score

        # Sort all candidates
        candidates.sort(key=score_candidate, reverse=True)
        
        # Select
        if not candidates: fail("No candidates found.")
        
        # Text: First candidate
        selected["text"] = candidates[0]["id"]
        
        # Streaming: First candidate that likely supports it (profiles usually assume capabilities of base)
        # We assume top Nova 2 profile supports text/stream
        selected["stream"] = candidates[0]["id"]
        
        # Vision: Look for Nova/Titan that implies image input
        # Profiles don't always list modalities in summary, but Nova 2 is multimodal.
        # We will iterate and find one that explicitly mentions modalities OR is a known multimodal family
        
        for c in candidates:
            # If model, check inputModalities. If profile, check name/models
            if c["type"] == "model" and "IMAGE" in c.get("input", []):
                selected["vision"] = c["id"]
                break
            # Heuristic for Profile Name if modalities missing
            if c["type"] == "profile" and ("nova" in c["id"] or "claude" in c["id"]): 
                # Nova and Claude are multimodal
                selected["vision"] = c["id"]
                break
        
        # Generate Selection MD
        md_content = f"# Bedrock Model Selection ({TIMESTAMP})\n\n"
        md_content += f"## Selected Models\n"
        md_content += f"- **Text**: `{selected['text']}`\n"
        md_content += f"- **Streaming**: `{selected['stream']}`\n"
        md_content += f"- **Vision**: `{selected['vision']}`\n\n"
        md_content += "## Discovery Logic\n"
        md_content += "Merged `list_foundation_models` and `list_inference_profiles`.\n"
        md_content += "Scored `nova-2 (profile)` > `nova-2 (base)` > `nova-1`.\n"
        
        with open(f"{EVIDENCE_DIR_BEDROCK}/model_selection.md", "w") as f:
            f.write(md_content)
        log(f"  Selection report saved to {EVIDENCE_DIR_BEDROCK}/model_selection.md")
        
        # Save selection json for resolver
        with open(f"{EVIDENCE_DIR_BEDROCK}/latest_selection.json", "w") as f:
             json.dump(selected, f, indent=2)
             
        return selected

    except Exception as e:
        fail(f"Discovery failed: {e}")

def phase_0c_live_calls(selected, region):
    log("Phase 0C: Live Minimal Calls...")
    client = boto3.client("bedrock-runtime", region_name=region)
    
    # 1. Text
    try:
        log(f"  Testing TEXT with {selected['text']}...")
        response = client.converse(
            modelId=selected["text"],
            messages=[{"role": "user", "content": [{"text": "Hello, code check."}]}],
            inferenceConfig={"maxTokens": 10}
        )
        output = response["output"]["message"]["content"][0]["text"]
        
        evidence = {
            "timestamp": datetime.datetime.now().isoformat(),
            "modelId": selected["text"],
            "input": "Hello, code check.",
            "output": output,
            "requestId": response["ResponseMetadata"]["RequestId"]
        }
        with open(f"{EVIDENCE_DIR_BEDROCK}/live_text.{TIMESTAMP}.json", "w") as f:
            json.dump(evidence, f, indent=2)
        log(f"  PASS: Text. Output: {output}")
        
    except Exception as e:
        fail(f"Text Call Failed: {e}")

    # 2. Streaming
    try:
        log(f"  Testing STREAM with {selected['stream']}...")
        response = client.converse_stream(
            modelId=selected["stream"],
            messages=[{"role": "user", "content": [{"text": "Count to 3."}]}],
            inferenceConfig={"maxTokens": 20}
        )
        stream = response.get("stream")
        events = []
        for event in stream:
            if "contentBlockDelta" in event:
                events.append(event["contentBlockDelta"]["delta"]["text"])
                if len(events) >= 3: break
        
        evidence = {
            "timestamp": datetime.datetime.now().isoformat(),
            "modelId": selected["stream"],
            "input": "Count to 3.",
            "first_chunks": events
        }
        with open(f"{EVIDENCE_DIR_BEDROCK}/live_stream.{TIMESTAMP}.json", "w") as f:
            json.dump(evidence, f, indent=2)
        
        # Also TXT as requested
        with open(f"{EVIDENCE_DIR_BEDROCK}/live_stream.{TIMESTAMP}.txt", "w") as f:
            f.write("".join(events))
            
        if not events: fail("Stream returned no events.")
        log(f"  PASS: Stream. Received {len(events)}+ chunks.")
        
    except Exception as e:
        fail(f"Stream Call Failed: {e}")

    # 3. Vision
    if selected["vision"]:
        try:
            log(f"  Testing VISION with {selected['vision']}...")
            # 1x1 GIF
            tiny_gif = b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
            
            response = client.converse(
                modelId=selected["vision"],
                messages=[{
                    "role": "user", 
                    "content": [
                        {"text": "Describe"},
                        {"image": {"format": "gif", "source": {"bytes": tiny_gif}}}
                    ]
                }],
                inferenceConfig={"maxTokens": 10}
            )
            output = response["output"]["message"]["content"][0]["text"]
             
            evidence = {
                "timestamp": datetime.datetime.now().isoformat(),
                "modelId": selected["vision"],
                "input": "[1x1 GIF]",
                "output": output,
                "requestId": response["ResponseMetadata"]["RequestId"]
            }
            with open(f"{EVIDENCE_DIR_BEDROCK}/live_vision.{TIMESTAMP}.json", "w") as f:
                json.dump(evidence, f, indent=2)
            log(f"  PASS: Vision. Output: {output}")
            
        except Exception as e:
            fail(f"Vision Call Failed: {e}")

if __name__ == "__main__":
    region = phase_0a_identity()
    selected = phase_0b_discovery(region)
    phase_0c_live_calls(selected, region)
    print("\n[Bedrock Gate] PASSED ALL CHECKS.")

def phase_1_adk():
    print("\n[ADK Gate] Phase 1: Checking ADK Surface & Freshness...")
    EVIDENCE_DIR_ADK = "docs/evidence/providers/adk"
    os.makedirs(EVIDENCE_DIR_ADK, exist_ok=True)
    
    # 1A: Document Surface
    # We know it uses vertexai from runtime/adk/client.py
    surface_md = """# ADK Surface Documentation
- **Client**: `vertexai.generative_models.GenerativeModel`
- **Location**: `runtime/adk/client.py`
- **Auth**: Google Application Default Credentials (ADC) via `GCP_PROJECT_ID` env var.
"""
    with open(f"{EVIDENCE_DIR_ADK}/adk_surface.md", "w") as f:
        f.write(surface_md)
    print(f"[ADK Gate]   Surface documented at {EVIDENCE_DIR_ADK}/adk_surface.md")

    # 1B: Live Tests with Gemini 2.5 Flash
    import vertexai
    from vertexai.generative_models import GenerativeModel, Part
    import base64
    
    project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
    location = os.environ.get("GCP_REGION", "us-central1")
    
    # Selection
    model_id = "gemini-2.5-flash" 
    # Current best heuristic for Dec 2025: Hardcode latest stable or list?
    # Vertex Model Garden list API is complex. We will stick to the proven 2.5 flash ID.
    
    # Save selection for resolver
    selected_adk = { "text": model_id, "vision": model_id, "search": model_id }
    with open(f"{EVIDENCE_DIR_ADK}/latest_selection.json", "w") as f:
        json.dump(selected_adk, f, indent=2)

    try:
        vertexai.init(project=project_id, location=location)
        
        # Text
        print(f"[ADK Gate]   Testing TEXT with {model_id}...")
        model = GenerativeModel(model_id)
        resp = model.generate_content("Hello")
        
        ev_text = {
            "timestamp": datetime.datetime.now().isoformat(),
            "modelId": model_id,
            "input": "Hello",
            "output": resp.text,
            "usage": str(resp.usage_metadata)
        }
        with open(f"{EVIDENCE_DIR_ADK}/live_text.{TIMESTAMP}.json", "w") as f:
            json.dump(ev_text, f, indent=2)
        print(f"[ADK Gate]   PASS: Text. Output: {resp.text}")

        # Vision
        print(f"[ADK Gate]   Testing VISION with {model_id}...")
        tiny_gif_b64 = "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        image_part = Part.from_data(data=base64.b64decode(tiny_gif_b64), mime_type="image/gif")
        resp_vis = model.generate_content(["Describe", image_part])
        
        ev_vis = {
             "timestamp": datetime.datetime.now().isoformat(),
             "modelId": model_id,
             "input": "[1x1 GIF]",
             "output": resp_vis.text
        }
        with open(f"{EVIDENCE_DIR_ADK}/live_vision.{TIMESTAMP}.json", "w") as f:
            json.dump(ev_vis, f, indent=2)
        print(f"[ADK Gate]   PASS: Vision. Output: {resp_vis.text}")

    except Exception as e:
        print(f"[ADK Gate] CRITICAL FAILURE: {e}")
        sys.exit(1)
        
    print("[ADK Gate] PASSED ALL CHECKS.")

if __name__ == "__main__":
    # BEDROCK
    region = phase_0a_identity()
    selected = phase_0b_discovery(region)
    phase_0c_live_calls(selected, region)
    
    # ADK
    phase_1_adk()
