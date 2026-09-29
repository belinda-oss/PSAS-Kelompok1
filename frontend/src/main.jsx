import React from 'react';
import { createRoot } from 'react-dom/client';
import AOS from 'aos';
import App from './app.jsx';
import 'aos/dist/aos.css';
import './styles/app.css';

AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: false,
    offset: 60
});

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
