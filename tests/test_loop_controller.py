
import pytest
from unittest.mock import MagicMock
from atoms_agents.runtime.loop_controller import LoopController, LoopContext, LoopState
from atoms_agents.runtime.executor import FlowExecutor

def test_loop_controller_transitions():
    ctx = LoopContext(run_id="test_run", tenant_id="t1")
    controller = LoopController(ctx)
    
    assert controller.current_state == LoopState.EXPLORE
    
    # Valid transition
    controller.transition(LoopState.EXECUTE, "Start exec")
    assert controller.current_state == LoopState.EXECUTE
    
    # Invalid transition (e.g., skip QA_REVIEW)
    with pytest.raises(ValueError, match="Invalid transition"):
        controller.transition(LoopState.COMPLETE)
    
    controller.transition(LoopState.QA_REVIEW)
    assert controller.current_state == LoopState.QA_REVIEW
    
    # QA Fail -> Refine
    next_state = controller.evaluate_qa(False)
    assert next_state == LoopState.REFINE
    controller.transition(LoopState.REFINE)
    assert ctx.current_attempt == 2
    
    # Refine -> Execute
    controller.transition(LoopState.EXECUTE)
    assert controller.current_state == LoopState.EXECUTE

def test_loop_retry_ceiling():
    # Max attempts = 2
    ctx = LoopContext(run_id="test_run", tenant_id="t1", max_attempts=2)
    controller = LoopController(ctx)
    
    controller.transition(LoopState.EXECUTE)
    controller.transition(LoopState.QA_REVIEW)
    
    # Attempt 1 failed
    controller.transition(LoopState.REFINE, "Fail 1")
    assert ctx.current_attempt == 2
    
    controller.transition(LoopState.EXECUTE)
    controller.transition(LoopState.QA_REVIEW)
    
    # Attempt 2 failed (Max reached)
    success = controller.transition(LoopState.REFINE, "Fail 2")
    assert not success
    assert controller.current_state == LoopState.FAILED
    assert "Max attempts 2 reached" in ctx.state_history[-1]["reason"]

def test_human_gate_transition():
    ctx = LoopContext(run_id="test_run", tenant_id="t1")
    controller = LoopController(ctx)
    
    controller.transition(LoopState.EXECUTE)
    controller.transition(LoopState.QA_REVIEW)
    
    # Move to Human Gate
    controller.transition(LoopState.HUMAN_GATE, "Indeterminate Auto-QA")
    assert controller.current_state == LoopState.HUMAN_GATE
    
    # Human approves
    next_state = controller.evaluate_human_gate(True, "Approved by Jamie")
    assert next_state == LoopState.COMPLETE
    
    controller.transition(LoopState.COMPLETE, "Human approved")
    assert controller.current_state == LoopState.COMPLETE
    assert ctx.human_approved is True

def test_executor_loop_qa_pass():
    # Mock context and flow
    mock_ctx = MagicMock()
    executor = FlowExecutor(mock_ctx)
    
    # Mock execute_flow to return success
    result_mock = MagicMock()
    result_mock.status = "success"
    # Inject a 'qa_passed' write to simulate Auto-QA success
    result_mock.node_results = [
        {"node_id": "n1", "writes": {"qa_passed": True}, "artifacts": []}
    ]
    executor.execute_flow = MagicMock(return_value=result_mock)
    
    flow_mock = MagicMock()
    flow_mock.flow_id = "test_flow"
    
    # Run loop
    res = executor.execute_factory_loop(flow_mock, max_attempts=2, tenant_id="t1", project_id="p1")
    
    assert res.status == "success"
    assert executor.execute_flow.call_count == 1

def test_executor_loop_human_gate_fallback():
    mock_ctx = MagicMock()
    executor = FlowExecutor(mock_ctx)
    
    # Mock execute_flow success but NO QA verdict
    result_mock = MagicMock()
    result_mock.status = "success"
    result_mock.node_results = [{"node_id": "n1", "writes": {}, "artifacts": []}]
    executor.execute_flow = MagicMock(return_value=result_mock)
    
    flow_mock = MagicMock()
    flow_mock.flow_id = "test_flow"
    
    # Run loop
    executor.execute_factory_loop(flow_mock, max_attempts=2, tenant_id="t1", project_id="p1")
    
    # It should have called execute_flow once and stopped at HUMAN_GATE (break)
    assert executor.execute_flow.call_count == 1

def test_executor_loop_evidence_driven_qa_pass():
    # base_ctx comes from test_memory_gateway_strict if we share, but we'll re-init here or use mock
    mock_reg = MagicMock()
    executor = FlowExecutor(mock_reg)
    
    # Mock execute_flow success
    result_mock = MagicMock()
    result_mock.status = "success"
    result_mock.node_results = []
    executor.execute_flow = MagicMock(return_value=result_mock)
    
    # Mock memory gateway to return qa_passed=True in batch results
    with MagicMock() as mock_boundary:
        with MagicMock() as mock_gw:
            # We need to mock the internal HttpMemoryGateway instantiation or client
            # Simpler: Mock HttpMemoryGateway.get_inbound_blackboards directly via patching if needed
            # But here we'll just mock the client results
            executor.execute_flow = MagicMock(return_value=result_mock)
            
            from unittest.mock import patch
            with patch("atoms_agents.runtime.executor.HttpMemoryGateway") as MockGateway:
                instance = MockGateway.return_value
                instance.get_inbound_blackboards.return_value = {"e1": {"qa_passed": True}}
                
                flow_mock = MagicMock()
                flow_mock.flow_id = "test_flow"
                flow_mock.edges = [MagicMock(edge_id="e1")]
                
                res = executor.execute_factory_loop(flow_mock, tenant_id="t1", project_id="p1")
                assert res.status == "success"
                assert executor.execute_flow.call_count == 1

def test_executor_loop_evidence_missing_human_gate():
    mock_reg = MagicMock()
    executor = FlowExecutor(mock_reg)
    
    result_mock = MagicMock()
    result_mock.status = "success"
    result_mock.node_results = []
    executor.execute_flow = MagicMock(return_value=result_mock)
    
    from unittest.mock import patch
    with patch("atoms_agents.runtime.executor.HttpMemoryGateway") as MockGateway:
        instance = MockGateway.return_value
        # No qa_passed in any edge
        instance.get_inbound_blackboards.return_value = {"e1": {"other": "val"}}
        
        flow_mock = MagicMock()
        flow_mock.flow_id = "test_flow"
        flow_mock.edges = [MagicMock(edge_id="e1")]
        
        # This should break and return the result after moving to HUMAN_GATE
        res = executor.execute_factory_loop(flow_mock, tenant_id="t1", project_id="p1")
        assert res.status == "success"
        assert executor.execute_flow.call_count == 1

def test_executor_loop_requires_project_id():
    mock_reg = MagicMock()
    executor = FlowExecutor(mock_reg)
    flow_mock = MagicMock()
    
    with pytest.raises(ValueError, match="project_id is required"):
        executor.execute_factory_loop(flow_mock, tenant_id="t1") # project_id missing
