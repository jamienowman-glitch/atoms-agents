
import os
import json

root = "/Users/jaynowman/dev/aitoms_fam/aitom_family"
report_dir = "/Users/jaynowman/dev/aitoms_fam/_atom_materialize_report"
output_file = os.path.join(report_dir, "workbench_readiness.tsv")

# Load list of finalized atoms if possible, otherwise scan
# We can trust the directories excluding 'haze_'
atoms = []
for item in sorted(os.listdir(root)):
    if os.path.isdir(os.path.join(root, item)) and not item.startswith("haze_"):
        atoms.append(item)

results = []

for atom_id in atoms:
    path = os.path.join(root, atom_id)
    
    # 1. Import + Render Contract
    view_index = os.path.join(path, "views/index.ts")
    view_tsx = os.path.join(path, "views/View.tsx")
    
    render_entry_ok = "NO"
    if os.path.exists(view_index):
        with open(view_index, 'r') as f:
            if "export { View }" in f.read():
                render_entry_ok = "YES"
    
    if os.path.exists(view_tsx):
        # Naive check if it compiles is hard without running tsc, but existence is a proxy
        pass
    else:
        render_entry_ok = "NO"

    # 2. Token Contract
    tokens_index = os.path.join(path, "exposed_tokens/_index.ts")
    tokens_ok = "NO"
    tokens_apply_visibly = "NO"
    
    if os.path.exists(tokens_index):
        with open(tokens_index, 'r') as f:
            content = f.read()
            # Check for exports
            if "export * as" in content or "export const tokens =" in content:
                 # It exists, but is it meaningful?
                 # My batch script output "export const tokens = {};" which is technically a valid export but empty
                 tokens_ok = "YES"
    
    # Check if CSS or View uses vars
    # A robust check would look for 'var(--' or usage of token objects
    # But for now, we look for connection.
    # In my batch script, I did NOT wire them up for Real atoms. I mostly just returned JSX.
    # In placeholders, I used a static class.
    
    # Heuristic: verify if style.css or View.tsx contains 'var(--' or 'tokens.'
    has_vars = False
    styles_path = os.path.join(path, "views/styles.css")
    if os.path.exists(styles_path):
        with open(styles_path, 'r') as f:
            if "var(--" in f.read():
                has_vars = True
                
    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
             if "tokens." in f.read() or "fontVariationSettings" in f.read():
                 has_vars = True
    
    if has_vars:
        tokens_apply_visibly = "YES"


    # 3. Typography / Variable Font
    # Check for 'Roboto Flex' and 'fontVariationSettings'
    variable_font_ok = "NO"
    uses_roboto = False
    uses_axes = False
    
    if os.path.exists(styles_path):
        with open(styles_path, 'r') as f:
            if "Roboto Flex" in f.read():
                uses_roboto = True

    if os.path.exists(view_tsx):
        with open(view_tsx, 'r') as f:
            content = f.read()
            if "fontVariationSettings" in content:
                uses_axes = True
            # Also check inline styles for font family if separate
            if "Roboto Flex" in content:
                uses_roboto = True
    
    if uses_roboto and uses_axes:
        variable_font_ok = "YES"
    elif uses_roboto and not uses_axes:
        variable_font_ok = "PARTIAL" # Has font but not axes control

    # 4. Behaviour Contract
    binding_path = os.path.join(path, "behaviour/bindings.ts")
    machine_path = os.path.join(path, "behaviour/machine.ts")
    behaviour_ok = "YES" if os.path.exists(binding_path) and os.path.exists(machine_path) else "NO"

    # 5. A11y + Tracking
    a11y_ts = os.path.join(path, "accessibility/a11y.ts")
    a11y_na = os.path.join(path, "accessibility/NA.md")
    
    track_ev = os.path.join(path, "tracking/events.ts")
    track_na = os.path.join(path, "tracking/NA.md")
    
    has_a11y = os.path.exists(a11y_ts) or os.path.exists(a11y_na)
    has_track = os.path.exists(track_ev) or os.path.exists(track_na)
    
    a11y_tracking_ok = "YES" if (has_a11y and has_track) else "NO"

    # Overall Status
    # "tokens_ok" is weak (empty object passes). 
    # But "tokens_apply_visibly" is the strong check.
    
    workbench_ready = "NO"
    reasons = []
    
    if render_entry_ok == "NO": reasons.append("Render entry missing")
    if tokens_ok == "NO": reasons.append("Tokens index missing")
    if tokens_apply_visibly == "NO": reasons.append("Tokens not applied")
    if variable_font_ok != "YES": reasons.append("Variable font axes missing")
    if behaviour_ok == "NO": reasons.append("Behaviour missing")
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
