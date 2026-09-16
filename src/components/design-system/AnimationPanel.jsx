import React, { useState, useEffect } from 'react';
import './DesignSystem.css';

const AnimationPanel = ({ selectedElement, onUpdate, theme }) => {
  const [settings, setSettings] = useState({
    animationType: 'none',
    animationDuration: 300,
    animationDelay: 0,
    animationIteration: 'once',
    animationDirection: 'normal',
    transitionProperty: 'all',
    transitionDuration: 200,
    transitionTiming: 'ease',
    hoverEffect: 'none',
    scrollAnimation: 'none'
  });

  useEffect(() => {
    if (selectedElement?.animation) {
      setSettings(prev => ({ ...prev, ...selectedElement.animation }));
    }
  }, [selectedElement]);

  const animationTypes = [
    { value: 'none', label: 'None' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'fadeOut', label: 'Fade Out' },
    { value: 'slideInLeft', label: 'Slide In Left' },
    { value: 'slideInRight', label: 'Slide In Right' },
    { value: 'slideInUp', label: 'Slide In Up' },
    { value: 'slideInDown', label: 'Slide In Down' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'zoomOut', label: 'Zoom Out' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'flip', label: 'Flip' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shake', label: 'Shake' },
    { value: 'swing', label: 'Swing' }
  ];

  const timingFunctions = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', label: 'Back' }
  ];

  const hoverEffects = [
    { value: 'none', label: 'None' },
    { value: 'scaleUp', label: 'Scale Up' },
    { value: 'scaleDown', label: 'Scale Down' },
    { value: 'lift', label: 'Lift' },
    { value: 'press', label: 'Press' },
    { value: 'glow', label: 'Glow' },
    { value: 'shadowGrow', label: 'Shadow Grow' },
    { value: 'colorShift', label: 'Color Shift' },
    { value: 'underline', label: 'Underline Slide' }
  ];

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    let styleUpdate = {};
    
    // Animation keyframes
    const keyframes = {
      fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
      fadeOut: '@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }',
      slideInLeft: '@keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
      slideInRight: '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
      slideInUp: '@keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
      slideInDown: '@keyframes slideInDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
      zoomIn: '@keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
      zoomOut: '@keyframes zoomOut { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
      bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }',
      pulse: '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }',
      shake: '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }',
      swing: '@keyframes swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 75% { transform: rotate(-5deg); } }',
      flip: '@keyframes flip { from { transform: rotateY(90deg); } to { transform: rotateY(0); } }',
      rotate: '@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'
    };

    if (settings.animationType !== 'none' && keyframes[settings.animationType]) {
      styleUpdate.animation = `${settings.animationType} ${settings.animationDuration}ms ${settings.transitionTiming} ${settings.animationDelay}ms ${settings.animationIteration === 'infinite' ? 'infinite' : ''}`;
    }

    if (settings.transitionProperty !== 'none') {
      styleUpdate.transition = `${settings.transitionProperty} ${settings.transitionDuration}ms ${settings.transitionTiming}`;
    }

    onUpdate({ animation: newSettings, style: styleUpdate });
  };

  return (
    <div className="design-panel animation-panel">
      <h3 className="panel-title">✨ Animations & Transitions</h3>

      <div className="panel-section">
        <label className="panel-label">Entrance Animation</label>
        <select
          value={settings.animationType}
          onChange={(e) => updateSetting('animationType', e.target.value)}
          className="panel-select"
        >
          {animationTypes.map(anim => (
            <option key={anim.value} value={anim.value}>
              {anim.label}
            </option>
          ))}
        </select>
        
        {settings.animationType !== 'none' && (
          <div className="animation-preview-wrapper">
            <div 
              className={`animation-preview ${settings.animationType}`}
              style={{
                animationDuration: `${settings.animationDuration}ms`,
                animationDelay: `${settings.animationDelay}ms`
              }}
            >
              Preview
            </div>
          </div>
        )}
      </div>

      {settings.animationType !== 'none' && (
        <>
          <div className="panel-row">
            <div className="panel-field">
              <label className="panel-label">Duration (ms)</label>
              <input
                type="number"
                value={settings.animationDuration}
                onChange={(e) => updateSetting('animationDuration', parseInt(e.target.value) || 0)}
                className="panel-input"
                min="0"
                max="5000"
                step="50"
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">Delay (ms)</label>
              <input
                type="number"
                value={settings.animationDelay}
                onChange={(e) => updateSetting('animationDelay', parseInt(e.target.value) || 0)}
                className="panel-input"
                min="0"
                max="5000"
                step="50"
              />
            </div>
          </div>

          <div className="panel-row">
            <div className="panel-field">
              <label className="panel-label">Iteration</label>
              <select
                value={settings.animationIteration}
                onChange={(e) => updateSetting('animationIteration', e.target.value)}
                className="panel-select"
              >
                <option value="once">Once</option>
                <option value="infinite">Infinite</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
              </select>
            </div>
            <div className="panel-field">
              <label className="panel-label">Direction</label>
              <select
                value={settings.animationDirection}
                onChange={(e) => updateSetting('animationDirection', e.target.value)}
                className="panel-select"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alt. Reverse</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="panel-section">
        <label className="panel-label">Transition Property</label>
        <select
          value={settings.transitionProperty}
          onChange={(e) => updateSetting('transitionProperty', e.target.value)}
          className="panel-select"
        >
          <option value="none">None</option>
          <option value="all">All Properties</option>
          <option value="opacity">Opacity Only</option>
          <option value="transform">Transform Only</option>
          <option value="background-color">Background Color</option>
          <option value="color">Text Color</option>
          <option value="box-shadow">Box Shadow</option>
        </select>
      </div>

      {settings.transitionProperty !== 'none' && (
        <>
          <div className="panel-row">
            <div className="panel-field">
              <label className="panel-label">Duration (ms)</label>
              <input
                type="number"
                value={settings.transitionDuration}
                onChange={(e) => updateSetting('transitionDuration', parseInt(e.target.value) || 0)}
                className="panel-input"
                min="0"
                max="3000"
                step="50"
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">Timing</label>
              <select
                value={settings.transitionTiming}
                onChange={(e) => updateSetting('transitionTiming', e.target.value)}
                className="panel-select"
              >
                {timingFunctions.map(timing => (
                  <option key={timing.value} value={timing.value}>
                    {timing.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <div className="panel-section">
        <label className="panel-label">Hover Effect</label>
        <select
          value={settings.hoverEffect}
          onChange={(e) => updateSetting('hoverEffect', e.target.value)}
          className="panel-select"
        >
          {hoverEffects.map(effect => (
            <option key={effect.value} value={effect.value}>
              {effect.label}
            </option>
          ))}
        </select>
        
        {settings.hoverEffect !== 'none' && (
          <div className="hover-preview-wrapper">
            <div 
              className={`hover-preview ${settings.hoverEffect}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.transition = 'transform 0.2s ease';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Hover me
            </div>
          </div>
        )}
      </div>

      <div className="panel-section">
        <label className="panel-label">Scroll Animation</label>
        <select
          value={settings.scrollAnimation}
          onChange={(e) => updateSetting('scrollAnimation', e.target.value)}
          className="panel-select"
        >
          <option value="none">None</option>
          <option value="fadeOnScroll">Fade on Scroll</option>
          <option value="slideUpOnScroll">Slide Up on Scroll</option>
          <option value="zoomOnScroll">Zoom on Scroll</option>
        </select>
      </div>

      <div className="panel-section">
        <label className="panel-label">Quick Animation Presets</label>
        <div className="preset-grid">
          <button className="preset-btn" onClick={() => {
            updateSetting('animationType', 'fadeIn');
            updateSetting('animationDuration', 500);
          }}>Smooth Fade</button>
          <button className="preset-btn" onClick={() => {
            updateSetting('animationType', 'slideInUp');
            updateSetting('animationDuration', 600);
          }}>Slide Up</button>
          <button className="preset-btn" onClick={() => {
            updateSetting('hoverEffect', 'lift');
            updateSetting('transitionDuration', 300);
          }}>Lift Hover</button>
          <button className="preset-btn" onClick={() => {
            updateSetting('hoverEffect', 'scaleUp');
            updateSetting('transitionDuration', 200);
          }}>Scale Hover</button>
        </div>
      </div>
    </div>
  );
};

export default AnimationPanel;
