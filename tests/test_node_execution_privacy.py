import pytest
from unittest.mock import MagicMock, patch, ANY, AsyncMock
from atoms_agents.runtime.node_executor import NodeExecutor
from atoms_agents.registry.schemas import NodeCard, RunProfileCard, PersonaCard, TaskCard
from atoms_agents.runtime.context import AgentsRequestContext, ContextMode
from atoms_agents.logging.event_v2_logger import log_provider_inference, EventV2Logger
from atoms_agents.runtime.node_result import NodeRunResult

@pytest.fixture
def mock_registry():
    registry = MagicMock()
    registry.personas.get.return_value = PersonaCard(
        persona_id="p1", name="Test Persona", description="Test Persona"
    )
    registry.tasks.get.return_value = TaskCard(
        task_id="t1", name="Test Task", goal="Test Goal"
    )
    registry.models.get.return_value = MagicMock()
    return registry

@pytest.fixture
def request_context():
    return AgentsRequestContext(
        tenant_id="test-tenant",
        mode=ContextMode.SAAS,
        project_id="test-project",
        request_id="req-1",
        actor_id="agent-1",
        surface_id="surface-1"
    )

class TestNodeExecutorPrivacy:
    
    @patch("atoms_agents.runtime.node_executor.resolve_gateway")
    @patch("atoms_agents.runtime.prompting.composer.compose_messages")
    def test_node_execution_scrubs_pii(self, mock_compose, mock_resolve_gateway, mock_registry, request_context):
        # Setup
        executor = NodeExecutor(mock_registry)
        mock_gateway = MagicMock()
        mock_gateway.check_readiness.return_value = MagicMock(ready=True)
        # Mock gateway response so execution finishes
        mock_gateway.generate.return_value = {"content": "Safe response", "status": "success"}
        mock_resolve_gateway.return_value = mock_gateway
        
        # Mock compose to return PII
        mock_compose.return_value = [
            {"role": "user", "content": "My email is test@example.com"}
        ]
        
        node = NodeCard(
            node_id="n1",
            name="Test Node", 
            kind="agent", 
            persona_ref="p1", 
            task_ref="t1",
            provider_ref="prov1",
            model_ref="mod1"
        )
        profile = RunProfileCard(
            profile_id="prof1",
            name="Test Profile",
            persistence_backend="local",
            blackboard_backend="local",
            pii_strategy="strict",
            nexus_strategy="disabled",
            allow_local_fallback=True
        )

        # Execute
        result = executor.execute_node(node, profile, request_context=request_context)

        # Assert
        assert result.status == "PASS"
        
        # Verify gateway was called with SCRUBBED message
        args, _ = mock_gateway.generate.call_args
        messages_arg = args[0]
        import re
        content = messages_arg[0]["content"]
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", content)
        assert "test@example.com" not in content

    @patch("atoms_agents.runtime.node_executor.resolve_gateway")
    @patch("atoms_agents.runtime.prompting.composer.compose_messages")
    def test_node_execution_passthrough_pii(self, mock_compose, mock_resolve_gateway, mock_registry, request_context):
        # Setup
        executor = NodeExecutor(mock_registry)
        mock_gateway = MagicMock()
        mock_gateway.check_readiness.return_value = MagicMock(ready=True)
        mock_gateway.generate.return_value = {"content": "Safe response", "status": "success"}
        mock_resolve_gateway.return_value = mock_gateway
        
        mock_compose.return_value = [{"role": "user", "content": "My email is test@example.com"}]
        
        node = NodeCard(node_id="n1", name="N", kind="agent", persona_ref="p1", task_ref="t1", provider_ref="pv", model_ref="m")
        profile = RunProfileCard(
            profile_id="prof1", name="P", persistence_backend="local", blackboard_backend="local",
            pii_strategy="passthrough", nexus_strategy="disabled", allow_local_fallback=True
        )

        # Execute
        result = executor.execute_node(node, profile, request_context=request_context)

        # Assert
        assert result.status == "PASS"
        args, _ = mock_gateway.generate.call_args
        content = args[0][0]["content"]
        assert "test@example.com" in content # NOT scrubbed
        
        # Verify warning log
        warning_event = next((e for e in result.events if e["type"] == "privacy_warning"), None)
        assert warning_event is not None
        assert "passthrough strategy enabled" in warning_event["message"]

    @patch("atoms_agents.runtime.node_executor.resolve_gateway")
    @patch("atoms_agents.runtime.prompting.composer.compose_messages")
    def test_node_execution_fail_closed_unknown_strategy(self, mock_compose, mock_resolve_gateway, mock_registry, request_context):
        # Setup
        executor = NodeExecutor(mock_registry)
        mock_compose.return_value = [{"role": "user", "content": "foo"}]
        
        node = NodeCard(node_id="n1", name="N", kind="agent", persona_ref="p1", task_ref="t1", provider_ref="pv", model_ref="m")
        profile = RunProfileCard(
            profile_id="prof1", name="P", persistence_backend="local", blackboard_backend="local",
            pii_strategy="voodoo", nexus_strategy="disabled", allow_local_fallback=True
        )

        # Execute
        result = executor.execute_node(node, profile, request_context=request_context)

        # Assert
        assert result.status == "FAIL"
        assert "Unknown pii_strategy: voodoo" in result.error

    @patch("atoms_agents.runtime.node_executor.resolve_gateway")
    @patch("atoms_agents.runtime.prompting.composer.compose_messages")
    @patch("atoms_agents.runtime.privacy.scrubber.RecursiveScrubber.scrub")
    def test_node_execution_fail_closed_on_scrub_error(self, mock_scrub, mock_compose, mock_resolve, mock_registry, request_context):
        # Setup
        executor = NodeExecutor(mock_registry)
        mock_gateway = MagicMock()
        mock_gateway.check_readiness.return_value = MagicMock(ready=True)
        mock_resolve.return_value = mock_gateway
        
        mock_compose.return_value = [{"role": "user", "content": "foo"}]
        
        # Simulate catastrophic scrubber failure
        mock_scrub.side_effect = Exception("Scrubber crashed")
        
        node = NodeCard(
            node_id="n1",
            name="Test Node", 
            kind="agent", 
            persona_ref="p1", 
            task_ref="t1",
            provider_ref="prov1",
            model_ref="mod1"
        )
        profile = RunProfileCard(
            profile_id="prof1",
            name="Test Profile",
            persistence_backend="local",
            blackboard_backend="local",
            pii_strategy="strict",
            nexus_strategy="disabled",
            allow_local_fallback=True
        )

        # Execute
        result = executor.execute_node(node, profile, request_context=request_context)

        # Assert
        assert result.status == "FAIL"
        assert "Scrubber crashed" in result.error
        # Gateway should NOT have been called
        mock_gateway.generate.assert_not_called()

