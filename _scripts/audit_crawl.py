
import os
import json
from pathlib import Path

# --- CONFIGURATION ---
ROOT_DIR = "/Users/jaynowman/dev"
IGNORE_DIRS = {
    "node_modules", ".git", ".venv", "__pycache__", ".next", 
    "dist", "build", ".idea", ".vscode", "_quarantine", "_scripts",
    "coverage", ".pytest_cache", ".mypy_cache"
}
IGNORE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".mp3", ".wav", ".mp4",
    ".json", ".lock", ".map", ".css", ".scss", ".less", ".md", ".txt", ".xml",
    ".yaml", ".yml", ".toml", ".ini", ".DS_Store"
}

# --- MARKERS TO LOOK FOR ---
INFRA_MARKERS = {
    "AWS": ["boto3", "aws-sdk", "aws-lambda", "s3"],
    "Database": ["supabase", "psycopg2", "sqlalchemy", "lancedb", "redis", "prisma"],
    "AI_Hardware": ["torch", "numpy", "cuda", "mps"],
    "AI_Services": ["openai", "anthropic", "elevenlabs", "mistral", "bedrock"],
    "Realtime": ["WebSocket", "EventSource", "socket.io", "pusher", "realtime-js"],
    "Browser_Hardware": ["navigator.mediaDevices", "getUserMedia", "MediaRecorder", "AudioContext"],
    "Auth": ["supabase.auth", "next-auth", "clerk", "jwt"],
    "Payment/Ledger": ["stripe", "snax", "ledger"],
    "Hosting/Deploy": ["vercel", "docker", "fly.io", "cloudflare"]
}

def is_ignored(path_part):
    return path_part in IGNORE_DIRS or path_part.startswith(".")

def crawl():
    print(f"🕷️  Crawling {ROOT_DIR} ...")
    
    all_scripts = []
    infra_hits = {k: {} for k in INFRA_MARKERS.keys()} # Category -> {Marker -> [Files]}
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Prune ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]
        
        for file in files:
            file_path = Path(root) / file
            
            # Skip ignored extensions
            if file_path.suffix.lower() in IGNORE_EXTENSIONS:
                continue
                
            # We treat everything else as a potential "script" or config requiring audit
            all_scripts.append(str(file_path))
            
            try:
                # Read content efficiently (skip large files)
                if file_path.stat().st_size > 1_000_000: # Skip > 1MB
                    continue
                    
                content = file_path.read_text(errors='ignore')
                
                # Check for Infrastructure Markers
                for category, markers in INFRA_MARKERS.items():
                    for marker in markers:
                        if marker in content:
                            if marker not in infra_hits[category]:
                                infra_hits[category][marker] = []
                            infra_hits[category][marker].append(str(file_path))
                            
            except Exception as e:
                # Ignore read errors (binary files, etc that slipped through)
                pass

    return all_scripts, infra_hits

def generate_report(scripts, infra):
    report = []
    report.append("# 🕷️ Systematic Codebase Audit Report")
    report.append(f"**Root:** `{ROOT_DIR}`")
    report.append(f"**Total Files Scanned:** {len(scripts)}")
    report.append("")
    
    report.append("## 🏗️ Infrastructure Detected (Code-Level Evidence)")
    for category, hits in infra.items():
        report.append(f"### {category}")
        if not hits:
            report.append("*None detected.*")
        else:
            for marker, files in hits.items():
                report.append(f"- **`{marker}`** found in {len(files)} files:")
                # List first 3 occurrences only to keep report readable, but note the count
                for f in files[:3]:
                    report.append(f"  - `{f}`")
                if len(files) > 3:
                    report.append(f"  - *(...and {len(files)-3} more)*")
        report.append("")

    report.append("## 🚨 Production Gaps Analysis (Automated)")
    
    # 1. Check for Browser Audio Capture
    browser_capture = infra["Browser_Hardware"].get("navigator.mediaDevices", []) + \
                      infra["Browser_Hardware"].get("getUserMedia", [])
    if not browser_capture:
        report.append("### ❌ MISSING: Client-Side Audio Capture")
        report.append("- **Gap:** No usage of `navigator.mediaDevices` or `getUserMedia` found in `atoms-ui`.")
        report.append("- **Impact:** Agents cannot listen to the user. The 'Talk' button works (ElevenLabs), but the 'Listen' button is inert.")
    else:
        report.append(f"### ✅ FOUND: Client-Side Audio Capture in {len(browser_capture)} files")

    # 2. Check for Realtime Transport
    ws_usage = infra["Realtime"].get("WebSocket", [])
    sse_usage = infra["Realtime"].get("EventSource", [])
    if ws_usage and sse_usage:
        report.append("### ✅ FOUND: Realtime Transport (Dual SSE/WS)")
        report.append("- **Analysis:** Both `WebSocket` and `EventSource` are actively used in the code.")
    elif not ws_usage and not sse_usage:
        report.append("### ❌ MISSING: Realtime Transport Logic")
    
    # 3. Check for Auth
    auth_usage = infra["Auth"].get("supabase.auth", [])
    if auth_usage:
        report.append(f"### ✅ FOUND: Authentication (Supabase) in {len(auth_usage)} files")
    else:
        report.append("### ⚠️ WARNING: No explicit Supabase Auth calls found (might be hidden in middleware).")

    report.append("")
    report.append("## 📜 Full Script Inventory")
    report.append("*(Listing every single code file found)*")
    for s in sorted(scripts):
        report.append(f"- `{s}`")

    return "\n".join(report)

if __name__ == "__main__":
    scripts_list, infra_map = crawl()
    report_content = generate_report(scripts_list, infra_map)
    
    output_path = Path(ROOT_DIR) / "docs/systematic_crawl_report.md"
    output_path.write_text(report_content)
    
    print(f"\n✅ Audit Complete. Report saved to: {output_path}")
