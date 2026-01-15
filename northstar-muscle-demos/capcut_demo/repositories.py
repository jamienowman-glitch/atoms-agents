
import json
import os
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime

# Media
from engines.media_v2.models import MediaAsset, DerivedArtifact, MediaKind
from engines.media_v2.service import MediaRepository, MediaStorage

# Timeline
from engines.video_timeline.service import TimelineRepository
from engines.video_timeline.models import (
    VideoProject, Sequence, Track, Clip, Transition, FilterStack, ParameterAutomation
)

class DemoMediaStorage:
    def __init__(self, root_dir: Path):
        self.root_dir = root_dir
        self.root_dir.mkdir(parents=True, exist_ok=True)

    def upload_bytes(self, tenant_id: str, env: str, asset_id: str, filename: str, content: bytes) -> str:
        safe_name = Path(filename).name or "unknown.bin"
        # Flatten structure for demo simplicity or keep basic hierarchy
        dest_path = self.root_dir / f"{asset_id}_{safe_name}"
        dest_path.write_bytes(content)
        return str(dest_path.absolute())

class JSONMediaRepository(MediaRepository):
    def __init__(self, db_path: Path):
        self.db_path = db_path
        self.assets: Dict[str, MediaAsset] = {}
        self.artifacts: Dict[str, DerivedArtifact] = {}
        self._load()

    def _load(self):
        if not self.db_path.exists():
            return
        try:
            data = json.loads(self.db_path.read_text())
            for d in data.get("assets", []):
                try:
                    asset = MediaAsset(**d)
                    self.assets[asset.id] = asset
                except Exception as e:
                    print(f"Failed to load asset {d.get('id')}: {e}")
            for d in data.get("artifacts", []):
                try:
                    art = DerivedArtifact(**d)
                    self.artifacts[art.id] = art
                except Exception as e:
                    print(f"Failed to load artifact {d.get('id')}: {e}")
        except Exception as e:
            print(f"Failed to load media DB: {e}")

    def _save(self):
        data = {
            "assets": [a.model_dump(mode='json') for a in self.assets.values()],
            "artifacts": [a.model_dump(mode='json') for a in self.artifacts.values()]
        }
        self.db_path.write_text(json.dumps(data, indent=2))

    def create_asset(self, asset: MediaAsset) -> MediaAsset:
        self.assets[asset.id] = asset
        self._save()
        return asset

    def get_asset(self, asset_id: str) -> Optional[MediaAsset]:
        return self.assets.get(asset_id)

    def list_assets(self, tenant_id: str, kind: Optional[MediaKind] = None, tag: Optional[str] = None, source_ref: Optional[str] = None) -> List[MediaAsset]:
        res = [a for a in self.assets.values() if a.tenant_id == tenant_id]
        if kind:
            res = [a for a in res if a.kind == kind]
        return sorted(res, key=lambda x: x.created_at, reverse=True)

    def create_artifact(self, artifact: DerivedArtifact) -> DerivedArtifact:
        self.artifacts[artifact.id] = artifact
        self._save()
        return artifact

    def get_artifact(self, artifact_id: str) -> Optional[DerivedArtifact]:
        return self.artifacts.get(artifact_id)

    def list_artifacts_for_asset(self, asset_id: str) -> List[DerivedArtifact]:
        res = [a for a in self.artifacts.values() if a.parent_asset_id == asset_id]
        return sorted(res, key=lambda x: x.created_at, reverse=True)


