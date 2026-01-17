import { AtelierManifest } from '../types/atelier';
import fs from 'fs';
import path from 'path';

// Helper to post data
async function postManifests(manifests: AtelierManifest[]) {
    try {
        const response = await fetch('http://localhost:8000/v1/registries/atelier/harvest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(manifests)
        });
        if (response.ok) {
            console.log(`Successfully harvested ${manifests.length} manifests.`);
        } else {
            console.error('Failed to harvest:', await response.text());
        }
    } catch (error) {
        console.error('Error connecting to backend:', error);
    }
}

// 1. Scan Canvases
function scanCanvases(): AtelierManifest[] {
    const canvasesDir = path.join(process.cwd(), 'components/canvases');
    if (!fs.existsSync(canvasesDir)) return [];

    const dirs = fs.readdirSync(canvasesDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    const manifests: AtelierManifest[] = [];

    // Map known canvases based on directory presence
    if (dirs.includes('VideoCanvas')) {
        manifests.push({
            id: 'video_canvas',
            name: 'Video Editor',
            type: 'canvas',
            description: 'Professional video editing timeline',
            capabilities: ['timeline_scrub', 'layer_composite'],
            acceptedTokens: ['video_clip', 'timeline_cursor']
        });
    }
    if (dirs.includes('PageCanvas')) {
        manifests.push({
            id: 'page_canvas',
            name: 'Page Designer',
            type: 'canvas',
            description: 'Grid-based page layout editor',
            capabilities: ['grid_layout', 'text_flow'],
            acceptedTokens: ['layout_block', 'css_class']
        });
    }

    return manifests;
}

// 2. Scan Atoms (Multi21)
function scanAtoms(): AtelierManifest[] {
    const multi21Dir = path.join(process.cwd(), 'components/multi21');
    if (!fs.existsSync(multi21Dir)) return [];

    const files = fs.readdirSync(multi21Dir)
        .filter(f => f.endsWith('.tsx'));

    const manifests: AtelierManifest[] = [];

    // Heuristics for finding Atoms
    files.forEach(file => {
        if (file === 'ConnectedBlock.tsx') {
            manifests.push({
                id: 'atom_vector', // Mapping VectorBlock/ConnectedBlock
                name: 'Vector Block',
                type: 'atom',
                description: 'Draggable vector element',
                capabilities: ['drag_drop', 'connection'],
                acceptedTokens: ['vector_path', 'color']
            });
        }
        if (file === 'Multi21_Text.tsx') {
            manifests.push({
                id: 'atom_text',
                name: 'Text Block',
                type: 'atom',
                description: 'Rich text editing block',
                capabilities: ['text_format'],
                acceptedTokens: ['font_family', 'color']
            });
        }
    });

    return manifests;
}

// 3. Scan Tokens
function scanTokens(): AtelierManifest[] {
    // Placeholder: Mock scanning lib/tokens
    // In reality, we'd read keys from the file.
    const manifests: AtelierManifest[] = [];
    manifests.push({
        id: 'token_set_core',
        name: 'Core Tokens',
        type: 'token_set',
        description: 'Global design system tokens',
        capabilities: [],
        acceptedTokens: []
    });
    return manifests;
}

async function run() {
    console.log('Starting Atelier Harvest...');

    const canvases = scanCanvases();
    console.log(`Found ${canvases.length} canvases.`);

    const atoms = scanAtoms();
    console.log(`Found ${atoms.length} atoms.`);

    const tokens = scanTokens();

    const all = [...canvases, ...atoms, ...tokens];
    await postManifests(all);
}

run();
