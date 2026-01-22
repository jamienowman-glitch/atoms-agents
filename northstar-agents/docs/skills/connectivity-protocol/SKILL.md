---
name: connectivity-protocol
description: Standard operating procedures for verifying agent connectivity, commerce tokens, and model versions.
---

# 🔌 CONNECTIVITY & COMMERCE PROTOCOLS

## 1. The Verification Loop
When building or testing agents, we do not trust local return values. We trust the **Nervous System**.
* **Action:** Agent writes to `Timeline`.
* **Verification:** Lab listens to `/sse/timeline`.
* **Rule:** If it doesn't appear in the SSE stream, it didn't happen.

## 2. The Commerce Standard
We operate a billed factory. "Unknown" cost is a bug.
* **Gateway Requirement:** All Gateways must return `TokenUsage` (input/output ints).
* **Price Book:** To update model pricing, edit `northstar-engines/data/price_book.json`. Do not edit Python code.

## 3. The "Gemini Purge"
* **Deprecated:** `gemini-1.5-pro`, `gemini-1.5-flash`.
* **Active:** `gemini-2.0-flash`, `gemini-2.0-pro` (or current 2026 equivalent).
* **Action:** If you see a hardcoded 1.5 model, destroy it.
