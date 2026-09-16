import React, { useState } from 'react'
import { TypographyPanel, ColorPanel, BorderPanel, DesignTokensPanel, AnimationPanel, ThemeTogglePanel, CustomFontUploader, CustomCSSEditor } from './design-system/index.js'

export function Inspector({ page, section, project, onPageChange, onThemeChange, onSectionChange, onSaveBlock, onRemoveSection }) {
  const [activeTab, setActiveTab] = useState('inspector')

  const handleProjectChange = (key, value) => {
    if (key === 'settings') {
      // Handle nested settings update
      const currentSettings = project.settings || {}
      const newSettings = { ...currentSettings, ...value }
      // This would need a new callback from App.jsx
    }
  }

  return (
    <aside className="sidebar right-sidebar">
      <div className="inspector-tabs">
        <button 
          className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspector')}
        >
          📋 Inspector
        </button>
        <button 
          className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          🎨 Design
        </button>
        <button 
          className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          🌓 Theme
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fonts' ? 'active' : ''}`}
          onClick={() => setActiveTab('fonts')}
        >
          🅰️ Fonts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
          onClick={() => setActiveTab('css')}
        >
          💻 CSS
        </button>
      </div>

      <div className="inspector-content">
        {activeTab === 'inspector' && (
          <div className="panel-block">
            <h3>Inspector</h3>
            <div className="inspector-form">
              <label>Page name<input value={page?.title || ''} onChange={(event) => onPageChange('title', event.target.value)} /></label>
              <label>Slug<input value={page?.slug || ''} onChange={(event) => onPageChange('slug', event.target.value)} /></label>
              <label>SEO title<input value={page?.seoTitle || ''} onChange={(event) => onPageChange('seoTitle', event.target.value)} /></label>
              <label>SEO description<textarea rows="3" value={page?.seoDescription || ''} onChange={(event) => onPageChange('seoDescription', event.target.value)} /></label>
              <label>Status<select value={page?.status || 'draft'} onChange={(event) => onPageChange('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <label>Accent<input type="color" value={project.theme.accent} onChange={(event) => onThemeChange('accent', event.target.value)} /></label>
              {section && <>
                <label>Section title<input value={section.title || ''} onChange={(event) => onSectionChange({ title: event.target.value })} /></label>
                {section.type === 'text' && <label>Body<textarea rows="4" value={section.body || ''} onChange={(event) => onSectionChange({ body: event.target.value })} /></label>}
                <button className="secondary-btn" onClick={onSaveBlock}>Save as block</button>
                <button className="danger-btn" onClick={onRemoveSection}>Remove section</button>
              </>}
            </div>
          </div>
        )}

        {activeTab === 'design' && section && (
          <>
            <TypographyPanel selectedElement={section} onUpdate={onSectionChange} theme={project.theme} />
            <ColorPanel selectedElement={section} onUpdate={onSectionChange} theme={project.theme} />
            <BorderPanel selectedElement={section} onUpdate={onSectionChange} theme={project.theme} />
            <AnimationPanel selectedElement={section} onUpdate={onSectionChange} theme={project.theme} />
          </>
        )}

        {activeTab === 'theme' && (
          <>
            <ThemeTogglePanel theme={project.theme} onThemeChange={onThemeChange} />
            <DesignTokensPanel theme={project.theme} onThemeChange={onThemeChange} />
          </>
        )}

        {activeTab === 'fonts' && (
          <CustomFontUploader theme={project.theme} onThemeChange={onThemeChange} />
        )}

        {activeTab === 'css' && (
          <CustomCSSEditor 
            section={section} 
            onSectionChange={onSectionChange} 
            page={page} 
            onPageChange={onPageChange}
            project={project}
            onProjectChange={handleProjectChange}
          />
        )}

        {activeTab !== 'inspector' && activeTab !== 'design' && (
          <div className="panel-block">
            <h3>Project JSON</h3>
            <pre className="code-block">{JSON.stringify(project, null, 2)}</pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .inspector-tabs {
          display: flex;
          gap: 4px;
          padding: 12px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .tab-btn {
          flex: 1;
          min-width: fit-content;
          padding: 8px 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }

        .inspector-content {
          padding: 12px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
      `}</style>
    </aside>
  )
}
