import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ATOMS_DIR = path.resolve(__dirname, '../atoms/aitom_family');
const CATALOG_JSON = path.resolve(__dirname, '../docs/TOKEN_CATALOG.json');
const CATALOG_TSV = path.resolve(__dirname, '../docs/TOKEN_CATALOG.tsv');

// Mock environment for evaluating schemas
const SANDBOX = {
    AssetRegistry: {
        icons: new Proxy({}, {
            get: (target, prop) => 'mock_asset'
        })
    },
    // Proxy for any other undefined globals that might appear
    console: console
};

// Helper to flatten object keys to dot notation
function flatten(obj, prefix = '', res = {}) {
    for (const key in obj) {
        if (key === 'meta') continue; // Skip meta
        const val = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            // Check for explicit "status: NA" object
            if (val.status === 'NA') {
                res[newKey] = { val, type: 'NA' };
            } else {
                flatten(val, newKey, res);
            }
        } else {
            res[newKey] = { val, type: typeof val };
        }
    }
    return res;
}

// Infer controller kind from value
function inferController(key, value) {
    if (key.includes('color') || (typeof value === 'string' && value.startsWith('#'))) return 'color';
    if (key.includes('size') || key.includes('width') || key.includes('height')) return 'text'; // Start with text for dimensions, maybe stepper later
    if (typeof value === 'number') {
        if (key === 'slnt' || key === 'wght' || key === 'wdth' || key.includes('opacity')) return 'slider';
        return 'stepper';
    }
    if (typeof value === 'boolean') return 'toggle';
    if (key.includes('align') || key.includes('justify') || key.includes('family')) return 'dropdown';
    return 'text';
}

async function seed() {
    console.log('Scanning atoms...');
    if (!fs.existsSync(ATOMS_DIR)) {
        console.error('Atoms directory not found');
        return;
    }

    const atomDirs = fs.readdirSync(ATOMS_DIR);
    let catalog = [];
    let count = 0;

    for (const atomId of atomDirs) {
        if (atomId.startsWith('.')) continue;

        const schemaPath = path.join(ATOMS_DIR, atomId, 'exposed_tokens/schema.ts');
        if (fs.existsSync(schemaPath)) {
            try {
                let content = fs.readFileSync(schemaPath, 'utf8');

                // 1. Remove imports
                content = content.replace(/import .*?;/g, '');

                // 2. Remove simple types usage (naive) - mostly schemas are just objects
                // If there are explicit type annotations like `foo: string`, this eval might fail.
                // Assuming standard "export const SCHEMA = { ... }" format.

                // 3. Extract the object literal
                // Match "export const SCHEMA = { ... };" or similar
                // We'll execute it in a VM to be safer/easier than parsing braces

                // Replace export with simple assignment
                content = content.replace('export const SCHEMA', 'var SCHEMA'); // Use var to allow redeclaration if context leaks, though fresh context is better
                // Ensure we return SCHEMA
                content += ';\nSCHEMA;';

                const script = new vm.Script(content);
                // Create a fresh context based on SANDBOX for each run to avoid "Identifier already declared"
                // We need to shallow copy the sandbox structure at least.
                const context = { ...SANDBOX, AssetRegistry: { ...SANDBOX.AssetRegistry } };
                const result = script.runInNewContext(context);

                if (result) {
                    const flattened = flatten(result);
                    const atomTokens = [];

                    Object.entries(flattened).forEach(([k, v]) => {
                        atomTokens.push({
                            section: atomId,
                            token_key: k,
                            token_type: v.type,
                            controller_kind: inferController(k, v.val),
                            controller_config: {},
                            notes: `Initial value: ${v.val}`,
                            status: (v.type === 'NA') ? 'NA' : 'ACTIVE'
                        });
                    });

                    catalog = [...catalog, ...atomTokens];
                    count++;
                    console.log(`Parsed ${atomId}: ${atomTokens.length} tokens`);
                }

            } catch (e) {
                console.warn(`Failed to parse schema for ${atomId}:`, e.message);
                // Continue to next atom
            }
        }
    }

    // Write Files
    fs.writeFileSync(CATALOG_JSON, JSON.stringify(catalog, null, 2));

    // Write TSV
    const headers = [
        'section', 'token_key', 'token_type', 'controller_kind',
        'controller_config', 'option_source', 'missing_siblings',
        'animation_enabled', 'animation_trigger', 'notes'
    ];

    const rows = catalog.map(item => {
        return headers.map(h => {
            const val = item[h];
            return val !== undefined ? String(val) : '';
        }).join('\t');
    });

    fs.writeFileSync(CATALOG_TSV, headers.join('\t') + '\n' + rows.join('\n'));
    console.log(`Done! Seeded ${catalog.length} tokens from ${count} atoms.`);
}

seed();
