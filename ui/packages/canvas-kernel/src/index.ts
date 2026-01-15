import { CanvasState, applyOp, initialState } from './reducer'; // Fixed import to './reducer'
import { CanvasOp } from '@northstar/contracts';

export * from './reducer';

export class CanvasKernel {
    private committedState: CanvasState;
    private optimisticState: CanvasState;
    private pendingOps: CanvasOp[] = [];
    private listeners: Set<(state: CanvasState) => void> = new Set();
    prev_state?: CanvasState; // For undo/rebase

    constructor(initial?: CanvasState) {
        this.committedState = initial || initialState;
        this.optimisticState = this.committedState;
    }

    getSnapshot(): CanvasState {
        return this.optimisticState;
    }

    getPendingOpsCount(): number {
        return this.pendingOps.length;
    }

    // --- Local / Optimistic Operations ---

    applyLocal(op: CanvasOp) {
        this.pendingOps.push(op);
        this.optimisticState = applyOp(this.optimisticState, op);
        this.notify();
    }

    // --- Remote / Committed Operations ---

    applyRemote(ops: CanvasOp[], rev: number, recoveryOps?: CanvasOp[]) {
        let nextCommitted = this.committedState;

        if (recoveryOps) {
            recoveryOps.forEach(op => {
                nextCommitted = applyOp(nextCommitted, op);
            });
        }

        ops.forEach(op => {
            nextCommitted = applyOp(nextCommitted, op);
        });

        nextCommitted.revision = rev;
        this.committedState = nextCommitted;

        this.rebase();
    }

    ackLocal(count: number) {
        if (count > 0) {
            this.pendingOps.splice(0, count);
            // We don't necessarily need to re-calc optimistic state if we just acked what was already there,
            // BUT if the server transformed it, applyRemote would have handled it.
            // If we strictly just remove pending, optimistic state is effectively unchanged 
            // because committed state advanced exactly by these ops (assuming no transform).
            // However, usually `applyRemote` triggers the rebase.
        }
    }

    private rebase() {
        let nextOptimistic = this.committedState;
        const validPending: CanvasOp[] = [];

        this.pendingOps.forEach(op => {
            try {
                nextOptimistic = applyOp(nextOptimistic, op);
                validPending.push(op);
            } catch (e) {
                console.warn("Dropped op during rebase", op);
            }
        });

        this.pendingOps = validPending;
        this.optimisticState = nextOptimistic;

        this.notify();
    }

    // Basic subscription for UI to re-render
    subscribe(fn: (state: CanvasState) => void): () => void {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    private notify() {
        this.listeners.forEach(fn => fn(this.optimisticState));
    }
}
