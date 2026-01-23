from decimal import Decimal
from typing import Dict, Any, Optional
import json
import os
from pathlib import Path

class TokenAccountingService:
    def __init__(self, price_book_path: Optional[str] = None):
        if not price_book_path:
            # Assumes this file is in northstar-engines/engines/budget/
            # and price_book is in northstar-engines/data/
            # Path(__file__) = .../engines/budget/token_accounting.py
            # parent = budget
            # parent.parent = engines
            # parent.parent.parent = northstar-engines
            base = Path(__file__).resolve().parent.parent.parent
            price_book_path = base / "data/price_book.json"

        self.rates = {}
        self.defaults = {"input_per_1m": 1.0, "output_per_1m": 1.0}

        if os.path.exists(price_book_path):
            try:
                with open(price_book_path, "r") as f:
                    data = json.load(f)
                    self.rates = data.get("rates", {})
                    if "defaults" in data:
                        self.defaults = data["defaults"]
            except Exception as e:
                print(f"Error loading price book: {e}")
        else:
            print(f"Warning: Price book not found at {price_book_path}")

    def calculate_cost(self, provider: str, model: str, usage: Dict[str, int]) -> float:
        input_tokens = usage.get("input_tokens", 0)
        output_tokens = usage.get("output_tokens", 0)

        # 1. Exact Match (e.g. "openai/gpt-4o")
        key = f"{provider}/{model}"
        rate = self.rates.get(key)

        # 2. Heuristics / Normalization
        if not rate:
            # Handle Azure
            if provider == "azure_openai":
                # Try 'openai/...'
                alt_key = f"openai/{model}"
                rate = self.rates.get(alt_key)

            # Handle Bedrock (aws_bedrock)
            if not rate and provider == "aws_bedrock":
                # Map bedrock ID to anthropic/claude-3-5-sonnet logic
                # Example model: "anthropic.claude-3-5-sonnet-20240620-v1:0"
                if "anthropic.claude" in model and "3-5" in model and "sonnet" in model:
                    rate = self.rates.get("anthropic/claude-3-5-sonnet")

        if not rate:
            rate = self.defaults

        p_in = Decimal(str(rate.get("input_per_1m", 0.0)))
        p_out = Decimal(str(rate.get("output_per_1m", 0.0)))

        # Avoid division by zero, though logic handles it.
        # Cost = (tokens / 1M) * price

        cost = (Decimal(input_tokens) / Decimal(1_000_000)) * p_in + \
               (Decimal(output_tokens) / Decimal(1_000_000)) * p_out

        return float(cost)
