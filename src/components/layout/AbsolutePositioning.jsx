import React, { useState, useRef, useEffect } from 'react';
import './AbsolutePositioning.css';

/**
 * AbsolutePositioning Component
 * Provides coordinate-based positioning, z-index controls, and overlap capabilities
 */
const AbsolutePositioning = ({ element, onUpdate, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const elementRef = useRef(null);
  const containerRef = useRef(null);

  const position = element.position || { x: 0, y: 0, z: 0 };
  const size = element.size || { width: 100, height: 100 };

  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.position-controls')) return;
    
    e.preventDefault();
    setIsDragging(true);
    const rect = elementRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowControls(true);
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;

      // Snap to grid (10px)
      newX = Math.round(newX / 10) * 10;
      newY = Math.round(newY / 10) * 10;

      // Boundaries
      newX = Math.max(0, Math.min(newX, containerRect.width - size.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - size.height));

      onUpdate({
        ...element,
        position: { ...position, x: newX, y: newY }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, size, position, element, onUpdate]);

  // Update position values
  const updatePosition = (axis, value) => {
    const numValue = parseFloat(value) || 0;
    onUpdate({
      ...element,
      position: { ...position, [axis]: numValue }
    });
  };

  // Update z-index
  const updateZIndex = (value) => {
    const numValue = parseInt(value) || 0;
    onUpdate({
      ...element,
      position: { ...position, z: numValue }
    });
  };

  // Bring forward/backward
  const adjustZIndex = (delta) => {
    updateZIndex(position.z + delta);
  };

  return (
    <div ref={containerRef} className="absolute-positioning-container">
      <div
        ref={elementRef}
        className={`absolute-element ${isDragging ? 'dragging' : ''} ${showControls ? 'selected' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: position.z,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={() => setShowControls(true)}
      >
        {children}
        
        {/* Selection indicator */}
        {showControls && (
          <div className="selection-overlay">
            <div className="resize-handle top-left" />
            <div className="resize-handle top-right" />
            <div className="resize-handle bottom-left" />
            <div className="resize-handle bottom-right" />
            <div className="resize-handle top-center" />
            <div className="resize-handle bottom-center" />
            <div className="resize-handle middle-left" />
            <div className="resize-handle middle-right" />
          </div>
        )}
      </div>

      {/* Position Controls Panel */}
      {showControls && (
        <div className="position-controls">
          <div className="control-group">
            <label>X Position</label>
            <input
              type="number"
              value={position.x}
              onChange={(e) => updatePosition('x', e.target.value)}
              className="position-input"
            />
          </div>
          
          <div className="control-group">
            <label>Y Position</label>
            <input
              type="number"
              value={position.y}
              onChange={(e) => updatePosition('y', e.target.value)}
              className="position-input"
            />
          </div>
          
          <div className="control-group">
            <label>Z-Index</label>
            <input
              type="number"
              value={position.z}
              onChange={(e) => updateZIndex(e.target.value)}
              className="position-input"
            />
          </div>

          <div className="control-group">
            <label>Layer Order</label>
            <div className="button-row">
              <button onClick={() => adjustZIndex(-1)} title="Send Backward">↓</button>
              <button onClick={() => adjustZIndex(1)} title="Bring Forward">↑</button>
              <button onClick={() => updateZIndex(999)} title="Bring to Front">⤒</button>
              <button onClick={() => updateZIndex(0)} title="Send to Back">⤓</button>
            </div>
          </div>

          <div className="control-group">
            <label>Size</label>
            <div className="size-inputs">
              <input
                type="number"
                value={size.width}
                onChange={(e) => onUpdate({
                  ...element,
                  size: { ...size, width: parseFloat(e.target.value) || 0 }
                })}
                placeholder="W"
                className="size-input"
              />
              <span>×</span>
              <input
                type="number"
                value={size.height}
                onChange={(e) => onUpdate({
                  ...element,
                  size: { ...size, height: parseFloat(e.target.value) || 0 }
                })}
                placeholder="H"
                className="size-input"
              />
            </div>
          </div>

          <button 
            className="close-controls"
            onClick={() => setShowControls(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * AbsolutePositioningPanel - Toolbar component for absolute positioning mode
 */
export const AbsolutePositioningPanel = ({ onEnable, isEnabled }) => {
  return (
    <div className={`absolute-positioning-panel ${isEnabled ? 'active' : ''}`}>
      <button 
        className="mode-toggle"
        onClick={() => onEnable(!isEnabled)}
        title="Toggle Absolute Positioning Mode"
      >
        <span className="icon">⬌</span>
        <span>Absolute Positioning</span>
      </button>
      
      {isEnabled && (
        <div className="mode-hints">
          <span>💡 Drag elements to position freely</span>
          <span>💡 Use arrow keys for fine adjustments</span>
          <span>💡 Hold Shift for 10px increments</span>
        </div>
      )}
    </div>
  );
};

export default AbsolutePositioning;
