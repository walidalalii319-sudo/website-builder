// Hero section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function HeroSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section 
      className="page-section hero-section" 
      style={{ background: `linear-gradient(135deg, ${accent}22, ${theme?.surface || '#fff'})` }}
      onClick={handleClick}
    >
      <div className="container">
        <div className="hero-content">
          <span className="eyebrow" style={{ color: accent }}>Website builder</span>
          <h1 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h1>
          <p className="hero-subtitle" style={{ color: theme?.text || '#0f172a', opacity: 0.8 }}>
            {section.subtitle}
          </p>
          <div className="hero-actions">
            <button 
              className="primary-btn" 
              style={{ backgroundColor: accent, borderRadius: theme?.radius || 8 }}
            >
              {section.cta}
            </button>
            {section.secondary && (
              <button 
                className="secondary-btn"
                style={{ borderRadius: theme?.radius || 8 }}
              >
                {section.secondary}
              </button>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="browser-mockup">
            <div className="browser-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="browser-content">
              <div className="skeleton-line" style={{ background: accent }} />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
