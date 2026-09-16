// Team section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function TeamSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <section className="page-section team-section" onClick={handleClick}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: accent }}>Team</span>
          <h2 style={{ color: theme?.text || '#0f172a' }}>{section.title}</h2>
          {section.subtitle && (
            <p style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>{section.subtitle}</p>
          )}
        </div>
        <div className="team-grid">
          {(section.members || []).map((member, index) => (
            <div 
              key={`${member.name}-${index}`} 
              className="team-card"
              style={{ borderRadius: theme?.radius || 8, background: theme?.surface || '#fff' }}
            >
              <div 
                className="team-avatar"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                {member.name.charAt(0)}
              </div>
              <h3 style={{ color: theme?.text || '#0f172a' }}>{member.name}</h3>
              <p className="team-role" style={{ color: accent }}>{member.role}</p>
              {member.bio && (
                <p className="team-bio" style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}>
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
