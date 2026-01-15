import React from 'react';
import { TokenCatalogItem } from '../client/api';

interface GraphTokenEditorProps {
    tokens: any;
    onChange: (path: string[], value: any) => void;
    metadata?: Record<string, TokenCatalogItem>;
    path?: string[];
}

// Contract Groups
const GROUPS = [
    "content", "typography", "color", "border", "spacing", "size",
    "layout", "effects", "media", "interaction", "linking",
    "data_binding", "tracking", "accessibility", "constraints",
    // Contract top-levels
    "node", "agent", "framework", "exec", "task", "artefact", "asset", "route", "board"
];

const QuickPage: React.FC<{ title: string, left: any, right: any }> = ({ title, left, right }) => (
    <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, color: '#666' }}>{title}</div>
        <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>{left}</div>
            <div style={{ width: 1, background: '#ddd' }}></div>
            <div style={{ flex: 1 }}>{right}</div>
        </div>
    </div>
);

export const GraphTokenEditor: React.FC<GraphTokenEditorProps> = ({ tokens, onChange, metadata = {}, path = [] }) => {
    if (!tokens || typeof tokens !== 'object') return null;

    // Mobile "Quick Pages" extraction logic
    const isRoot = path.length === 0;

    const getValue = (p: string) => {
        const parts = p.split('.');
        let cur = tokens;
        for (const part of parts) {
            if (cur && typeof cur === 'object') cur = cur[part];
            else return undefined;
        }
        return cur;
    };

    const renderQuickControl = (fullPath: string, label: string) => {
        const val = getValue(fullPath);
        if (val === undefined) return null;
        const pathArr = fullPath.split('.');
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9 }}>{label}</span>
                <input
                    type="range"
                    min={0} max={100}
                    value={Number(val) || 0}
                    onChange={e => onChange(pathArr, Number(e.target.value))}
                    style={{ width: '100%' }}
                />
                <span style={{ fontSize: 10, textAlign: 'center' }}>{val}</span>
            </div>
        );
    };

    const renderToggle = (fullPath: string, label: string) => {
        const val = getValue(fullPath);
        if (val === undefined) return null;
        const pathArr = fullPath.split('.');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 9 }}>{label}</span>
                <input
                    type="checkbox"
                    checked={!!val}
                    onChange={e => onChange(pathArr, e.target.checked)}
                />
            </div>
        );
    };

    return (
        <div className="token-list">
            {isRoot && (
                <div className="quick-pages">
                    {/* Quick Page 1: Timeout + Retries (node.exec...) */}
                    {(getValue('node.exec.timeout_ms') !== undefined || getValue('node.exec.retries.max') !== undefined) && (
                        <QuickPage
                            title="Execution"
                            left={renderQuickControl('node.exec.timeout_ms', 'Timeout')}
                            right={renderQuickControl('node.exec.retries.max', 'Retries')}
                        />
                    )}
                    {/* Quick Page 2: Backoff + Concurrency */}
                    {(getValue('node.exec.retries.backoff_ms') !== undefined || getValue('node.exec.concurrency') !== undefined) && (
                        <QuickPage
                            title="Throttling"
                            left={renderQuickControl('node.exec.retries.backoff_ms', 'Backoff')}
                            right={renderQuickControl('node.exec.concurrency', 'Concurrency')}
                        />
                    )}
                    {/* Quick Page 3: Rounds (Framework) */}
                    {(getValue('node.framework.rounds.min') !== undefined) && (
                        <QuickPage
                            title="Rounds"
                            left={renderQuickControl('node.framework.rounds.min', 'Min')}
                            right={renderQuickControl('node.framework.rounds.max', 'Max')}
                        />
                    )}
                    {/* Quick Page 4: Discussion (Framework) */}
                    {(getValue('node.framework.discussion.debate_enabled') !== undefined) && (
                        <QuickPage
                            title="Discussion"
                            left={renderToggle('node.framework.discussion.debate_enabled', 'Debate')}
                            right={renderToggle('node.framework.discussion.parallelism_enabled', 'Parallel')}
                        />
                    )}
                </div>
            )}

            <div className="full-inspector">
                {isRoot && <div style={{ fontSize: 10, fontWeight: 700, margin: '16px 0 8px', textTransform: 'uppercase', color: '#999' }}>Full Properties</div>}
                <TokenTree tokens={tokens} onChange={onChange} path={path} metadata={metadata} isRoot={isRoot} />
            </div>
        </div>
    );
};

