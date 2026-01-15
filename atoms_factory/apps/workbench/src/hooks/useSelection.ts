import { create } from 'zustand';

interface SelectionState {
    selectedElementId: string | null;
    selectElement: (id: string | null) => void;
}

export const useSelection = create<SelectionState>((set) => ({
    selectedElementId: null,
    selectElement: (id) => set({ selectedElementId: id }),
}));
