
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
    # Check if we have the wiring code
    tokens_apply_visibly = "NO"
    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
            c = f.read()
            if "defaultTokens" in c and "--ns-surface" in c:
                tokens_apply_visibly = "YES"
            # Fallback for old manual ones? No, I overwrote/injected everywhere. 
    
    # 4. VARIABLE FONT
    variable_font_ok = "NO"
    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
            c = f.read()
            if "resolveRobotoFlexVariation" in c:
                variable_font_ok = "YES"
    
    # 5. BEHAVIOUR & A11Y
    behaviour_ok = "YES" if os.path.exists(os.path.join(path, "behaviour/machine.ts")) else "NO"
    a11y_tracking_ok = "YES" if os.path.exists(os.path.join(path, "accessibility/a11y.ts")) else "NO"

    # Overall
    workbench_ready = "NO"
    reasons = []
    
    if render_entry_ok == "NO": reasons.append("Render entry missing")
    if tokens_ok == "NO": reasons.append("Tokens missing")
    if tokens_apply_visibly == "NO": reasons.append("Tokens not applied")
    if variable_font_ok == "NO": reasons.append("Variable font wiring missing")
    
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
