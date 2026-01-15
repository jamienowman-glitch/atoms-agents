import os
import json
import traceback
from typing import Any, Optional, Dict, Tuple, List
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.store.base import BaseStore
import aiosqlite

# Global fallback for memory saver to stay process-bound if needed
GLOBAL_MEMORY_SAVER = None

async def get_persistence(db_path: str = "northstar_state.db") -> BaseCheckpointSaver:
    """
    Returns an AsyncSqliteSaver (Durable) or falls back to MemorySaver.
    """
    global GLOBAL_MEMORY_SAVER
    checkpointer = None
    
    try:
        from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
        
        # Async Connection
        conn = await aiosqlite.connect(db_path)
        # Enable autocommit logic if needed or just use standard
        # Note: caller is responsible for closing conn if using raw aiosqlite, 
        # but AsyncSqliteSaver usually takes ownership or we manage it.
        # For this shared helper, we assume the caller manages lifecycle or we return simple saver.
        # Ideally, we return (checkpointer, connection) so caller can close it.
        checkpointer = AsyncSqliteSaver(conn)
        return checkpointer, conn
        
    except ImportError:
         pass
    except Exception:
         pass

    # Fallback
    if GLOBAL_MEMORY_SAVER is None:
        try:
            from langgraph.checkpoint.memory import MemorySaver
            GLOBAL_MEMORY_SAVER = MemorySaver()
        except:
             pass
    return GLOBAL_MEMORY_SAVER, None

class JsonFileStore(BaseStore):
    """
    A simple file-based store for LangGraph that persists to a JSON file.
    Does NOT support efficient search or high concurrency. Demonstration purposes only.
    """
    def __init__(self, path="northstar_store.json"):
        self.path = path
        self.data = {}
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    self.data = json.load(f)
            except: pass

    def _ns_key(self, namespace): return ":".join(namespace)

    def put(self, namespace, key, value, index=None):
        ns_k = self._ns_key(namespace)
        if ns_k not in self.data: self.data[ns_k] = {}
        self.data[ns_k][key] = {"value": value, "key": key, "namespace": list(namespace)}
        print(f"[STORE DEBUG] Saving {key} to {ns_k}")
        self._save()

    def get(self, namespace, key):
        ns_k = self._ns_key(namespace)
        item = self.data.get(ns_k, {}).get(key)
        return type('Item', (object,), {"value": item["value"]}) if item else None

    def search(self, namespace, query=None, limit=None):
        ns_k = self._ns_key(namespace)
        print(f"[STORE DEBUG] Searching {ns_k}. keys: {self.data.keys()}")
        items = self.data.get(ns_k, {})
        res = []
        for v in items.values():
            res.append(type('Item', (object,), {"value": v["value"], "key": v["key"]}))
        
        # Simple text filter
        if query:
            res = [r for r in res if str(query).lower() in str(r.value).lower()]
        return res

    def _save(self):
        try:
            with open(self.path, "w") as f: json.dump(self.data, f)
        except: pass

    async def abatch(self, ops): raise NotImplementedError
    def batch(self, ops): raise NotImplementedError
