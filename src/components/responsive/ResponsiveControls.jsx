import React, { useState, useEffect } from 'react'

/**
 * ResponsiveControls Component
 * Provides viewport switching with actual responsive behavior
 * Supports desktop, tablet, and mobile views with real CSS transformations
 */
export function ResponsiveControls({ viewport, onViewportChange, children }) {
  const [canvasWidth, setCanvasWidth] = useState('100%')
  const [scale, setScale] = useState(1)

  // Define breakpoint widths for each viewport
  const viewportWidths = {
    desktop: 1440,
    tablet: 768,
    mobile: 375
  }

  // Update canvas width and scale based on viewport
  useEffect(() => {
    const width = viewportWidths[viewport] || 1440
    const containerWidth = Math.min(window.innerWidth - 400, width) // Account for sidebars
    
    setCanvasWidth(`${width}px`)
    
    // Calculate scale to fit the canvas in the available space
    const availableWidth = window.innerWidth - 400 // Sidebar + Inspector width
    const calculatedScale = Math.min(1, availableWidth / width)
    setScale(calculatedScale > 0.5 ? calculatedScale : 0.5) // Minimum scale of 0.5
  }, [viewport])

  return (
    <div className="responsive-wrapper">
      {/* Viewport Control Bar */}
      <div className="viewport-control-bar">
        <div className="viewport-buttons">
          {['desktop', 'tablet', 'mobile'].map((mode) => (
            <button
              key={mode}
              className={`viewport-btn ${viewport === mode ? 'active' : ''}`}
              onClick={() => onViewportChange(mode)}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view (${getViewportShortcut(mode)})`}
            >
              <ViewportIcon mode={mode} />
              <span className="viewport-label">{mode}</span>
            </button>
          ))}
        </div>
        
        <div className="viewport-info">
          <span className="viewport-dimensions">
            {viewportWidths[viewport]}px × Auto
          </span>
          {viewport !== 'desktop' && (
            <span className="scale-indicator">
              Scale: {Math.round(scale * 100)}%
            </span>
          )}
        </div>

        <div className="rotate-toggle">
          <button 
            className="rotate-btn"
            title="Rotate device (coming soon)"
            disabled={viewport === 'desktop'}
          >
            ↻ Rotate
          </button>
        </div>
      </div>

      {/* Canvas with responsive styling */}
      <div 
        className={`responsive-canvas ${viewport}`}
        style={{
          width: canvasWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
      >
        {children}
      </div>

      {/* Responsive helper overlay */}
      <div className="responsive-helpers">
        {viewport === 'mobile' && (
          <div className="mobile-frame">
            <div className="notch"></div>
            <div className="home-indicator"></div>
          </div>
        )}
        {viewport === 'tablet' && (
          <div className="tablet-frame">
            <div className="tablet-bezel"></div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get keyboard shortcuts
function getViewportShortcut(mode) {
  const shortcuts = {
    desktop: 'Ctrl+1',
    tablet: 'Ctrl+2',
    mobile: 'Ctrl+3'
  }
  return shortcuts[mode] || ''
}

// Viewport icon component
function ViewportIcon({ mode }) {
  if (mode === 'desktop') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  }
  if (mode === 'tablet') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
        <circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
    )
  }
  // mobile
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

/**
 * ResponsiveWrapper - Higher order component for responsive previews
 */
export function ResponsiveWrapper({ viewport = 'desktop', children, className = '' }) {
  const viewportClasses = {
    desktop: 'resp-desktop',
    tablet: 'resp-tablet',
    mobile: 'resp-mobile'
  }

  return (
    <div className={`responsive-wrapper ${viewportClasses[viewport]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * useResponsive Hook - Custom hook for responsive state management
 */
export function useResponsive(defaultViewport = 'desktop') {
  const [viewport, setViewport] = useState(defaultViewport)
  const [isResizing, setIsResizing] = useState(false)

  const changeViewport = (newViewport) => {
    setViewport(newViewport)
    setIsResizing(true)
    setTimeout(() => setIsResizing(false), 300) // Animation duration
  }

  // Keyboard shortcuts for viewport switching
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault()
        changeViewport('desktop')
      } else if (e.ctrlKey && e.key === '2') {
        e.preventDefault()
        changeViewport('tablet')
      } else if (e.ctrlKey && e.key === '3') {
        e.preventDefault()
        changeViewport('mobile')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    viewport,
    setViewport: changeViewport,
    isResizing,
    isDesktop: viewport === 'desktop',
    isTablet: viewport === 'tablet',
    isMobile: viewport === 'mobile'
  }
}

export default ResponsiveControls
