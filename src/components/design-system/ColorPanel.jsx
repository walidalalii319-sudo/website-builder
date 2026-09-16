import React, { useState, useEffect } from 'react';
import './DesignSystem.css';

const ColorPanel = ({ selectedElement, onUpdate, theme, designTokens }) => {
  const [activeTab, setActiveTab] = useState('solid');
  const [colors, setColors] = useState({
    background: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientAngle: 135,
    opacity: 100
  });

  useEffect(() => {
    if (selectedElement?.colors) {
      setColors(prev => ({ ...prev, ...selectedElement.colors }));
    }
  }, [selectedElement]);

  const presetColors = [
    '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#795548', '#9e9e9e', '#607d8b', '#1a237e', '#0d47a1', '#1b5e20'
  ];

  const gradientPresets = [
    { start: '#667eea', end: '#764ba2', angle: 135, name: 'Purple Dream' },
    { start: '#f093fb', end: '#f5576c', angle: 45, name: 'Pink Passion' },
    { start: '#4facfe', end: '#00f2fe', angle: 90, name: 'Ocean Blue' },
    { start: '#43e97b', end: '#38f9d7', angle: 180, name: 'Fresh Mint' },
    { start: '#fa709a', end: '#fee140', angle: 45, name: 'Sunset' },
    { start: '#a8edea', end: '#fed6e3', angle: 135, name: 'Soft Pink' },
    { start: '#ff9a9e', end: '#fecfef', angle: 90, name: 'Warm Flame' },
    { start: '#ffecd2', end: '#fcb69f', angle: 45, name: 'Peach' }
  ];

  const updateColor = (key, value) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    
    let styleUpdate = {};
    if (activeTab === 'solid') {
      styleUpdate = {
        backgroundColor: key === 'background' ? `${value}cc`.slice(0, 7) : undefined,
        color: key === 'text' ? value : undefined,
        borderColor: key === 'border' ? value : undefined
      };
    } else if (activeTab === 'gradient') {
      const gradientValue = `linear-gradient(${newColors.gradientAngle}deg, ${newColors.gradientStart}, ${newColors.gradientEnd})`;
      styleUpdate = {
        backgroundImage: key !== 'background' ? gradientValue : undefined,
        background: key === 'background' ? 'transparent' : undefined
      };
    }
    
    onUpdate({ colors: newColors, style: styleUpdate });
  };

  const applyGradientPreset = (preset) => {
    const newColors = {
      ...colors,
      gradientStart: preset.start,
      gradientEnd: preset.end,
      gradientAngle: preset.angle
    };
    setColors(newColors);
    onUpdate({ 
      colors: newColors,
      style: { backgroundImage: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})` }
    });
  };

  return (
    <div className="design-panel color-panel">
      <h3 className="panel-title">🎨 Colors</h3>

      <div className="tab-buttons">
        <button 
          className={`tab-btn ${activeTab === 'solid' ? 'active' : ''}`}
          onClick={() => setActiveTab('solid')}
        >
          Solid
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gradient' ? 'active' : ''}`}
          onClick={() => setActiveTab('gradient')}
        >
          Gradient
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button>
      </div>

      {activeTab === 'solid' && (
        <>
          <div className="panel-section">
            <label className="panel-label">Background Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={colors.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="color-input"
              />
              <input
                type="text"
                value={colors.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="color-text-input"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="panel-section">
            <label className="panel-label">Text Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={colors.text}
                onChange={(e) => updateColor('text', e.target.value)}
                className="color-input"
              />
              <input
                type="text"
                value={colors.text}
                onChange={(e) => updateColor('text', e.target.value)}
                className="color-text-input"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="panel-section">
            <label className="panel-label">Border Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={colors.border}
                onChange={(e) => updateColor('border', e.target.value)}
                className="color-input"
              />
              <input
                type="text"
                value={colors.border}
                onChange={(e) => updateColor('border', e.target.value)}
                className="color-text-input"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="panel-section">
            <label className="panel-label">Opacity: {colors.opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={colors.opacity}
              onChange={(e) => updateColor('opacity', parseInt(e.target.value))}
              className="panel-slider"
            />
          </div>

          <div className="panel-section">
            <label className="panel-label">Quick Colors</label>
            <div className="color-grid">
              {presetColors.map(color => (
                <button
                  key={color}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor('background', color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'gradient' && (
        <>
          <div className="panel-section">
            <label className="panel-label">Gradient Preview</label>
            <div 
              className="gradient-preview"
              style={{
                background: `linear-gradient(${colors.gradientAngle}deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
                height: '80px',
                borderRadius: '8px'
              }}
            />
          </div>

          <div className="panel-row">
            <div className="panel-field">
              <label className="panel-label">Start Color</label>
              <input
                type="color"
                value={colors.gradientStart}
                onChange={(e) => updateColor('gradientStart', e.target.value)}
                className="color-input-full"
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">End Color</label>
              <input
                type="color"
                value={colors.gradientEnd}
                onChange={(e) => updateColor('gradientEnd', e.target.value)}
                className="color-input-full"
              />
            </div>
          </div>

          <div className="panel-section">
            <label className="panel-label">Angle: {colors.gradientAngle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={colors.gradientAngle}
              onChange={(e) => updateColor('gradientAngle', parseInt(e.target.value))}
              className="panel-slider"
            />
            <div className="angle-presets">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <button
                  key={angle}
                  className={`angle-btn ${colors.gradientAngle === angle ? 'active' : ''}`}
                  onClick={() => updateColor('gradientAngle', angle)}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <label className="panel-label">Gradient Presets</label>
            <div className="gradient-grid">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  className="gradient-swatch"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})`
                  }}
                  onClick={() => applyGradientPreset(preset)}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'tokens' && designTokens && (
        <div className="tokens-section">
          <label className="panel-label">Design Tokens</label>
          {Object.entries(designTokens.colors || {}).map(([tokenName, tokenValue]) => (
            <div key={tokenName} className="token-item">
              <div 
                className="token-color"
                style={{ backgroundColor: tokenValue }}
              />
              <div className="token-info">
                <span className="token-name">{tokenName}</span>
                <span className="token-value">{tokenValue}</span>
              </div>
              <button
                className="btn-apply-token"
                onClick={() => updateColor('background', tokenValue)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPanel;
