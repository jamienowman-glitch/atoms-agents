import csv
import re
import os

def parse_plans(log_path):
    if not os.path.exists(log_path):
        return {}
    with open(log_path, 'r') as f:
        content = f.read()
    
    # Split by ### ATOM:
    blocks = content.split('### ATOM: ')
    plans = {}
    for block in blocks[1:]: # skip first empty or preamble
        lines = block.split('\n')
        atom_name = lines[0].strip()
        
        # Check status
        if 'STATUS: ACTIVE' in block:
            plans[atom_name] = '### ATOM: ' + block
    return plans

def main():
    matrix_path = 'docs/atoms_matrix.tsv'
    layout_log = 'docs/plans/layout_plans_log.md'
    views_log = 'docs/plans/views_plans_log.md'
    
    layout_plans = parse_plans(layout_log)
    views_plans = parse_plans(views_log)
    
    work_items = []
    
    with open(matrix_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            atom = row['atom_name']
            
            l_status = row.get('layout_status', 'MISSING')
            v_status = row.get('views_status', 'MISSING')
            
            item = {'atom': atom, 'layout': None, 'views': None}
            
            if l_status in ['ACTIVE', 'MISSING']:
                if atom in layout_plans:
                    item['layout'] = layout_plans[atom]
            
            if v_status in ['ACTIVE', 'MISSING']:
                if atom in views_plans:
                    item['views'] = views_plans[atom]
            
            if item['layout'] or item['views']:
                work_items.append(item)

    print(f"Found {len(work_items)} atoms to process.")
    for item in work_items:
        print(f"ATOM: {item['atom']}")
        if item['layout']:
            print(f"  - Layout: ACTIVE PLAN FOUND")
        if item['views']:
            print(f"  - Views: ACTIVE PLAN FOUND")

if __name__ == '__main__':
    main()
