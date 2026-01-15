
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ATOMS_DIR = path.resolve(__dirname, '../atoms/aitom_family');

const TYP_DEFAULTS = {
    weight: 400,
    slant: 0,
    width: 100,
    letter_spacing: "'0px'", // String for schema file
    animation: "{\n                animation_mode: 'OFF',\n                animation_style: 'BREATHE_IN'\n            }"
};

function processSchema(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find typography block
    // We look for "typography: {" and match the balanced braces manually-ish or regex
    // Since these are JS objects in files, regex is tricky but we'll try to find keys inside typography.

    // Strategy: 
    // 1. Identify typography keys (heading, subheading, base, etc.)
    // 2. For each key, check if properties exist. If not, inject them.

    // Simplistic Logic:
    // Regex to find: key: { ... } inside typography.
    // This is hard to do robustly with Regex.
    // But we know the formatting is pretty standard (from Prettier usually).

    // Let's iterate lines.
    const lines = content.split('\n');
    let inTypography = false;
    let braceBalance = 0;

    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('typography: {')) {
            inTypography = true;
            braceBalance = 1;
            newLines.push(line);
            continue;
        }

        if (inTypography) {
            // Check for braces to know when we leave typography
            const open = (line.match(/{/g) || []).length;
            const close = (line.match(/}/g) || []).length;
            braceBalance += open - close;

            // If we are inside a typography item (e.g. heading: { ... }), braceBalance should be 2
            // If line ends with '{', it's starting an item.
            // If line contains '},', it's ending an item.

            // We want to inject properties before the closing brace of an item.
            if (braceBalance === 2 && (line.trim().startsWith('}') || line.trim().startsWith('},'))) {
                // We are closing an item like `heading: { ... }`
                // Check what we have collected for this item in previous lines? 
                // Actually relying on lines buffer is hard.
                // Let's just blindly inject missing keys if they aren't there?
                // No, that duplicates.

                // Alternative: Just Rewrite the whole item block? No, we lose existing values.
            }

            if (braceBalance === 0) {
                inTypography = false;
            }
        }
        newLines.push(line);
    }

    // Regex replacement Approach (Surgeon)
    // Find: (key): \{([^}]+)\} inside typography
    // This is too brittle.

    // APPROACH 2: Eval -> Modify Object -> Stringify -> Write?
    // We lose comments and formatting. User hates that? They didn't say, but code quality matters.

    // APPROACH 3: Targeted Line Injection
    // We look for lines containing `weight:` or `size:` which strongly mimics a typo object.
    // If we find `weight:`, we check if `slant:` follows. If not, add it.

    let modified = content;

    // Inject Slant
    // Look for `weight: <val>,` and append `slant: 0,` if missing
    modified = modified.replace(/(weight:\s*\d+,?)([\s\S]*?)(?=})/g, (match, weightPart, rest) => {
        if (!rest.includes('slant:')) {
            return `${weightPart}\n            slant: 0,${rest}`;
        }
        return match;
    });

    // Inject Width
    modified = modified.replace(/(weight:\s*\d+,?)([\s\S]*?)(?=})/g, (match, weightPart, rest) => {
        if (!rest.includes('width:')) {
            return `${weightPart}\n            width: 100,${rest}`;
        }
        return match;
    });

    // Inject Letter Spacing
    modified = modified.replace(/(weight:\s*\d+,?)([\s\S]*?)(?=})/g, (match, weightPart, rest) => {
        if (!rest.includes('letter_spacing:') && !rest.includes('tracking:')) {
            return `${weightPart}\n            letter_spacing: '0px',${rest}`;
        }
        return match;
    });

    // Inject Animation
    modified = modified.replace(/(weight:\s*\d+)(,?)([\s\S]*?)(?=})/g, (match, weightPart, comma, rest) => {
        // Avoid double injection or if matches `axes` block (like in cta_button)
        // cta_button has axes: { wdth, slnt }. We should probably deprecate axes object and flatten, 
        // OR update refine_catalog to look inside axes?
        // User said "Eveywhere there is typography".
        // Flattening is safer for the contract.

        if (!rest.includes('animation:')) {
            const separator = comma ? comma : ',';
            return `${weightPart}${separator}\n            animation: {\n                animation_mode: 'OFF',\n                animation_style: 'BREATHE_IN'\n            },${rest}`;
        }
        return match;
    });

    // FALLBACK: If no 'weight' found, anchor on 'size'
    // This handles atoms like rich_text_block that lacked weight.
    // We inject weight, width, slant, spacing, animation after size.
    modified = modified.replace(/(size:\s*['"][^'"]+['"])(,?)([\s\S]*?)(?=})/g, (match, sizePart, comma, rest) => {
        let insertion = '';
        if (!rest.includes('weight') && !content.includes('weight:')) insertion += `\n            weight: 400,`;
        if (!rest.includes('slant')) insertion += `\n            slant: 0,`;
        if (!rest.includes('width')) insertion += `\n            width: 100,`;
        if (!rest.includes('letter_spacing') && !rest.includes('tracking')) insertion += `\n            letter_spacing: '0px',`;
        if (!rest.includes('animation:')) insertion += `\n            animation: {\n                animation_mode: 'OFF',\n                animation_style: 'BREATHE_IN'\n            },`;

        if (insertion) {
            return `${sizePart}${insertion}${rest}`;
        }
        return match;
    });

    // Cleanup CTA Button specific "axes" object if we flattened it? 
    // The above usage appends slant/width/spacing/animation to the parent object.
    // CTA button currently has `axes: { ... }`.
    // If we add `slant: 0` to parent, we might have duplicates or conflict.
    // Ideally we remove `axes` object.
    // Let's do a targeted lookup for `axes: { ... }` and remove it.
    modified = modified.replace(/axes:\s*{[^}]+},?/g, '');

    return modified;
}

async function upgrade() {
    console.log('Upgrading schemas...');
    const atomDirs = fs.readdirSync(ATOMS_DIR);

    for (const atomId of atomDirs) {
        if (atomId.startsWith('.')) continue;

        const schemaPath = path.join(ATOMS_DIR, atomId, 'exposed_tokens/schema.ts');
        if (fs.existsSync(schemaPath)) {
            try {
                const oldContent = fs.readFileSync(schemaPath, 'utf8');
                const newContent = processSchema(schemaPath);

                if (oldContent !== newContent) {
                    fs.writeFileSync(schemaPath, newContent);
                    console.log(`Upgraded ${atomId}`);
                } else {
                    console.log(`Skipped ${atomId} (no changes needed)`);
                }
            } catch (e) {
                console.error(`Error upgrading ${atomId}:`, e.message);
            }
        }
    }
}

upgrade();
