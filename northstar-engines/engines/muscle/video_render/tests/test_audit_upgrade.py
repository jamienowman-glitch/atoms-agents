import pytest
from unittest.mock import MagicMock, patch
from engines.video_render.service import RenderService
from engines.video_render.models import RenderRequest
from engines.video_timeline.models import VideoProject, Sequence, Track, Clip, Transition, Filter, FilterStack
from engines.media_v2.models import MediaAsset, DerivedArtifact

@pytest.fixture
def mock_timeline():
    with patch("engines.video_render.service.get_timeline_service") as m:
        svc = MagicMock()
        m.return_value = svc
        yield svc

@pytest.fixture
def mock_media():
    with patch("engines.video_render.service.get_media_service") as m:
        svc = MagicMock()
        m.return_value = svc
        yield svc

@pytest.fixture
def mock_captions():
    with patch("engines.video_render.service.get_captions_service") as m:
        svc = MagicMock()
        m.return_value = svc
        yield svc

@pytest.fixture
def service(mock_timeline, mock_media, mock_captions):
    # Ensure environment variables are set to defaults or mock them
    return RenderService()

def test_audit_upgrade(service, mock_timeline, mock_media, mock_captions):
    # Setup
    tid = "t_audit"
    pid = "p_audit"
    seq_id = "seq_1"

    project = VideoProject(id=pid, tenant_id=tid, env="dev", title="Audit", sequence_ids=[seq_id])
    sequence = Sequence(id=seq_id, tenant_id=tid, env="dev", project_id=pid, name="Seq1")

    # Tracks: 1 Dialogue, 1 Music
    t_diag = Track(id="t1", tenant_id=tid, env="dev", sequence_id=seq_id, kind="audio", audio_role="dialogue")
    t_music = Track(id="t2", tenant_id=tid, env="dev", sequence_id=seq_id, kind="audio", audio_role="music")
    # Video Track
    t_vid = Track(id="t3", tenant_id=tid, env="dev", sequence_id=seq_id, kind="video")

    # Clips
    # Dialogue Clip: 0-10s
    c_diag = Clip(
        id="c1", tenant_id=tid, env="dev", track_id=t_diag.id, asset_id="a1",
        in_ms=0, out_ms=10000, start_ms_on_timeline=0
    )
    # Music Clip: 0-20s
    c_music = Clip(
        id="c2", tenant_id=tid, env="dev", track_id=t_music.id, asset_id="a2",
        in_ms=0, out_ms=20000, start_ms_on_timeline=0
    )
    # Video Clip 1: 0-5s
    c_vid1 = Clip(
        id="c3", tenant_id=tid, env="dev", track_id=t_vid.id, asset_id="a3",
        in_ms=0, out_ms=5000, start_ms_on_timeline=0
    )
    # Video Clip 2: 5-10s
    c_vid2 = Clip(
        id="c4", tenant_id=tid, env="dev", track_id=t_vid.id, asset_id="a4",
        in_ms=0, out_ms=5000, start_ms_on_timeline=5000
    )

    # Transition: Whip Left between c3 and c4
    trans = Transition(
        id="tr1", tenant_id=tid, env="dev", sequence_id=seq_id, type="whip_left",
        duration_ms=500, from_clip_id=c_vid1.id, to_clip_id=c_vid2.id
    )

    # Color Balance Filter on c_vid1
    f_color = Filter(
        type="color_balance",
        params={"shadows_r": 0.1, "midtones_g": -0.2, "highlights_b": 0.3},
        enabled=True
    )
    fs_stack = FilterStack(
        target_type="clip", target_id=c_vid1.id, filters=[f_color], tenant_id=tid, env="dev"
    )

    # Mocks
    mock_timeline.get_project.return_value = project
    mock_timeline.list_sequences_for_project.return_value = [sequence]
    mock_timeline.list_tracks_for_sequence.return_value = [t_diag, t_music, t_vid]

    def list_clips(track_id):
        if track_id == t_diag.id: return [c_diag]
        if track_id == t_music.id: return [c_music]
        if track_id == t_vid.id: return [c_vid1, c_vid2]
        return []
    mock_timeline.list_clips_for_track.side_effect = list_clips
    mock_timeline.list_transitions_for_sequence.return_value = [trans]

    def get_filter_stack(target_type, target_id):
        if target_type == "clip" and target_id == c_vid1.id:
            return fs_stack
        return None
    mock_timeline.get_filter_stack_for_target.side_effect = get_filter_stack
    mock_timeline.list_automation.return_value = []

    # Media Mock
    mock_media.get_asset.side_effect = lambda aid: MediaAsset(
        id=aid, tenant_id=tid, env="dev", kind="video" if aid in ["a3", "a4"] else "audio",
        source_uri=f"file:///tmp/{aid}.mp4"
    )
    mock_media.list_artifacts_for_asset.return_value = []

    # Captions Mock
    mock_captions.convert_to_srt.return_value = "/tmp/captions.srt"

    # Request
    req = RenderRequest(
        tenant_id=tid, env="dev", project_id=pid,
        ducking={"atten_db": -10},
        burn_in_captions={
            "artifact_id": "cap_art_1",
            "style": {
                "font_name": "Arial' OR 1=1 --",
                "font_size": 24,
                "color": "&H00FFFF",
                "back_color": "&H000000"
            }
        },
        dry_run=True
    )

    # Execute
    plan = service._build_plan(req)

    print("\nDEBUG FILTERS:")
    for f in plan.filters:
        print(f)

    # Assertions

    # 1. Ducking
    # Check for smooth ducking volume expression
    ducking_found = False
    for f in plan.filters:
        if "volume='" in f and "min(" in f and "if(between" in f:
             ducking_found = True
             # Check for 300ms fade (0.3)
             assert "0.3" in f
    assert ducking_found, "Smooth ducking filter not found (should use min())"

    # 2. Transition
    # Check for whip_left (smoothleft)
    transition_found = False
    for f in plan.filters:
        if "xfade=transition=smoothleft" in f:
            transition_found = True
            break
    assert transition_found, "Whip left transition not found"

    # 3. Color Balance
    # Check for colorbalance filter with params
    color_found = False
    for f in plan.filters:
        if "colorbalance=" in f:
            if "rs=0.1" in f and "gm=-0.2" in f and "bh=0.3" in f:
                color_found = True
                break
    assert color_found, "Color balance filter not found or incorrect params"

    # 4. Styled Captions
    # Check for subtitles filter with force_style and sanitization
    captions_found = False
    for f in plan.filters:
        if "subtitles=filename='/tmp/captions.srt'" in f:
            # Expect sanitized output (removed quotes)
            if ":force_style='Fontname=Arial OR 1=1 --,Fontsize=24,PrimaryColour=&H00FFFF,BackColour=&H000000'" in f:
                captions_found = True
                break
    assert captions_found, "Styled subtitles filter not found or sanitization failed"
