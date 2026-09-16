import React, { useState } from 'react';
import './DesignSystem.css';

const CustomCSSEditor = ({ section, onSectionChange, page, onPageChange, project, onProjectChange }) => {
  const [cssScope, setCssScope] = useState('element'); // 'element', 'page', 'project'
  const [cssCode, setCssCode] = useState('');

  const getElementCSS = () => {
    if (section?.customCSS) {
      return section.customCSS;
    }
    return '';
  };

  const getPageCSS = () => {
    if (page?.customCSS) {
      return page.customCSS;
    }
    return '';
  };

  const getProjectCSS = () => {
    if (project?.settings?.customCSS) {
      return project.settings.customCSS;
    }
    return '';
  };

  const loadCSS = (scope) => {
    setCssScope(scope);
    if (scope === 'element') {
      setCssCode(getElementCSS());
    } else if (scope === 'page') {
      setCssCode(getPageCSS());
    } else if (scope === 'project') {
      setCssCode(getProjectCSS());
    }
  };

  const saveCSS = () => {
    if (cssScope === 'element' && section) {
      onSectionChange({ customCSS: cssCode });
    } else if (cssScope === 'page' && page) {
      onPageChange('customCSS', cssCode);
    } else if (cssScope === 'project') {
      onProjectChange('settings', { 
        ...project.settings, 
        customCSS: cssCode 
      });
    }
  };

  const clearCSS = () => {
    setCssCode('');
    if (cssScope === 'element' && section) {
      onSectionChange({ customCSS: '' });
    } else if (cssScope === 'page' && page) {
      onPageChange('customCSS', '');
    } else if (cssScope === 'project') {
      onProjectChange('settings', { 
        ...project.settings, 
        customCSS: '' 
      });
    }
  };

  const cssExamples = [
    {
      name: 'Hover Effect',
      code: `.element:hover {\n  transform: scale(1.05);\n  transition: transform 0.3s ease;\n}`
    },
    {
      name: 'Custom Shadow',
      code: `.element {\n  box-shadow: 0 10px 40px rgba(0,0,0,0.2);\n}`
    },
    {
      name: 'Gradient Border',
      code: `.element {\n  background: linear-gradient(#fff, #fff) padding-box,\n              linear-gradient(45deg, #7c3aed, #ec4899) border-box;\n  border: 3px solid transparent;\n}`
    },
    {
      name: 'Animation',
      code: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.element {\n  animation: fadeIn 0.5s ease-in;\n}`
    },
    {
      name: 'Responsive',
      code: `@media (max-width: 768px) {\n  .element {\n    font-size: 14px;\n    padding: 12px;\n  }\n}`
    }
  ];

  return (
    <div className="design-panel custom-css-panel">
      <h3 className="panel-title">💻 Custom CSS</h3>
      
      <div className="panel-section">
        <label className="panel-label">CSS Scope</label>
        <div className="scope-tabs">
          <button 
            className={`scope-tab ${cssScope === 'element' ? 'active' : ''}`}
            onClick={() => loadCSS('element')}
            disabled={!section}
          >
            Element
          </button>
          <button 
            className={`scope-tab ${cssScope === 'page' ? 'active' : ''}`}
            onClick={() => loadCSS('page')}
            disabled={!page}
          >
            Page
          </button>
          <button 
            className={`scope-tab ${cssScope === 'project' ? 'active' : ''}`}
            onClick={() => loadCSS('project')}
          >
            Project
          </button>
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">
          CSS for {cssScope}
          {cssScope === 'element' && section && `: ${section.type}`}
          {cssScope === 'page' && page && `: ${page.title}`}
          {cssScope === 'project' && ': Global'}
        </label>
        
        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          className="css-editor"
          placeholder="Enter your custom CSS here..."
          spellCheck="false"
          rows="10"
        />
        
        <div className="css-actions">
          <button className="btn-primary" onClick={saveCSS}>
            💾 Save CSS
          </button>
          <button className="btn-secondary" onClick={clearCSS}>
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">CSS Examples</label>
        <div className="css-examples">
          {cssExamples.map((example, index) => (
            <div key={index} className="css-example-card">
              <div className="example-header">
                <span className="example-name">{example.name}</span>
                <button 
                  className="btn-small btn-icon"
                  onClick={() => setCssCode(cssCode + '\n\n' + example.code)}
                  title="Insert this CSS"
                >
                  ➕ Insert
                </button>
              </div>
              <pre className="example-code">{example.code}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label">Tips</label>
        <ul className="css-tips">
          <li>Use <code>.element</code> to target the current element</li>
          <li>CSS is scoped to prevent conflicts</li>
          <li>Supports all modern CSS features</li>
          <li>Use media queries for responsive styles</li>
          <li>Animations and keyframes are supported</li>
        </ul>
      </div>

      <style jsx>{`
        .scope-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .scope-tab {
          flex: 1;
          padding: 8px 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        
        .scope-tab.active {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }
        
        .scope-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .css-editor {
          width: 100%;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 13px;
          line-height: 1.6;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          resize: vertical;
          background: #1e293b;
          color: #f1f5f9;
        }
        
        .css-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .css-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-primary {
          background: #7c3aed;
          color: white;
        }
        
        .btn-secondary {
          background: #e2e8f0;
          color: #475569;
        }
        
        .css-examples {
          display: grid;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .css-example-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: #f8fafc;
        }
        
        .example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .example-name {
          font-weight: 600;
          color: #1e293b;
        }
        
        .example-code {
          background: #1e293b;
          color: #e2e8f0;
          padding: 10px;
          border-radius: 6px;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
        }
        
        .css-tips {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .css-tips li {
          padding: 6px 0;
          color: #64748b;
          font-size: 13px;
        }
        
        .css-tips code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: #7c3aed;
        }
        
        .btn-small {
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
        }
        
        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default CustomCSSEditor;
