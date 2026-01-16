import { NodeType } from '../lib/LensRegistry';

// Definition of standard surfaces (matching backend Enum)
enum ToolSurface {
    DESKTOP_RAIL = "desktop_rail",
    DESKTOP_PANEL = "desktop_panel",
    MOBILE_DOCK = "mobile_dock",
    MOBILE_DRAWER = "mobile_drawer",
    CONTEXT_LENS = "context_lens",
    DELIVERY_LENS = "delivery_lens",
    CANVAS_OVERLAY = "canvas_overlay"
}

// Token types (matching backend)
interface TokenDefinition {
    id: string;
    type: 'color' | 'float' | 'string';
    constraints: Record<string, any>;
}

interface UIAtom {
    id: string;
    surfaces: ToolSurface[];
    tokens: TokenDefinition[];
    connectors: Record<string, string>;
}

// Manual mapping of existing nodes to Atelier Standard
const knownAtoms: Partial<Record<NodeType, UIAtom>> = {
    'agent_node': {
        id: 'agent_node',
        surfaces: [ToolSurface.CANVAS_OVERLAY, ToolSurface.DESKTOP_PANEL],
        tokens: [
            { id: 'role_color', type: 'color', constraints: { required: true } }
        ],
        connectors: {
            'read': ToolSurface.CONTEXT_LENS,
            'write': ToolSurface.DELIVERY_LENS
        }
    },
    'video_node': {
        id: 'video_node',
        surfaces: [ToolSurface.CANVAS_OVERLAY],
        tokens: [
            { id: 'duration', type: 'float', constraints: { min: 0 } }
        ],
        connectors: {
            'read': ToolSurface.CONTEXT_LENS
        }
    },
    'page_node': {
        id: 'page_node',
        surfaces: [ToolSurface.CANVAS_OVERLAY, ToolSurface.DESKTOP_RAIL],
        tokens: [
            { id: 'slug', type: 'string', constraints: { format: 'slug' } }
        ],
        connectors: {}
    }
};

async function harvest() {
    const atoms = Object.values(knownAtoms);
    console.log(`Harvesting ${atoms.length} atoms...`);

    try {
        const response = await fetch('http://localhost:8000/v1/registry/harvest/atoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atoms)
        });

        if (response.ok) {
            console.log('Successfully harvested atoms!');
        } else {
            console.error('Failed to harvest atoms:', await response.text());
        }
    } catch (error) {
        console.error('Error connecting to backend:', error);
    }
}

harvest();
