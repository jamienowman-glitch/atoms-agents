
import React, { useState, useEffect } from 'react';
import { TokenApi, TokenCatalogItem } from '../client/api';
import { DraftDiffManager, DraftDiff } from '../logic/DraftDiffManager';

// ... shared styles or imports ...

export const TokenWorkbench: React.FC = () => {
    const [catalog, setCatalog] = useState<TokenCatalogItem[]>([]);
    const [draftDiff, setDraftDiff] = useState<DraftDiff>({});
    const [selectedTokenKey, setSelectedTokenKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            const serverCatalog = await TokenApi.getCatalog();
            const localDiff = DraftDiffManager.getDiff();
            setCatalog(serverCatalog);
            setDraftDiff(localDiff);
            setIsLoading(false);
        };
        load();
    }, []);

    // Derived State: Catalog + Diff
    const mergedCatalog = DraftDiffManager.applyDiffToCatalog(catalog, draftDiff);

    const handleSaveDiff = (tokenKey: string, patch: Partial<TokenCatalogItem>, comment: string) => {
        DraftDiffManager.updateDiff(tokenKey, patch, comment);
        setDraftDiff(DraftDiffManager.getDiff());
        setNotification('Draft saved locally');
        setTimeout(() => setNotification(null), 2000);
    };

    const handleApplyDiff = async () => {
        if (!confirm('Are you sure you want to apply changes to the canonical catalog? This will overwrite permanent storage.')) return;

        const success = await TokenApi.saveCatalog(mergedCatalog);
        if (success) {
            DraftDiffManager.clearDiff();
            setDraftDiff({});
            setCatalog(mergedCatalog);
            setNotification('Successfully applied changes to server!');
        } else {
            alert('Failed to apply changes.');
        }
    };

    const handleDiscardDiff = () => {
        if (!confirm('Discard all local drafts?')) return;
        DraftDiffManager.clearDiff();
        setDraftDiff({});
    };

    const handleExportJson = () => {
        const blob = new Blob([JSON.stringify(mergedCatalog, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TOKEN_CATALOG_CANONICAL.json';
        a.click();
    };

    if (isLoading) return <div>Loading Workbench...</div>;

    const selectedToken = mergedCatalog.find(t => t.token_key === selectedTokenKey);

    return (
        <div className="workbench-layout token-workbench">
            {/* Header / Toolbar */}
            <div className="wb-header" style={{ padding: 10, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Token Workbench</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    {Object.keys(draftDiff).length > 0 && (
                        <>
                            <span className="badge" style={{ background: '#ffeb3b', padding: '2px 8px' }}>Draft Active ({Object.keys(draftDiff).length})</span>
                            <button onClick={handleApplyDiff} style={{ background: 'black', color: 'white' }}>Apply Diff</button>
                            <button onClick={handleDiscardDiff}>Discard</button>
                        </>
                    )}
                    <button onClick={handleExportJson}>Export JSON</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* List */}
                <div className="sidebar" style={{ width: 300, overflowY: 'auto', borderRight: '1px solid #eee' }}>
                    {mergedCatalog.map(token => {
                        const isDraft = !!draftDiff[token.token_key];
                        return (
                            <div
                                key={token.token_key}
                                className={`atom-list-item ${selectedTokenKey === token.token_key ? 'active' : ''}`}
                                onClick={() => setSelectedTokenKey(token.token_key)}
                                style={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                <span>{token.token_key}</span>
                                {isDraft && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffeb3b' }}></span>}
                            </div>
                        );
                    })}
                    {mergedCatalog.length === 0 && <div style={{ padding: 20, color: '#999' }}>No tokens found in catalog.</div>}
                </div>

                {/* Detail Editor */}
                <div className="main-preview" style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                    {selectedToken ? (
                        <TokenDetailEditor
                            token={selectedToken}
                            draftEntry={draftDiff[selectedToken.token_key]}
                            onSave={handleSaveDiff}
                        />
                    ) : (
                        <div style={{ color: '#999', marginTop: 50, textAlign: 'center' }}>Select a token to edit</div>
                    )}
                </div>
            </div>
            {notification && <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#333', color: 'white', padding: '10px 20px', borderRadius: 4 }}>{notification}</div>}
        </div>
    );
};

// Sub-component for editing
const TokenDetailEditor: React.FC<{
    token: TokenCatalogItem,
    draftEntry?: any,
    onSave: (key: string, patch: Partial<TokenCatalogItem>, comment: string) => void
}> = ({ token, draftEntry, onSave }) => {
    const [localState, setLocalState] = useState(token);
    const [comment, setComment] = useState(draftEntry?.comment || '');

    useEffect(() => {
        setLocalState(token);
        setComment(draftEntry?.comment || '');
    }, [token, draftEntry]);

    const handleChange = (field: keyof TokenCatalogItem, value: any) => {
        setLocalState(prev => ({ ...prev, [field]: value }));
    };

    const handleCommit = () => {
        // diff against original? For now just save the whole patch of editable fields
        onSave(token.token_key, localState, comment);
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>{token.token_key}</h2>
            <div className="control-row">
                <label>Section</label>
                <input value={localState.section || ''} onChange={e => handleChange('section', e.target.value)} />
            </div>
            <div className="control-row">
                <label>Type</label>
                <input value={localState.token_type || ''} onChange={e => handleChange('token_type', e.target.value)} />
            </div>
            <div className="control-row">
                <label>Controller Kind</label>
                <select value={localState.controller_kind || 'text'} onChange={e => handleChange('controller_kind', e.target.value)}>
                    <option value="text">Text</option>
                    <option value="color">Color</option>
                    <option value="slider">Slider</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="toggle">Toggle</option>
                </select>
            </div>

            {/* Controller Config based on kind would go here */}

            <div className="control-row">
                <label>Notes</label>
                <textarea
                    value={localState.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                    style={{ width: '100%', height: 60 }}
                />
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 4 }}>
                <h4>Draft Change</h4>
                <div className="control-row">
                    <label>Change Comment (Required)</label>
                    <input
                        placeholder="Why are you making this change?"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <button onClick={handleCommit} disabled={!comment} style={{ marginTop: 10 }}>
                    Update Draft
                </button>
            </div>
        </div>
    );
};
