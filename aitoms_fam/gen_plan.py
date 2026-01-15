
import json

with open("active_tasks.json", "r") as f:
    tasks = json.load(f)

# Sort tasks by atom then dimension
tasks.sort(key=lambda x: (x['atom'], x['dimension']))

md_output = []
md_output.append("# Lane A Implementation Plan\n")
md_output.append("This plan outlines the creation of missing specification files for Lane A atoms (Chat & Swarm).\n")
md_output.append("## Proposed Changes\n")

current_atom = None

for task in tasks:
    atom = task['atom']
    if atom != current_atom:
        md_output.append(f"\n### {atom}\n")
        current_atom = atom
    
    md_output.append(f"#### Dimension: {task['dimension']}")
    for req_file in task['required_files']:
        path = req_file['path']
        desc = req_file['description']
        # The path should be absolute in the plan or relative to repo root. The JSON has relative paths.
        full_path = f"/Users/jaynowman/dev/aitoms_fam/{path}"
        md_output.append(f"- [NEW] [{path}]({full_path}) - {desc}")

md_output.append("\n## Verification Plan\n")
md_output.append("### Automated Verification\n")
md_output.append("- Run a script to verify that all files listed above exist.")
md_output.append("- Check that file content is not empty.")

with open("impl_plan_content.md", "w") as f:
    f.write("\n".join(md_output))
print("Plan generated.")
