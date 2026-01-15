
import os
import json
import sys
from typing import Dict, Any
from northstar.registry.schemas import NodeCard, PersonaCard
from northstar.runtime.render.html_renderer import render_canvas

def render_flow(
    flows: Dict[str, Any], 
    nodes: Dict[str, Any], 
    personas: Dict[str, Any],
    flow_id: str, 
    theme: str = "light", 
    out: str = ""
) -> None:
    if flow_id not in flows:
        print(f"Flow '{flow_id}' not found.")
        sys.exit(1)
        
    flow = flows[flow_id]
    
    # Check integrity
    valid_nodes = {nid: nodes[nid] for nid in flow.nodes if nid in nodes and isinstance(nodes[nid], NodeCard)}
    valid_personas = {pid: personas[pid] for pid in personas if isinstance(personas[pid], PersonaCard)}

    html = render_canvas(flow, valid_nodes, valid_personas, theme=theme)
    
    if not out:
        out = f".northstar/artifacts/flow_{flow_id}.html"
        
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w") as f:
        f.write(html)
        
    print(f"Rendered flow canvas to: {out}")

def render_run(
    flows: Dict[str, Any],
    nodes: Dict[str, Any],
    personas: Dict[str, Any],
    report_path: str,
    theme: str = "light",
    out: str = ""
) -> None:
    if not os.path.exists(report_path):
        print(f"Report file not found: {report_path}")
        sys.exit(1)
        
    with open(report_path, "r") as f:
        report = json.load(f)
        
    flow_id = report.get("flow_id")
    if not flow_id or flow_id not in flows:
         print(f"Flow '{flow_id}' from report not found in registry.")
         sys.exit(1)
         
    flow = flows[flow_id]
    valid_nodes = {nid: nodes[nid] for nid in flow.nodes if nid in nodes and isinstance(nodes[nid], NodeCard)}
    valid_personas = {pid: personas[pid] for pid in personas if isinstance(personas[pid], PersonaCard)}
    
    html = render_canvas(flow, valid_nodes, valid_personas, result=report, theme=theme)
    
    if not out:
        out = f".northstar/artifacts/run_{flow_id}.html"

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w") as f:
        f.write(html)
        
    print(f"Rendered run canvas to: {out}")
