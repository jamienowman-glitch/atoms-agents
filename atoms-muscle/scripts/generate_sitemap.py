
import json
import os
from pathlib import Path

# --- Configuration ---
# The canonical domain for our marketplace/microsite
BASE_URL = "https://atoms.org"

# Paths relative to the script
ROOT_DIR = Path(__file__).parent.parent
AGENTS_JSON_PATH = ROOT_DIR / ".well-known" / "agents.json"
SITEMAP_XML_PATH = ROOT_DIR / ".well-known" / "sitemap.xml"

def generate_sitemap():
    """
    Reads .well-known/agents.json and generates a sitemap.xml
    to boost AEO and ensure search engines crawl all our muscles.
    """
    if not AGENTS_JSON_PATH.exists():
        print(f"❌ Error: {AGENTS_JSON_PATH} not found. Run sync_muscles.py first.")
        return

    try:
        with open(AGENTS_JSON_PATH, "r") as f:
            agents_catalog = json.load(f)
    except json.JSONDecodeError:
        print(f"❌ Error: {AGENTS_JSON_PATH} is not valid JSON.")
        return

    agents = agents_catalog.get("agents", [])
    print(f"🔍 Found {len(agents)} agents in the catalog.")

    # Start XML
    xml_content = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    # Add Homepage (The Registry Root)
    xml_content.append(f"""
    <url>
        <loc>{BASE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>""")

    # Add each Agent
    for agent in agents:
        # Construct the canonical URL for the muscle/agent
        # Assumption: The frontend route is /muscle/{id} or /agent/{id}
        # We use the unique 'id' from the catalog.
        agent_id = agent.get("id")
        
        # We can also add a lastmod if we had it, but for now we default to daily crawl
        # as availability updates frequently.
        
        xml_content.append(f"""
    <url>
        <loc>{BASE_URL}/agent/{agent_id}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>""")

    # Close XML
    xml_content.append('</urlset>')

    # Write File
    with open(SITEMAP_XML_PATH, "w") as f:
        f.write("\n".join(xml_content))

    print(f"✅ Generated sitemap.xml with {len(agents) + 1} URLs at {SITEMAP_XML_PATH}")

if __name__ == "__main__":
    generate_sitemap()
