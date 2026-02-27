from dataclasses import dataclass
from typing import List, Optional


@dataclass
class BudgetCard:
    budget_id: str
    max_calls_per_run: Optional[int] = None
    max_tokens_per_call: Optional[int] = None
    timeout_seconds: Optional[int] = None
    max_nodes_per_run: Optional[int] = None
    allow_providers: Optional[List[str]] = None
    allow_models: Optional[List[str]] = None
    card_type: str = "budget"

