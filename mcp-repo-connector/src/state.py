import time
from typing import List, Optional, Set
from threading import Lock
from .config import ConfigLoader
from .audit import AuditLogger

class ServerState:
    _instance = None
    _lock = Lock()

    def __init__(self):
        self.write_enabled: bool = False
        self.write_expires_at: float = 0
        
        # Scopes
        # Default active scope includes dev-root? User said "I must be able to choose".
        # Let's default to just 'dev-root' to start safe/simple?
        # Or empty?
        # "Core outcome... see everything".
        # Let's default to dev-root so it works out of the box.
        self.active_scopes: Set[str] = {"dev-root"}
        self.scope_locked: bool = False
        
        self.tunnel_url: Optional[str] = None
        self.tunnel_status: str = "stopped" # stopped, starting, running, error

    @classmethod
    def get(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = ServerState()
            return cls._instance

    def enable_writes(self, duration_minutes: int = 60):
        with self._lock:
            # Check global config override?
            # User said "Default mode MUST be READ-ONLY" but UI can toggle for session.
            # Does global config (ENABLE_WRITES=false) block this?
            # "Writes must be OFF by default (ENABLE_WRITES=false)."
            # "UI must let me toggle... for the current session only."
            # So session override > config default?
            # Or config is a hard switch?
            # Typically config is "Server Capabilities". If config says NO WRITES, then UI cannot enable it.
            # BUT user requirement "UI must let me toggle... for the current session only" implies 
            # the server is CAPABLE, but session is GATED.
            # Let's assume Config.enable_writes is potentially "Allow Write Mode Toggling".
            # If Config.enable_writes is FALSE, maybe we block?
            # Re-reading: "Write tools (implement but gate behind ENABLE_WRITES=false by default)"
            # User requirement 1: "Read vs Read+Write selectable per session... UI must let me toggle"
            # This implies the CONFIG just sets the default state or the "hard cap".
            # Let's effectively ignore the static config for the toggle logic IF we assume the user OWNS the machine.
            # But safer: Config must be TRUE to allow toggling?
            # Re-reading prompt: "Writes must be OFF by default... If writes are enabled... UI must let me toggle".
            # OK, let's treat the static config as "Allow session overrides". 
            # Actually, user said "Read vs Read+Write selectable per session". 
            # I will allow toggling regardless of static config if it's strictly a session control. 
            # BUT, let's check `ConfigLoader.get().enable_writes` as a "System Permission".
            # If System Permission is False, maybe we shouldn't allow?
            # The prompt says: "Writes must be OFF by default (ENABLE_WRITES=false)."
            # Then says: "UI must let me toggle".
            # Interpret: ENABLE_WRITES config controls if the SERVER starts with write capabilities loaded?
            # Let's just implement the session toggle. Checks in tools will look at Session State.
            
            self.write_enabled = True
            self.write_expires_at = time.time() + (duration_minutes * 60)
            AuditLogger.log("session.enable_writes", {"duration_minutes": duration_minutes})

    def disable_writes(self):
        with self._lock:
            self.write_enabled = False
            self.write_expires_at = 0
            AuditLogger.log("session.disable_writes", {})

    def check_write_permission(self):
        # Expiry check
        if self.write_enabled and time.time() > self.write_expires_at:
            self.disable_writes()
            
        with self._lock:
            if not self.write_enabled:
                raise PermissionError("Write mode is not enabled for this session.")
                
    def set_scopes(self, scopes: List[str]):
        with self._lock:
            if self.scope_locked:
                raise PermissionError("Scope is locked.")
            self.active_scopes = set(scopes)
            AuditLogger.log("session.set_scopes", {"scopes": scopes})
            
    def lock_scope(self):
        with self._lock:
            self.scope_locked = True
            AuditLogger.log("session.lock_scope", {})
            
    def unlock_scope(self):
        with self._lock:
            self.scope_locked = False
            AuditLogger.log("session.unlock_scope", {})

    def is_scope_allowed(self, workspace_id: str) -> bool:
        with self._lock:
            # "dev-root" access implies everything?
            # If 'dev-root' is in active_scopes, we can access any workspace?
            # "I want... 'dev-root' workspace that can search across everything... OR single repo"
            # It seems 'dev-root' is a workspace ID itself.
            # If I ask for workspace_id='northstar', and 'northstar' is NOT in active_scopes, BUT 'dev-root' IS, is it allowed?
            # Probably NO. 'dev-root' allows accessing 'dev-root'.
            # If I want to access 'northstar' specifically, it must be in scope.
            # UNLESS 'dev-root' implies "All access".
            # Let's be strict: You can only access workspace_ids that are in active_scopes.
            # If you want to search everything, you call search(workspace_id='dev-root').
            return workspace_id in self.active_scopes