class JSONTimelineRepository(TimelineRepository):
    def __init__(self, projects_dir: Path):
        self.projects_dir = projects_dir
        self.projects_dir.mkdir(parents=True, exist_ok=True)
        # We rely on loading specific project files on demand for get/update
        # But for list_projects, we might need to scan.
        # For this demo, assuming we just operate on one project at a time or in-memory is flushed.
        # To make it robust: Load project from JSON into a temporary InMemory struct, modify, then Dump.
        pass

    def _project_file(self, project_id: str) -> Path:
        return self.projects_dir / f"{project_id}.json"

    def _load_proj_bundle(self, project_id: str) -> Optional[Dict[str, Any]]:
        p = self._project_file(project_id)
        if not p.exists():
            return None
        return json.loads(p.read_text())

    def _save_proj_bundle(self, project_id: str, bundle: Dict[str, Any]):
        p = self._project_file(project_id)
        p.write_text(json.dumps(bundle, indent=2))

    # Helper to load/save just the project record
    # BUT, the interface assumes granular methods.
    # We will implement a "Load-Modify-Save" pattern for every method. 
    # This is inefficient but simple and robust for a demo.

    def _update_bundle(self, project_id: str, modifier_func):
        bundle = self._load_proj_bundle(project_id)
        if not bundle:
             # Maybe creating?
             pass 
        if bundle is None:
             bundle = {"project": None, "sequences": [], "tracks": [], "clips": [], "transitions": [], "filter_stacks": [], "automation": []}
        
        bundle = modifier_func(bundle)
        
        # Determine ID from bundle if possible, but we need project_id.
        # If project is None, we need to know valid ID.
        if bundle.get("project"):
             project_id = bundle["project"]["id"]
        
        if project_id:
             self._save_proj_bundle(project_id, bundle)
        return bundle

    # Project
    def create_project(self, project: VideoProject) -> VideoProject:
        bundle = {
            "project": project.model_dump(mode='json'),
            "sequences": [], "tracks": [], "clips": [], "transitions": [], "filter_stacks": [], "automation": []
        }
        self._save_proj_bundle(project.id, bundle)
        return project

    def get_project(self, project_id: str) -> Optional[VideoProject]:
        bundle = self._load_proj_bundle(project_id)
        if not bundle or not bundle.get("project"):
            return None
        return VideoProject(**bundle["project"])

    def list_projects(self, tenant_id: str) -> List[VideoProject]:
        # Scan dir
        res = []
        for f in self.projects_dir.glob("*.json"):
            try:
                data = json.loads(f.read_text())
                if data.get("project") and data["project"].get("tenant_id") == tenant_id:
                     res.append(VideoProject(**data["project"]))
            except:
                pass
        return sorted(res, key=lambda x: x.created_at, reverse=True)

    def update_project(self, project: VideoProject) -> VideoProject:
        def mod(b):
            b["project"] = project.model_dump(mode='json')
            return b
        self._update_bundle(project.id, mod)
        return project

    # Sequence
    def create_sequence(self, sequence: Sequence) -> Sequence:
        def mod(b):
            b["sequences"].append(sequence.model_dump(mode='json'))
            # Check project link
            if b["project"] and sequence.id not in b["project"].get("sequence_ids", []):
                 b["project"].setdefault("sequence_ids", []).append(sequence.id)
            return b
        self._update_bundle(sequence.project_id, mod)
        return sequence

    def get_sequence(self, seq_id: str) -> Optional[Sequence]:
        # Expensive scan if we don't know project_id.
        # For this demo, we assume we can find it. 
        # But wait, arguments are just seq_id.
        # We must scan all projects? Or maintain an index.
        # SCAN ALL PROJECTS (simplest for small demo)
        for f in self.projects_dir.glob("*.json"):
            try:
                b = json.loads(f.read_text())
                for s in b.get("sequences", []):
                    if s["id"] == seq_id:
                        return Sequence(**s)
            except:
                pass
        return None

    def list_sequences_for_project(self, project_id: str) -> List[Sequence]:
        b = self._load_proj_bundle(project_id)
        if not b: return []
        return [Sequence(**s) for s in b.get("sequences", [])]

    # Use generic helper for modifying list items
    def _modify_item(self, target_collection: str, item_id: str, new_item_dict: Dict, project_id_hint: str = None) -> Any:
        # Find project first
        target_file = None
        if project_id_hint:
             target_file = self._project_file(project_id_hint)
        else:
            # Scan
             for f in self.projects_dir.glob("*.json"):
                b = json.loads(f.read_text())
                # Check if item exists in collection
                if any(x["id"] == item_id for x in b.get(target_collection, [])):
                    target_file = f
                    break
        
        if not target_file or not target_file.exists():
            return None # Or raise
        
        b = json.loads(target_file.read_text())
        # Replace
        new_list = [x for x in b[target_collection] if x["id"] != item_id]
        new_list.append(new_item_dict)
        b[target_collection] = new_list
        target_file.write_text(json.dumps(b, indent=2))
        return new_item_dict

    def update_sequence(self, sequence: Sequence) -> Sequence:
        self._modify_item("sequences", sequence.id, sequence.model_dump(mode='json'), sequence.project_id)
        return sequence

    # Track
    def create_track(self, track: Track) -> Track:
        # Need to find project from sequence_id...
        seq = self.get_sequence(track.sequence_id)
        if not seq: raise ValueError("Sequence not found")
        project_id = seq.project_id
        
        def mod(b):
            b["tracks"].append(track.model_dump(mode='json'))
            # Update sequence track_ids
            for s in b["sequences"]:
                if s["id"] == track.sequence_id:
                    if track.id not in s.get("track_ids", []):
                        s.setdefault("track_ids", []).append(track.id)
            return b
        self._update_bundle(project_id, mod)
        return track

    def get_track(self, track_id: str) -> Optional[Track]:
        for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for t in b.get("tracks", []):
                if t["id"] == track_id:
                    return Track(**t)
        return None

    def list_tracks_for_sequence(self, sequence_id: str) -> List[Track]:
        seq = self.get_sequence(sequence_id)
        if not seq: return []
        b = self._load_proj_bundle(seq.project_id)
        if not b: return []
        res = [Track(**t) for t in b.get("tracks", []) if t["sequence_id"] == sequence_id]
        return sorted(res, key=lambda x: x.order)

    def update_track(self, track: Track) -> Track:
        # Find project via sequence
        seq = self.get_sequence(track.sequence_id) # Can we trust track.sequence_id?
        # Better scan
        self._modify_item("tracks", track.id, track.model_dump(mode='json'))
        return track

    # Clip
    def create_clip(self, clip: Clip) -> Clip:
        track = self.get_track(clip.track_id)
        if not track: raise ValueError("Track not found")
        seq = self.get_sequence(track.sequence_id)
        project_id = seq.project_id
        
        def mod(b):
            b["clips"].append(clip.model_dump(mode='json'))
            return b
        self._update_bundle(project_id, mod)
        return clip

    def get_clip(self, clip_id: str) -> Optional[Clip]:
        for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for c in b.get("clips", []):
                if c["id"] == clip_id:
                    return Clip(**c)
        return None

    def list_clips_for_track(self, track_id: str) -> List[Clip]:
        track = self.get_track(track_id)
        if not track: return []
        seq = self.get_sequence(track.sequence_id)
        b = self._load_proj_bundle(seq.project_id)
        if not b: return []
        res = [Clip(**c) for c in b.get("clips", []) if c["track_id"] == track_id]
        return sorted(res, key=lambda x: x.start_ms_on_timeline)

    def update_clip(self, clip: Clip) -> Clip:
        self._modify_item("clips", clip.id, clip.model_dump(mode='json'))
        return clip
        
    def delete_clip(self, clip_id: str) -> None:
         for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            original_len = len(b.get("clips", []))
            b["clips"] = [c for c in b.get("clips", []) if c["id"] != clip_id]
            if len(b["clips"]) < original_len:
                f.write_text(json.dumps(b, indent=2))
                return

    # Transitions
    def create_transition(self, transition: Transition) -> Transition:
         seq = self.get_sequence(transition.sequence_id)
         project_id = seq.project_id
         def mod(b):
            b.setdefault("transitions", []).append(transition.model_dump(mode='json'))
            return b
         self._update_bundle(project_id, mod)
         return transition
         
    def get_transition(self, transition_id: str) -> Optional[Transition]:
        for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for t in b.get("transitions", []):
                if t["id"] == transition_id:
                    return Transition(**t)
        return None
        
    def list_transitions_for_sequence(self, sequence_id: str) -> List[Transition]:
        seq = self.get_sequence(sequence_id)
        if not seq: return []
        b = self._load_proj_bundle(seq.project_id)
        return [Transition(**t) for t in b.get("transitions", []) if t["sequence_id"] == sequence_id]

    def update_transition(self, transition: Transition) -> Transition:
        self._modify_item("transitions", transition.id, transition.model_dump(mode='json'))
        return transition

    def delete_transition(self, transition_id: str) -> None:
        pass # Stub

    # Filters
    def create_filter_stack(self, stack: FilterStack) -> FilterStack:
        # Hard to find project ID from stack target (could be clip or track)
        # Scan all
        for f in self.projects_dir.glob("*.json"):
             b = json.loads(f.read_text())
             # Heuristic: Check if target exists in this bundle
             found = False
             if stack.target_type == "clip":
                 found = any(c["id"] == stack.target_id for c in b.get("clips", []))
             elif stack.target_type == "track":
                 found = any(t["id"] == stack.target_id for t in b.get("tracks", []))
             
             if found:
                 b.setdefault("filter_stacks", []).append(stack.model_dump(mode='json'))
                 f.write_text(json.dumps(b, indent=2))
                 return stack
        return stack # Should error if no project found

    def get_filter_stack(self, stack_id: str) -> Optional[FilterStack]:
         for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for s in b.get("filter_stacks", []):
                if s["id"] == stack_id:
                    return FilterStack(**s)
         return None

    def get_filter_stack_for_target(self, target_type: str, target_id: str) -> Optional[FilterStack]:
         for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for s in b.get("filter_stacks", []):
                if s["target_type"] == target_type and s["target_id"] == target_id:
                    return FilterStack(**s)
         return None
         
    def update_filter_stack(self, stack: FilterStack) -> FilterStack:
        self._modify_item("filter_stacks", stack.id, stack.model_dump(mode='json'))
        return stack
        
    def delete_filter_stack(self, stack_id: str) -> None:
        pass

    # Automation
    def create_automation(self, automation: ParameterAutomation) -> ParameterAutomation:
         # Same heuristic
         for f in self.projects_dir.glob("*.json"):
             b = json.loads(f.read_text())
             found = False
             if automation.target_type == "clip":
                 found = any(c["id"] == automation.target_id for c in b.get("clips", []))
             elif automation.target_type == "track":
                 found = any(t["id"] == automation.target_id for t in b.get("tracks", []))
             
             if found:
                 b.setdefault("automation", []).append(automation.model_dump(mode='json'))
                 f.write_text(json.dumps(b, indent=2))
                 return automation
         return automation
         
    def get_automation(self, automation_id: str) -> Optional[ParameterAutomation]:
         for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for a in b.get("automation", []):
                if a["id"] == automation_id:
                    return ParameterAutomation(**a)
         return None

    def list_automation(self, target_type: str, target_id: str) -> List[ParameterAutomation]:
         res = []
         for f in self.projects_dir.glob("*.json"):
            b = json.loads(f.read_text())
            for a in b.get("automation", []):
                if a["target_type"] == target_type and a["target_id"] == target_id:
                    res.append(ParameterAutomation(**a))
         return res
         
    def update_automation(self, automation: ParameterAutomation) -> ParameterAutomation:
         self._modify_item("automation", automation.id, automation.model_dump(mode='json'))
         return automation

    def delete_automation(self, automation_id: str) -> None:
        pass
