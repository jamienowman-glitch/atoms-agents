import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { VideoCanvasPage } from './labs/video-canvas/VideoCanvasPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Hybrid Router: Simple separation between Builder and Labs
const path = window.location.pathname;

if (path.startsWith('/labs/video-canvas')) {
    root.render(
        <React.StrictMode>
            <VideoCanvasPage />
        </React.StrictMode>
    );
} else {
    // Default to Builder App
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
