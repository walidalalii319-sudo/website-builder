import React, { useState, useEffect } from 'react';
import './DesignSystem.css';

const TypographyPanel = ({ selectedElement, onUpdate, theme }) => {
  const [settings, setSettings] = useState({
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    fontStyle: 'normal'
  });

  useEffect(() => {
    if (selectedElement?.typography) {
      setSettings(prev => ({ ...prev, ...selectedElement.typography }));
    }
  }, [selectedElement]);

  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Poppins', 'Oswald', 'Raleway', 'Playfair Display', 'Merriweather',
    'Nunito', 'Source Sans Pro', 'Ubuntu', 'Crimson Text', 'Work Sans'
  ];

  const fontWeights = [
    { value: 100, label: 'Thin' },
    { value: 200, label: 'Extra Light' },
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
    { value: 900, label: 'Black' }
  ];

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate({ typography: newSettings });
  };

  return (
    <div className="design-panel typography-panel">
      <h3 className="panel-title">📝 Typography</h3>
      
      <div className="panel-section">
        <label className="panel-label">Font Family</label>
        <select 
          value={settings.fontFamily}
          onChange={(e) => updateSetting('fontFamily', e.target.value)}
          className="panel-select"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <div className="font-preview" style={{ fontFamily: settings.fontFamily }}>
          The quick brown fox jumps over the lazy dog
        </div>
      </div>

      <div className="panel-row">
        <div className="panel-field">
          <label className="panel-label">Size (px)</label>
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 0)}
            className="panel-input"
            min="8"
            max="200"
          />
        </div>
        <div className="panel-field">
          <label className="panel-label">Weight</label>
          <select
            value={settings.fontWeight}
            onChange={(e) => updateSetting('fontWeight', parseInt(e.target.value))}
            className="panel-select"
          >
            {fontWeights.map(weight => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-row">
        <div className="panel-field">
          <label className="panel-label">Line Height</label>
          <input
            type="number"
            value={settings.lineHeight}
            onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value) || 1)}
            className="panel-input"
            step="0.1"
            min="0.5"
            max="3"
          />
        </div>
        <div className="panel-field">
          <label className="panel-label">Letter Spacing</label>
          <input
            type="number"
            value={settings.letterSpacing}
            onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value) || 0)}
            className="panel-input"
            step="0.1"
            min="-5"
            max="20"
          />
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Text Align</label>
        <div className="button-group">
          {['left', 'center', 'right', 'justify'].map(align => (
            <button
              key={align}
              className={`btn-icon ${settings.textAlign === align ? 'active' : ''}`}
              onClick={() => updateSetting('textAlign', align)}
              title={align}
            >
              {align === 'left' && '⬅'}
              {align === 'center' && '↔'}
              {align === 'right' && '➡'}
              {align === 'justify' && '≡'}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Text Transform</label>
        <select
          value={settings.textTransform}
          onChange={(e) => updateSetting('textTransform', e.target.value)}
          className="panel-select"
        >
          <option value="none">None</option>
          <option value="capitalize">Capitalize</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
        </select>
      </div>

      <div className="panel-row">
        <div className="panel-field">
          <label className="panel-label">Style</label>
          <select
            value={settings.fontStyle}
            onChange={(e) => updateSetting('fontStyle', e.target.value)}
            className="panel-select"
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
            <option value="oblique">Oblique</option>
          </select>
        </div>
        <div className="panel-field">
          <label className="panel-label">Decoration</label>
          <select
            value={settings.textDecoration}
            onChange={(e) => updateSetting('textDecoration', e.target.value)}
            className="panel-select"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="overline">Overline</option>
            <option value="line-through">Line-through</option>
          </select>
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Quick Presets</label>
        <div className="preset-grid">
          <button className="preset-btn" onClick={() => updateSetting('fontSize', 12)}>Small</button>
          <button className="preset-btn" onClick={() => updateSetting('fontSize', 16)}>Body</button>
          <button className="preset-btn" onClick={() => updateSetting('fontSize', 24)}>Heading 3</button>
          <button className="preset-btn" onClick={() => updateSetting('fontSize', 32)}>Heading 2</button>
          <button className="preset-btn" onClick={() => updateSetting('fontSize', 48)}>Heading 1</button>
          <button className="preset-btn" onClick={() => updateSetting('fontWeight', 700)}>Bold</button>
        </div>
      </div>
    </div>
  );
};

export default TypographyPanel;