const TokenTree: React.FC<{ tokens: any, onChange: (p: string[], v: any) => void, path: string[], metadata: any, isRoot?: boolean }> = ({ tokens, onChange, path, metadata, isRoot }) => {
    if (!tokens || typeof tokens !== 'object') return null;

    const keys = Object.keys(tokens);

    // Sort logic
    const sortedKeys = [...keys].sort((a, b) => {
        const ia = GROUPS.indexOf(a);
        const ib = GROUPS.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <>
            {sortedKeys.map((key) => {
                const value = tokens[key];
                const currentPath = [...path, key];
                const fullKey = currentPath.join('.');
                const metaItem = metadata[fullKey];

                if (value && typeof value === 'object' && value.status === 'NA') {
                    return (
                        <div key={key} className="prop-group na-group">
                            <div className="group-header closed">
                                <span className="group-title">{key}</span>
                                <span className="na-badge">NA</span>
                            </div>
                        </div>
                    );
                }

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return (
                        <div key={key} className={`prop-group`}>
                            <h3 className="group-title" style={{ fontSize: 12, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{key}</h3>
                            <div className="group-content" style={{ paddingLeft: 8, borderLeft: '1px solid #eee' }}>
                                <TokenTree tokens={value} onChange={onChange} path={currentPath} metadata={metadata} />
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={key} className="control-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="control-label" style={{ fontSize: 12, color: '#555' }}>{key}</label>
                        <div style={{ width: '60%' }}>
                            {renderInput(value, (v) => onChange(currentPath, v), key, metaItem)}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const renderInput = (value: any, handleChange: (v: any) => void, key: string, metadata?: TokenCatalogItem) => {
    const kind = metadata?.controller_kind || 'unknown';
    const config = metadata?.controller_config || {};

    if (kind === 'color' || (typeof value === 'string' && (value.startsWith('#') || key.includes('color')))) {
        return (
            <div className="color-input-group" style={{ display: 'flex', gap: 5 }}>
                <input type="color" value={value === 'transparent' ? '#ffffff' : (value || '#000000')} onChange={(e) => handleChange(e.target.value)} style={{ width: 24, height: 24, border: 'none', padding: 0 }} />
                <input type="text" value={value} onChange={(e) => handleChange(e.target.value)} style={{ flex: 1, fontSize: 12, padding: 4, borderRadius: 4, border: '1px solid #ddd' }} />
            </div>
        )
    }

    if (kind === 'dropdown' && config.options) {
        return (
            <select value={value} onChange={e => handleChange(e.target.value)} style={{ width: '100%', fontSize: 12, padding: 4 }}>
                {config.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        );
    }

    if (kind === 'slider' || (typeof value === 'number' && key.includes('timeout'))) {
        const max = config.max || (key.includes('timeout') ? 60000 : 100);
        const min = config.min || 0;
        return (
            <div style={{ display: 'flex', gap: 5, flex: 1, alignItems: 'center' }}>
                <input type="range" style={{ flex: 1 }} value={value} min={min} max={max} step={config.step} onChange={(e) => handleChange(Number(e.target.value))} />
                <span style={{ fontSize: 10, width: 30, textAlign: 'right' }}>{value}</span>
            </div>
        );
    }

    if (kind === 'toggle' || typeof value === 'boolean') {
        return <input type="checkbox" checked={value} onChange={(e) => handleChange(e.target.checked)} />;
    }

    const type = typeof value === 'number' ? 'number' : 'text';
    return <input type={type} value={value} onChange={(e) => handleChange(type === 'number' ? Number(e.target.value) : e.target.value)} style={{ width: '100%', fontSize: 12, padding: 4, borderRadius: 4, border: '1px solid #ddd' }} />;
}
