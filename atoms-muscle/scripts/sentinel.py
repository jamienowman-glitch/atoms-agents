import sys
import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) # atoms-muscle/scripts
MUSCLE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "../src")) # atoms-muscle/src
FACTORY_SCRIPT = os.path.join(SCRIPT_DIR, "factory.py")
SYNC_SCRIPT = os.path.abspath(os.path.join(SCRIPT_DIR, "../../atoms-core/scripts/sync_muscles.py"))

class MuscleHandler(FileSystemEventHandler):
    def on_created(self, event):
        self.process(event)

    def on_modified(self, event):
        self.process(event)

    def process(self, event):
        # We only care if someone writes a "service.py"
        if event.is_directory:
            return
        
        filename = os.path.basename(event.src_path)
        if filename == "service.py":
            print(f"\n👀 Detected change in: {event.src_path}")
            
            # 1. Trigger Factory (Wrap Agent)
            muscle_dir = os.path.dirname(event.src_path)
            print(f"🏭 Auto-Wrapping {muscle_dir}...")
            subprocess.run(["python3", FACTORY_SCRIPT, muscle_dir], check=False)
            
            # 2. Trigger Registry (Sync)
            print(f"💪 Auto-Syncing Registry...")
            subprocess.run(["python3", SYNC_SCRIPT], check=False)

if __name__ == "__main__":
    print(f"🔭 Muscle Sentinel Active.")
    print(f"   Watching: {MUSCLE_ROOT}")
    print(f"   Action: service.py -> Factory -> Registry")
    
    event_handler = MuscleHandler()
    observer = Observer()
    observer.schedule(event_handler, MUSCLE_ROOT, recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
