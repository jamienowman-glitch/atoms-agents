
const API_BASE = import.meta.env.VITE_ENGINES_URI || `http://${window.location.hostname}:3001/api`;

export interface TokenCatalogItem {
    token_key: string;
    section: string;
    token_type: string;
    controller_kind: string;
    controller_config?: any;
    option_source?: string;
    missing_siblings?: string[];
    notes?: string;
    status?: string;
    animation_spec?: AnimationSpec;
    value?: any;
    element_id?: string;
}

export interface AnimationSpec {
    enabled: boolean;
    trigger: 'hover' | 'scroll';
    start_value?: string | number;
    end_value?: string | number;
    duration_ms: number;
    easing: string;
    scope: 'element' | 'component' | 'page';
    notes?: string;
}

export const TokenApi = {
    async getCatalog(canvasId: string, elementId?: string): Promise<TokenCatalogItem[]> {
        try {
            const query = elementId ? `?element_id=${encodeURIComponent(elementId)}` : '';
            const res = await fetch(`${API_BASE}/canvas/${canvasId}/token_catalog${query}`);
            if (!res.ok) throw new Error('Failed to fetch catalog');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    async setToken(canvasId: string, baseRev: number, elementId: string, tokenPath: string, value: any) {
        return CanvasApi.sendCommand(canvasId, {
            id: crypto.randomUUID(),
            type: 'set_token',
            canvas_id: canvasId,
            base_rev: baseRev,
            idempotency_key: crypto.randomUUID(),
            args: {
                element_id: elementId,
                token_path: tokenPath,
                value: value
            }
        });
    },

    async saveCatalog(catalog: TokenCatalogItem[]): Promise<boolean> {
        // Deprecated
        return false;
    }
};

export const CanvasApi = {
    async getSnapshot(canvasId: string) {
        const res = await fetch(`${API_BASE}/canvas/${canvasId}/snapshot`);
        if (!res.ok) throw new Error(`Failed to get snapshot for ${canvasId}`);
        return await res.json();
    },

    async sendCommand(canvasId: string, command: any) {
        const res = await fetch(`${API_BASE}/canvas/${canvasId}/commands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(command)
        });
        if (res.status === 409) {
            throw new Error('Conflict');
        }
        if (!res.ok) throw new Error(`Command failed: ${res.statusText}`);
        return await res.json();
    },

    getSSEUrl(canvasId: string) {
        return `${API_BASE.replace('/api', '')}/sse/canvas/${canvasId}`;
    }
};
