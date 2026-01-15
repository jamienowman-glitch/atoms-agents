
import os
import re
import json

atoms = [
    "borderless_big_chat", "bottom_chat_input_bar", "chat_card_v1", "chat_fullscreen_view",
    "chat_icon_band_popover", "chat_message_action_bar", "chat_message_block", "chat_message_list",
    "chat_rail", "chat_rail_header_bar", "chat_rail_settings", "chat_rail_shell", "chat_rail_sliders",
    "chat_rail_tools", "chat_safety_controls_bar", "chat_settings", "chat_shortcuts_popover",
    "chat_upload_source_picker", "cluster_popup", "cluster_rep", "desktop_floating_chat", "fed_popup",
    "fed_rep", "micro_public_chat", "swarm_chat_bars", "swarm_group_chat_bar"
]

log_dir = "/Users/jaynowman/dev/aitoms_fam/docs/plans/"
log_files = [f for f in os.listdir(log_dir) if f.endswith("_plans_log.md")]

tasks = []

for log_file in log_files:
    file_path = os.path.join(log_dir, log_file)
    with open(file_path, "r") as f:
        content = f.read()
    
    blocks = re.split(r'(?m)^#{2,3}\s+(?:atom|ATOM):\s+', content)
    
    for block in blocks:
        if not block.strip():
            continue
            
        lines = block.split('\n')
        atom_name = lines[0].strip()
        
        if atom_name in atoms:
            if "STATUS: ACTIVE" in block:
                # Extract dimension
                dimension_match = re.search(r'(?i)dimension:\s*(.+)', block)
                dimension = dimension_match.group(1).strip() if dimension_match else "unknown"

                # Extract required files
                req_files_match = re.search(r'Required files:\n(.*?)(?=\n\n|\n[A-Z]|\n#)', block, re.DOTALL)
                req_files_raw = req_files_match.group(1).strip() if req_files_match else ""
                
                # Parse req files into a list
                req_files = []
                for line in req_files_raw.split('\n'):
                    if line.strip().startswith('-'):
                        # clean up "- path/to/file – description"
                        parts = line.strip().lstrip('- ').split(' – ', 1)
                        if len(parts) == 1:
                             parts = line.strip().lstrip('- ').split(' - ', 1) # try hyphen
                        path = parts[0].strip()
                        desc = parts[1].strip() if len(parts) > 1 else ""
                        req_files.append({"path": path, "description": desc})

                # Extract impl notes
                notes_match = re.search(r'Implementation notes:\n(.*?)(?=\n\n|\nSTATUS)', block, re.DOTALL)
                notes = notes_match.group(1).strip() if notes_match else ""
                
                tasks.append({
                    "atom": atom_name,
                    "dimension": dimension,
                    "log_file": log_file,
                    "required_files": req_files,
                    "notes": notes
                })

with open("active_tasks.json", "w") as f:
    json.dump(tasks, f, indent=2)
print("Done.")
