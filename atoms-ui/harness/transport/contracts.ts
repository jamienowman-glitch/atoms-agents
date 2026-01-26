export type AtomId = string;
export type CanvasId = string;
export type ActorId = string;
export type Revision = number;

// --- Atoms & Tokens ---

export type PrimitiveValue = string | number | boolean | null;

export interface TokenValue {
    type: 'static' | 'bound';
    value: PrimitiveValue;
    fallback?: PrimitiveValue;
    meta?: Record<string, unknown>; // tracking, schema, etc.
}

export interface Atom {
    id: AtomId;
    type: string; // e.g., 'text', 'box', 'image'
    parent_id: AtomId | null; // null for root atoms
    properties: Record<string, TokenValue | PrimitiveValue>;
    children?: AtomId[]; // Ordered list of child IDs
}

// --- Operations (Mutations) ---

export type OpType = 'add' | 'remove' | 'update' | 'move';

export interface BaseOp {
    kind: OpType;
    actor_id: ActorId;
}

export interface AddOp extends BaseOp {
    kind: 'add';
    atom: Atom;
    parent_id: AtomId | null; // Where to add
    index: number; // Insert position
}

export interface RemoveOp extends BaseOp {
    kind: 'remove';
    atom_id: AtomId;
}

export interface UpdateOp extends BaseOp {
    kind: 'update';
    atom_id: AtomId;
    properties: Record<string, TokenValue | PrimitiveValue>; // Partial update
}

export interface MoveOp extends BaseOp {
    kind: 'move';
    atom_id: AtomId;
    new_parent_id: AtomId | null;
    new_index: number;
}

export type CanvasOp = AddOp | RemoveOp | UpdateOp | MoveOp;

// --- Commands (Transport) ---

export interface Command {
    base_rev: Revision;
    ops: CanvasOp[];
    actor_id: ActorId;
    correlation_id: string; // For idempotency & optimistic updates

    // Generic Extensions for Tool Control
    type?: string;
    command?: string;
    payload?: any;
    context?: any;
}

export interface CommandResponse {
    success: boolean;
    head_rev: Revision;
    applied_ops?: CanvasOp[];
    error?: {
        code: string;
        message: string;
        expected_rev?: Revision;
        recovery_ops?: CanvasOp[]; // For conflict resolution
    };
}

// --- Realtime / Stream Events ---

export type GestureKind = 'caret' | 'drag' | 'cursor';

export interface GesturePayload {
    kind: GestureKind;
    atom_id?: AtomId; // For selection/caret
    position?: { x: number; y: number }; // For cursors/drags
    meta?: unknown;
    // Generic
    type?: string;
    x?: number;
    y?: number;
    focus_id?: string;
}

export interface GestureEvent {
    type: 'gesture';
    data: {
        kind?: GestureKind; // Optional flexibility
        payload?: GesturePayload;
        actor_id?: ActorId;
        // Flattened structure support
        type?: string;
        x?: number;
        y?: number;
        focus_id?: string;
    };
}

export interface OpCommittedEvent {
    type: 'op_committed';
    data: {
        rev: Revision;
        ops: CanvasOp[];
        actor_id: ActorId;
    };
}

export interface SystemEvent {
    type: 'system';
    data: {
        code: string;
        message: string;
    };
}

export interface SafetyDecisionEvent {
    type: 'safety_decision';
    data: {
        action: string;
        result: 'PASS' | 'BLOCK';
        reason: string;
        gate: string;
        [key: string]: unknown;
    };
    routing?: {
        canvas_id?: string;
        thread_id?: string;
        [key: string]: unknown;
    };
    ids?: {
        run_id?: string;
        [key: string]: unknown;
    };
    meta?: {
        [key: string]: unknown;
    };
}

export interface MediaSidecar {
    uri?: string;
    object_id?: string;
    artifact_id?: string;
    mime_type?: string;
    size_bytes?: number;
    checksum?: string;
    metadata?: Record<string, unknown>;
}

export interface MediaPayload {
    sidecars: MediaSidecar[];
    caption?: string;
}

export interface StreamEnvelopeBase {
    type: string;
    atom_metadata?: Record<string, unknown>;
    media_payload?: MediaPayload;
    [key: string]: unknown;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export type StreamEvent =
    | (GestureEvent & StreamEnvelopeBase)
    | (OpCommittedEvent & StreamEnvelopeBase)
    | (SystemEvent & StreamEnvelopeBase)
    | (SafetyDecisionEvent & StreamEnvelopeBase);
