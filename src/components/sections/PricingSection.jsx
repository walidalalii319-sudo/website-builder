// Pricing section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function PricingSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section pricing-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Pricing</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
        </div>
        <div className="pricing-grid">
          {(section.plans || []).map((plan, index) => (
            <div 
              key={`${plan.name}-${index}`} 
              className="pricing-card"
              style={{ borderRadius: theme?.radius || 8, background: theme?.surface || '#fff' }}
            >
              <h3 style={{ color: theme?.text || '#0f172a' }}>{plan.name}</h3>
              <div className="price" style={{ color: accent }}>
                {plan.price}<span>/mo</span>
              </div>
              <p style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>{plan.desc}</p>
              <button 
                className="primary-btn small"
                style={{ backgroundColor: accent, borderRadius: theme?.radius || 8 }}
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
