export type ChatMode = 'nano' | 'micro' | 'standard' | 'full';

export type StreamingState = 'idle' | 'thinking' | 'streaming';

export interface ChatMessage {
    id: string;
    role: 'agent' | 'human';
    content: string;
    timestamp?: string;
}

export type ChatAction = 'strategy-lock' | 'save' | '3-wise' | 'remind' | 'undo' | 'todo';
