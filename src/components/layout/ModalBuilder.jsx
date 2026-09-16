import { useState, useEffect } from 'react';
import './ModalBuilder.css';

const ModalBuilder = ({ theme, onSave }) => {
  const [modals, setModals] = useState([]);
  const [selectedModal, setSelectedModal] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState(null);

  const defaultModal = {
    id: `modal-${Date.now()}`,
    name: 'New Modal',
    triggerType: 'button', // button, link, auto, scroll, exit-intent
    triggerElement: null,
    autoDelay: 3000,
    scrollPercentage: 50,
    animation: 'fade', // fade, slide, zoom, flip
    overlay: true,
    closeOnOverlay: true,
    closeOnEscape: true,
    showCloseButton: true,
    width: 600,
    padding: 32,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    content: []
  };

  const addModal = () => {
    const newModal = { ...defaultModal, id: `modal-${Date.now()}` };
    setModals([...modals, newModal]);
    setSelectedModal(newModal);
  };

  const updateModal = (modalId, updates) => {
    const updated = modals.map(m => 
      m.id === modalId ? { ...m, ...updates } : m
    );
    setModals(updated);
    if (selectedModal?.id === modalId) {
      setSelectedModal({ ...selectedModal, ...updates });
    }
    onSave?.(updated);
  };

  const deleteModal = (modalId) => {
    const filtered = modals.filter(m => m.id !== modalId);
    setModals(filtered);
    if (selectedModal?.id === modalId) {
      setSelectedModal(null);
    }
    onSave?.(filtered);
  };

  const duplicateModal = (modal) => {
    const copy = { 
      ...modal, 
      id: `modal-${Date.now()}`, 
      name: `${modal.name} (Copy)` 
    };
    setModals([...modals, copy]);
    setSelectedModal(copy);
  };

  const getTriggerLabel = (type) => {
    const labels = {
      button: '🔘 Button Click',
      link: '🔗 Link Click',
      auto: '⏱️ Auto (Delay)',
      scroll: '📜 Scroll Position',
      'exit-intent': '🚪 Exit Intent'
    };
    return labels[type] || type;
  };

  const getAnimationOptions = () => [
    { value: 'fade', label: 'Fade In' },
    { value: 'slide', label: 'Slide Up' },
    { value: 'zoom', label: 'Zoom In' },
    { value: 'flip', label: 'Flip' },
    { value: 'none', label: 'None' }
  ];

  return (
    <div className="modal-builder" style={{ '--theme-accent': theme?.accentColor || '#6366f1' }}>
      {/* Sidebar - Modal List */}
      <div className="modal-sidebar">
        <div className="sidebar-header">
          <h3>Modals & Popups</h3>
          <button className="add-modal-btn" onClick={addModal}>
            + New Modal
          </button>
        </div>
        
        <div className="modal-list">
          {modals.length === 0 ? (
            <div className="empty-state">
              <p>No modals yet</p>
              <p className="hint">Click "+ New Modal" to create one</p>
            </div>
          ) : (
            modals.map(modal => (
              <div
                key={modal.id}
                className={`modal-item ${selectedModal?.id === modal.id ? 'active' : ''}`}
                onClick={() => setSelectedModal(modal)}
              >
                <div className="modal-info">
                  <span className="modal-name">{modal.name}</span>
                  <span className="modal-trigger">{getTriggerLabel(modal.triggerType)}</span>
                </div>
                <div className="modal-actions">
                  <button
                    className="action-btn duplicate"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateModal(modal);
                    }}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteModal(modal.id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="preview-btn"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '✏️ Edit' : '👁️ Preview'}
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="modal-editor">
        {selectedModal ? (
          <>
            <div className="editor-header">
              <input
                type="text"
                className="modal-name-input"
                value={selectedModal.name}
                onChange={(e) => updateModal(selectedModal.id, { name: e.target.value })}
              />
              <div className="editor-actions">
                <button 
                  className="test-trigger-btn"
                  onClick={() => setActiveTrigger(selectedModal.id)}
                >
                  🧪 Test Trigger
                </button>
              </div>
            </div>

            <div className="editor-content">
              {/* Left Panel - Settings */}
              <div className="settings-panel">
                <h4>Trigger Settings</h4>
                
                <div className="setting-group">
                  <label>Trigger Type</label>
                  <select
                    value={selectedModal.triggerType}
                    onChange={(e) => updateModal(selectedModal.id, { triggerType: e.target.value })}
                  >
                    <option value="button">Button Click</option>
                    <option value="link">Link Click</option>
                    <option value="auto">Auto (Delay)</option>
                    <option value="scroll">Scroll Position</option>
                    <option value="exit-intent">Exit Intent</option>
                  </select>
                </div>

                {selectedModal.triggerType === 'auto' && (
                  <div className="setting-group">
                    <label>Delay (ms)</label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={selectedModal.autoDelay}
                      onChange={(e) => updateModal(selectedModal.id, { autoDelay: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                {selectedModal.triggerType === 'scroll' && (
                  <div className="setting-group">
                    <label>Scroll Percentage (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedModal.scrollPercentage}
                      onChange={(e) => updateModal(selectedModal.id, { scrollPercentage: parseInt(e.target.value) })}
                    />
                    <span>{selectedModal.scrollPercentage}%</span>
                  </div>
                )}

                <h4>Appearance</h4>
                
                <div className="setting-group">
                  <label>Animation</label>
                  <select
                    value={selectedModal.animation}
                    onChange={(e) => updateModal(selectedModal.id, { animation: e.target.value })}
                  >
                    {getAnimationOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-row">
                  <div className="setting-group">
                    <label>Width (px)</label>
                    <input
                      type="range"
                      min="300"
                      max="1200"
                      value={selectedModal.width}
                      onChange={(e) => updateModal(selectedModal.id, { width: parseInt(e.target.value) })}
                    />
                    <span>{selectedModal.width}px</span>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-group">
                    <label>Padding (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="64"
                      value={selectedModal.padding}
                      onChange={(e) => updateModal(selectedModal.id, { padding: parseInt(e.target.value) })}
                    />
                    <span>{selectedModal.padding}px</span>
                  </div>
                  <div className="setting-group">
                    <label>Radius (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={selectedModal.borderRadius}
                      onChange={(e) => updateModal(selectedModal.id, { borderRadius: parseInt(e.target.value) })}
                    />
                    <span>{selectedModal.borderRadius}px</span>
                  </div>
                </div>

                <div className="setting-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={selectedModal.backgroundColor}
                    onChange={(e) => updateModal(selectedModal.id, { backgroundColor: e.target.value })}
                  />
                </div>

                <h4>Behavior</h4>
                
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedModal.overlay}
                      onChange={(e) => updateModal(selectedModal.id, { overlay: e.target.checked })}
                    />
                    Show Overlay
                  </label>
                </div>

                {selectedModal.overlay && (
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedModal.closeOnOverlay}
                        onChange={(e) => updateModal(selectedModal.id, { closeOnOverlay: e.target.checked })}
                      />
                      Close on Overlay Click
                    </label>
                  </div>
                )}

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedModal.closeOnEscape}
                      onChange={(e) => updateModal(selectedModal.id, { closeOnEscape: e.target.checked })}
                    />
                    Close on ESC Key
                  </label>
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedModal.showCloseButton}
                      onChange={(e) => updateModal(selectedModal.id, { showCloseButton: e.target.checked })}
                    />
                    Show Close Button
                  </label>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="preview-panel">
                <h4>Modal Preview</h4>
                <div 
                  className="modal-preview-container"
                  onClick={() => selectedModal.closeOnOverlay && setActiveTrigger(null)}
                >
                  <div
                    className={`modal-preview ${selectedModal.animation}-animation`}
                    style={{
                      width: `${selectedModal.width}px`,
                      padding: `${selectedModal.padding}px`,
                      borderRadius: `${selectedModal.borderRadius}px`,
                      backgroundColor: selectedModal.backgroundColor
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedModal.showCloseButton && (
                      <button
                        className="preview-close-btn"
                        onClick={() => setActiveTrigger(null)}
                      >
                        ×
                      </button>
                    )}
                    <div className="preview-content">
                      <h3>{selectedModal.name}</h3>
                      <p>This is a preview of your modal content.</p>
                      <p>Add your custom content using the section editor.</p>
                      <button 
                        className="preview-cta-btn"
                        style={{ 
                          background: theme?.accentColor || '#6366f1',
                          marginTop: '16px'
                        }}
                      >
                        Call to Action
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="trigger-code">
                  <h5>Trigger Code Snippet</h5>
                  <code>
                    {selectedModal.triggerType === 'button' && 
                      `data-modal-trigger="${selectedModal.id}"`}
                    {selectedModal.triggerType === 'auto' && 
                      `// Auto opens after ${selectedModal.autoDelay}ms`}
                    {selectedModal.triggerType === 'scroll' && 
                      `// Opens at ${selectedModal.scrollPercentage}% scroll`}
                    {selectedModal.triggerType === 'exit-intent' && 
                      `// Opens on exit intent detection`}
                  </code>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <h3>Select or Create a Modal</h3>
            <p>Choose a modal from the sidebar or create a new one to start editing.</p>
            <button className="create-first-btn" onClick={addModal}>
              + Create Your First Modal
            </button>
          </div>
        )}
      </div>

      {/* Active Modal for Testing */}
      {activeTrigger && selectedModal && (
        <div className="modal-overlay-active">
          <div
            className={`modal-active ${selectedModal.animation}-animation`}
            style={{
              width: `${selectedModal.width}px`,
              padding: `${selectedModal.padding}px`,
              borderRadius: `${selectedModal.borderRadius}px`,
              backgroundColor: selectedModal.backgroundColor
            }}
          >
            {selectedModal.showCloseButton && (
              <button
                className="close-btn"
                onClick={() => setActiveTrigger(null)}
              >
                ×
              </button>
            )}
            <div className="modal-content-area">
              <h3>{selectedModal.name}</h3>
              <p>Your modal content goes here</p>
              <button 
                className="modal-submit-btn"
                style={{ background: theme?.accentColor || '#6366f1' }}
                onClick={() => setActiveTrigger(null)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalBuilder;
