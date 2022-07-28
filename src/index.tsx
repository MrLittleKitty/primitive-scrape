import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ExtensionPopupPage from './ExtensionPopupPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ExtensionPopupPage />
  </React.StrictMode>
);