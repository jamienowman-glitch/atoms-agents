import React from 'react';
import { Reorder } from 'framer-motion';
import { SECTION_TEMPLATES, SCHEMAS } from '@northstar/ui-atoms/src/schemas';
import { Atom } from '@northstar/contracts';

interface SidebarProps {
    sections: Atom[]; // Root atoms
    atoms: Record<string, Atom>; // All atoms (for looking up children)
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReorder: (newOrder: string[]) => void;
    onAddSection: (type: string) => void;
    onAddBlock?: (sectionId: string, type: string) => void;
    onDelete: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, atoms, selectedId, onSelect, onReorder, onAddSection, onAddBlock, onDelete }) => {
    // Helper to get allowed blocks for a section type
    const getAllowedBlocks = (sectionType: string) => {
        return SCHEMAS[sectionType]?.allowedBlocks || [];
    };
    return (
        <div style={{ width: '260px', borderRight: '1px solid #ddd', background: '#f6f6f7', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #ddd', fontWeight: '600' }}>
                Sections
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <Reorder.Group axis="y" values={sections} onReorder={(newSections) => onReorder(newSections.map(s => s.id))}>
                    {sections.map(section => (
                        <Reorder.Item key={section.id} value={section} style={{ position: 'relative' }}>
                            {/* Section Header */}
                            <div
                                onClick={() => onSelect(section.id)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '4px',
                                    background: selectedId === section.id ? '#e3ecff' : '#fff',
                                    border: selectedId === section.id ? '1px solid #005bd3' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    userSelect: 'none'
                                }}
                            >
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                    {SECTION_TEMPLATES.find(t => t.id === section.type)?.name || section.type}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Child Blocks */}
                            <div style={{ paddingLeft: '16px', marginBottom: '8px' }}>
                                {section.children?.map(childId => {
                                    const child = atoms[childId];
                                    if (!child) return null;
                                    const isChildSelected = selectedId === childId;

                                    // Map block types to readable names
                                    const blockName = child.type
                                        .replace('-block', '')
                                        .replace(/^\w/, c => c.toUpperCase());

                                    return (
                                        <div
                                            key={childId}
                                            onClick={(e) => { e.stopPropagation(); onSelect(childId); }}
                                            style={{
                                                padding: '6px 8px',
                                                marginBottom: '2px',
                                                background: isChildSelected ? '#e3ecff' : 'transparent',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: isChildSelected ? '#005bd3' : '#444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <span style={{ opacity: 0.5 }}>⠿</span> {blockName}
                                        </div>
                                    );
                                })}

                                {/* Add Block Button */}
                                {onAddBlock && (
                                    <div style={{ marginTop: '4px', paddingLeft: '8px' }}>
                                        <div className="add-block-trigger" style={{ fontSize: '11px', color: '#005bd3', cursor: 'pointer', display: 'flex', gap: '4px', opacity: 0.8 }}>
                                            <span>+ Add Block</span>
                                            <div className="block-menu" style={{ display: 'none', flexDirection: 'column', background: '#fff', border: '1px solid #ddd', position: 'absolute', zIndex: 10, borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                {/* Logic handled by hover or click state in production, for MVP just list inline if selected */}
                                            </div>
                                        </div>
                                        {/* Simple inline list for MVP */}
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                                            {getAllowedBlocks(section.type).map(blockType => (
                                                <button
                                                    key={blockType}
                                                    onClick={(e) => { e.stopPropagation(); onAddBlock(section.id, blockType); }}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        background: '#fff',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    + {blockType.split('-')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>Add Section</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SECTION_TEMPLATES.map(tmpl => (
                            <button
                                key={tmpl.id}
                                onClick={() => onAddSection(tmpl.id)}
                                style={{ padding: '8px', textAlign: 'left', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                + {tmpl.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
