import sys
import unittest
import os
from northstar.runtime.gateway_resolution import resolve_gateway
from northstar.registry.schemas import ModelCard, ProviderConfigCard

class ProbeHarness:
    def __init__(self):
        self.results = []
        
    def probe_provider_connectivity(self, provider_id: str, model_id: str, prompt: str = "Hello from Northstar Probe"):
        print(f"\n--- Probing {provider_id} / {model_id} ---")
        try:
            gateway = resolve_gateway(provider_id)
            readiness = gateway.check_readiness()
            print(f"Readiness: {readiness}")
            
            if not readiness.ready:
                self.results.append({"provider": provider_id, "status": "SKIPPED", "reason": "Not Ready"})
                return

            # Fake Model Card for probe (or load from registry if fully integrated, but here we synthesize to test runtime)
            model = ModelCard(f"probe.{model_id}", provider_id, model_id)
            messages = [{"role": "user", "content": prompt}]
            
            resp = gateway.generate(messages, model, None)
            
            status = "SUCCESS" if "content" in resp else "FAIL"
            token_count = resp.get("usage", {}).get("total_tokens", "N/A")
            
            print(f"Result: {status}")
            print(f"Tokens: {token_count}")
            # print(f"Content: {resp.get('content')}") # Sensitive?
            
            self.results.append({
                "provider": provider_id, 
                "model": model_id, 
                "status": status, 
                "tokens": token_count,
                "error": resp.get("reason") or resp.get("error")
            })
            
        except Exception as e:
            print(f"Exception: {e}")
            self.results.append({"provider": provider_id, "model": model_id, "status": "ERROR", "error": str(e)})

    def probe_gemini_video(self, video_path: str):
         print(f"\n--- Probing Gemini Video Input ---")
         if not os.path.exists(video_path):
             print(f"Video file not found: {video_path}")
             return
             
         try:
             gateway = resolve_gateway("gemini")
             if not gateway.check_readiness().ready:
                 print("Gemini not ready")
                 return
                 
             model = ModelCard("probe.gemini_flash", "gemini", "gemini-2.0-flash")
             # Send file path as text (our hack in gemini.py)
             messages = [{"role": "user", "content": f"file://{video_path}"}, {"role": "user", "content": "Describe this video."}]
             
             resp = gateway.generate(messages, model, None)
             print(f"Video Result: {resp}")
             self.results.append({"provider": "gemini", "feature": "video_upload", "status": "SUCCESS" if "content" in resp else "FAIL"})
             
         except Exception as e:
             print(f"Video Probe Exception: {e}")
             self.results.append({"provider": "gemini", "feature": "video_upload", "status": "ERROR", "error": str(e)})

    def print_report(self):
        print("\n=== PROBE REPORT ===")
        print(f"{'PROVIDER':<15} {'MODEL':<25} {'STATUS':<10} {'TOKENS'}")
        print("-" * 60)
        for r in self.results:
            p = r.get("provider", "")
            m = r.get("model", r.get("feature", ""))
            s = r.get("status", "")
            t = r.get("tokens", "")
            print(f"{p:<15} {m:<25} {s:<10} {t}")

if __name__ == "__main__":
    harness = ProbeHarness()
    
    # 1. Groq
    harness.probe_provider_connectivity("groq", "llama-3.3-70b-versatile")
    
    # 2. OpenRouter
    harness.probe_provider_connectivity("openrouter", "anthropic/claude-3-haiku") # Cheap model
    
    # 3. NVIDIA
    harness.probe_provider_connectivity("nvidia", "meta/llama3-70b-instruct")
    
    # 4. Comet
    harness.probe_provider_connectivity("comet", "comet-default")
    
    # 5. Gemini Text
    harness.probe_provider_connectivity("gemini", "gemini-2.0-flash")
    
    # 6. Jules
    harness.probe_provider_connectivity("jules", "default", prompt="Hello Jules")
    
    harness.print_report()
