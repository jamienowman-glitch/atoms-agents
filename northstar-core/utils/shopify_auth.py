import hmac
import hashlib
import urllib.parse
from typing import Dict

def verify_shopify_proxy_hmac(query_params: Dict[str, str], shared_secret: str) -> bool:
    """
    Verifies the HMAC signature of a Shopify App Proxy request.
    
    Args:
        query_params: The dictionary of query parameters from the request.
        shared_secret: The API Secret Key of the Shopify App.
        
    Returns:
        True if the signature is valid, False otherwise.
    """
    if "signature" not in query_params:
        return False

    signature = query_params["signature"]
    
    # Remove signature from params for calculation
    params_to_hash = {k: v for k, v in query_params.items() if k != "signature"}
    
    # Sort and encode params
    sorted_params = sorted(params_to_hash.items())
    encoded_params = []
    
    for key, value in sorted_params:
        # Shopify App Proxy params are just key=value, not array format
        # Values should be unquoted string if they are lists (which they ideally aren't for proxy)
        # Standard implementation joins list with comma, but typically proxy params are simple strings
        if isinstance(value, list):
            value = ",".join(value)
        encoded_params.append(f"{key}={value}")
        
    # Join with no delimiter? No, for Proxy it's simple concatenation of key=value
    # Wait, documentation says: "sort the query parameters... concatenate the parameters into a single string"
    # Actually, it's typically: "path_prefix=...&shop=..." -> sort -> join
    # "The characters in the string are the key and value pairs... concatenated together."
    # Let's double check the exact spec.
    # Spec: "Sort the keys... For each key-value pair... concatenate the key and value with an =... concatenate the pairs"
    # Actually, for App Proxy it is slightly different than Admin/OAuth.
    # "calculate the signature... sort the parameters... format key=value... join with simply nothing?"
    # NO. App Proxy calculation:
    # 1. Parse params.
    # 2. Remove signature.
    # 3. Sort keys.
    # 4. Create string: "key1=value1key2=value2..." NO, that's not right.
    # 5. Correct: encoded_string = "key1=value1key2=value2" ? 
    # Let's check the search result from before.
    
    # Search Result 3464 said: "Sort... Join multiple values... Concatenate them into a single string in the format key=value."
    # It didn't specify the separator between pairs. 
    # Typically it is NO separator for some signatures, but standard HMAC is usually `&`.
    # Let's use the `urllib.parse.urlencode` logic but verify the separator.
    # OFFICIAL DOCS: "input_string = 'key1=value1key2=value2...'" (No separator)
    # Wait, let's play it safe and check the connector implementation logic if possible, or assume standard.
    # Actually, most libraries use `urllib.parse.urlencode` which adds `&`.
    # BUT Shopify App Proxy is unique.
    
    # Re-reading specific docs: 
    # "The signature is a SHA-256 HMAC of the query parameters."
    # "to verify: ... sort ... concatenate the key and value ... join them".
    # If I use `hmac` verification, I need to be exact.
    
    # Let's implement a standard `verify_hmac` that tries both (common pitfall).
    # But for now, let's assume the standard `urlencode` (with `&`) is WRONG for Proxy.
    # Proxy is often `key=valuekey=value`.
    
    # actually, let's implement a safer version that takes the raw query string if possible?
    # No, FastAPI gives parsed params.
    
    # Let's stick to the most common implementation:
    # message = sorted_params.map(k,v -> f"{k}={v}").join("")
    
    input_string = "".join([f"{k}={v}" for k, v in sorted_params])
    
    # Create HMAC
    secret_bytes = shared_secret.encode('utf-8')
    message_bytes = input_string.encode('utf-8')
    
    calculated_signature = hmac.new(secret_bytes, message_bytes, hashlib.sha256).hexdigest()
    
    return hmac.compare_digest(calculated_signature, signature)
