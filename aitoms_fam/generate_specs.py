import json
import os

# Load tasks
with open("active_tasks.json", "r") as f:
    tasks = json.load(f)

# Reference atom for style
REFERENCE_STYLE = """## {title}

{content}

### Implementation notes
{notes}
"""

# Create files
for task in tasks:
    atom = task['atom']
    dimension = task['dimension']
    notes = task['notes']
    
    for req_file in task['required_files']:
        path = req_file['path']
        desc = req_file['description']
        
        # Build full path
        full_path = f"/Users/jaynowman/dev/aitoms_fam/{path}"
        
        # Create directory if needed
        dir_path = os.path.dirname(full_path)
        os.makedirs(dir_path, exist_ok=True)
        
        # Generate content based on dimension and description
        file_basename = os.path.basename(path).replace('.md', '').replace('.', '')
        title = file_basename.replace('_', ' ').title()
        
        # Build content from description and notes
        content_lines = []
        
        if desc and desc != "":
            content_lines.append(f"**Purpose**: {desc}")
        
        # Add notes as bullet points
        if notes:
            content_lines.append("\n**Specification**:")
            for line in notes.split('\n'):
                line = line.strip()
                if line.startswith('-'):
                    content_lines.append(line)
                elif line:
                    content_lines.append(f"- {line}")
        
        content = "\n".join(content_lines) if content_lines else f"Specification for {title} in {atom}/{dimension}."
        
        file_content = f"## {title}\n\n{content}\n"
        
        # Write file
        with open(full_path, 'w') as f:
            f.write(file_content)

print(f"Created {len([f for t in tasks for f in t['required_files']])} files")
