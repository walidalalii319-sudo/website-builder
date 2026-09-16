// CTA section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function CtaSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section cta-section" onClick={handleClick}>
      <div className="container">
        <div 
          className="cta-box"
          style={{ 
            background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
            borderRadius: theme?.radius || 8 
          }}
        >
          <h2 style={{ color: '#fff' }}>{section.title}</h2>
          <p style={{ color: '#fff', opacity: 0.9 }}>{section.subtitle}</p>
          <button 
            className="primary-btn inverse"
            style={{ 
              backgroundColor: '#fff', 
              color: accent,
              borderRadius: theme?.radius || 8 
            }}
          >
            {section.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
