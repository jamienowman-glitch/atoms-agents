import sys
import time
import subprocess
import os
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configuration
DEV_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_REGISTRY_ROOT = DEV_ROOT / "_quarantine" / "atoms-registry"
REGISTRY_ROOT = os.environ.get("ATOMS_REGISTRY_ROOT", str(DEFAULT_REGISTRY_ROOT))
MUSCLE_ROOT = os.environ.get("ATOMS_MUSCLE_ROOT", str(DEV_ROOT / "atoms-muscle" / "src" / "muscle"))

class SystemHandler(FileSystemEventHandler):
    def on_modified(self, event):
        self.process(event)
    def on_created(self, event):
        self.process(event)
        
    def process(self, event):
        if event.is_directory: return
        file_path = event.src_path
        
        # 1. MUSCLE FACTORY
        if MUSCLE_ROOT in file_path and os.path.basename(file_path) == "service.py":
            print(f"💪 Muscle Detected: {file_path}")
            # Target the directory of the service.py
            muscle_dir = os.path.dirname(file_path)
            subprocess.run(f"python3 ../atoms-muscle/scripts/factory.py {muscle_dir}", shell=True, cwd="/Users/jaynowman/dev/atoms-core/scripts")
            # Then sync registry
            subprocess.run("python3 ../atoms-core/scripts/sync_muscles.py", shell=True, cwd="/Users/jaynowman/dev/atoms-core/scripts")
            return

        # 2. GENERIC REGISTRY
        if REGISTRY_ROOT in file_path and (file_path.endswith(".yaml") or file_path.endswith(".yml")):
            # Determine Registry Name from Folder
            # /path/to/atoms-registry/{surfaces}/file.yaml -> surfaces
            relative = os.path.relpath(file_path, REGISTRY_ROOT)
            parts = relative.split('/')
            
            if len(parts) >= 2:
                registry_name = parts[0] # e.g. "surfaces", "canvases", "fonts"
                target_dir = os.path.join(REGISTRY_ROOT, registry_name)
                
                print(f"📚 Registry Update Detected: {registry_name}")
                print(f"   🚀 Triggering Generic Sync...")
                
                # Run Sync Generic
                # arg1: folder, arg2: table_name
                cmd = f"python3 sync_generic.py {target_dir} {registry_name}"
                try:
                    subprocess.run(cmd, shell=True, check=True, cwd="/Users/jaynowman/dev/atoms-core/scripts")
                    print(f"   ✅ Auto-Sync Complete.")
                except Exception as e:
                    print(f"   ❌ Auto-Sync Failed: {e}")

def start_sentinel():
    observer = Observer()
    handler = SystemHandler()
    
    print("🛡️  SYSTEM SENTINEL ACTIVE (MUSCLE ONLY)")
    print("=======================================")
    print(f"1. Watching: {MUSCLE_ROOT} (Muscles)")
    
    observer.schedule(handler, MUSCLE_ROOT, recursive=True)

        
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_sentinel()
