import { NodeType } from './LensRegistry';

export type LensType = 'graph_lens' | 'canvas_lens' | 'log_lens';
export type CanvasType = 'video_canvas' | 'page_canvas' | 'recap_canvas' | 'config_canvas';

export const getCanvasTypeForNode = (nodeType: NodeType): CanvasType | null => {
    switch (nodeType) {
        case 'video_node':
            return 'video_canvas';
        case 'page_node':
        case 'agent_node':
            return 'page_canvas';
        // Future mappings
        // case 'recap_node': return 'recap_canvas';
        default:
            return null;
    }
};
