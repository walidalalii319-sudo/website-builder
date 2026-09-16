import React from 'react'
import { SectionRenderer } from './SectionRenderer.jsx'

export function BuilderCanvas({ page, project, viewport, activeSectionId, onSelect, onReorderSections }) {
  return (
    <main className="builder-main">
      <header className="topbar">
        <span className="status-pill">● Local project</span>
        {/* Viewport controls moved to ResponsiveControls component */}
        <button className="primary-btn small">Preview</button>
      </header>
      
      <div className={`canvas ${viewport}`}>
        <div 
          className="canvas-inner" 
          style={{ 
            background: project.theme.background, 
            maxWidth: `${project.theme.containerWidth}px`, 
            borderRadius: `${project.theme.radius}px` 
          }}
        >
          {page?.sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`section-wrapper ${section.id === activeSectionId ? 'selected-section' : ''}`}
              onClick={() => onSelect(section.id)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', section.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId !== section.id && onReorderSections) {
                  onReorderSections(draggedId, section.id);
                }
              }}
              style={{ 
                cursor: 'grab',
                position: 'relative'
              }}
            >
              <div className="section-drag-handle" style={{
                position: 'absolute',
                left: '-30px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '4px 8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#6b7280',
                opacity: section.id === activeSectionId ? 1 : 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none'
              }}>
                ⋮⋮
              </div>
              <SectionRenderer section={section} accent={project.theme.accent} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
