import { createContext, useContext } from 'react';

export interface CanvasActions {
    onForward: (nodeId: string, payload?: any) => void;
}

export const CanvasActionContext = createContext<CanvasActions | undefined>(undefined);

export const useCanvasActions = () => {
    const ctx = useContext(CanvasActionContext);
    if (!ctx) throw new Error('useCanvasActions must be used within CanvasActionContext');
    return ctx;
};
