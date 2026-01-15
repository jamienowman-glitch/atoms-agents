import React, { useState } from 'react';
import { SCHEMAS, Setting } from '@northstar/builder-registry';

interface InspectorProps {
    atomId: string | null;
    type: string | null;
    properties: Record<string, any>;
    onChange: (id: string, property: string, value: any) => void;
    onUpload?: (files: FileList) => Promise<string>;
    onSimulateAgent?: (id: string, prop: string, targetText: string) => void; // New
}

export const Inspector: React.FC<InspectorProps> = ({ atomId, type, properties, onChange, onUpload, onSimulateAgent }) => {
    if (!atomId || !type) {
        return (
            <div style={{ padding: '24px', color: '#6d7175', textAlign: 'center', marginTop: '40px' }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>No Selection</div>
                <div style={{ fontSize: '13px' }}>Click a section or block on the canvas to edit settings.</div>
            </div>
        );
    }

    const schema = SCHEMAS[type];
    if (!schema) {
        return <div style={{ padding: 20 }}>No settings available for {type}</div>;
    }

    return (
        <div style={{
            width: '320px',
            borderLeft: '1px solid #e1e3e5',
            background: '#fff',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #e1e3e5',
                background: '#fcfcfc'
            }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{schema.name}</h3>
            </div>

            <div style={{ padding: '20px' }}>
                {schema.settings.map((setting) => (
                    <div key={setting.id} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: '13px', fontWeight: 400, color: '#303030' }}>
                                {setting.label}
                            </label>
                            {/* Agent Trigger for Text Fields */}
                            {(setting.type === 'text' || setting.type === 'textarea') && onSimulateAgent && (
                                <button
                                    onClick={() => onSimulateAgent(atomId, setting.id, "Agent is writing copy...")}
                                    style={{ border: 'none', background: 'transparent', color: '#005bd3', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    ✨ Write Copy
                                </button>
                            )}
                        </div>
                        <Control
                            setting={setting}
                            value={properties[setting.id] ?? setting.default}
                            onChange={(val) => onChange(atomId, setting.id, val)}
                            onUpload={onUpload}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ... Control component remains mostly the same, ensuring robust rendering ...
const Control = ({ setting, value, onChange, onUpload }: { setting: Setting, value: any, onChange: (v: any) => void, onUpload?: any }) => {
    const baseStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #898f94',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#202223',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box' as const
    };

    switch (setting.type) {
        case 'text':
            return <input type="text" value={value} onChange={e => onChange(e.target.value)} style={baseStyle} />;

        case 'textarea':
            return (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    rows={5}
                    style={{ ...baseStyle, fontFamily: 'inherit', resize: 'vertical', minHeight: '80px' }}
                />
            );

        case 'color':
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #898f94', padding: '4px', borderRadius: '4px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <input
                            type="color"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            style={{
                                width: '150%',
                                height: '150%',
                                border: 'none',
                                padding: 0,
                                margin: '-25%',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        style={{ ...baseStyle, border: 'none', padding: '4px', fontFamily: 'monospace' }}
                    />
                </div>
            );

        case 'number':
        case 'range':
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        value={Number(value)}
                        onChange={e => onChange(Number(e.target.value))}
                        style={{ flex: 1, accentColor: '#005bd3' }}
                    />
                    <div style={{
                        width: '40px',
                        textAlign: 'right',
                        fontSize: '13px',
                        color: '#6d7175'
                    }}>
                        {value}
                    </div>
                </div>
            );

        case 'select':
        case 'alignment':
            return (
                <div style={{ position: 'relative' }}>
                    <select
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        style={{ ...baseStyle, appearance: 'none', background: '#fff' }}
                    >
                        {setting.options ? setting.options.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        )) : (
                            <>
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </>
                        )}
                    </select>
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px' }}>▼</div>
                </div>
            );

        case 'image':
            return (
                <div style={{ border: '1px dashed #babfc3', padding: '20px', borderRadius: '4px', textAlign: 'center', background: '#fbfbfb' }}>
                    {value ? (
                        <div style={{ marginBottom: '12px', position: 'relative' }}>
                            <img src={value} style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 4, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                            <button onClick={() => onChange('')} style={{ fontSize: '11px', marginTop: 8, color: '#d82c0d', border: 'none', background: 'transparent', cursor: 'pointer', textDecoration: 'underline' }}>Remove Image</button>
                        </div>
                    ) : (
                        <div style={{ color: '#6d7175', fontSize: '13px', marginBottom: '12px' }}>No image selected</div>
                    )}

                    <label style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: '#fff',
                        border: '1px solid #babfc3',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
                    }}>
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                if (e.target.files && e.target.files.length > 0 && onUpload) {
                                    const url = await onUpload(e.target.files);
                                    onChange(url);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            );

        default:
            return null;
    }
};
