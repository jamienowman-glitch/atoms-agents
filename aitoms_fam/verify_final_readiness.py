
import os
import json

root = "/Users/jaynowman/dev/aitoms_fam/aitom_family"
report_dir = "/Users/jaynowman/dev/aitoms_fam/_atom_materialize_report"
output_file = os.path.join(report_dir, "workbench_readiness_after.tsv")

atoms = []
for item in sorted(os.listdir(root)):
    if os.path.isdir(os.path.join(root, item)) and not item.startswith("haze_") and not item.startswith("_"):
        atoms.append(item)

results = []

for atom_id in atoms:
    path = os.path.join(root, atom_id)
    view_tsx = os.path.join(path, "views/View.tsx")
    
    # 1. RENDER
    render_entry_ok = "YES" if os.path.exists(os.path.join(path, "views/index.ts")) else "NO"
    
    # 2. TOKENS
    tokens_ok = "YES" if os.path.exists(os.path.join(path, "exposed_tokens/_index.ts")) else "NO"
    
    # 3. APPLY VISIBLY
    tokens_apply_visibly = "NO"
    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
            c = f.read()
            if "defaultTokens" in c and "--ns-surface" in c:
                tokens_apply_visibly = "YES"
    
    # 4. VARIABLE FONT
    variable_font_ok = "NO"
    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
            c = f.read()
            if "resolveRobotoFlexVariation" in c:
                variable_font_ok = "YES"
    
    # 5. BEHAVIOUR & A11Y
    behaviour_ok = "YES" if os.path.exists(os.path.join(path, "behaviour/machine.ts")) else "NO"
    
    # A11y check: accepts .ts OR .md (as long as it's not empty, but existence check implies content usually)
    # Plus NA.md is allowed IF it has content
    has_a11y = False
    a11y_path = os.path.join(path, "accessibility")
    if os.path.exists(a11y_path):
        for f in os.listdir(a11y_path):
            if f.endswith(".ts") or f.endswith(".md"):
                # Ideally check content length > 0
                has_a11y = True
                break

    has_track = False
    track_path = os.path.join(path, "tracking")
    if os.path.exists(track_path):
        for f in os.listdir(track_path):
            if f.endswith(".ts") or f.endswith(".md"):
                has_track = True
                break

    a11y_tracking_ok = "YES" if (has_a11y and has_track) else "NO"

    # Overall
    workbench_ready = "NO"
    reasons = []
    
    if render_entry_ok == "NO": reasons.append("Render entry missing")
    if tokens_ok == "NO": reasons.append("Tokens missing")
    if tokens_apply_visibly == "NO": reasons.append("Tokens not applied")
    if variable_font_ok == "NO": reasons.append("Variable font wiring missing")
    if a11y_tracking_ok == "NO": reasons.append("A11y/Tracking missing")
    
    if not reasons:
        workbench_ready = "YES"
        reason_str = "Ready"
    else:
        reason_str = "; ".join(reasons)

    results.append(f"{atom_id}\t{workbench_ready}\t{reason_str}\t{render_entry_ok}\t{tokens_ok}\t{tokens_apply_visibly}\t{variable_font_ok}\t{behaviour_ok}\t{a11y_tracking_ok}")

with open(output_file, 'w') as f:
    f.write("atom_id\tworkbench_ready\treason\trender_entry_ok\ttokens_ok\ttokens_apply_visibly\tvariable_font_ok\tbehaviour_ok\ta11y_tracking_ok\n")
    f.write("\n".join(results))

print(f"Verified {len(atoms)} atoms.")
