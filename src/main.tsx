import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App.tsx';

const rootEl = document.getElementById('root')!;

hydrateRoot(
  rootEl,
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works without it
    });
  });
}
