import { Atom, AtomId, CanvasOp } from '@/lib/gate3/contracts';

export interface CanvasState {
    atoms: Record<AtomId, Atom>;
    rootAtomIds: AtomId[];
    revision: number;
}

export const initialState: CanvasState = {
    atoms: {},
    rootAtomIds: [],
    revision: 0,
};

// --- Low-level helpers ---

function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

function removeChild(state: CanvasState, parentId: AtomId | null, childId: AtomId) {
    if (!parentId) {
        const idx = state.rootAtomIds.indexOf(childId);
        if (idx > -1) state.rootAtomIds.splice(idx, 1);
    } else {
        const parent = state.atoms[parentId];
        if (parent && parent.children) {
            const idx = parent.children.indexOf(childId);
            if (idx > -1) parent.children.splice(idx, 1);
        }
    }
}

function insertChild(state: CanvasState, parentId: AtomId | null, childId: AtomId, index: number) {
    if (!parentId) {
        state.rootAtomIds.splice(index, 0, childId);
    } else {
        const parent = state.atoms[parentId];
        if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.splice(index, 0, childId);
        }
    }
}

// --- Reducer ---

export function applyOp(state: CanvasState, op: CanvasOp): CanvasState {
    const next = clone(state);

    switch (op.kind) {
        case 'add': {
            next.atoms[op.atom.id] = op.atom;
            insertChild(next, op.parent_id, op.atom.id, op.index);
            break;
        }
        case 'remove': {
            // NOTE: This assumes we want to leave orphaned children or delete them?
            // For now, let's just unlink. Real impl might need recursive delete.
            removeChild(next, state.atoms[op.atom_id]?.parent_id ?? null, op.atom_id);
            delete next.atoms[op.atom_id];
            break;
        }
        case 'update': {
            const atom = next.atoms[op.atom_id];
            if (atom) {
                atom.properties = { ...atom.properties, ...op.properties };
            }
            break;
        }
        case 'move': {
            // 1. Find current parent
            const atom = next.atoms[op.atom_id];
            if (!atom) break;
            const oldParentId = atom.parent_id;

            // 2. Remove from old location
            removeChild(next, oldParentId, op.atom_id);

            // 3. Update parent ptr
            atom.parent_id = op.new_parent_id;

            // 4. Insert into new location
            insertChild(next, op.new_parent_id, op.atom_id, op.new_index);
            break;
        }
    }

    next.revision += 1;
    return next;
}
