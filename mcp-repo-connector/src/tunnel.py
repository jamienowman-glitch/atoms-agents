import subprocess
import threading
import re
import time
from typing import Optional
from .state import ServerState

class TunnelManager:
    _process: Optional[subprocess.Popen] = None
    _thread: Optional[threading.Thread] = None
    _stop_event = threading.Event()

    @classmethod
    def start(cls, provider: str = "cloudflared", port: int = 8000):
        state = ServerState.get()
        if state.tunnel_status == "running":
            return

        cls.stop() # Ensure clean slate
        state.tunnel_status = "starting"
        cls._stop_event.clear()

        cmd = []
        url_regex = None

        if provider == "cloudflared":
            # Check availability
            # Create an empty config file to bypass any global ~/.cloudflared/config.yml that might cause 404s
            import os
            empty_conf = os.path.join(os.getcwd(), "empty_config.yml")
            if not os.path.exists(empty_conf):
                open(empty_conf, 'w').close()

            # Using 127.0.0.1 for reliability, and bypassing global config
            cmd = ["cloudflared", "tunnel", "--config", empty_conf, "--url", f"http://127.0.0.1:{port}"]
            url_regex = r"https://[a-zA-Z0-9-]+\.trycloudflare\.com"
        
        elif provider == "ngrok":
             if not cls._check_command("ngrok"):
                 state.tunnel_status = "error"
                 return
             cmd = ["ngrok", "http", str(port), "--log", "stdout"]
             url_regex = r"https://[a-zA-Z0-9-]+\.ngrok-free\.app" # or ngrok.io
        else:
            state.tunnel_status = "error"
            return

        def run_tunnel():
            print(f"Starting tunnel: {' '.join(cmd)}")
            try:
                cls._process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                
                # Scan output for URL
                found_url = False
                debug_log = open("tunnel_debug.log", "w")
                
                while not cls._stop_event.is_set() and cls._process.poll() is None:
                    line = cls._process.stdout.readline()
                    if not line:
                        break
                    
                    debug_log.write(f"RAW: {line}")
                    debug_log.flush()
                    print(f"Tunnel: {line.strip()}")
                    
                    if not found_url and url_regex:
                        match = None # Initialize match
                        # Check for the standardized banner or just trycloudflare link
                        # The URL usually appears in lines like "|  https://random-name.trycloudflare.com  |"
                        if ".trycloudflare.com" in line or (provider == "ngrok" and "ngrok" in line):
                             match = re.search(url_regex, line)
                        match_ngrok_io = re.search(r"https://[a-zA-Z0-9-]+\.ngrok\.io", line)
                        
                        final_match = match or match_ngrok_io
                        
                        if final_match:
                            url = final_match.group(0)
                            state.tunnel_url = url
                            state.tunnel_status = "running"
                            found_url = True
                            print(f"Tunnel URL found: {url}")
                            
            except Exception as e:
                print(f"Tunnel error: {e}")
                state.tunnel_status = "error"
            finally:
                if cls._process:
                    cls._process.terminate()
                    cls._process = None
                if state.tunnel_status == "starting":
                    state.tunnel_status = "stopped"

        cls._thread = threading.Thread(target=run_tunnel, daemon=True)
        cls._thread.start()

    @classmethod
    def stop(cls):
        cls._stop_event.set()
        if cls._process:
            cls._process.terminate()
            try:
                cls._process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                cls._process.kill()
            cls._process = None
        
        state = ServerState.get()
        state.tunnel_status = "stopped"
        state.tunnel_url = None

    @staticmethod
    def _check_command(cmd: str) -> bool:
        from shutil import which
        return which(cmd) is not None
