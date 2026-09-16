import React, { useState, useRef } from 'react';
import './DesignSystem.css';

const CustomFontUploader = ({ theme, onThemeChange }) => {
  const [customFonts, setCustomFonts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['.ttf', '.otf', '.woff', '.woff2'];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    const newFonts = [];
    files.forEach(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (supportedFormats.includes(ext)) {
        const fontName = file.name.replace(/\.[^/.]+$/, '');
        const fontUrl = URL.createObjectURL(file);
        
        newFonts.push({
          id: `font-${Date.now()}-${fontName}`,
          name: fontName,
          fileName: file.name,
          url: fontUrl,
          format: ext.substring(1),
          uploadedAt: new Date().toISOString()
        });
      }
    });

    if (newFonts.length > 0) {
      setCustomFonts(prev => [...prev, ...newFonts]);
      
      // Add to available fonts in theme
      const currentFonts = theme.customFonts || [];
      const updatedFonts = [...currentFonts, ...newFonts];
      onThemeChange('customFonts', updatedFonts);
    }

    setIsUploading(false);
    event.target.value = '';
  };

  const removeFont = (fontId) => {
    setCustomFonts(prev => prev.filter(f => f.id !== fontId));
    
    const updatedFonts = (theme.customFonts || []).filter(f => f.id !== fontId);
    onThemeChange('customFonts', updatedFonts);
  };

  const selectFont = (fontName) => {
    onThemeChange('fontFamily', `${fontName}, ${theme.fontFamily || 'sans-serif'}`);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const allFonts = [
    ...['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
         'Poppins', 'Oswald', 'Raleway', 'Playfair Display', 'Merriweather',
         'Nunito', 'Source Sans Pro', 'Ubuntu', 'Crimson Text', 'Work Sans'],
    ...customFonts.map(f => f.name)
  ];

  return (
    <div className="design-panel custom-font-panel">
      <h3 className="panel-title">🅰️ Custom Fonts</h3>
      
      <div className="panel-section">
        <label className="panel-label">Upload Font Files</label>
        <p className="panel-hint">
          Supported formats: TTF, OTF, WOFF, WOFF2
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <button 
          className="upload-btn"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? '⏳ Uploading...' : '📁 Choose Font Files'}
        </button>
      </div>

      {customFonts.length > 0 && (
        <div className="panel-section">
          <label className="panel-label">Uploaded Fonts ({customFonts.length})</label>
          <div className="uploaded-fonts-list">
            {customFonts.map(font => (
              <div key={font.id} className="uploaded-font-item">
                <div className="font-info">
                  <span className="font-name">{font.name}</span>
                  <span className="font-format">{font.format.toUpperCase()}</span>
                </div>
                <div className="font-actions">
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => selectFont(font.name)}
                    title="Use this font"
                  >
                    Use
                  </button>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => removeFont(font.id)}
                    title="Remove font"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel-section">
        <label className="panel-label">Available Fonts</label>
        <select 
          value={theme.fontFamily?.split(',')[0] || 'Inter'}
          onChange={(e) => selectFont(e.target.value)}
          className="panel-select"
        >
          {allFonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <div className="font-preview" style={{ fontFamily: theme.fontFamily }}>
          The quick brown fox jumps over the lazy dog
        </div>
      </div>

      <style jsx>{`
        .uploaded-fonts-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px;
        }
        
        .uploaded-font-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .uploaded-font-item:last-child {
          border-bottom: none;
        }
        
        .font-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .font-name {
          font-weight: 500;
          color: #1e293b;
        }
        
        .font-format {
          font-size: 11px;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
        }
        
        .font-actions {
          display: flex;
          gap: 4px;
        }
        
        .btn-small {
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background: #7c3aed;
          color: white;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .upload-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s;
        }
        
        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CustomFontUploader;
