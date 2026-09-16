import { useState } from 'react';
import './VersionHistory.css';

const VersionHistory = ({ history, currentVersion, onRestore, onSaveVersion, theme }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [versionNote, setVersionNote] = useState('');
  const [compareTarget, setCompareTarget] = useState(null);

  const defaultVersions = [
    {
      id: 'v1',
      name: 'Initial Version',
      timestamp: new Date(Date.now() - 86400000),
      note: 'Created initial page layout',
      changes: 0,
      isCurrent: false
    },
    {
      id: 'v2',
      name: 'Added Hero Section',
      timestamp: new Date(Date.now() - 3600000),
      note: 'Updated hero with new CTA',
      changes: 3,
      isCurrent: false
    },
    {
      id: 'v3',
      name: 'Current Version',
      timestamp: new Date(),
      note: 'Latest auto-save',
      changes: 1,
      isCurrent: true
    }
  ];

  const versions = history?.versions || defaultVersions;

  const formatTimestamp = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const saveNamedVersion = () => {
    if (!versionNote.trim()) return;
    
    const newVersion = {
      id: `v${versions.length + 1}`,
      name: `Version ${versions.length + 1}`,
      timestamp: new Date(),
      note: versionNote,
      changes: 0,
      isCurrent: true
    };
    
    onSaveVersion?.(newVersion);
    setVersionNote('');
  };

  const getChangesColor = (changes) => {
    if (changes === 0) return '#6b7280';
    if (changes < 5) return '#059669';
    if (changes < 10) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="version-history" style={{ '--theme-accent': theme?.accentColor || '#6366f1' }}>
      {/* Header */}
      <div className="vh-header">
        <h3>Version History</h3>
        <div className="vh-actions">
          <button 
            className="compare-btn"
            onClick={() => setShowCompare(!showCompare)}
          >
            {showCompare ? '✓ Done Comparing' : '⚖️ Compare'}
          </button>
          <button className="save-version-btn" onClick={saveNamedVersion}>
            💾 Save Version
          </button>
        </div>
      </div>

      {/* Version Note Input */}
      <div className="version-note-input">
        <input
          type="text"
          placeholder="Add a note for this version..."
          value={versionNote}
          onChange={(e) => setVersionNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && saveNamedVersion()}
        />
        <button onClick={saveNamedVersion}>Save</button>
      </div>

      {/* Versions List */}
      <div className="versions-list">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className={`version-item ${version.isCurrent ? 'current' : ''} ${selectedVersion?.id === version.id ? 'selected' : ''}`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="version-main">
              <div className="version-header">
                <span className="version-name">{version.name}</span>
                {version.isCurrent && <span className="current-badge">Current</span>}
              </div>
              <div className="version-meta">
                <span className="version-time">{formatTimestamp(version.timestamp)}</span>
                <span className="version-changes" style={{ color: getChangesColor(version.changes) }}>
                  {version.changes} change{version.changes !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {version.note && (
              <div className="version-note">{version.note}</div>
            )}

            <div className="version-actions">
              <button
                className="action-btn preview"
                onClick={(e) => {
                  e.stopPropagation();
                  // Preview logic here
                }}
                title="Preview this version"
              >
                👁️
              </button>
              {!version.isCurrent && (
                <>
                  <button
                    className="action-btn restore"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore?.(version);
                    }}
                    title="Restore this version"
                  >
                    ↩️ Restore
                  </button>
                  {showCompare && !compareTarget && (
                    <button
                      className="action-btn compare-select"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareTarget(version);
                      }}
                      title="Select for comparison"
                    >
                      📊 Select
                    </button>
                  )}
                </>
              )}
            </div>

            {showCompare && compareTarget && compareTarget.id !== version.id && (
              <button
                className="compare-now-btn"
                onClick={() => {
                  // Trigger comparison between compareTarget and version
                  setShowCompare(false);
                  setCompareTarget(null);
                }}
              >
                Compare with {compareTarget.name}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comparison View */}
      {showCompare && compareTarget && (
        <div className="comparison-view">
          <div className="comparison-header">
            <h4>Comparing Versions</h4>
            <button 
              className="close-compare"
              onClick={() => {
                setShowCompare(false);
                setCompareTarget(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="comparison-content">
            <div className="compare-column">
              <h5>{compareTarget.name}</h5>
              <p className="compare-time">{formatTimestamp(compareTarget.timestamp)}</p>
              <div className="compare-details">
                <p>Note: {compareTarget.note || 'No notes'}</p>
                <p>Changes: {compareTarget.changes}</p>
              </div>
            </div>
            <div className="compare-arrow">→</div>
            <div className="compare-column current">
              <h5>Current Version</h5>
              <p className="compare-time">{formatTimestamp(new Date())}</p>
              <div className="compare-details">
                <p>Latest auto-saved state</p>
              </div>
            </div>
          </div>
          <div className="comparison-summary">
            <h5>Summary of Changes</h5>
            <ul>
              <li>Sections modified: <strong>2</strong></li>
              <li>Content updated: <strong>5</strong> elements</li>
              <li>Styles changed: <strong>3</strong> properties</li>
            </ul>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {selectedVersion && !selectedVersion.isCurrent && (
        <div className="restore-modal-overlay">
          <div className="restore-modal">
            <h4>Restore Version?</h4>
            <p>
              You're about to restore <strong>{selectedVersion.name}</strong>. 
              This will create a new version with the restored content.
            </p>
            <div className="restore-info">
              <p><strong>From:</strong> {formatTimestamp(selectedVersion.timestamp)}</p>
              <p><strong>Note:</strong> {selectedVersion.note || 'No notes'}</p>
              <p><strong>Changes:</strong> {selectedVersion.changes}</p>
            </div>
            <div className="restore-actions">
              <button 
                className="cancel-btn"
                onClick={() => setSelectedVersion(null)}
              >
                Cancel
              </button>
              <button 
                className="confirm-restore-btn"
                onClick={() => {
                  onRestore?.(selectedVersion);
                  setSelectedVersion(null);
                }}
              >
                ✓ Restore Version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-save Indicator */}
      <div className="auto-save-indicator">
        <span className="save-dot"></span>
        Auto-saved {formatTimestamp(new Date())}
      </div>
    </div>
  );
};

export default VersionHistory;
