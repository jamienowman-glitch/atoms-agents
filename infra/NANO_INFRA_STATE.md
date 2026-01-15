# Azure Infra — Canonical State

## Cosmos DB
- Account name: northstar-cosmos-02
- Resource group: northstar-smoke-rg
- Region: eastus2
- API: SQL (Core)
- Endpoint: https://northstar-cosmos-02.documents.azure.com:443/
- Database: northstar
- Container: control_plane
- Partition key: /pk
- Throughput: 400 RU/s
- Auth: Azure AD (Cosmos DB Built-in Data Contributor)
- Public access: Enabled
- Private endpoints: Disabled
- Availability zones: Disabled

## Status
- Created successfully via Azure CLI
- Verified live
- Ready for routing-registry integration
