---
title: Azure Billing Re-enable (Blocking COGS)
date: 2026-01-27
owner: jaynowman
status: blocked
---

# Azure Billing Re-enable (COGS)

**Problem**
- Subscription is disabled: `64cce95c-7395-41e4-87c4-0141783036b9`
- Error seen: `ReadOnlyDisabledSubscription`

## Portal Steps (No Terminal)
1) Open `portal.azure.com`
2) Search **Subscriptions**
3) Open **Azure subscription 1**
4) If **Disabled**, click **Reactivate** or **Upgrade to Pay‑As‑You‑Go**
5) Add/confirm payment method if required

## CLI Steps (after subscription enabled)
```bash
az account set --subscription 64cce95c-7395-41e4-87c4-0141783036b9

az ad sp create-for-rbac \
  --name "northstar-billing" \
  --role "Cost Management Reader" \
  --scopes /subscriptions/64cce95c-7395-41e4-87c4-0141783036b9
```

## Paste JSON Output Here
```json
{
  "appId": "",
  "displayName": "",
  "password": "",
  "tenant": ""
}
```

## Vault Filename Proposal (for when ready)
- `azure-client-id.txt`
- `azure-client-secret.txt`
- `azure-tenant-id.txt`
- `azure-subscription-id.txt`
