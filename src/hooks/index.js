// Custom React hooks for the website builder

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { clone } from '../utils/helpers.js'

/**
 * Hook for managing undo/redo history
 * @template T
 * @param {T} initialState - Initial state value
 * @param {number} maxHistory - Maximum history size
 * @returns {{state: T, setState: function, undo: function, redo: function, canUndo: boolean, canRedo: boolean, clearHistory: function}}
 */
export function useHistory(initialState, maxHistory = 50) {
  const [history, setHistory] = useState([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const state = history[currentIndex]

  const setState = useCallback((newState) => {
    const value = typeof newState === 'function' ? newState(history[currentIndex]) : newState
    const newHistory = history.slice(0, currentIndex + 1)
    
    if (newHistory.length >= maxHistory) {
      newHistory.shift()
    } else {
      setCurrentIndex(newHistory.length)
    }
    
    setHistory([...newHistory, clone(value)])
  }, [history, currentIndex, maxHistory])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const clearHistory = useCallback(() => {
    setHistory([initialState])
    setCurrentIndex(0)
  }, [initialState])

  return { state, setState, undo, redo, canUndo, canRedo, clearHistory }
}

/**
 * Hook for drag and drop functionality
 * @param {object} options - Drag drop options
 * @param {function} options.onDrop - Callback when item is dropped
 * @param {string} [options.acceptType] - Accepted drag type
 * @returns {{isDragging: boolean, draggedItem: any, handleDragStart: function, handleDragEnd: function, handleDragOver: function, handleDrop: function}}
 */
export function useDragDrop({ onDrop, acceptType = '*' } = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const dragNodeRef = useRef(null)

  const handleDragStart = useCallback((event, item) => {
    setIsDragging(true)
    setDraggedItem(item)
    dragNodeRef.current = event.target
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(item))
    if (acceptType !== '*') {
      event.dataTransfer.setData('text/plain', acceptType)
    }
  }, [acceptType])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDraggedItem(null)
    dragNodeRef.current = null
  }, [])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((event, targetData) => {
    event.preventDefault()
    if (onDrop && draggedItem) {
      onDrop(draggedItem, targetData)
    }
    handleDragEnd()
  }, [draggedItem, onDrop, handleDragEnd])

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  }
}

/**
 * Hook for viewport/responsive state management
 * @param {string} initialViewport - Initial viewport mode
 * @returns {{viewport: string, setViewport: function, isMobile: boolean, isTablet: boolean, isDesktop: boolean, viewportWidth: number}}
 */
export function useViewport(initialViewport = 'desktop') {
  const [viewport, setViewport] = useState(initialViewport)

  const breakpoints = useMemo(() => ({
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  }), [])

  const viewportWidths = useMemo(() => ({
    mobile: 375,
    tablet: 768,
    desktop: 1200,
  }), [])

  const isMobile = viewport === 'mobile'
  const isTablet = viewport === 'tablet'
  const isDesktop = viewport === 'desktop'

  const viewportWidth = viewportWidths[viewport]

  return {
    viewport,
    setViewport,
    isMobile,
    isTablet,
    isDesktop,
    viewportWidth,
    breakpoints,
  }
}

/**
 * Hook for keyboard shortcuts
 * @param {Array<{keys: string[], handler: function, preventDefault?: boolean}>} shortcuts - Shortcut definitions
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const pressedKeys = []
      if (event.ctrlKey || event.metaKey) pressedKeys.push('mod')
      if (event.shiftKey) pressedKeys.push('shift')
      if (event.altKey) pressedKeys.push('alt')
      pressedKeys.push(event.key.toLowerCase())

      const keyString = pressedKeys.join('+')

      for (const shortcut of shortcuts) {
        const shortcutString = shortcut.keys.join('+')
        if (keyString === shortcutString) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }
          shortcut.handler(event)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Hook for local storage persistence
 * @template T
 * @param {string} key - Storage key
 * @param {T} initialValue - Initial value
 * @returns {{value: T, setValue: function, removeValue: function}}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return { value: storedValue, setValue, removeValue }
}

/**
 * Hook for debounced values
 * @template T
 * @param {T} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {T} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing selection state
 * @template T
 * @param {T} initialSelection - Initial selected item
 * @returns {{selected: T, setSelected: function, clearSelection: function}}
 */
export function useSelection(initialSelection = null) {
  const [selected, setSelected] = useState(initialSelection)

  const clearSelection = useCallback(() => {
    setSelected(null)
  }, [])

  return { selected, setSelected, clearSelection }
}

/**
 * Hook for managing modal/dialog state
 * @param {boolean} initialOpen - Initial open state
 * @returns {{isOpen: boolean, open: function, close: function, toggle: function}}
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}

/**
 * Hook for managing form state
 * @param {object} initialValues - Initial form values
 * @param {object} [validators] - Validation functions
 * @returns {{values: object, errors: object, touched: object, handleChange: function, handleBlur: function, handleSubmit: function, resetForm: function, isValid: boolean, isDirty: boolean}}
 */
export function useForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback((fieldValues = values) => {
    const newErrors = {}
    
    for (const [field, validator] of Object.entries(validators)) {
      const error = validator(fieldValues[field], fieldValues)
      if (error) {
        newErrors[field] = error
      }
    }
    
    return newErrors
  }, [validators, values])

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target
    const newValue = type === 'checkbox' ? checked : value
    
    setValues((prev) => ({ ...prev, [name]: newValue }))
    
    if (validators[name]) {
      const fieldError = validators[name](newValue, { ...values, [name]: newValue })
      setErrors((prev) => ({ ...prev, [name]: fieldError || '' }))
    }
  }, [validators, values])

  const handleBlur = useCallback((event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    if (validators[name]) {
      const fieldError = validators[name](values[name], values)
      setErrors((prev) => ({ ...prev, [name]: fieldError || '' }))
    }
  }, [validators, values])

  const handleSubmit = useCallback((onSubmit) => (event) => {
    event?.preventDefault()
    const validationErrors = validate()
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values)
    } else {
      setErrors(validationErrors)
      setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    }
  }, [validate, values])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = Object.keys(errors).length === 0
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
    isDirty,
  }
}
