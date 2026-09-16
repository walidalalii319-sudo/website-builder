// Features section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function FeaturesSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section features-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Features</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
        </div>
        <div className="feature-grid">
          {(section.items || []).map((item, index) => (
            <div 
              key={`${item.name}-${index}`} 
              className="feature-card"
              style={{ borderRadius: theme?.radius || 8, background: theme?.surface || '#fff' }}
            >
              <div 
                className="feature-icon"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 style={{ color: theme?.text || '#0f172a' }}>{item.name}</h3>
              <p style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
