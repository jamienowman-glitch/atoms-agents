
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_JSON = path.resolve(__dirname, '../docs/TOKEN_CATALOG.json');
const CATALOG_TSV = path.resolve(__dirname, '../docs/TOKEN_CATALOG.tsv');

// Metadata Rules
const RULES = [
    // 1. Color
    { keys: ['color', 'background', 'bg', 'border_color', 'fill', 'stroke'], kind: 'color' },

    // 2. Selects / Enums
    // Animation Enums (Must be before 'style' to avoid partial match)
    { keys: ['animation_mode'], kind: 'dropdown', options: ['ON_SCROLL', 'OFF'] },
    { keys: ['animation_style'], kind: 'dropdown', options: ['BREATHE_IN', 'BREATHE_OUT', 'LEAN_BACK'] },

    { keys: ['align', 'justify', 'text_align'], kind: 'dropdown', options: ['left', 'center', 'right', 'justify', 'start', 'end'] },
    { keys: ['display'], kind: 'dropdown', options: ['block', 'flex', 'inline-block', 'none', 'grid', 'inline-flex'] },
    { keys: ['position'], kind: 'dropdown', options: ['relative', 'absolute', 'fixed', 'sticky'] },
    // Removed weight from dropdown to enforce slider
    { keys: ['style', 'font_style'], kind: 'dropdown', options: ['normal', 'italic'] },
    { keys: ['text_decoration'], kind: 'dropdown', options: ['none', 'underline', 'line-through'] },
    { keys: ['family', 'font_family'], kind: 'dropdown', options: ['roboto_flex', 'serif', 'sans-serif', 'monospace'] },
    // New Enums for user feedback
    { keys: ['role'], kind: 'dropdown', options: ['button', 'article', 'banner', 'navigation', 'main', 'complementary', 'region', 'img', 'none'] },
    { keys: ['status'], kind: 'dropdown', options: ['ENABLED', 'DISABLED', 'NA'] },
    { keys: ['analytics_event_name'], kind: 'text' }, // Locking this down? User said "needs to be fixed". Text is probably fine but maybe they implied uneditable? Keeping text for now, assuming "fixed" meant "standardized interaction".
    // 3. Sliders
    { keys: ['opacity'], kind: 'slider', min: 0, max: 1, step: 0.1 },
    { keys: ['slnt', 'slant'], kind: 'slider', min: -10, max: 0, step: 1 },
    { keys: ['slnt', 'slant'], kind: 'slider', min: -10, max: 0, step: 1 },
    // Specific width rule for typography (Variable Font)
    { keys: ['width'], section: 'typography', kind: 'slider', min: 25, max: 151, step: 1 },
    { keys: ['wdth'], kind: 'slider', min: 25, max: 151, step: 1 },
    { keys: ['wght', 'weight', 'font_weight'], kind: 'slider', min: 100, max: 900, step: 10 },
    { keys: ['letter_spacing', 'tracking'], kind: 'slider', min: -100, max: 250, step: 1 },
    // Typography size as slider? "MUST BE BOTH SLIDERS OR EDITABLE NUMBERS"
    // Size usually has units (px). We need a smart dimension controller.

    // 4. Dimensions (Steppers)
    { keys: ['size', 'width', 'height', 'top', 'bottom', 'left', 'right', 'margin', 'padding', 'gap', 'radius', 'border_width'], kind: 'dimension' },

    // 5. Numeric Steppers
    { keys: ['tab_index', 'order', 'flex_grow', 'flex_shrink'], kind: 'stepper' }
];

async function refine() {
    if (!fs.existsSync(CATALOG_JSON)) {
        console.error('Catalog not found');
        return;
    }

    const catalog = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
    let updates = 0;

    catalog.forEach(token => {
        const lastPart = token.token_key.split('.').pop().toLowerCase();

        // Find matching rule
        const rule = RULES.find(r => {
            const keyMatch = r.keys.some(k => lastPart.includes(k));
            if (!keyMatch) return false;
            // Optional section filter
            if (r.section && token.section !== r.section) return false;
            return true;
        });

        if (rule) {
            token.controller_kind = rule.kind;
            token.controller_config = {};

            if (rule.options) token.controller_config.options = rule.options;
            if (rule.min !== undefined) token.controller_config.min = rule.min;
            if (rule.max !== undefined) token.controller_config.max = rule.max;
            if (rule.step !== undefined) token.controller_config.step = rule.step;

            updates++;
        }
    });

    fs.writeFileSync(CATALOG_JSON, JSON.stringify(catalog, null, 2));

    // Re-generate TSV
    const headers = Object.keys(catalog[0] || {});
    // ensure specific order: section first
    const orderedHeaders = ['section', 'token_key', 'token_type', 'controller_kind', 'controller_config', 'notes', 'status', 'option_source', 'missing_siblings', 'animation_spec'];

    const rows = catalog.map(item => {
        return orderedHeaders.map(h => {
            let val = item[h];
            if (typeof val === 'object') val = JSON.stringify(val);
            return val !== undefined ? String(val) : '';
        }).join('\t');
    });

    fs.writeFileSync(CATALOG_TSV, orderedHeaders.join('\t') + '\n' + rows.join('\n'));
    console.log(`Refined ${updates} tokens based on heuristics.`);
}

refine();
