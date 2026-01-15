import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    IconPadlock, IconScales, IconNight, IconAlarm, IconTodo, IconForward,
    IconMiniAgent, IconSend, IconChevronUp, IconChevronDown
} from './icons';
import '../../ui_kit/button.css';
import './ChatRail.css';
import { CatalogResponse } from '@northstar/agent-driver';
import { Toolpop } from '../Toolpop/Toolpop';

type RailMode = 'full' | 'half' | 'micro' | 'nano';

interface Message {
    id: string;
    role: 'human' | 'agent';
    text: string;
    timestamp: number;
    isNew?: boolean;
}

interface ChatRailProps {
    catalog: CatalogResponse | null;
    selectedAtomKind: string | null;
    onUpdateToken: (token: string, value: any) => void;
}

const MODES: RailMode[] = ['nano', 'micro', 'half', 'full'];

export const ChatRail: React.FC<ChatRailProps> = ({ catalog, selectedAtomKind, onUpdateToken }) => {
    const [mode, setMode] = useState<RailMode>('half');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'agent', text: 'Hello! I am your AI assistant. How can I help you today?', timestamp: Date.now() }
    ]);
    const [inputText, setInputText] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    // Tool Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [previousMode, setPreviousMode] = useState<RailMode>('half');

    // Auto-scroll to bottom
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, mode]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const updatedMessages: Message[] = [
            ...messages.map(m => ({ ...m, isNew: false })),
            { id: Date.now().toString(), role: 'human', text: inputText, timestamp: Date.now(), isNew: true }
        ];

        setMessages(updatedMessages);
        setInputText('');

        // Stub agent reply
        setTimeout(() => {
            setMessages(prev => [
                ...prev.map(m => ({ ...m, isNew: false })),
                {
                    id: (Date.now() + 1).toString(),
                    role: 'agent',
                    text: 'This is a simulated response demonstrating the generic ChatRail component.',
                    timestamp: Date.now(),
                    isNew: true
                }
            ]);
        }, 600);
    };

    const cycleMode = (direction: 'up' | 'down') => {
        // If drawer is open, cycling mode closes it
        if (drawerOpen) {
            setDrawerOpen(false);
            setMode(previousMode);
            return;
        }

        const currentIndex = MODES.indexOf(mode);
        let nextIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;

        // Clamp
        if (nextIndex >= MODES.length) nextIndex = MODES.length - 1;
        if (nextIndex < 0) nextIndex = 0;

        setMode(MODES[nextIndex]);
    };

    const toggleDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
            setMode(previousMode);
        } else {
            setPreviousMode(mode);
            setMode('nano');
            setDrawerOpen(true);
        }
    };

    const getHeightVariant = (m: RailMode) => {
        switch (m) {
            case 'full': return { height: '90vh' };
            case 'half': return { height: '50vh' };
            case 'micro': return { height: '140px' }; // Composer + ~1 line
            case 'nano': return { height: '48px' }; // Just the status line
        }
    };

    return (
        <>
            {/* Tool Drawer - Docked above/behind rail when open */}
            {drawerOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '48px', // Stacked on top of Nano rail
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '600px',
                    background: '#111',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    color: '#fff',
                    zIndex: 9998, // Behind Rail z-index (9999) but conceptually "above" it in UI stack
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                    paddingBottom: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
                        <button onClick={toggleDrawer} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
                    </div>
                    <Toolpop catalog={catalog} selectedAtomKind={selectedAtomKind} onUpdateToken={onUpdateToken} />
                </div>
            )}

            <motion.div
                className={`ChatRail mode-${mode}`}
                initial={false}
                animate={getHeightVariant(mode)}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Controls */}
                {mode !== 'nano' && (
                    <div className="ChatRail-header">
                        <div className="ChatRail-controls">
                            {/* NEW: Tool Drawer Toggle in correct surface */}
                            <button className="sq-icon-btn" onClick={toggleDrawer} title="Open Tools">
                                <IconScales />
                            </button>
                            <div style={{ width: '1px', background: '#333', margin: '0 4px' }} />
                            <button className="sq-icon-btn" onClick={() => cycleMode('down')}>
                                <IconChevronDown />
                            </button>
                            <button className="sq-icon-btn" onClick={() => cycleMode('up')} disabled={mode === 'full'}>
                                <IconChevronUp />
                            </button>
                        </div>
                    </div>
                )}

                {/* Nano mode control override */}
                {mode === 'nano' && (
                    <div style={{ position: 'absolute', right: 8, top: 12, zIndex: 10, display: 'flex', gap: '8px' }}>
                        <button className="sq-icon-btn" onClick={toggleDrawer}>
                            <IconScales />
                        </button>
                        <button className="sq-icon-btn" onClick={() => cycleMode('up')}>
                            <IconChevronUp />
                        </button>
                    </div>
                )}

                <div className="ChatRail-body" ref={listRef}>
                    {mode === 'nano' ? (
                        <NanoMessage message={messages.filter(m => m.role === 'agent').pop()} />
                    ) : (
                        messages.map((msg, idx) => {
                            const indexFromBottom = messages.length - 1 - idx;
                            return (
                                <MessageRow
                                    key={msg.id}
                                    message={msg}
                                    indexFromBottom={indexFromBottom}
                                />
                            );
                        })
                    )}
                </div>

                {/* Composer - Hidden in Nano */}
                {mode !== 'nano' && (
                    <div className="ChatRail-composer">
                        <div className="ChatRail-input-wrapper">
                            <div style={{ opacity: 0.5, display: 'flex' }}><IconMiniAgent /></div>
                            <input
                                className="ChatRail-input"
                                placeholder="Message..."
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                        </div>
                        <button className="ChatRail-send-btn" onClick={handleSend}>
                            <IconSend />
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

const NanoMessage = ({ message }: { message?: Message }) => {
    if (!message) return null;
    return (
        <motion.div
            className="ChatRail-message-content agent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
            <span style={{ fontWeight: 600, marginRight: 8 }}>AI</span>
            {message.text}
        </motion.div>
    );
};

const interpolateWeight = (indexFromBottom: number) => {
    const t = Math.min(indexFromBottom, 5) / 5;
    return Math.round(900 - (700 * t));
};

const MessageRow = ({ message, indexFromBottom }: { message: Message; indexFromBottom: number }) => {
    const targetWeight = interpolateWeight(indexFromBottom);

    return (
        <div className="ChatRail-message-row">
            <motion.div
                className={`ChatRail-message-content ${message.role}`}
                animate={{
                    fontVariationSettings: `'wght' ${targetWeight}, 'wdth' 100`,
                    opacity: Math.max(0.4, 1 - (indexFromBottom * 0.1)),
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {message.text}
            </motion.div>

            {/* Agent Icons - Purely decorative/status now, REVERTED to minimal */}
            {message.role === 'agent' && (
                <div className="ChatRail-icons">
                    <IconWithState Icon={IconPadlock} />
                    {/* IconScales removed from here - it belongs in the drawer toggle only */}
                    <IconWithState Icon={IconNight} />
                    <IconWithState Icon={IconAlarm} />
                    <IconWithState Icon={IconTodo} />
                    <IconWithState Icon={IconForward} />
                </div>
            )}
        </div>
    );
}

const IconWithState = ({ Icon }: { Icon: any }) => {
    // Restored to minimal interaction (local toggle only if needed, or static)
    // User requested minimal look, likely removed 'sq-icon-btn' which adds padding/bg
    const [active, setActive] = useState(false);

    return (
        <div
            className="ChatRail-icon-btn"
            onClick={() => setActive(!active)}
        >
            {Icon === IconPadlock ? <IconPadlock locked={active} /> : <Icon />}
        </div>
    );
};
