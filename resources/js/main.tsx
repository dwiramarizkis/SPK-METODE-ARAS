import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppComponent from './AppComponent';
import { Toaster } from '@/components/ui/sonner';

// Remove loading indicator
const loadingEl = document.getElementById('loading');
if (loadingEl) {
    loadingEl.remove();
}

const container = document.getElementById('app');

if (!container) {
    console.error('Container not found');
} else {
    try {
        const root = createRoot(container);
        root.render(
            <>
                <AppComponent />
                <Toaster position="top-right" richColors />
            </>
        );
    } catch (error) {
        console.error('Render error:', error);
        container.innerHTML = `
            <div style="padding: 40px; background: #ff7a05; color: white; text-align: center;">
                <h1>❌ Render Error</h1>
                <pre style="text-align: left; background: rgba(0,0,0,0.2); padding: 20px;">${error}</pre>
            </div>
        `;
    }
}
