import sys
from typing import Any, Optional
from northstar.runtime.live.certifier import Certifier

def certify_live(ctx: Any, provider_id: str, model_id: str, profile: Optional[str] = None) -> None:
    """
    Perform a live smoke test for a provider/model.
    """
    if not provider_id or not model_id:
        print("Error: --provider and --model are strictly required for certification.")
        sys.exit(1)

    print(f"Certifying Live Connector: {provider_id} / {model_id} ...")
    
    certifier = Certifier(ctx)
    result = certifier.certify(provider_id, model_id, profile)
    
    print("-" * 40)
    print(f"Outcome: {'PASS' if result.success else 'FAIL'}")
    print(f"Latency: {result.latency_ms:.2f}ms")
    print(f"Reason:  {result.reason}")
    if not result.success and result.nonce:
         print(f"Expected Nonce: {result.nonce}")
         print(f"Got: {result.response_content}")
    print("-" * 40)
    
    if not result.success:
        sys.exit(1)
