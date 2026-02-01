
import os
import re
import json
from pathlib import Path
from collections import defaultdict

# --- CONFIGURATION ---
ROOT_DIR = "/Users/jaynowman/dev"
# Focusing on the known sub-repos to give structured output
SUB_REPOS = [
    "atoms-app", 
    "atoms-ui", 
    "atoms-core", 
    "atoms-muscle", 
    "atoms-agents", 
    "atoms-connectors", 
    "atoms-tuning",
    "agents-services"
]

# We still ignore massive binary/cache dirs to avoid freezing, but we open up extensions
IGNORE_DIRS = {
    "node_modules", ".git", ".venv", "__pycache__", ".next", 
    "dist", "build", "_quarantine", "coverage", ".pytest_cache", ".mypy_cache",
    "target", # Rust/Other
}
# Binary extensions to skip (cannot read text)
BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".mp3", ".wav", ".mp4", 
    ".mkv", ".mov", ".zip", ".tar", ".gz", ".pyc", ".so", ".dylib", ".bin", 
    ".exe", ".ttf", ".woff", ".woff2", ".eot", ".pdf", ".ai", ".psd"
}

# --- REGEX PATTERNS ---
PATTERNS = {
    "Env_Vars": r"([A-Z0-9_]{5,})", # Screaming snake case, at least 5 chars (e.g. NEXT_PUBLIC_API)
    "URLs": r"(https?://[^\s\"\'<>]+)", # http/https links
    "WS_URLs": r"(wss?://[^\s\"\'<>]+)", # ws/wss links
    "Ports": r"(:[0-9]{4,5})", # Ports like :3000, :5432
    "Specific_Imports": r"(import\s+[\w\d_]+|from\s+[\w\d_]+|require\(['\"][\w\d_\-@/]+['\"]\))" 
}

def get_repo_name(path):
    # Determine which sub-repo a file belongs to
    parts = Path(path).relative_to(ROOT_DIR).parts
    if parts:
        return parts[0]
    return "root"

def crawl_v2():
    print(f"🕷️  Deep Crawl V2 (Repo-Scoped) on {ROOT_DIR} ...")
    
    # Structure: repo -> category -> deduplicated_set
    inventory = defaultdict(lambda: defaultdict(set))
    file_count = 0
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Prune ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]
        
        for file in files:
            file_path = Path(root) / file
            
            # Skip known binary types
            if file_path.suffix.lower() in BINARY_EXTENSIONS:
                continue
            
            # Identify Repo
            repo = get_repo_name(file_path)
            file_count += 1
            
            try:
                # Text check + read
                if file_path.stat().st_size > 500_000: # Limit size only slightly
                    continue
                    
                content = file_path.read_text(errors='ignore')
                
                # Scan Regex Patterns
                for category, pattern in PATTERNS.items():
                    matches = re.findall(pattern, content)
                    for m in matches:
                        # Clean up Environment Variables (filter out common code noise)
                        if category == "Env_Vars":
                            if " " in m or len(m) < 6 or m.isdigit(): continue # Skip noise
                            if m in {"RETURN", "SELECT", "UPDATE", "INSERT", "DELETE", "CONST", "CLASS"}: continue # SQL/Code keywords
                            
                        # Clean up Ports
                        if category == "Ports":
                            # :1234
                            p = m.strip(":")
                            if not p.isdigit(): continue
                            
                        inventory[repo][category].add(m)
                
                # Special Check: "Missing" Keywords requested by user
                if "navigator.mediaDevices" in content:
                    inventory[repo]["Capabilities"].add("Browser_Audio_Capture")
                if "getUserMedia" in content:
                    inventory[repo]["Capabilities"].add("Browser_Audio_Capture")
                if "EventSource" in content:
                    inventory[repo]["Capabilities"].add("SSE_Client")
                if "WebSocket" in content:
                    inventory[repo]["Capabilities"].add("WS_Client")
                if "boto3" in content:
                    inventory[repo]["Capabilities"].add("AWS_Boto3")

            except Exception as e:
                pass

    return inventory, file_count

def generate_repo_report(inventory, count):
    report = []
    report.append("# 🕷️ Deep Repo Audit (V2)")
    report.append(f"**Files Scanned:** {count}")
    report.append("This report lists **every external touchpoint** (Env Vars, URLs, Ports) per repository to identify missing links.")
    report.append("")
    
    sorted_repos = sorted(inventory.keys())
    
    for repo in sorted_repos:
        if repo not in SUB_REPOS and repo != "agents-services":
            # Skip root/misc unless important
            if repo != "root": continue
            
        data = inventory[repo]
        report.append(f"## 📦 `{repo}`")
        
        # 1. Capabilities (High Level)
        if data["Capabilities"]:
            report.append(f"**Detected Capabilities:** {', '.join(sorted(data['Capabilities']))}")
        
        # 2. Ports (Listeners/Connections)
        if data["Ports"]:
            report.append("**Ports Detected:**")
            report.append("`" + "`, `".join(sorted(data["Ports"])) + "`")
            
        # 3. Environment Variables (The "Missing" Configs)
        env_vars = [v for v in data["Env_Vars"] if not v.startswith("REACT_")] # Filter noise slightly if needed, but keeping mostly raw
        # Heuristic filter for likely real env vars (usually start with common prefixes or look like keys)
        likely_env = {e for e in env_vars if any(x in e for x in ["KEY", "SECRET", "URL", "PORT", "ENV", "ID", "TOKEN", "BUCKET", "REGION"])}
        
        if likely_env:
            report.append("**Environment Variables (Likely):**")
            for e in sorted(likely_env):
                report.append(f"- `{e}`")
                
        # 4. URLs (External Services)
        urls = [u for u in data["URLs"] if "localhost" not in u and "127.0.0.1" not in u and "example.com" not in u]
        # Filter for interesting domains
        interesting_domains = {u for u in urls if any(x in u for x in ["api", "aws", "supabase", "stripe", "googleapis", "s3", "azure", "vercel"])}
        
        if interesting_domains:
            report.append("**External Service Calls:**")
            for u in sorted(interesting_domains):
                 report.append(f"- `{u}`")
                 
        report.append("")
        
    return "\n".join(report)

if __name__ == "__main__":
    inv, count = crawl_v2()
    report_content = generate_repo_report(inv, count)
    
    output_path = Path(ROOT_DIR) / "docs/repo_deep_scan.md"
    output_path.write_text(report_content)
    
    print(f"\n✅ Deep Scan Complete. Scanned {count} files. Report saved to: {output_path}")
