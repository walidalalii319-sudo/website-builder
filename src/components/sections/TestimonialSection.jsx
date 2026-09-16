// Testimonial section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function TestimonialSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section testimonial-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Testimonials</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
        </div>
        <div className="testimonial-grid">
          {(section.items || []).map((item, index) => (
            <div 
              key={`${item.name}-${index}`} 
              className="testimonial-card"
              style={{ borderRadius: theme?.radius || 8, background: theme?.surface || '#fff' }}
            >
              <div className="testimonial-avatar" style={{ backgroundColor: `${accent}22`, color: accent }}>
                {item.name.charAt(0)}
              </div>
              <blockquote style={{ color: theme?.text || '#0f172a' }}>
                "{item.content}"
              </blockquote>
              <div className="testimonial-author">
                <strong style={{ color: theme?.text || '#0f172a' }}>{item.name}</strong>
                <span style={{ color: theme?.text || '#0f172a', opacity: 0.6 }}>{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
