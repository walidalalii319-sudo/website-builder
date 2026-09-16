import React, { useState, useCallback } from 'react';
import './LayersPanel.css';

/**
 * LayersPanel Component
 * Provides visual hierarchy panel with drag-to-reorder, visibility toggles, and lock/unlock
 */
const LayersPanel = ({ 
  layers = [], 
  onReorder, 
  onToggleVisibility, 
  onToggleLock,
  onSelect,
  selectedId 
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [dragOverLayer, setDragOverLayer] = useState(null);

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Handle drag start
  const handleDragStart = (e, layer) => {
    setDraggedLayer(layer);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', layer.id);
  };

  // Handle drag over
  const handleDragOver = (e, layer) => {
    e.preventDefault();
    if (draggedLayer && draggedLayer.id !== layer.id) {
      setDragOverLayer(layer.id);
    }
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverLayer(null);
  };

  // Handle drop
  const handleDrop = (e, targetLayer) => {
    e.preventDefault();
    if (draggedLayer && draggedLayer.id !== targetLayer.id) {
      onReorder(draggedLayer.id, targetLayer.id);
    }
    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  // Render layer tree recursively
  const renderLayerTree = (items, level = 0) => {
    return items.map((layer, index) => {
      const hasChildren = layer.children && layer.children.length > 0;
      const isExpanded = expandedGroups.has(layer.id);
      const isSelected = selectedId === layer.id;
      const isVisible = layer.visible !== false;
      const isLocked = layer.locked === true;

      return (
        <div key={layer.id} className="layer-tree-item">
          <div
            className={`layer-row level-${level} ${isSelected ? 'selected' : ''} ${dragOverLayer === layer.id ? 'drag-over' : ''}`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            draggable
            onDragStart={(e) => handleDragStart(e, layer)}
            onDragOver={(e) => handleDragOver(e, layer)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, layer)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(layer.id)}
          >
            {/* Drag handle */}
            <span className="drag-handle" title="Drag to reorder">
              ⋮⋮
            </span>

            {/* Expand/Collapse toggle */}
            {hasChildren ? (
              <button
                className="expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(layer.id);
                }}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            ) : (
              <span className="expand-placeholder" />
            )}

            {/* Visibility toggle */}
            <button
              className={`visibility-toggle ${isVisible ? 'visible' : 'hidden'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
              title={isVisible ? 'Hide layer' : 'Show layer'}
            >
              {isVisible ? '👁️' : '🚫'}
            </button>

            {/* Lock toggle */}
            <button
              className={`lock-toggle ${isLocked ? 'locked' : 'unlocked'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(layer.id);
              }}
              title={isLocked ? 'Unlock layer' : 'Lock layer'}
            >
              {isLocked ? '🔒' : '🔓'}
            </button>

            {/* Layer icon based on type */}
            <span className="layer-icon">
              {getIconForType(layer.type)}
            </span>

            {/* Layer name */}
            <span className="layer-name">{layer.name || layer.type || 'Unnamed'}</span>

            {/* Selection indicator */}
            {isSelected && (
              <span className="selection-indicator">●</span>
            )}
          </div>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && (
            <div className="layer-children">
              {renderLayerTree(layer.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="layers-panel-container">
      <div className="layers-header">
        <h3>Layers</h3>
        <div className="layers-actions">
          <button 
            className="action-btn" 
            title="Expand All"
            onClick={() => expandAll(layers)}
          >
            ⤢
          </button>
          <button 
            className="action-btn" 
            title="Collapse All"
            onClick={() => collapseAll(layers)}
          >
            ⤡
          </button>
        </div>
      </div>

      <div className="layers-list">
        {layers.length === 0 ? (
          <div className="empty-state">
            <p>No layers yet</p>
            <p className="hint">Add elements to see them here</p>
          </div>
        ) : (
          renderLayerTree(layers)
        )}
      </div>

      <div className="layers-footer">
        <div className="legend">
          <span className="legend-item">
            <span className="legend-icon">👁️</span> Visible
          </span>
          <span className="legend-item">
            <span className="legend-icon">🚫</span> Hidden
          </span>
          <span className="legend-item">
            <span className="legend-icon">🔓</span> Unlocked
          </span>
          <span className="legend-item">
            <span className="legend-icon">🔒</span> Locked
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const expandAll = (layers) => {
  // Implementation would expand all groups
  console.log('Expand all');
};

const collapseAll = (layers) => {
  // Implementation would collapse all groups
  console.log('Collapse all');
};

const getIconForType = (type) => {
  const icons = {
    section: '📄',
    container: '📦',
    row: '▬',
    column: '│',
    grid: '▦',
    text: '📝',
    heading: '🔠',
    paragraph: '¶',
    image: '🖼️',
    video: '🎥',
    button: '🔘',
    link: '🔗',
    input: '⌨️',
    form: '📋',
    card: '🃏',
    modal: '🪟',
    popup: '💬',
    header: '🎯',
    footer: '🏁',
    nav: '🧭',
    menu: '☰',
    logo: '⭐',
    icon: '★',
    shape: '◆',
    divider: '─',
    spacer: '↕️',
    code: '</>',
    html: '🌐',
    embed: '📌'
  };
  return icons[type] || '🔷';
};

/**
 * LayersPanelWithSearch - Enhanced version with search/filter
 */
export const LayersPanelWithSearch = ({ layers, ...props }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showOnlyVisible, setShowOnlyVisible] = useState(false);
  const [showOnlyLocked, setShowOnlyLocked] = useState(false);

  // Filter layers based on search and filters
  const filterLayers = useCallback((items) => {
    return items.filter(layer => {
      // Search filter
      const matchesSearch = !searchQuery || 
        (layer.name && layer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (layer.type && layer.type.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const matchesType = filterType === 'all' || layer.type === filterType;

      // Visibility filter
      const matchesVisibility = !showOnlyVisible || layer.visible !== false;

      // Lock filter
      const matchesLock = !showOnlyLocked || layer.locked === true;

      return matchesSearch && matchesType && matchesVisibility && matchesLock;
    }).map(layer => ({
      ...layer,
      children: layer.children ? filterLayers(layer.children) : []
    }));
  }, [searchQuery, filterType, showOnlyVisible, showOnlyLocked]);

  const filteredLayers = filterLayers(layers);

  return (
    <div className="layers-panel-with-search">
      <div className="layers-search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search layers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="type-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="section">Sections</option>
          <option value="container">Containers</option>
          <option value="text">Text</option>
          <option value="image">Images</option>
          <option value="button">Buttons</option>
          <option value="input">Inputs</option>
        </select>
      </div>

      <div className="layers-filters">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyVisible}
            onChange={(e) => setShowOnlyVisible(e.target.checked)}
          />
          Visible only
        </label>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyLocked}
            onChange={(e) => setShowOnlyLocked(e.target.checked)}
          />
          Locked only
        </label>
      </div>

      <LayersPanel 
        layers={filteredLayers} 
        {...props} 
      />
    </div>
  );
};

export default LayersPanel;
