// Footer section component

import React from 'react'

/**
 * @param {object} props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color
 * @param {object} props.theme - Theme configuration
 * @param {boolean} [props.isPreview] - Preview mode
 * @param {function} [props.onEdit] - Edit callback
 */
export function FooterSection({ section, accent, theme, isPreview, onEdit }) {
  const handleClick = () => {
    if (onEdit && !isPreview) {
      onEdit(section)
    }
  }

  return (
    <footer className="page-footer" onClick={handleClick}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <strong style={{ color: theme?.text || '#0f172a' }}>{section.title}</strong>
            <p style={{ color: theme?.text || '#0f172a', opacity: 0.6 }}>
              Building better digital experiences.
            </p>
          </div>
          <nav className="footer-nav">
            {(section.links || []).map((link, index) => (
              <a 
                key={`${link}-${index}`} 
                href="#"
                style={{ color: theme?.text || '#0f172a', opacity: 0.7 }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p style={{ color: theme?.text || '#0f172a', opacity: 0.5 }}>
            © {new Date().getFullYear()} {section.title}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
