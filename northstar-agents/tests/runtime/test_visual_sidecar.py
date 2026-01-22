import base64
from pathlib import Path

from northstar.runtime.visual_sidecar import sanitize_canvas_event


def test_visual_sidecar_replaces_data_uri(tmp_path: Path):
    data_bytes = b"test-image-bytes"
    data_uri = f"data:image/png;base64,{base64.b64encode(data_bytes).decode()}"
    payload = {"type": "VISUAL_SNAPSHOT", "data": {"image": data_uri}}

    sanitized = sanitize_canvas_event(payload, artifacts_dir=tmp_path)
    image_entry = sanitized["data"]["image"]

    assert isinstance(image_entry, dict)
    assert image_entry["uri"].startswith("file://")
    stored_path = Path(image_entry["uri"][7:])
    assert stored_path.exists()
    assert stored_path.read_bytes() == data_bytes
