import { CanvasTransport } from '../transport';

export interface RegistryEntry {
    id: string;
    namespace: string;
    key: string;
    name: string;
    summary?: string;
    config: Record<string, any>;
    maturity?: string;
    tenant_id?: string;
}

export interface McpTool {
    name: string;
    description?: string;
    inputSchema: Record<string, any>;
}

export class RegistryClient {
    private transport: CanvasTransport;

    constructor(transport: CanvasTransport) {
        this.transport = transport;
    }

    private get baseUrl() {
        // Access private config or provide public getter in transport
        // For now, casting to any to access config.httpHost
        // Ideal: Transport should expose request() method
        return (this.transport as any).config.httpHost;
    }

    private async fetchJson(path: string, options?: RequestInit) {
        const url = `${this.baseUrl}${path}`;
        const headers = (this.transport as any).getHeaders({
            'Content-Type': 'application/json'
        });

        const res = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options?.headers
            }
        });

        if (!res.ok) {
            throw new Error(`RegistryClient Error ${res.status}: ${res.statusText}`);
        }
        return await res.json();
    }

    async getMuscles(): Promise<RegistryEntry[]> {
        return this.fetchJson('/registries/entries?namespace=muscles');
    }

    async getSurfaces(): Promise<RegistryEntry[]> {
        return this.fetchJson('/registries/entries?namespace=surfaces');
    }

    async getCanvases(): Promise<RegistryEntry[]> {
        return this.fetchJson('/registries/entries?namespace=canvases');
    }

    async getConnectors(): Promise<RegistryEntry[]> {
        return this.fetchJson('/registries/entries?namespace=connectors');
    }

    async getAtoms(): Promise<RegistryEntry[]> {
        return this.fetchJson('/registries/entries?namespace=atoms');
    }

    async listMcpTools(): Promise<McpTool[]> {
        const res = await this.fetchJson('/tools/list', { method: 'POST' });
        // The API returns { tools: [...] }
        // Each tool has scopes. We flatten for the Editor? 
        // Or return raw tools? 
        // Tech Spec said we want schemas.
        // Let's return raw for now.
        return res.tools || [];
    }
}
