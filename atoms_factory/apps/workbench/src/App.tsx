import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './workbench.css';
import { PreviewCanvas } from './components/PreviewCanvas';
import { TokenEditor } from './components/TokenEditor';
import { TokenWorkbench } from './routes/TokenWorkbench';
import { LensGraphView } from './components/LensGraphView';
import { TokenApi } from './client/api';
import { FloatingInspector } from './components/FloatingInspector';
import { buildTree } from './client/utils';

// Dynamically import all views (Code only)
const viewModules = import.meta.glob('../../../atoms/aitom_family/*/views/View.tsx', { eager: true });

// Also import Roboto Flex font to ensure it's loaded
// @ts-ignore
import fontUrl from '@fonts/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf';

// Extract atom IDs
const atomIds = Object.keys(viewModules).map(path => {
  const parts = path.split('/');
  return parts[parts.length - 3]; // .../aitom_family/<id>/views/View.tsx
}).sort();

// Helper to get modules for an ID
const getAtomView = (id: string) => {
  const viewPath = Object.keys(viewModules).find(p => p.includes(`/${id}/views/View.tsx`));
  return viewPath ? (viewModules[viewPath] as any).View : null;
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>
          <h3>Render Error</h3>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Default Canvas ID for Workbench interaction
const CANVAS_ID = 'default';

function App() {
  const [selectedAtomId, setSelectedAtomId] = useState<string>(
    atomIds.includes('section_hero_banner') ? 'section_hero_banner' : (atomIds[0] || '')
  );

  // Active tokens for the View (fetched from Engine)
  const [activeTokens, setActiveTokens] = useState<any>({});
  const [loadingTokens, setLoadingTokens] = useState(false);

  // Fetch Tokens
  const refreshTokens = useCallback(async () => {
    setLoadingTokens(true);
    try {
      // Fetch catalog scoped to this element (Atom ID)
      // We assume the Canvas has an element with this ID, or we are previewing "Global Defaults" + "Atom Schema"?
      // If the element doesn't exist in Canvas State, we get Defaults. 
      // This matches "Fresh clone" -> Defaults.
      const catalog = await TokenApi.getCatalog(CANVAS_ID, selectedAtomId);
      const { tree } = buildTree(catalog);
      setActiveTokens(tree || {});
    } catch (e) {
      console.error("Failed to fetch tokens", e);
    } finally {
      setLoadingTokens(false);
    }
  }, [selectedAtomId]);

  useEffect(() => {
    refreshTokens();
  }, [refreshTokens]);

  const View = useMemo(() => getAtomView(selectedAtomId), [selectedAtomId]);

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [searchTerm, setSearchTerm] = useState('');

  // ...

  // In return:
  // <TokenEditor tokens={customTokens} onChange={handleTokenChange} metadata={currentMetadata} />

  const handleExport = () => {
    const exportData = {
      id: crypto.randomUUID(),
      type_id: selectedAtomId,
      version: '1.0.0', // TODO: read from schema
      tokens: activeTokens
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAtomId}_instance.json`;
    a.click();
  };

  // Inject Font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
          font-family: 'Roboto Flex';
          src: url('${fontUrl}') format('truetype');
        }
      `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    }
  }, []);

  const filteredAtoms = atomIds.filter(id => id.toLowerCase().includes(searchTerm.toLowerCase()));

  // Simple Router
  const path = window.location.pathname;
  if (path === '/workbench/tokens') {
    return (
      <div className="workbench-layout">
        <TokenWorkbench />
      </div>
    );
  }

  if (path === '/workbench/lens-graph') {
    return <LensGraphView deviceMode="desktop" />;
  }
  if (path === '/workbench/lens-graph-mobile') {
    return <LensGraphView deviceMode="mobile" />;
  }

  return (
    <div className="workbench-layout">
      {/* Sidebar (Desktop Only) */}
      <div className="sidebar">
        <div className="sidebar-header">Atoms ({atomIds.length})</div>
        <div className="atom-list">
          {filteredAtoms.map(id => (
            <div
              key={id}
              className={`atom-list-item ${selectedAtomId === id ? 'active' : ''}`}
              onClick={() => setSelectedAtomId(id)}
            >
              {id}
            </div>
          ))}
        </div>
      </div>

      {/* Main Preview */}
      <div className="main-preview">
        {deviceMode === 'desktop' && (
          <div className="toolbar">
            <div className="toolbar-group">
              <button
                className={`tool-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setDeviceMode('desktop')}>
                Desktop
              </button>
              <button
                className={`tool-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setDeviceMode('mobile')}>
                Mobile
              </button>
            </div>
            <div className="toolbar-group">
              <button className="tool-btn" onClick={handleExport}>Export JSON</button>
            </div>
          </div>
        )}

        <PreviewCanvas deviceMode={deviceMode}>
          <ErrorBoundary>
            {View ? (
              // View uses 'tokens' prop to render. 
              // We don't pass onUpdate because View shouldn't update tokens directly? 
              // Or if it does (e.g. interactive components), it should use API?
              // Standard Views are read-only.
              <View tokens={activeTokens} />
            ) : (
              <div style={{ padding: 20 }}>
                <h3>No View Found</h3>
                <p>Ensure <code>views/View.tsx</code> exists and exports <code>View</code>.</p>
              </div>
            )}
          </ErrorBoundary>
        </PreviewCanvas>
      </div>

      {/* Desktop Properties Panel */}
      <div className="properties-panel">
        <div className="prop-header">
          <h2>Inspector</h2>
          <div style={{ fontSize: 10, color: '#666' }}>{selectedAtomId}</div>
        </div>
        <TokenEditor
          canvasId={CANVAS_ID}
          elementId={selectedAtomId}
          onChange={refreshTokens}
        />
      </div>

      {/* Mobile Floating Inspector */}
      <div className="mobile-inspector-host">
        <FloatingInspector
          canvasId={CANVAS_ID}
          elementId={selectedAtomId}
        />
      </div>
    </div>
  );
}

export default App;
