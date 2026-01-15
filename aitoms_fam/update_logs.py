import json
import re

# Load tasks
with open("active_tasks.json", "r") as f:
    tasks = json.load(f)

# Group by log file and atom
updates_by_log = {}
for task in tasks:
    log_file = task['log_file']
    atom = task['atom']
    
    if log_file not in updates_by_log:
        updates_by_log[log_file] = set()
    updates_by_log[log_file].add(atom)

# Update each log file
log_dir = "/Users/jaynowman/dev/aitoms_fam/docs/plans/"

for log_file, atoms in updates_by_log.items():
    file_path = f"{log_dir}{log_file}"
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # For each atom, find its block and update STATUS: ACTIVE to STATUS: DONE
    for atom in atoms:
        # Pattern to match the atom block and its STATUS line
        # Match from atom header to STATUS: ACTIVE
        pattern = rf'(#{2,3}\s+(?:atom|ATOM):\s+{re.escape(atom)}\b.*?)(STATUS:\s*ACTIVE)'
        
        # Replace STATUS: ACTIVE with STATUS: DONE
        content = re.sub(pattern, r'\1STATUS: DONE', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Write back
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Updated {log_file}: {len(atoms)} atoms marked DONE")

print(f"\nTotal: {len(tasks)} dimension-tasks across {len(updates_by_log)} log files")
