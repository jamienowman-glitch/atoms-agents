import os

ROOT = "/Users/jaynowman/dev/aitoms_fam"
ACTIVE = os.path.join(ROOT, "aitom_family")
INACTIVE = os.path.join(ROOT, "_atoms_inactive", "aitom_family")

BUCKETS = [
    "behaviour", "layout", "views", "typography", "colours", 
    "icons", "data_schema", "tracking", "accessibility", "exposed_tokens"
]

def analyze_atom(path, atom_id):
    if not os.path.isdir(path):
        return None
    
    children = os.listdir(path)
    # Filter out .DS_Store
    children = [c for c in children if not c.startswith('.')]
    
    buckets_found = [c for c in children if c in BUCKETS]
    other_files = [c for c in children if c not in BUCKETS]
    
    status = "Junk"
    if len(buckets_found) == 10:
        status = "Complete (Structure)"
    elif len(buckets_found) > 0:
        status = "Partial"
    elif len(children) == 0:
        status = "Placeholder"
    elif len(other_files) > 0 and len(buckets_found) == 0:
        status = "Non-Standard"

    return {
        "id": atom_id,
        "location": "active" if "aitom_family/" in path and "_atoms_inactive" not in path else "inactive",
        "status": status,
        "buckets": len(buckets_found),
        "files": len(children)
    }

def generate_report():
    report_data = []
    
    # Scan Active
    if os.path.exists(ACTIVE):
        for atom in os.listdir(ACTIVE):
            if atom.startswith('.') or atom == "_shared": continue
            data = analyze_atom(os.path.join(ACTIVE, atom), atom)
            if data: report_data.append(data)
            
    # Scan Inactive
    if os.path.exists(INACTIVE):
        for atom in os.listdir(INACTIVE):
            if atom.startswith('.'): continue
            data = analyze_atom(os.path.join(INACTIVE, atom), atom)
            if data: report_data.append(data)

    # Write TSV
    out_path = os.path.join(ROOT, "_salvage_report", "atoms_found.tsv")
    with open(out_path, "w") as f:
        f.write("Atom ID\tLocation\tStatus\tBuckets\tFiles\n")
        for item in sorted(report_data, key=lambda x: x['id']):
            f.write(f"{item['id']}\t{item['location']}\t{item['status']}\t{item['buckets']}\t{item['files']}\n")
    
    print(f"Report generated: {out_path}")
    
    # Write Migration Candidates (Active only for now)
    mig_path = os.path.join(ROOT, "_salvage_report", "atoms_to_migrate.tsv")
    with open(mig_path, "w") as f:
        f.write("Atom ID\tReadiness\n")
        for item in sorted(report_data, key=lambda x: x['id']):
            if item['location'] == "active" and item['buckets'] == 10:
                f.write(f"{item['id']}\tREADY\n")

if __name__ == "__main__":
    generate_report()
