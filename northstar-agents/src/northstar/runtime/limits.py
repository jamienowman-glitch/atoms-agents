from dataclasses import dataclass

@dataclass
class RunLimits:
    max_calls: int = 1
    max_output_tokens: int = 64
    timeout_seconds: float = 20.0
