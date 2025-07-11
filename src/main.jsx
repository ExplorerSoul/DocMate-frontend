import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
