import { useState, useCallback } from 'react';
import './GridBuilder.css';

const GridBuilder = ({ layout, onChange, theme }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [dragMode, setDragMode] = useState(false);

  const defaultLayout = {
    type: 'grid', // 'grid' | 'flex'
    columns: 3,
    rows: 2,
    gap: 20,
    columnGap: 20,
    rowGap: 20,
    alignItems: 'stretch', // 'start' | 'end' | 'center' | 'stretch'
    justifyContent: 'start', // 'start' | 'end' | 'center' | 'space-between' | 'space-around'
    autoFlow: 'row', // 'row' | 'column' | 'row-dense' | 'column-dense'
    cells: [],
    responsive: {
      tablet: { columns: 2, gap: 15 },
      mobile: { columns: 1, gap: 10 }
    }
  };

  const currentLayout = layout || defaultLayout;

  const updateLayout = (updates) => {
    const newLayout = { ...currentLayout, ...updates };
    onChange?.(newLayout);
  };

  const addCell = () => {
    const newCell = {
      id: `cell-${Date.now()}`,
      columnStart: 1,
      columnEnd: 2,
      rowStart: 1,
      rowEnd: 2,
      content: null,
      backgroundColor: 'transparent',
      padding: 16,
      borderRadius: 8
    };
    updateLayout({ cells: [...currentLayout.cells, newCell] });
  };

  const updateCell = (cellId, updates) => {
    const newCells = currentLayout.cells.map(cell =>
      cell.id === cellId ? { ...cell, ...updates } : cell
    );
    updateLayout({ cells: newCells });
  };

  const removeCell = (cellId) => {
    updateLayout({ cells: currentLayout.cells.filter(c => c.id !== cellId) });
  };

  const handleDragStart = (e, cell) => {
    e.dataTransfer.setData('cellId', cell.id);
    setDragMode(true);
  };

  const handleDrop = (e, targetCell) => {
    e.preventDefault();
    setDragMode(false);
    const sourceId = e.dataTransfer.getData('cellId');
    if (sourceId && sourceId !== targetCell.id) {
      const sourceIndex = currentLayout.cells.findIndex(c => c.id === sourceId);
      const targetIndex = currentLayout.cells.findIndex(c => c.id === targetCell.id);
      const newCells = [...currentLayout.cells];
      const [removed] = newCells.splice(sourceIndex, 1);
      newCells.splice(targetIndex, 0, removed);
      updateLayout({ cells: newCells });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="grid-builder" style={{ '--theme-accent': theme?.accentColor || '#6366f1' }}>
      {/* Controls Panel */}
      <div className="grid-controls">
        <div className="control-group">
          <label>Layout Type</label>
          <div className="toggle-buttons">
            <button
              className={currentLayout.type === 'grid' ? 'active' : ''}
              onClick={() => updateLayout({ type: 'grid' })}
            >
              CSS Grid
            </button>
            <button
              className={currentLayout.type === 'flex' ? 'active' : ''}
              onClick={() => updateLayout({ type: 'flex' })}
            >
              Flexbox
            </button>
          </div>
        </div>

        {currentLayout.type === 'grid' && (
          <>
            <div className="control-row">
              <div className="control-group">
                <label>Columns</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={currentLayout.columns}
                  onChange={(e) => updateLayout({ columns: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="control-group">
                <label>Rows</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={currentLayout.rows}
                  onChange={(e) => updateLayout({ rows: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="control-row">
              <div className="control-group">
                <label>Gap (px)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentLayout.gap}
                  onChange={(e) => updateLayout({ gap: parseInt(e.target.value) })}
                />
                <span>{currentLayout.gap}px</span>
              </div>
            </div>
            <div className="control-group">
              <label>Auto Flow</label>
              <select
                value={currentLayout.autoFlow}
                onChange={(e) => updateLayout({ autoFlow: e.target.value })}
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
                <option value="row-dense">Row Dense</option>
                <option value="column-dense">Column Dense</option>
              </select>
            </div>
          </>
        )}

        {currentLayout.type === 'flex' && (
          <>
            <div className="control-group">
              <label>Align Items</label>
              <select
                value={currentLayout.alignItems}
                onChange={(e) => updateLayout({ alignItems: e.target.value })}
              >
                <option value="stretch">Stretch</option>
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div className="control-group">
              <label>Justify Content</label>
              <select
                value={currentLayout.justifyContent}
                onChange={(e) => updateLayout({ justifyContent: e.target.value })}
              >
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
            </div>
          </>
        )}

        <div className="control-row">
          <div className="control-group">
            <label>Align Items</label>
            <select
              value={currentLayout.alignItems}
              onChange={(e) => updateLayout({ alignItems: e.target.value })}
            >
              <option value="stretch">Stretch</option>
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="center">Center</option>
            </select>
          </div>
          <div className="control-group">
            <label>Justify Content</label>
            <select
              value={currentLayout.justifyContent}
              onChange={(e) => updateLayout({ justifyContent: e.target.value })}
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="center">Center</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>
        </div>

        <button className="add-cell-btn" onClick={addCell}>
          + Add Cell
        </button>
      </div>

      {/* Visual Preview */}
      <div className="grid-preview-area">
        <h4>Visual Editor</h4>
        <p className="preview-hint">Drag cells to reorder • Click to edit</p>
        
        <div
          className="grid-canvas"
          style={{
            display: currentLayout.type === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: currentLayout.type === 'grid' 
              ? `repeat(${currentLayout.columns}, 1fr)` 
              : undefined,
            gridTemplateRows: currentLayout.type === 'grid'
              ? `repeat(${currentLayout.rows}, 1fr)`
              : undefined,
            gap: `${currentLayout.gap}px`,
            columnGap: `${currentLayout.columnGap}px`,
            rowGap: `${currentLayout.rowGap}px`,
            alignItems: currentLayout.alignItems,
            justifyContent: currentLayout.justifyContent,
            gridAutoFlow: currentLayout.type === 'grid' ? currentLayout.autoFlow : undefined
          }}
        >
          {currentLayout.cells.map((cell) => (
            <div
              key={cell.id}
              className={`grid-cell ${selectedCell?.id === cell.id ? 'selected' : ''}`}
              style={{
                gridColumnStart: cell.columnStart,
                gridColumnEnd: cell.columnEnd,
                gridRowStart: cell.rowStart,
                gridRowEnd: cell.rowEnd,
                backgroundColor: cell.backgroundColor,
                padding: `${cell.padding}px`,
                borderRadius: `${cell.borderRadius}px`
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, cell)}
              onDrop={(e) => handleDrop(e, cell)}
              onDragOver={handleDragOver}
              onClick={() => setSelectedCell(cell)}
            >
              <div className="cell-header">
                <span className="cell-id">{cell.id.split('-')[1]}</span>
                <button
                  className="remove-cell"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCell(cell.id);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="cell-content">
                {cell.content || 'Drop content here'}
              </div>
            </div>
          ))}
          
          {currentLayout.cells.length === 0 && (
            <div className="empty-grid-message">
              Click "+ Add Cell" to start building your layout
            </div>
          )}
        </div>
      </div>

      {/* Cell Properties Panel */}
      {selectedCell && (
        <div className="cell-properties">
          <h4>Cell Properties</h4>
          <div className="control-row">
            <div className="control-group">
              <label>Column Start</label>
              <input
                type="number"
                min="1"
                max="12"
                value={selectedCell.columnStart}
                onChange={(e) => updateCell(selectedCell.id, { columnStart: parseInt(e.target.value) })}
              />
            </div>
            <div className="control-group">
              <label>Column End</label>
              <input
                type="number"
                min="2"
                max="13"
                value={selectedCell.columnEnd}
                onChange={(e) => updateCell(selectedCell.id, { columnEnd: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="control-row">
            <div className="control-group">
              <label>Row Start</label>
              <input
                type="number"
                min="1"
                max="20"
                value={selectedCell.rowStart}
                onChange={(e) => updateCell(selectedCell.id, { rowStart: parseInt(e.target.value) })}
              />
            </div>
            <div className="control-group">
              <label>Row End</label>
              <input
                type="number"
                min="2"
                max="21"
                value={selectedCell.rowEnd}
                onChange={(e) => updateCell(selectedCell.id, { rowEnd: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="control-group">
            <label>Background</label>
            <input
              type="color"
              value={selectedCell.backgroundColor !== 'transparent' ? selectedCell.backgroundColor : '#ffffff'}
              onChange={(e) => updateCell(selectedCell.id, { backgroundColor: e.target.value })}
            />
            <button
              className="clear-bg"
              onClick={() => updateCell(selectedCell.id, { backgroundColor: 'transparent' })}
            >
              Clear
            </button>
          </div>
          <div className="control-row">
            <div className="control-group">
              <label>Padding (px)</label>
              <input
                type="range"
                min="0"
                max="64"
                value={selectedCell.padding}
                onChange={(e) => updateCell(selectedCell.id, { padding: parseInt(e.target.value) })}
              />
              <span>{selectedCell.padding}px</span>
            </div>
            <div className="control-group">
              <label>Radius (px)</label>
              <input
                type="range"
                min="0"
                max="32"
                value={selectedCell.borderRadius}
                onChange={(e) => updateCell(selectedCell.id, { borderRadius: parseInt(e.target.value) })}
              />
              <span>{selectedCell.borderRadius}px</span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Settings */}
      <div className="responsive-settings">
        <h4>Responsive Breakpoints</h4>
        <div className="breakpoint-row">
          <span>📱 Mobile</span>
          <input
            type="number"
            min="1"
            max="4"
            value={currentLayout.responsive.mobile.columns}
            onChange={(e) => updateLayout({
              responsive: {
                ...currentLayout.responsive,
                mobile: { ...currentLayout.responsive.mobile, columns: parseInt(e.target.value) }
              }
            })}
          />
          <span>columns</span>
        </div>
        <div className="breakpoint-row">
          <span>📲 Tablet</span>
          <input
            type="number"
            min="1"
            max="8"
            value={currentLayout.responsive.tablet.columns}
            onChange={(e) => updateLayout({
              responsive: {
                ...currentLayout.responsive,
                tablet: { ...currentLayout.responsive.tablet, columns: parseInt(e.target.value) }
              }
            })}
          />
          <span>columns</span>
        </div>
      </div>
    </div>
  );
};

export default GridBuilder;
