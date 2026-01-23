import { useState, useCallback } from 'react';

export interface GraphNode {
    id: string;
    position: { x: number, y: number };
    data: any;
    type: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
}

export interface AgentFlowFile {
    version: "0.1";
    meta: {
        name: string;
        created_at: string;
        updated_at: string;
    };
    graph: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}

export const useFlowPersistence = () => {
    const [lastLoaded, setLastLoaded] = useState<string | null>(null);

    const exportFlow = useCallback((
        name: string,
        nodes: GraphNode[],
        edges: GraphEdge[],
        viewport: { x: number, y: number, zoom: number }
    ) => {
        const flowFile: AgentFlowFile = {
            version: "0.1",
            meta: {
                name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            graph: {
                nodes,
                edges
            },
            viewport
        };

        const blob = new Blob([JSON.stringify(flowFile, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.agentflow`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    const importFlow = useCallback(async (file: File): Promise<AgentFlowFile> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    if (json.version !== "0.1") {
                        throw new Error("Unsupported version");
                    }
                    setLastLoaded(new Date().toISOString());
                    resolve(json);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        });
    }, []);

    return { exportFlow, importFlow, lastLoaded };
};
