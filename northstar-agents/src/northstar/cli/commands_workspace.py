from pathlib import Path
from typing import Any
from northstar.core.workspace.store import WorkspaceStore

def workspace_export(ctx: Any, out_dir: str) -> None:
    """
    Export the current workspace to a directory.
    Note: This exports the underlying WorkspaceManager state.
    """
    store = WorkspaceStore()
    target_path = Path(out_dir).resolve()
    
    try:
        # WorkspaceStore wraps WorkspaceManager, accessing it to export
        store.workspace.export(target_path)
        print(f"✅ Workspace exported to: {target_path}")
    except Exception as e:
        print(f"❌ Export failed: {e}")

def workspace_clear(ctx: Any, yes: bool) -> None:
    """Clear the workspace (destructive)."""
    if not yes:
        confirm = input("Are you sure you want to delete all workspace data? [y/N] ")
        if confirm.lower() != 'y':
            print("Aborted.")
            return

    store = WorkspaceStore()
    store.nuke_all()
    print("🗑️  Workspace cleared.")

def workspace_status() -> None:
    """List all cards currently overridden in the workspace."""
    store = WorkspaceStore()
    overrides = store.list_overrides()
    
    nodes = overrides.get("nodes", [])
    flows = overrides.get("flows", [])
    
    if not nodes and not flows:
        print("Workspace is clean. No overrides found.")
        return

    if nodes:
        print("\nModified Nodes (Workspace):")
        for nid in nodes:
            print(f"  - {nid}")
            
    if flows:
        print("\nModified Flows (Workspace):")
        for fid in flows:
            print(f"  - {fid}")
    
    print("")

def workspace_reset(card_type: str, card_id: str) -> None:
    """Remove overrides from the workspace."""
    store = WorkspaceStore()
    
    # Validation handled by store mostly, but check args
    if card_type == "all":
        # Reuse clear logic or just nuke
        print("Use workspace-clear to reset everything.")
        return

    if not card_id:
        print("❌ Error: Missing card ID.")
        return

    deleted = store.delete_card(card_type, card_id)
    if deleted:
        print(f"✅ Reset {card_type} '{card_id}' (removed from workspace).")
    else:
        print(f"⚠️  No workspace override found for {card_type} '{card_id}'.")
