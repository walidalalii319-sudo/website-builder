// Text section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function TextSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section text-section" onClick={handleClick}>
      <div className="container">
        <span className="eyebrow" style={{ color: accent }}>Content block</span>
        <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
        <p 
          className="text-body"
          style={{ color: theme?.text || '#0f172a', opacity: 0.8 }}
        >
          {section.body}
        </p>
      </div>
    </section>
  )
}
