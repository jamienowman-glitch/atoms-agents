# AGENTS.md

## 🛑 The Law of the Muscle

**This is a Dumb Factory.**

1.  **NO Auth Checks.**
    *   This environment assumes the request is already authorized by the Core / Orchestrator.
    *   Do not import `engines.identity`, `engines.auth`, or `engines.common.identity`.
    *   Do not check `tenant_id` membership.

2.  **NO Database Calls (Direct).**
    *   This environment processes inputs and returns outputs.
    *   It does not query the User DB, the Tenant DB, or the Billing DB.
    *   It receives all necessary context (URLs, paths, configuration) in the Job payload.

3.  **Pure Input/Output.**
    *   Input: Job Description + Assets (S3 URLs / Local Paths).
    *   Process: Heavy Compute (FFmpeg, Rendering, Inference).
    *   Output: Result (S3 URL / Local Path) + Metadata.

4.  **Hardware Aware.**
    *   Code must check for GPU availability.
    *   Gracefully degrade to CPU if necessary (or fail fast if GPU is mandatory).

5.  **Clean Dependencies.**
    *   Do not import `northstar_engines` code.
    *   This repository is standalone.
