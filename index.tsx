
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { storage } from './services/storage';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

// Initialize storage (now async) before mounting
storage.init().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
