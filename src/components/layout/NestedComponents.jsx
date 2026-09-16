import React, { useState, useCallback } from 'react';
import './NestedComponents.css';

/**
 * NestedComponents Component
 * Enables component-in-component editing with unlimited nesting levels
 */
const NestedComponents = ({ 
  components = [], 
  onAddComponent, 
  onUpdateComponent, 
  onDeleteComponent,
  selectedId,
  onSelect
}) => {
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Toggle expanded state for nested items
  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Find component by ID
  const findComponent = useCallback((id, comps = components) => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children && comp.children.length > 0) {
        const found = findComponent(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  }, [components]);

  // Add child component to parent
  const addChildComponent = (parentId, childComponent) => {
    const updateTree = (comps) => {
      return comps.map(comp => {
        if (comp.id === parentId) {
          return {
            ...comp,
            children: [...(comp.children || []), childComponent]
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children)
          };
        }
        return comp;
      });
    };
    
    onAddComponent(updateTree(components));
  };

  // Update component in tree
  const updateComponentInTree = (id, updates) => {
    const updateTree = (comps) => {
      return comps.map(comp => {
        if (comp.id === id) {
          return { ...comp, ...updates };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children)
          };
        }
        return comp;
      });
    };
    
    onUpdateComponent(updateTree(components));
  };

  // Delete component from tree
  const deleteComponentFromTree = (id) => {
    const removeFromTree = (comps) => {
      return comps
        .filter(comp => comp.id !== id)
        .map(comp => {
          if (comp.children && comp.children.length > 0) {
            return {
              ...comp,
              children: removeFromTree(comp.children)
            };
          }
          return comp;
        });
    };
    
    onDeleteComponent(removeFromTree(components));
  };

  // Render component tree recursively
  const renderTree = (comps, level = 0) => {
    return comps.map(comp => {
      const hasChildren = comp.children && comp.children.length > 0;
      const isExpanded = expandedIds.has(comp.id);
      const isSelected = selectedId === comp.id;

      return (
        <div key={comp.id} className="nested-component-tree">
          <div
            className={`nested-component-item level-${level} ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => onSelect(comp.id)}
          >
            {/* Expand/Collapse toggle */}
            {hasChildren && (
              <button
                className="expand-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(comp.id);
                }}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            
            {!hasChildren && <span className="expand-placeholder" />}

            {/* Component icon based on type */}
            <span className="component-icon">
              {getIconForType(comp.type)}
            </span>

            {/* Component name */}
            <span className="component-name">{comp.name || comp.type}</span>

            {/* Instance badge if it's a symbol instance */}
            {comp.isInstance && (
              <span className="instance-badge">Instance</span>
            )}

            {/* Actions */}
            <div className="component-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="action-btn add-child"
                title="Add child component"
                onClick={() => handleAddChild(comp.id)}
              >
                +
              </button>
              <button
                className="action-btn edit"
                title="Edit component"
                onClick={() => handleEditComponent(comp)}
              >
                ✏️
              </button>
              {level > 0 && (
                <button
                  className="action-btn delete"
                  title="Delete component"
                  onClick={() => deleteComponentFromTree(comp.id)}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && (
            <div className="nested-children">
              {renderTree(comp.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleAddChild = (parentId) => {
    // Open modal or trigger component picker
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: 'container',
      name: 'New Component',
      children: [],
      props: {}
    };
    addChildComponent(parentId, newComponent);
  };

  const handleEditComponent = (component) => {
    // Open editor for this component
    onSelect(component.id);
  };

  return (
    <div className="nested-components-container">
      <div className="nested-header">
        <h3>Nested Components</h3>
        <button
          className="add-root-component"
          onClick={() => handleAddChild(null)}
        >
          + Add Root Component
        </button>
      </div>
      
      <div className="nested-tree-view">
        {components.length === 0 ? (
          <div className="empty-state">
            <p>No components yet</p>
            <p className="hint">Click "Add Root Component" to start building</p>
          </div>
        ) : (
          renderTree(components)
        )}
      </div>
    </div>
  );
};

/**
 * SymbolInstance Component
 * Represents an instance of a master component with overrides
 */
export const SymbolInstance = ({ 
  instance, 
  masterComponent, 
  onOverride,
  onDetach
}) => {
  const [overrides, setOverrides] = useState(instance.overrides || {});

  const handleOverride = (property, value) => {
    const newOverrides = {
      ...overrides,
      [property]: value
    };
    setOverrides(newOverrides);
    onOverride(instance.id, newOverrides);
  };

  return (
    <div className="symbol-instance">
      <div className="instance-header">
        <span className="instance-name">{instance.name}</span>
        <span className="master-link">
          Linked to: {masterComponent?.name || 'Master'}
        </span>
      </div>

      <div className="instance-content">
        {/* Render with overrides applied */}
        <div className="instance-preview">
          {React.cloneElement(masterComponent?.content || <div />, {
            style: {
              ...masterComponent?.props?.style,
              ...overrides.style
            },
            children: overrides.text || masterComponent?.props?.children
          })}
        </div>
      </div>

      <div className="instance-overrides">
        <h4>Overrides</h4>
        
        <div className="override-field">
          <label>Text Content</label>
          <input
            type="text"
            value={overrides.text || ''}
            onChange={(e) => handleOverride('text', e.target.value)}
            placeholder="Override text..."
          />
        </div>

        <div className="override-field">
          <label>Color</label>
          <input
            type="color"
            value={overrides.color || '#000000'}
            onChange={(e) => handleOverride('color', e.target.value)}
          />
        </div>

        <div className="override-field">
          <label>Background Color</label>
          <input
            type="color"
            value={overrides.backgroundColor || '#ffffff'}
            onChange={(e) => handleOverride('backgroundColor', e.target.value)}
          />
        </div>

        <button
          className="detach-instance"
          onClick={() => onDetach(instance.id)}
        >
          Detach from Master
        </button>
      </div>
    </div>
  );
};

/**
 * ComponentNestingPanel - Main panel for managing nested components
 */
export const ComponentNestingPanel = ({ components, onUpdateComponents }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleAddComponent = (newTree) => {
    onUpdateComponents(newTree);
  };

  const handleUpdateComponent = (newTree) => {
    onUpdateComponents(newTree);
  };

  const handleDeleteComponent = (newTree) => {
    onUpdateComponents(newTree);
    if (selectedId && !findComponentById(newTree, selectedId)) {
      setSelectedId(null);
    }
  };

  const findComponentById = (comps, id) => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponentById(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getIconForType = (type) => {
    const icons = {
      container: '📦',
      text: '📝',
      image: '🖼️',
      button: '🔘',
      input: '⌨️',
      grid: '▦',
      flex: '⇄',
      section: '📄',
      header: '🎯',
      footer: '🏁',
      nav: '🧭',
      modal: '🪟',
      card: '🃏'
    };
    return icons[type] || '🔷';
  };

  return (
    <div className="component-nesting-panel">
      <NestedComponents
        components={components}
        onAddComponent={handleAddComponent}
        onUpdateComponent={handleUpdateComponent}
        onDeleteComponent={handleDeleteComponent}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </div>
  );
};

// Helper function for external use
const getIconForType = (type) => {
  const icons = {
    container: '📦',
    text: '📝',
    image: '🖼️',
    button: '🔘',
    input: '⌨️',
    grid: '▦',
    flex: '⇄',
    section: '📄',
    header: '🎯',
    footer: '🏁',
    nav: '🧭',
    modal: '🪟',
    card: '🃏'
  };
  return icons[type] || '🔷';
};

export default NestedComponents;
