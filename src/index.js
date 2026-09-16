import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export components for external use
export { default as App } from './App';
export { default as VisualEditor } from './VisualEditor';
export { default as Inspector } from './Inspector';
export { default as LayersPanel } from './LayersPanel';
export { default as MediaLibrary } from './MediaLibrary';
export { default as DesignSystem } from './DesignSystem';
export { default as ContentManagement } from './ContentManagement';
export { default as AnalyticsDashboard } from './AnalyticsDashboard';
export { default as ThemeTogglePanel } from './ThemeTogglePanel';
export { default as CustomFontUploader } from './CustomFontUploader';
export { default as CustomCSSEditor } from './CustomCSSEditor';
