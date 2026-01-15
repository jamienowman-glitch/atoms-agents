import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { CatalogResponse } from '@northstar/agent-driver';
import './Toolpill.css';

interface ToolpillProps {
    catalog: CatalogResponse | null;
    onInsert: (kind: string) => void;
}

export const Toolpill: React.FC<ToolpillProps> = ({ catalog, onInsert }) => {
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    // Reset expansion on click outside? Maybe not required by spec but good UX.
    // Spec: "Tap on pill expands it"
    // Spec: "Must include a header with close X button when expanded"

    const handleStartDrag = (event: any) => {
        dragControls.start(event);
    };

    return (
        <motion.div
            ref={containerRef}
            className={`Toolpill ${expanded ? 'expanded' : 'collapsed'}`}
            drag
            dragControls={dragControls}
            dragListener={false} // We manually start drag
            dragMomentum={false}
            initial={{ x: 20, y: window.innerHeight - 80 }} // "Default near bottom-left"
            // We use layout animations for smooth expand/collapse
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onPointerDown={(e) => {
                // If collapsed, drag whole thing
                if (!expanded) {
                    handleStartDrag(e);
                }
            }}
            onClick={() => {
                if (!expanded) setExpanded(true);
            }}
        >
            {expanded ? (
                <div className="Toolpill-content">
                    <div
                        className="Toolpill-header"
                        onPointerDown={handleStartDrag} // Drag only via header when expanded
                    >
                        <span className="Toolpill-title">Insert</span>
                        <button
                            className="Toolpill-close-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(false);
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="Toolpill-grid">
                        {catalog?.insertables.map(item => (
                            <div
                                key={item.id}
                                className="Toolpill-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onInsert(item.kind);
                                    // Optional: Collapse on insert?
                                    // setExpanded(false);
                                }}
                            >
                                <div className="Toolpill-item-icon">
                                    {/* Placeholder icon or from catalog if available */}
                                    +
                                </div>
                                <div className="Toolpill-item-label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="Toolpill-collapsed-icon">
                    +
                </div>
            )}
        </motion.div>
    );
};
