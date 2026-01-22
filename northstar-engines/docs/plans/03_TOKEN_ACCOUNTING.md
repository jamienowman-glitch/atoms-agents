# Plan 03: Token Accounting & Commerce Layer

**Phase**: 3 - Connectivity & Truth Verification
**Target**: `northstar-engines` & `northstar-agents`
**Status**: DRAFT

## 1. The Objective
We cannot manage what we cannot measure. We must transition from "Fire and Forget" to "Track and Bill."
Every LLM interaction must return precise token usage. The Engine must calculate the USD cost of that usage using a localized "Price Book" and broadcast this cost in real-time to the Lab.

## 2. Standardization: The Gateway Contract
Currently, Gateways return inconsistent shapes. We will enforce a strict contract.

### 2.1 Update `LLMGateway.generate`
The `generate` method signature remains the same, but the return `Dict[str, Any]` **MUST** conform to this schema:

```python
class TokenUsage(TypedDict):
    input_tokens: int
    output_tokens: int
    total_tokens: int
    # details: Optional[Dict[str, int]] # e.g. cache_read, cache_creation

class GenerationResult(TypedDict):
    role: str
    content: str
    usage: TokenUsage  # <--- CRITICAL: Must not be None
    finish_reason: str
    model_id: str      # The actual model used (e.g. if resolved from alias)
```

**Task:**
- Modify `northstar-agents/src/northstar/runtime/gateway.py` to define these TypedDicts.
- Update `OpenRouterGateway`, `AzureOpenAIGateway`, `BedrockGateway`, `VertexGateway` to map their SDK responses to this schema.

## 3. The Price Book (Lookup Table)
We will move hardcoded prices from `cogs.py` to a data-driven approach.

### 3.1 `northstar-engines/data/price_book.json`
A persistent JSON file defining costs per **1 Million Tokens** (industry standard).

```json
{
  "currency": "USD",
  "rates": {
    "openai/gpt-4o": {
      "input_per_1m": 2.50,
      "output_per_1m": 10.00
    },
    "google/gemini-2.0-flash": {
      "input_per_1m": 0.10,
      "output_per_1m": 0.40
    },
    "anthropic/claude-3-5-sonnet": {
      "input_per_1m": 3.00,
      "output_per_1m": 15.00
    }
  },
  "defaults": {
     "input_per_1m": 1.00, 
     "output_per_1m": 1.00
  }
}
```

## 4. The Commerce Engine
We will upgrade `northstar-engines/engines/budget/` to handle real-time calculation.

### 4.1 `TokenAccountingService`
A new service class that:
1.  Loads `price_book.json` on startup.
2.  Accepts `(provider, model, input_tokens, output_tokens)`.
3.  Returns `cost_usd: Decimal`.

```python
def calculate_cost(self, provider: str, model: str, usage: TokenUsage) -> Decimal:
    # Logic to match "provider/model" key in Price Book
    # Fallback to fuzzy matching or defaults
    # Return (input * price_in + output * price_out) / 1,000,000
```

## 5. SSE Integration (The "Receipt")
The Lab needs to see the bill immediately.

### 5.1 Update Stream Events
When `NodeExecutor` (in Agents) or `RoutingService` (in Engines) completes a step, it emits a `run_step_complete` event. This event must now include the commerce payload.

**Event Payload Upgrade:**
```json
{
  "type": "run_step_complete",
  "data": {
    "node_id": "...",
    "output": "...",
    "usage": {
      "input": 150,
      "output": 40
    },
    "cost_usd": 0.00045,  # Calculated by calling AccountingService
    "provider": "google",
    "model": "gemini-2.0-flash"
  }
}
```

## 6. Execution Steps (For Worker)
1.  **Refactor Gateways**: Open all `providers/*.py` and fix the return statements.
2.  **Create Price Book**: Create the JSON file with current rates for all models in our Registry.
3.  **Implement Service**: Write `TokenAccountingService` in `engines/budget`.
4.  **Hook Execution**: In `NodeExecutor.execute_node`, after getting the result from Gateway:
    - Call `TokenAccountingService.calculate_cost(...)`.
    - Inject `cost_usd` into the result object.
    - Ensure this flows into the `StreamEvent`.

## 7. Verification
- **Unit Test**: `test_token_accounting.py` -> Verify math correctness.
- **Integration**: Run a flow, check the SSE stream contains `cost_usd`.
