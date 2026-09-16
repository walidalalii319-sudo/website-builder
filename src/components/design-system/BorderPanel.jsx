import React, { useState, useEffect } from 'react';
import './DesignSystem.css';

const BorderPanel = ({ selectedElement, onUpdate, theme }) => {
  const [settings, setSettings] = useState({
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderRadius: 0,
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomRight: 0,
    borderRadiusBottomLeft: 0,
    boxShadow: 'none',
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: '#000000',
    outlineOffset: 0
  });

  useEffect(() => {
    if (selectedElement?.border) {
      setSettings(prev => ({ ...prev, ...selectedElement.border }));
    }
  }, [selectedElement]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    let styleUpdate = {};
    if (key.startsWith('borderRadius') && key !== 'borderRadius') {
      const { topLeft, topRight, bottomRight, bottomLeft } = newSettings;
      styleUpdate.borderRadius = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
    } else if (key === 'borderRadius') {
      styleUpdate.borderRadius = `${value}px`;
    } else if (key === 'boxShadow') {
      styleUpdate.boxShadow = value;
    } else if (key.startsWith('outline')) {
      if (key === 'outlineWidth' || key === 'outlineStyle' || key === 'outlineColor') {
        styleUpdate.outline = `${newSettings.outlineWidth}px ${newSettings.outlineStyle} ${newSettings.outlineColor}`;
        styleUpdate.outlineOffset = `${newSettings.outlineOffset}px`;
      } else if (key === 'outlineOffset') {
        styleUpdate.outlineOffset = `${value}px`;
      }
    } else {
      styleUpdate.borderWidth = `${newSettings.borderWidth}px`;
      styleUpdate.borderStyle = newSettings.borderStyle;
      styleUpdate.borderColor = newSettings.borderColor;
    }
    
    onUpdate({ border: newSettings, style: styleUpdate });
  };

  const shadowPresets = [
    { value: 'none', label: 'None' },
    { value: '0 1px 3px rgba(0,0,0,0.12)', label: 'Small' },
    { value: '0 4px 6px rgba(0,0,0,0.1)', label: 'Medium' },
    { value: '0 10px 15px rgba(0,0,0,0.1)', label: 'Large' },
    { value: '0 20px 25px rgba(0,0,0,0.15)', label: 'XL' },
    { value: '0 25px 50px rgba(0,0,0,0.25)', label: '2XL' },
    { value: '0 0 10px rgba(100,100,255,0.5)', label: 'Glow Blue' },
    { value: '0 0 10px rgba(255,100,100,0.5)', label: 'Glow Red' },
    { value: 'inset 0 2px 4px rgba(0,0,0,0.1)', label: 'Inset' }
  ];

  const applyShadowPreset = (shadow) => {
    updateSetting('boxShadow', shadow.value);
  };

  return (
    <div className="design-panel border-panel">
      <h3 className="panel-title">🔲 Borders & Effects</h3>

      <div className="panel-section">
        <label className="panel-label">Border Width</label>
        <div className="slider-with-input">
          <input
            type="range"
            min="0"
            max="20"
            value={settings.borderWidth}
            onChange={(e) => updateSetting('borderWidth', parseInt(e.target.value))}
            className="panel-slider"
          />
          <input
            type="number"
            value={settings.borderWidth}
            onChange={(e) => updateSetting('borderWidth', parseInt(e.target.value) || 0)}
            className="panel-input-small"
            min="0"
            max="50"
          />
        </div>
      </div>

      <div className="panel-row">
        <div className="panel-field">
          <label className="panel-label">Style</label>
          <select
            value={settings.borderStyle}
            onChange={(e) => updateSetting('borderStyle', e.target.value)}
            className="panel-select"
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
            <option value="ridge">Ridge</option>
            <option value="inset">Inset</option>
            <option value="outset">Outset</option>
          </select>
        </div>
        <div className="panel-field">
          <label className="panel-label">Color</label>
          <input
            type="color"
            value={settings.borderColor}
            onChange={(e) => updateSetting('borderColor', e.target.value)}
            className="color-input-full"
          />
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Corner Radius</label>
        <div className="radius-controls">
          <button
            className="radius-link-btn"
            onClick={() => {
              const uniform = settings.borderRadius;
              setSettings(prev => ({
                ...prev,
                borderRadiusTopLeft: uniform,
                borderRadiusTopRight: uniform,
                borderRadiusBottomRight: uniform,
                borderRadiusBottomLeft: uniform
              }));
            }}
            title="Link all corners"
          >
            🔗
          </button>
          <div className="radius-grid">
            <div className="radius-item">
              <span className="radius-label">TL</span>
              <input
                type="number"
                value={settings.borderRadiusTopLeft}
                onChange={(e) => updateSetting('borderRadiusTopLeft', parseInt(e.target.value) || 0)}
                className="panel-input-tiny"
                min="0"
                max="100"
              />
            </div>
            <div className="radius-item">
              <span className="radius-label">TR</span>
              <input
                type="number"
                value={settings.borderRadiusTopRight}
                onChange={(e) => updateSetting('borderRadiusTopRight', parseInt(e.target.value) || 0)}
                className="panel-input-tiny"
                min="0"
                max="100"
              />
            </div>
            <div className="radius-item">
              <span className="radius-label">BR</span>
              <input
                type="number"
                value={settings.borderRadiusBottomRight}
                onChange={(e) => updateSetting('borderRadiusBottomRight', parseInt(e.target.value) || 0)}
                className="panel-input-tiny"
                min="0"
                max="100"
              />
            </div>
            <div className="radius-item">
              <span className="radius-label">BL</span>
              <input
                type="number"
                value={settings.borderRadiusBottomLeft}
                onChange={(e) => updateSetting('borderRadiusBottomLeft', parseInt(e.target.value) || 0)}
                className="panel-input-tiny"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Uniform Radius</label>
        <div className="slider-with-input">
          <input
            type="range"
            min="0"
            max="50"
            value={settings.borderRadius}
            onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
            className="panel-slider"
          />
          <input
            type="number"
            value={settings.borderRadius}
            onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value) || 0)}
            className="panel-input-small"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Box Shadow</label>
        <select
          value={settings.boxShadow}
          onChange={(e) => updateSetting('boxShadow', e.target.value)}
          className="panel-select"
        >
          {shadowPresets.map(shadow => (
            <option key={shadow.value} value={shadow.value}>
              {shadow.label}
            </option>
          ))}
        </select>
        
        <div className="shadow-preview" style={{ boxShadow: settings.boxShadow }}>
          Preview
        </div>

        <div className="shadow-presets">
          {shadowPresets.slice(1, 5).map((shadow, index) => (
            <button
              key={index}
              className={`shadow-swatch ${settings.boxShadow === shadow.value ? 'active' : ''}`}
              style={{ boxShadow: shadow.value }}
              onClick={() => applyShadowPreset(shadow)}
              title={shadow.label}
            />
          ))}
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Outline</label>
        <div className="panel-row">
          <div className="panel-field">
            <label className="panel-label">Width</label>
            <input
              type="number"
              value={settings.outlineWidth}
              onChange={(e) => updateSetting('outlineWidth', parseInt(e.target.value) || 0)}
              className="panel-input"
              min="0"
              max="20"
            />
          </div>
          <div className="panel-field">
            <label className="panel-label">Offset</label>
            <input
              type="number"
              value={settings.outlineOffset}
              onChange={(e) => updateSetting('outlineOffset', parseInt(e.target.value) || 0)}
              className="panel-input"
              min="-10"
              max="20"
            />
          </div>
        </div>
        <div className="panel-row">
          <div className="panel-field">
            <label className="panel-label">Style</label>
            <select
              value={settings.outlineStyle}
              onChange={(e) => updateSetting('outlineStyle', e.target.value)}
              className="panel-select"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div className="panel-field">
            <label className="panel-label">Color</label>
            <input
              type="color"
              value={settings.outlineColor}
              onChange={(e) => updateSetting('outlineColor', e.target.value)}
              className="color-input-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderPanel;
