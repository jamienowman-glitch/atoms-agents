# Phase 03: Runtime Stubs

## Execution Wrapper (`ConnectorExecutor`)
The single entry point for all connector operations.

```python
class ConnectorExecutor:
    def __init__(self, secrets: SecretResolver, gating: GatingService, 
                 budget: BudgetService, dataset: DatasetService):
        self.secrets = secrets
        self.gating = gating
        self.budget = budget
        self.dataset = dataset

    async def execute_operation(self, instance: ConnectorInstance, op_id: str, inputs: dict) -> dict:
        template = await self.registry.get_template(instance.template_ref)
        op_def = template.operations[op_id]
        
        # 1. Context & Scoping
        ctx = RequestContext(tenant_id=instance.tenant_id, env=instance.env)
        
        # 2. Strategy Lock Gate (REQUIRED)
        allowed = await self.gating.check_strategy_lock(
            ctx, 
            action=op_def.strategy_lock_action, 
            inputs=inputs
        )
        if not allowed:
            raise StrategyViolationError(f"Action {op_def.strategy_lock_action} blocked by Strategy Lock")

        # 3. Firearms Gate (CONDITIONAL)
        if op_def.firearms_action:
            allowed = await self.gating.check_firearms(
                ctx, 
                action=op_def.firearms_action, 
                subject=instance.id
            )
            if not allowed:
                raise FirearmsViolationError("Flux Capacitor not licensed for this operation")

        # 4. Secret Resolution (GSM)
        # Only resolve secrets JUST IN TIME. Never log them.
        runtime_config = await self.secrets.resolve_config(instance.config, template.auth_scheme)

        # 5. Execute Provider Logic
        try:
            outputs = await provider_impl.run(op_id, inputs, runtime_config)
        except Exception as e:
            # Handle error, maybe refund budget?
            raise e

        # 6. Dataset Event (Telemetry)
        if op_def.dataset_event.enabled:
            await self.dataset.emit(DatasetEvent(
                tenantId=instance.tenant_id,  # camelCase per contract
                env=instance.env,
                surface="connector",
                agentId=instance.id,
                input=inputs,
                output=outputs,
                metadata={"op_id": op_id}
            ))

        # 7. Budget Event (Billing)
        cost = calculate_cost(op_def.usage_event, inputs, outputs)
        await self.budget.emit(UsageEvent(
            tenant_id=instance.tenant_id,
            env=instance.env,
            tool_type=op_def.usage_event.tool_type,
            tool_id=instance.template_ref.id,
            cost=cost
        ))

        return outputs
```

## Interfaces

### SecretResolver
```python
class SecretResolver:
    async def resolve_config(self, config: dict, schema: dict) -> dict:
        """
        Iterates over config.auth.
        If value starts with 'secret::', fetches from GSM.
        Returns dict with resolved values.
        """
        pass
```

### GatingService
```python
class GatingService:
    async def check_strategy_lock(self, ctx: RequestContext, action: str, inputs: dict) -> bool:
        """Queries engines.strategy_lock for permission."""
        pass

    async def check_firearms(self, ctx: RequestContext, action: str, subject: str) -> bool:
        """Queries engines.firearms for licence validity."""
        pass
```
