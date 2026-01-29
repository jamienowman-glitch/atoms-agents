from typing import Any, Dict, Optional, Tuple

def get_optical_flow_filter(fps: float, mode: str, mc_mode: str, me_mode: str) -> Optional[str]:
    # Brain: Generate filter string. Brawn: Executes it.
    # Logic from original:
    if mode == "mci":
        return f"minterpolate=mi_mode=mci:mc_mode={mc_mode}:me_mode={me_mode}:fps={fps}"
    return None

class CaptionsServiceStub:
    def convert_to_srt(self, artifact_id: str) -> str:
        # Brain: Assume SRT will be at {artifact_id}.srt or handle this in Brawn?
        # If we return a path here, it goes into the plan.
        # Original logic returned local path.
        # We can return a placeholder path that Brawn must resolve.
        return f"captions_{artifact_id}.srt"

def get_captions_service() -> CaptionsServiceStub:
    return CaptionsServiceStub()
