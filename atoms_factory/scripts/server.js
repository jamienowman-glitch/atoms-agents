
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Path to the canonical token catalog
const CATALOG_PATH = path.resolve(__dirname, '../docs/TOKEN_CATALOG.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure docs directory exists
const docsDir = path.dirname(CATALOG_PATH);
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// GET /api/tokens
app.get('/api/tokens', (req, res) => {
    if (fs.existsSync(CATALOG_PATH)) {
        try {
            const data = fs.readFileSync(CATALOG_PATH, 'utf-8');
            res.json(JSON.parse(data));
        } catch (err) {
            console.error('Error reading catalog:', err);
            res.status(500).json({ error: 'Failed to read catalog' });
        }
    } else {
        // Return empty array if no catalog exists yet
        res.json([]);
    }
});

// POST /api/tokens
app.post('/api/tokens', (req, res) => {
    try {
        const catalog = req.body;
        // Basic validation
        if (!Array.isArray(catalog)) {
            return res.status(400).json({ error: 'Catalog must be an array' });
        }
        
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
        console.log(`Saved catalog to ${CATALOG_PATH}`);
        
        // Also save TSV for deliverables
        const tsvPath = CATALOG_PATH.replace('.json', '.tsv');
        saveTsv(catalog, tsvPath);
        
        res.json({ success: true, count: catalog.length });
    } catch (err) {
        console.error('Error writing catalog:', err);
        res.status(500).json({ error: 'Failed to save catalog' });
    }
});

function saveTsv(catalog, filePath) {
    try {
        const headers = [
            'section', 'token_key', 'token_type', 'controller_kind', 
            'controller_config', 'option_source', 'missing_siblings', 
            'animation_enabled', 'animation_trigger', 'notes'
        ];
        
        const rows = catalog.map(item => {
            return headers.map(h => {
                const val = item[h];
                if (typeof val === 'object') return JSON.stringify(val);
                return val !== undefined ? String(val) : '';
            }).join('\t');
        });
        
        const tsvContent = headers.join('\t') + '\n' + rows.join('\n');
        fs.writeFileSync(filePath, tsvContent);
        console.log(`Saved TSV to ${filePath}`);
    } catch (e) {
        console.error("Failed to save TSV", e);
    }
}

app.listen(PORT, () => {
    console.log(`Token Workbench Server running on http://localhost:${PORT}`);
    console.log(`Storage path: ${CATALOG_PATH}`);
});
