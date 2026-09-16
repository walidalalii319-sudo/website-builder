import React from 'react';
import './DesignSystem.css';

const ThemeTogglePanel = ({ theme, onThemeChange }) => {
  const isDark = theme.darkMode || false;

  const toggleDarkMode = () => {
    onThemeChange('darkMode', !isDark);
  };

  const darkColors = {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
  };

  const lightColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
  };

  const applyPreset = (preset) => {
    if (preset === 'dark') {
      onThemeChange('background', darkColors.background);
      onThemeChange('surface', darkColors.surface);
      onThemeChange('text', darkColors.text);
      onThemeChange('darkMode', true);
    } else {
      onThemeChange('background', lightColors.background);
      onThemeChange('surface', lightColors.surface);
      onThemeChange('text', lightColors.text);
      onThemeChange('darkMode', false);
    }
  };

  return (
    <div className="design-panel theme-toggle-panel">
      <h3 className="panel-title">🌓 Theme Mode</h3>
      
      <div className="panel-section">
        <label className="panel-label">Current Mode</label>
        <div className="theme-mode-display">
          <span className={`mode-indicator ${isDark ? 'dark' : 'light'}`}>
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </span>
        </div>
      </div>

      <div className="panel-section">
        <button 
          className={`theme-toggle-btn ${isDark ? 'dark' : 'light'}`}
          onClick={toggleDarkMode}
        >
          <span className="toggle-icon">{isDark ? '🌙' : '☀️'}</span>
          <span className="toggle-text">Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>

      <div className="panel-section">
        <label className="panel-label">Quick Presets</label>
        <div className="preset-grid">
          <button 
            className="preset-btn" 
            onClick={() => applyPreset('light')}
            title="Apply Light Theme"
          >
            ☀️ Light
          </button>
          <button 
            className="preset-btn" 
            onClick={() => applyPreset('dark')}
            title="Apply Dark Theme"
          >
            🌙 Dark
          </button>
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Auto-Update Colors</label>
        <p className="panel-hint">
          When switching themes, background, surface, and text colors will be automatically adjusted for optimal contrast.
        </p>
      </div>
    </div>
  );
};

export default ThemeTogglePanel;
