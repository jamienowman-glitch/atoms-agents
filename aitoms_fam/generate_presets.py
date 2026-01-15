
import csv
import json

tsv_path = '/Users/jaynowman/dev/aitoms_fam/fonts/roboto_flex_presets.tsv'
ts_path = '/Users/jaynowman/dev/aitoms_fam/aitom_family/_shared/typography/presets.ts'

presets = {}
axes_keys = []

with open(tsv_path, 'r') as f:
    reader = csv.DictReader(f, delimiter='\t')
    axes_keys = [k for k in reader.fieldnames if k != 'name']
    
    for row in reader:
        name = row['name']
        values = {}
        for k in axes_keys:
            if row[k]:
                values[k] = float(row[k])
        presets[name] = values

ts_content = f"""// Generated from roboto_flex_presets.tsv

export interface RobotoFlexAxes {{
{chr(10).join([f"  '{k}'?: number;" for k in axes_keys])}
}}

export const robotoFlexAxes = {json.dumps(axes_keys)};

export const robotoFlexPresets: Record<string, RobotoFlexAxes> = {json.dumps(presets, indent=2)};
"""

with open(ts_path, 'w') as f:
    f.write(ts_content)

print(f"Generated presets.ts with {len(presets)} presets.")
