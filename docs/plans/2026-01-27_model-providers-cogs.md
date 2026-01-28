---
title: Model Providers COGS (Inputs + Priors)
date: 2026-01-27
owner: jaynowman
status: active
---

# Model Providers COGS (Inputs + Priors)

This page defines the **vault inputs** that power `/dashboard/models/cost`.

## 1) Usage Snapshot (MTD)
**File:** `/Users/jaynowman/northstar-keys/model-usage-mtd.json`
```json
{
  "providers": {
    "groq": {
      "models": {
        "groq-llama-3.1-70b": {
          "input_tokens": 0,
          "output_tokens": 0,
          "requests": 0
        }
      }
    }
  }
}
```

## 2) Pricing Priors
**File:** `/Users/jaynowman/northstar-keys/model-pricing.json`
```json
{
  "providers": {
    "groq": {
      "models": {
        "groq-llama-3.1-70b": {
          "input_per_million": 0.0,
          "output_per_million": 0.0,
          "currency": "USD"
        }
      }
    }
  }
}
```

## 3) Free Credits / Free Tier (MTD)
**File:** `/Users/jaynowman/northstar-keys/model-free-credits.json`
```json
{
  "providers": {
    "groq": {
      "mtd_gbp": 0.0
    }
  }
}
```

## Registry Source
Currently read from `northstar-agents/src/northstar/registry/cards`.
Supabase registry hookup is pending and will replace this once stable.
