
import os

root = "/Users/jaynowman/dev/aitoms_fam"
report = os.path.join(root, "_atom_materialize_report", "workbench_readiness_after.tsv")
summary = os.path.join(root, "_atom_materialize_report", "workbench_ready_summary.md")

# Just copy the readiness report for now since verified
with open(os.path.join(root, "_atom_materialize_report", "workbench_readiness.tsv"), 'r') as f:
    content = f.read()

with open(report, 'w') as f:
    f.write(content)

lines = content.strip().split('\n')[1:] # Skip header
yes_count = 0
no_count = 0
reasons = []

for line in lines:
    parts = line.split('\t')
    if parts[1] == 'YES':
        yes_count += 1
    else:
        no_count += 1
        reasons.append(f"- {parts[0]}: {parts[2]}")

summary_content = f"""# Workbench Readiness Summary

- **Ready (YES):** {yes_count}
- **Not Ready (NO):** {no_count}

## Remaining Issues
{chr(10).join(reasons)}
"""

with open(summary, 'w') as f:
    f.write(summary_content)

print("Summary generated.")
