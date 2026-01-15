from typing import Dict, Any, Optional
from northstar.registry.schemas import FlowCard, NodeCard, PersonaCard

def render_canvas(
    flow: FlowCard, 
    nodes: Dict[str, NodeCard], 
    personas: Dict[str, PersonaCard],
    result: Optional[Dict[str, Any]] = None, 
    theme: str = "light"
) -> str:
    # Build Node Data
    nodes_data = []
    
    # Sort by topological order if available, else flow definition order
    from northstar.runtime.dag_validator import DAGValidator
    try:
        # We need edges to sort.
        # Assuming flow.edges behaves like DAGValidator expects
        ordered_ids = DAGValidator.validate_dag(flow.nodes, flow.edges, flow.entry_node, flow.exit_nodes)
    except Exception:
        # Fallback to definition order if validation fails here (should verify beforehand)
        ordered_ids = flow.nodes

    for node_id in ordered_ids:
        if node_id not in nodes:
            continue
        node = nodes[node_id]
        
        icon_url = ""
        if node.persona_ref and node.persona_ref in personas:
            p = personas[node.persona_ref]
            icon_url = p.icon_dark if theme == "dark" and p.icon_dark else (p.icon_light or "")
            
        status = "pending"
        if result:
            for nr in result.get("node_results", []):
                if nr["node_id"] == node_id:
                    status = nr.get("status", "unknown")
                    break

        nodes_data.append({
            "id": node_id,
            "name": node.name,
            "kind": node.kind,
            "icon": icon_url or "",
            "status": status,
            "details": f"{node.persona_ref or ''} / {node.task_ref or ''}"
        })

    # Render HTML
    bg_color = "#1a1a1a" if theme == "dark" else "#f5f5f5"
    text_color = "#ffffff" if theme == "dark" else "#000000"
    card_bg = "#2d2d2d" if theme == "dark" else "#ffffff"
    border_color = "#444" if theme == "dark" else "#ddd"

    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ margin: 0; padding: 20px; font-family: sans-serif; background: {bg_color}; color: {text_color}; }}
  .container {{ display: flex; flex-direction: row; gap: 40px; overflow-x: auto; padding-bottom: 20px; }}
  .node {{ 
    border: 1px solid {border_color}; 
    background: {card_bg}; 
    border-radius: 8px; 
    padding: 16px; 
    min-width: 200px; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    position: relative;
  }}
  .node.success {{ border-color: #4caf50; border-width: 2px; }}
  .node.failed {{ border-color: #f44336; border-width: 2px; }}
  .node img {{ width: 48px; height: 48px; border-radius: 50%; display: block; margin-bottom: 10px; background: #ccc; }}
  .arrow {{ font-size: 24px; align-self: center; color: #888; }}
  h3 {{ margin: 0 0 8px 0; font-size: 16px; }}
  p {{ margin: 0; font-size: 12px; opacity: 0.8; }}
  
  @media (max-width: 768px) {{
    .container {{ flex-direction: column; align-items: center; }}
    .arrow {{ transform: rotate(90deg); }}
  }}
</style>
</head>
<body>
  <h1>Flow: {flow.name} ({flow.flow_id})</h1>
  <div class="container">
"""
    
    for i, n in enumerate(nodes_data):
        icon_html = f'<img src="{n["icon"]}">' if n["icon"] else ""
        classes = f"node {n['status']}"
        
        html += f"""
    <div class="{classes}">
        {icon_html}
        <h3>{n['name']}</h3>
        <p><b>{n['kind']}</b></p>
        <p>{n['details']}</p>
        <p>Status: {n['status']}</p>
    </div>
"""
        if i < len(nodes_data) - 1:
            html += '    <div class="arrow">→</div>\n'

    html += """
  </div>
</body>
</html>"""
    return html
