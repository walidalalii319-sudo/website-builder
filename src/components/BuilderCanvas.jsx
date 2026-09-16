import React from 'react'

export function BuilderCanvas({ page, project, viewport, activeSectionId, onSelect }) {
  return <main className="builder-main"><header className="topbar"><span className="status-pill">● Local project</span><div className="viewport-controls">{['desktop', 'tablet', 'mobile'].map((mode) => <button className={viewport === mode ? 'active' : ''} key={mode}>{mode}</button>)}</div><button className="primary-btn small">Preview</button></header><div className={`canvas ${viewport}`}><div className="canvas-inner" style={{ background: project.theme.background, maxWidth: `${project.theme.containerWidth}px`, borderRadius: `${project.theme.radius}px` }}>{page?.sections.map((section) => <div key={section.id} className={section.id === activeSectionId ? 'selected-section' : ''} onClick={() => onSelect(section.id)}><SectionRenderer section={section} accent={project.theme.accent} /></div>)}</div></div></main>
}