class TestLoggingPrivacy:
    @pytest.mark.asyncio
    async def test_log_provider_inference_scrubs_pii(self):
        logger = EventV2Logger("t1", "p1")
        # Mock emit_event to check payload
        logger.emit_event = AsyncMock()
        
        await log_provider_inference(
            logger,
            provider_id="prov",
            model_id="mod",
            input_text="Input with test@example.com",
            output_text="Output with 123-456-7890",
        )
        
        # Verify payload in emit_event call
        args, _ = logger.emit_event.call_args
        event = args[0]
        payload = event.payload
        
        import re
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", payload["input_text"])
        assert "test@example.com" not in payload["input_text"]
        
        assert re.search(r"\[PHONE:[a-f0-9]{12}\]", payload["output_text"])
        assert "123-456-7890" not in payload["output_text"]

    @pytest.mark.asyncio
    async def test_log_provider_inference_fails_safe(self, monkeypatch):
        logger = EventV2Logger("t1", "p1")
        logger.emit_event = AsyncMock()

        # Force scrubber failure in the logging path
        from atoms_agents.runtime.privacy.scrubber import PiiScrubber
        def mock_scrub_error(*args, **kwargs):
            raise Exception("Scrubber explosion")
        
        monkeypatch.setattr(PiiScrubber, "scrub_text", mock_scrub_error)

        await log_provider_inference(
            logger,
            provider_id="prov",
            model_id="mod",
            input_text="Secret PII test@example.com",
            output_text="Secret response 555-555-5555"
        )

        # Verify raw content was DROPPED
        args, _ = logger.emit_event.call_args
        event = args[0]
        payload = event.payload
        
        assert payload["input_text"] == "[SCRUBBER_FAILED_DROPPED]"
        assert payload["output_text"] == "[SCRUBBER_FAILED_DROPPED]"
        assert "test@example.com" not in payload["input_text"]

