import React, { useState, useCallback } from 'react';

/**
 * DraggableItem Component
 * A reusable component for drag-and-drop functionality
 */
export function DraggableItem({ id, children, onDragStart, onDragOver, onDrop, className = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(id, e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
    if (onDragOver) onDragOver(id, e);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (onDrop) onDrop(draggedId, id, e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`draggable-item ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''} ${className}`}
      style={{ cursor: 'grab' }}
    >
      {children}
    </div>
  );
}

/**
 * useDragAndDrop Hook
 * Custom hook for managing drag-and-drop state and operations
 */
export function useDragAndDrop(items, onReorder) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragStart = useCallback((id) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback((id) => {
    if (id !== draggedId) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDrop = useCallback((sourceId, targetId) => {
    if (sourceId && targetId && sourceId !== targetId) {
      const newItems = [...items];
      const sourceIndex = newItems.findIndex(item => item.id === sourceId);
      const targetIndex = newItems.findIndex(item => item.id === targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const [removed] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, removed);
        
        if (onReorder) {
          onReorder(newItems);
        }
      }
    }
    
    setDraggedId(null);
    setDragOverId(null);
  }, [items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  return {
    draggedId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}

/**
 * SortableList Component
 * A higher-level component for sortable lists with drag-and-drop
 */
export function SortableList({ items, renderItem, onReorder, className = '' }) {
  const {
    draggedId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop(items, onReorder);

  return (
    <div className={`sortable-list ${className}`}>
      {items.map((item) => (
        <DraggableItem
          key={item.id}
          id={item.id}
          onDragStart={() => handleDragStart(item.id)}
          onDragOver={() => handleDragOver(item.id)}
          onDrop={handleDrop}
          className={draggedId === item.id ? 'dragging' : dragOverId === item.id ? 'drag-over' : ''}
        >
          {renderItem(item, draggedId === item.id)}
        </DraggableItem>
      ))}
    </div>
  );
}
