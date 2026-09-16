// Gallery section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function GallerySection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section gallery-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Portfolio</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
          {section.subtitle && (
            <p style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>{section.subtitle}</p>
          )}
        </div>
        <div className="gallery-grid">
          {(section.images || []).map((image, index) => (
            <div 
              key={`${image.alt}-${index}`} 
              className="gallery-item"
              style={{ borderRadius: theme?.radius || 8 }}
            >
              <div 
                className="gallery-placeholder"
                style={{ background: `${accent}11` }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              {image.caption && (
                <p className="gallery-caption" style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
