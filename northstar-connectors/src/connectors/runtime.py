import abc
from decimal import Decimal
from typing import Any, Dict, Protocol, Optional

from connectors.models import (
    ConnectorInstance, 
    ConnectorTemplate, 
    RequestContext, 
    DatasetEvent, 
    UsageEvent
)
from connectors.registry import Registry

class SecretResolver(abc.ABC):
    @abc.abstractmethod
    async def resolve_config(self, config: Dict[str, Any], template: ConnectorTemplate) -> Dict[str, Any]:
        """Resolve secret:: references to actual values."""
        pass

class GatingService(abc.ABC):
    @abc.abstractmethod
    async def check_strategy_lock(self, ctx: RequestContext, action: str, inputs: Dict[str, Any]) -> bool:
        pass

    @abc.abstractmethod
    async def check_firearms(self, ctx: RequestContext, action: str, subject: str) -> bool:
        pass

class BudgetService(abc.ABC):
    @abc.abstractmethod
    async def emit(self, event: UsageEvent) -> None:
        pass

class DatasetService(abc.ABC):
    @abc.abstractmethod
    async def emit(self, event: DatasetEvent) -> None:
        pass

class ProviderBackend(Protocol):
    async def run(self, op_id: str, inputs: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
        ...

class RuntimeConfig:
    def __init__(self, secrets: SecretResolver, gating: GatingService, budget: BudgetService, dataset: DatasetService, registry: Registry):
        self.secrets = secrets
        self.gating = gating
        self.budget = budget
        self.dataset = dataset
        self.registry = registry
    
    # Simple registry injection for now
    _providers: Dict[str, ProviderBackend] = {}

    def register_provider(self, provider_slug: str, implementation: ProviderBackend):
        self._providers[provider_slug] = implementation

    def get_provider(self, slug: str) -> Optional[ProviderBackend]:
        return self._providers.get(slug)


class StrategyViolationError(Exception):
    pass

class FirearmsViolationError(Exception):
    pass


class ConnectorExecutor:
    def __init__(self, config: RuntimeConfig):
        self.cfg = config

    async def execute_operation(self, instance: ConnectorInstance, op_id: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        # 0. Load Template
        template = self.cfg.registry.get_template(instance.template_ref.id, instance.template_ref.version)
        if not template:
            raise ValueError(f"Template not found: {instance.template_ref}")
        
        op_def = template.operations.get(op_id)
        if not op_def:
            raise ValueError(f"Operation {op_id} not found in template {template.id}")

        # 1. Context
        ctx = RequestContext(
            tenant_id=instance.tenant_id,
            env=instance.env
        )

        # 2. Strategy Lock
        if op_def.strategy_lock_action:
            allowed = await self.cfg.gating.check_strategy_lock(ctx, op_def.strategy_lock_action, inputs)
            if not allowed:
                raise StrategyViolationError(f"Action {op_def.strategy_lock_action} blocked by Strategy Lock")

        # 3. Firearms
        if op_def.firearms_action:
            allowed = await self.cfg.gating.check_firearms(ctx, op_def.firearms_action, instance.id)
            if not allowed:
                raise FirearmsViolationError(f"Firearms licence required for {op_def.firearms_action}")

        # 4. Resolve Secrets
        start_time = Decimal(0) # Placeholder for cost calc, simplified here
        runtime_config = await self.cfg.secrets.resolve_config(instance.config, template)

        # 5. Execute
        provider = self.cfg.get_provider(template.id)
        if not provider:
            raise ValueError(f"No backend registered for provider {template.id}")
        
        try:
            outputs = await provider.run(op_id, inputs, runtime_config)
        except Exception:
            raise

        # 6. Dataset Event
        if op_def.dataset_event.enabled:
            await self.cfg.dataset.emit(DatasetEvent(
                tenantId=instance.tenant_id, # camelCase
                env=instance.env,
                surface="connector",
                agentId=instance.id,
                input=inputs,
                output=outputs,
                train_ok=op_def.dataset_event.train_ok,
                pii_flags=op_def.dataset_event.pii_flags,
                metadata={"op_id": op_id}
            ))

        # 7. Budget Event
        # Simplified cost calc (static default from YAML)
        # Real impl might measure duration or token usage
        cost_val = op_def.usage_event.default_cost
        await self.cfg.budget.emit(UsageEvent(
            tenant_id=instance.tenant_id,
            env=instance.env,
            tool_type=op_def.usage_event.tool_type,
            tool_id=template.id, 
            cost=str(cost_val)
        ))

        return outputs
