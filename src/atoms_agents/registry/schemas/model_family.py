from dataclasses import dataclass, field
from typing import List


@dataclass
class ModelFamilyCard:
    family_id: str
    name: str
    description: str = ""
    provider_ids: List[str] = field(default_factory=list)  # Which providers host this family
    card_type: str = "model_family"

