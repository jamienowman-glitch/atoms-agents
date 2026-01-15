
export interface ToolDef {
    id: string;
    icon: 'scales' | 'night' | 'alarm' | 'todo' | 'padlock' | 'forward';
    label: string;
    action: 'open_drawer' | 'toggle_state' | 'run_command';
    payload?: any;
}

export interface AtomManifest {
    kind: string;
    label: string;
    description?: string;
    tokens: Record<string, {
        type: 'string' | 'number' | 'boolean' | 'enum' | 'color' | 'text';
        options?: string[];
        default?: any;
    }>;
}

export interface CatalogResponse {
    tools: ToolDef[];
    insertables: {
        id: string;
        kind: string;
        label: string;
        icon?: string;
    }[];
    manifests: Record<string, AtomManifest>;
    context?: {
        surface: string;
        viewport: string;
    };
}

export class CatalogClient {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    async fetchCatalog(context: { surface: string; viewport: string; atomKind?: string | null }): Promise<CatalogResponse> {
        try {
            const url = new URL(`${this.baseUrl}/ui/catalog`, window.location.origin);
            url.searchParams.set('surface', context.surface);
            url.searchParams.set('viewport', context.viewport);
            if (context.atomKind) {
                url.searchParams.set('context', context.atomKind);
            }

            const res = await fetch(url.toString());
            if (!res.ok) {
                console.warn(`[CatalogClient] Failed to fetch catalog, using mock data. Status: ${res.status}`);
                return this.getMockCatalog(context);
            }
            return await res.json();
        } catch (e) {
            console.warn("[CatalogClient] Fetch error, using mock data", e);
            return this.getMockCatalog(context);
        }
    }

    // --- Mock Data (Contract Implementation) ---

    private getMockCatalog(context: { surface: string; viewport: string; atomKind?: string | null }): CatalogResponse {
        return {
            tools: [
                { id: 'tool-scales', icon: 'scales', label: 'Balanced AI', action: 'open_drawer' },
                { id: 'tool-night', icon: 'night', label: 'Scratchpad', action: 'toggle_state' },
                { id: 'tool-alarm', icon: 'alarm', label: 'Schedule', action: 'open_drawer' },
                { id: 'tool-todo', icon: 'todo', label: 'Tasks', action: 'open_drawer' },
                { id: 'tool-padlock', icon: 'padlock', label: 'Lock', action: 'toggle_state' },
                { id: 'tool-forward', icon: 'forward', label: 'Share', action: 'run_command' }
            ],
            insertables: [
                { id: 'ins-text', kind: 'text-block', label: 'Text Block' },
                { id: 'ins-button', kind: 'button-block', label: 'Button' },
                { id: 'ins-media', kind: 'media-block', label: 'Media' },
                { id: 'ins-guides', kind: 'guides-block', label: 'Guides' },
                { id: 'ins-vector', kind: 'vector-block', label: 'Vector Art' }
            ],
            manifests: {
                'text-block': {
                    kind: 'text-block',
                    label: 'Text',
                    tokens: {
                        'content.text': { type: 'text', default: 'New text block' },
                        'style.typography': { type: 'enum', options: ['h1', 'h2', 'h3', 'body'], default: 'body' }
                    }
                },
                'button-block': {
                    kind: 'button-block',
                    label: 'Button',
                    tokens: {
                        'content.label': { type: 'string', default: 'Click Me' },
                        'action.href': { type: 'string', default: '#' },
                        'style.variant': { type: 'enum', options: ['primary', 'secondary', 'outline'], default: 'primary' }
                    }
                },
                'media-block': {
                    kind: 'media-block',
                    label: 'Media',
                    tokens: {
                        'src': { type: 'string', default: '' },
                        'filters.brightness': { type: 'number', default: 100 },
                        'playback.autoplay': { type: 'boolean', default: false }
                    }
                },
                'guides-block': {
                    kind: 'guides-block',
                    label: 'Guides',
                    tokens: {
                        'layout.mode': { type: 'enum', options: ['faq', 'profile', 'howto'], default: 'faq' }
                    }
                },
                'vector-block': {
                    kind: 'vector-block',
                    label: 'Vector',
                    tokens: {
                        'path.d': { type: 'text', default: '' },
                        'style.strokeWidth': { type: 'number', default: 2 }
                    }
                }
            }
        };
    }
}
