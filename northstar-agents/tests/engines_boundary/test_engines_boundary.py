import io
from urllib import error as urlerror

import pytest

from northstar.engines_boundary.action_envelope import ActionEnvelope
from northstar.engines_boundary.client import EnginesBoundaryClient
from northstar.engines_boundary.errors import SafetyBlocked, parse_safety_error
from northstar.runtime.context import AgentsRequestContext, ContextMode


def test_action_envelope_to_json_stable():
    envelope = ActionEnvelope(
        action_name="chat_send",
        subject_type="thread",
        subject_id="thread-123",
        surface_id="chat",
        app_id="northstar",
        payload={"text": "hi"},
    )

    assert envelope.to_json() == {
        "action_name": "chat_send",
        "subject_type": "thread",
        "subject_id": "thread-123",
        "payload": {"text": "hi"},
        "surface_id": "chat",
        "app_id": "northstar",
    }


def test_headers_include_context_fields():
    ctx = AgentsRequestContext(
        tenant_id="tenant-1",
        mode=ContextMode.ENTERPRISE,
        project_id="project-1",
        request_id="req-1",
        trace_id="trace-1",
        run_id="run-1",
        step_id="step-1",
    )
    client = EnginesBoundaryClient()

    headers = client._build_headers(ctx)

    assert headers["X-Mode"] == "enterprise"
    assert headers["X-Tenant-Id"] == "tenant-1"
    assert headers["X-Project-Id"] == "project-1"
    assert headers["X-Request-Id"] == "req-1"
    assert headers["X-Trace-Id"] == "trace-1"
    assert headers["X-Run-Id"] == "run-1"
    assert headers["X-Step-Id"] == "step-1"


def test_parse_safety_error_engine_shape():
    body = {
        "error": "budget_threshold_missing",
        "gate": "budget",
        "action": "chat_send",
        "threshold": 5,
    }

    exc = parse_safety_error(403, body)

    assert isinstance(exc, SafetyBlocked)
    assert exc.http_status == 403
    assert exc.error == "budget_threshold_missing"
    assert exc.gate == "budget"
    assert exc.action_name == "chat_send"
    assert exc.details == {"threshold": 5}


def test_parse_safety_error_fastapi_detail():
    body = {"detail": "invalid mode header"}

    exc = parse_safety_error(409, body)

    assert exc.http_status == 409
    assert exc.error == "invalid mode header"
    assert exc.gate is None
    assert exc.action_name is None
    assert exc.details == {"detail": "invalid mode header"}


def test_request_json_raises_safety_blocked(monkeypatch):
    ctx = AgentsRequestContext(
        tenant_id="tenant-99",
        mode=ContextMode.LAB,
        project_id="project-99",
        request_id="req-99",
    )
    client = EnginesBoundaryClient("http://localhost:9999")

    def fake_urlopen(req):
        payload = b'{"error":"blocked","gate":"budget","action":"chat_send"}'
        raise urlerror.HTTPError(
            req.full_url, 403, "Forbidden", hdrs=None, fp=io.BytesIO(payload)
        )

    monkeypatch.setattr(
        "northstar.engines_boundary.client.request.urlopen", fake_urlopen
    )

    with pytest.raises(SafetyBlocked) as exc_info:
        client.request_json("POST", "/chat", ctx, json={"message": "hi"})

    err = exc_info.value
    assert err.gate == "budget"
    assert err.action_name == "chat_send"
