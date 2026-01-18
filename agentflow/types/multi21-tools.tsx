export interface ToolOption {
    id: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    isDefault?: boolean;
}

export type ToolType = 'simple' | 'withOptions';

export interface ToolConfig {
    id: string;
    type: ToolType;
    icon: React.ReactNode;
    label?: string;
    options?: ToolOption[]; // Only if type === 'withOptions'
}

// Example config scaffold for previewMode to ease future wiring.
export const previewModeTool: ToolConfig = {
    id: 'previewMode',
    type: 'withOptions',
    icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
    ),
    label: 'Preview',
    options: [
        { id: 'desktop', label: 'Desktop', isDefault: true },
        { id: 'mobile', label: 'Mobile' },
    ],
};
