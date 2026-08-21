import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>Laravel + React Berhasil Terhubung! 🚀</h1>
            <p>Edit file <code>resources/js/app.jsx</code> untuk mulai ngoding React.</p>
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}