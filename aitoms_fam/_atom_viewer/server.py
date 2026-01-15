import os
import csv
import json
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='static')
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FEEDBACK_FILE = os.path.join(REPO_ROOT, '_atom_viewer', 'feedback.tsv')

if not os.path.exists(FEEDBACK_FILE):
    with open(FEEDBACK_FILE, 'w') as f:
        f.write("atom_root\tstatus\tnotes\n")

def get_feedback():
    feedback = {}
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, 'r') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                feedback[row['atom_root']] = row
    return feedback

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/atoms')
def list_atoms():
    report_path = os.path.join(REPO_ROOT, '_atom_move_ready_report', '02_atom_status.tsv')
    atoms = []
    feedback = get_feedback()
    
    if os.path.exists(report_path):
        with open(report_path, 'r') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                atom_root = row['atom_root']
                fb = feedback.get(atom_root, {})
                atoms.append({
                    **row,
                    'user_status': fb.get('status', 'UNREVIEWED'),
                    'user_notes': fb.get('notes', '')
                })
    print(f"DEBUG: Found {len(atoms)} atoms")
    return jsonify(atoms)

@app.route('/api/atom', methods=['GET'])
def get_atom_details():
    atom_root = request.args.get('root')
    if not atom_root:
        return jsonify({'error': 'Missing root'}), 400
    
    # Security: ensure we stay within repo
    full_path = os.path.abspath(os.path.join(REPO_ROOT, atom_root))
    if not full_path.startswith(REPO_ROOT):
        return jsonify({'error': 'Invalid path'}), 403

    details = {'views': [], 'data_schema': [], 'exposed_tokens': []}
    
    for bucket in ['views', 'data_schema', 'exposed_tokens']:
        bucket_path = os.path.join(full_path, bucket)
        if os.path.exists(bucket_path):
            for root, dirs, files in os.walk(bucket_path):
                for file in files:
                    if file.endswith('.md') or file.endswith('.ts') or file.endswith('.json'):
                        file_path = os.path.join(root, file)
                        with open(file_path, 'r') as f:
                            content = f.read()
                        
                        # Extra: Extract simple tokens (hex codes)
                        import re
                        tokens = {}
                        if 'exposed_tokens' in bucket:
                            hex_codes = re.findall(r'#[0-9a-fA-F]{6}', content)
                            if hex_codes:
                                tokens['extracted_colors'] = hex_codes

                        # Extra: Identify if it's "Golden Code"
                        if file.endswith('.tsx'):
                            tokens['is_golden_code'] = True

                        # Extra: Extract TS tokens from Granular Files
                        # Matches: export const tokenName = { defaultValue: "...", ... }
                        if file.endswith('.ts') and 'exposed_tokens' in bucket:
                            # Parse dictionary-like objects
                            # This is a simple regex parser for the demo.
                            # In prod, we'd use a real TS parser or consistent JSON.
                            
                            # Find all block exports
                            blocks = re.split(r'export const', content)
                            for block in blocks:
                                if not block.strip(): continue
                                
                                # Extract name
                                name_match = re.search(r'^\s*(\w+)\s*=', block)
                                if name_match:
                                    token_name = name_match.group(1)
                                    
                                    # Extract defaultValue
                                    val_match = re.search(r'defaultValue:\s*[\'"](.*?)[\'"]', block)
                                    if val_match:
                                        # Determine category from parent folder
                                        rel_dir = os.path.dirname(os.path.relpath(file_path, os.path.join(full_path, 'exposed_tokens')))
                                        category = rel_dir if rel_dir != '.' else 'misc'
                                        
                                        if 'granular_tokens' not in tokens:
                                            tokens['granular_tokens'] = {}
                                        
                                        if category not in tokens['granular_tokens']:
                                            tokens['granular_tokens'][category] = []

                                        tokens['granular_tokens'][category].append({
                                            'name': token_name,
                                            'value': val_match.group(1),
                                            'type': 'text' # default, refined by 'type:' regex if needed
                                        })

                        details[bucket].append({
                            'name': file,
                            'path': os.path.relpath(file_path, full_path),
                            'content': content,
                            'tokens': tokens
                        })
    return jsonify(details)

@app.route('/api/fonts/presets')
def get_font_presets():
    presets = []
    tsv_path = os.path.join(REPO_ROOT, 'fonts', 'roboto_flex_presets.tsv')
    if os.path.exists(tsv_path):
        with open(tsv_path, 'r') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                presets.append(row)
    return jsonify(presets)

@app.route('/fonts/<path:filename>')
def serve_fonts(filename):
    return send_from_directory(os.path.join(REPO_ROOT, 'fonts'), filename)

@app.route('/api/atom/approve', methods=['POST'])
def approve_atom():
    data = request.json
    atom_root = data.get('atom_root')
    
    # Write status file
    status_file = os.path.join(REPO_ROOT, atom_root, 'exposed_tokens', '_status.tsv')
    
    # Ensure dir exists
    os.makedirs(os.path.dirname(status_file), exist_ok=True)
    
    with open(status_file, 'w') as f:
        f.write("atom_root\tstatus\tapproved_by\tapproved_at\n")
        f.write(f"{atom_root}\tEXPORT_READY\tJAY\tNOW\n") # simplified timestamp
        
    return jsonify({'success': True})

@app.route('/api/feedback', methods=['POST'])
def save_feedback():
    data = request.json
    atom_root = data.get('atom_root')
    status = data.get('status')
    notes = data.get('notes', '')
    
    feedback = get_feedback()
    feedback[atom_root] = {'atom_root': atom_root, 'status': status, 'notes': notes}
    
    with open(FEEDBACK_FILE, 'w') as f:
        writer = csv.DictWriter(f, fieldnames=['atom_root', 'status', 'notes'], delimiter='\t')
        writer.writeheader()
        for key in sorted(feedback.keys()):
            writer.writerow(feedback[key])
            
    return jsonify({'success': True})

@app.route('/api/export')
def export_feedback():
    return send_from_directory(os.path.dirname(FEEDBACK_FILE), os.path.basename(FEEDBACK_FILE), as_attachment=True)

if __name__ == '__main__':
    # Verify flask is installed
    app.run(host='0.0.0.0', port=8080)
