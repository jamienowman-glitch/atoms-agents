# Live Smoke Tests

This directory contains the `smoke_live.py` script for verifying connectivity to underlying AI runtimes.

## Prerequisites

-   Active `northstar-core` venv.
-   Required environment variables for the runtimes you want to test.

## Usage

```bash
RUN_LIVE=1 python3 scripts/smoke_live.py
```

## Configuration

| Runtime | Env Vars Required | Notes |
| :--- | :--- | :--- |
| **Bedrock** | `AWS_PROFILE` or `AWS_ACCESS_KEY_ID`+`AWS_SECRET_ACCESS_KEY` | Uses `us-east-1` by default. |
| **ADK** | `GCP_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` | Uses `gemini-2.0-flash`. |

## Expected Output

```poll
RUNTIME                   | STATUS | MODEL                     | LATENCY  | MESSAGE
----------------------------------------------------------------------------------------------------
runtime/bedrock           | ✅ PASS | amazon.titan-text-express-v1 | 0.85s    | OK
runtime/adk               | ✅ PASS | gemini-1.0-pro            | 1.20s    | OK
runtime/langgraph         | ⏭️ SKIP | N/A                       | 0.00s    | No live flow defined ...
...
```

## Troubleshooting

### ADK 404 Error
If you see `404 Publisher Model ... was not found`, verify:
1.  **Project ID**: Ensure `GCP_PROJECT_ID` is correct.
2.  **API Enabled**: Ensure `Vertex AI API` is enabled in your GCP project.
3.  **Region**: Ensure the model is available in the configured region (default `us-central1`).
4.  **Permissions**: Ensure your `GOOGLE_APPLICATION_CREDENTIALS` account has `Vertex AI User` role.
