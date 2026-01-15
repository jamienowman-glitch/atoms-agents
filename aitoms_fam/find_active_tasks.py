
import os
import re

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

for log_file in log_files:
    file_path = os.path.join(log_dir, log_file)
    with open(file_path, "r") as f:
        content = f.read()
    
    # Split by atom headers (## atom: or ### ATOM:)
    # Normalizing line endings and splitting
    blocks = re.split(r'(?m)^#{2,3}\s+(?:atom|ATOM):\s+', content)
    
    for block in blocks:
        if not block.strip():
            continue
            
        lines = block.split('\n')
        atom_name = lines[0].strip()
        
        if atom_name in atoms:
            if "STATUS: ACTIVE" in block:
                print(f"--- ACTIVE TASK FOUND ---")
                print(f"Atom: {atom_name}")
                print(f"Log File: {log_file}")
                
                # Extract required files
                req_files_match = re.search(r'Required files:\n(.*?)(?=\n\n|\n[A-Z]|\n#)', block, re.DOTALL)
                if req_files_match:
                    print(f"Required Files:\n{req_files_match.group(1).strip()}")
                
                # Extract impl notes
                notes_match = re.search(r'Implementation notes:\n(.*?)(?=\n\n|\nSTATUS)', block, re.DOTALL)
                if notes_match:
                    print(f"Notes:\n{notes_match.group(1).strip()}")
                
                print("\n")
