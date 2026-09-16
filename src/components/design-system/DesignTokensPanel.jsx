import React, { useState, useEffect } from 'react';
import './DesignSystem.css';

const DesignTokensPanel = ({ designTokens, onUpdateTokens, theme }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [newToken, setNewToken] = useState({ name: '', value: '' });
  const [tokens, setTokens] = useState(designTokens || {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#333333',
      textMuted: '#666666',
      border: '#e0e0e0'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px'
    },
    typography: {
      fontFamilyBase: 'Inter',
      fontFamilyHeading: 'Poppins',
      fontSizeSm: '12px',
      fontSizeBase: '16px',
      fontSizeLg: '20px',
      fontSizeXl: '24px',
      fontSize2xl: '32px',
      fontSize3xl: '48px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '700'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
      xl: '0 20px 25px rgba(0,0,0,0.15)'
    },
    borderRadius: {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      full: '9999px'
    }
  });

  useEffect(() => {
    if (designTokens) {
      setTokens(designTokens);
    }
  }, [designTokens]);

  const addToken = (category) => {
    if (newToken.name && newToken.value) {
      const updatedTokens = {
        ...tokens,
        [category]: {
          ...tokens[category],
          [newToken.name]: newToken.value
        }
      };
      setTokens(updatedTokens);
      onUpdateTokens(updatedTokens);
      setNewToken({ name: '', value: '' });
    }
  };

  const updateToken = (category, tokenName, value) => {
    const updatedTokens = {
      ...tokens,
      [category]: {
        ...tokens[category],
        [tokenName]: value
      }
    };
    setTokens(updatedTokens);
    onUpdateTokens(updatedTokens);
  };

  const deleteToken = (category, tokenName) => {
    const { [tokenName]: removed, ...rest } = tokens[category];
    const updatedTokens = {
      ...tokens,
      [category]: rest
    };
    setTokens(updatedTokens);
    onUpdateTokens(updatedTokens);
  };

  const categories = [
    { id: 'colors', label: '🎨 Colors', type: 'color' },
    { id: 'spacing', label: '📏 Spacing', type: 'text' },
    { id: 'typography', label: '📝 Typography', type: 'mixed' },
    { id: 'shadows', label: '✨ Shadows', type: 'shadow' },
    { id: 'borderRadius', label: '🔲 Radius', type: 'text' }
  ];

  return (
    <div className="design-panel tokens-panel">
      <h3 className="panel-title">🎯 Design Tokens</h3>

      <div className="tab-buttons">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="tokens-content">
        <div className="add-token-form">
          <input
            type="text"
            placeholder="Token name (e.g., brandPrimary)"
            value={newToken.name}
            onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
            className="panel-input"
          />
          <div className="add-token-inputs">
            {activeTab === 'colors' ? (
              <input
                type="color"
                value={newToken.value || '#000000'}
                onChange={(e) => setNewToken(prev => ({ ...prev, value: e.target.value }))}
                className="color-input"
              />
            ) : (
              <input
                type="text"
                placeholder="Value (e.g., 16px or #ff0000)"
                value={newToken.value}
                onChange={(e) => setNewToken(prev => ({ ...prev, value: e.target.value }))}
                className="panel-input"
              />
            )}
            <button
              className="btn-add-token"
              onClick={() => addToken(activeTab)}
            >
              + Add
            </button>
          </div>
        </div>

        <div className="tokens-list">
          {Object.entries(tokens[activeTab] || {}).map(([tokenName, tokenValue]) => (
            <div key={tokenName} className="token-row">
              <div className="token-preview">
                {activeTab === 'colors' && (
                  <div 
                    className="token-color-swatch"
                    style={{ backgroundColor: tokenValue }}
                  />
                )}
                {activeTab === 'shadows' && (
                  <div 
                    className="token-shadow-swatch"
                    style={{ boxShadow: tokenValue }}
                  >
                    Aa
                  </div>
                )}
                {activeTab === 'borderRadius' && (
                  <div 
                    className="token-radius-swatch"
                    style={{ borderRadius: tokenValue, backgroundColor: '#667eea' }}
                  />
                )}
              </div>
              <div className="token-details">
                <span className="token-name-display">{tokenName}</span>
                <span className="token-value-display">{tokenValue}</span>
              </div>
              <div className="token-actions">
                <input
                  type={activeTab === 'colors' ? 'color' : 'text'}
                  value={tokenValue}
                  onChange={(e) => updateToken(activeTab, tokenName, e.target.value)}
                  className="token-edit-input"
                />
                <button
                  className="btn-delete-token"
                  onClick={() => deleteToken(activeTab, tokenName)}
                  title="Delete token"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Export Tokens</label>
        <button 
          className="btn-export"
          onClick={() => {
            const dataStr = JSON.stringify(tokens, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'design-tokens.json';
            link.click();
          }}
        >
          📥 Export JSON
        </button>
        <button 
          className="btn-import"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const imported = JSON.parse(event.target.result);
                  setTokens(imported);
                  onUpdateTokens(imported);
                } catch (err) {
                  alert('Invalid JSON file');
                }
              };
              reader.readAsText(file);
            };
            input.click();
          }}
        >
          📂 Import JSON
        </button>
      </div>

      <div className="panel-section">
        <label className="panel-label">CSS Variables Preview</label>
        <pre className="css-preview">
          {`:root {\n${Object.entries(tokens.colors || {}).map(([k, v]) => `  --color-${k}: ${v};`).join('\n')}\n}`}
        </pre>
      </div>
    </div>
  );
};

export default DesignTokensPanel;
