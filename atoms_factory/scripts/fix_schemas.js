
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ATOMS_DIR = path.resolve(__dirname, '../atoms/aitom_family');

function fixSchema(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern: Value (string/number) -> Whitespace -> Key (one of our injected ones)
    // We want to ensure there is a comma after the value.

    // Regex explanation:
    // 1. (: \s*  (?: '...' | "..." | \d+ ))  -- Capture value (simplified)
    // 2. (?!\s*,)                          -- negative lookahead: make sure NO comma follows immediately
    // 3. (\s+)                             -- Capture whitespace (newline)
    // 4. (weight|slant|width|letter_spacing|tracking|animation): -- Capture next key

    // Note: JS Regex lookbehind is supported in Node.

    const regex = /(: \s*(?:'[^']+'|"[^"]+"|\d+))(?!\s*,)(\s*)(weight|slant|width|letter_spacing|tracking|animation):/g;

    // Actually, simple replacement:
    // unexpected identifier often happens when we have `600 \n letter_spacing`.

    // Let's iterate and replace.
    // We need to match the value robustly.
    // Strings: '...' or "..."
    // Numbers: \d+ or \d+\.\d+
    // Booleans: true|false (not needed for typ usually)

    content = content.replace(/((?:'[^']*'|"[^"]*"|\d+(?:\.\d+)?))\s*\n(\s*)(weight|slant|width|letter_spacing|tracking|animation):/g, (match, val, indent, key) => {
        // If match includes a comma, regex wouldn't catch it if we were strict?
        // Let's just blindly add comma if it's missing.
        // The regex above matches "VAL \n KEY". It does NOT match "VAL, \n KEY".

        return `${val},\n${indent}${key}:`;
    });

    return content;
}

async function run() {
    const atomDirs = fs.readdirSync(ATOMS_DIR);
    for (const atomId of atomDirs) {
        if (atomId.startsWith('.')) continue;
        const schemaPath = path.join(ATOMS_DIR, atomId, 'exposed_tokens/schema.ts');
        if (fs.existsSync(schemaPath)) {
            try {
                const fixed = fixSchema(schemaPath);
                if (fixed !== fs.readFileSync(schemaPath, 'utf8')) {
                    fs.writeFileSync(schemaPath, fixed);
                    console.log(`Fixed commas in ${atomId}`);
                }
            } catch (e) {
                console.error(`Error fixing ${atomId}:`, e.message);
            }
        }
    }
}

run();
