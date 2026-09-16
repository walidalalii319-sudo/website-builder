// Stats section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function StatsSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section stats-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Statistics</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
        </div>
        <div className="stats-grid">
          {(section.items || []).map((stat, index) => (
            <div 
              key={`${stat.label}-${index}`} 
              className="stat-item"
              style={{ borderRadius: theme?.radius || 8 }}
            >
              <div className="stat-value" style={{ color: accent }}>{stat.value}</div>
              <div className="stat-label" style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
