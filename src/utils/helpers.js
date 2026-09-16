// Core utility functions for the website builder

/**
 * Deep clone a value using JSON serialization
 * @template T
 * @param {T} value - Value to clone
 * @returns {T} Cloned value
 */
export const clone = (value) => JSON.parse(JSON.stringify(value))

/**
 * Generate a unique ID with prefix
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Input text
 * @returns {string} Slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Debounce a function call
 * @template {(...args: any[]) => any} F
 * @param {F} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {F} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Deep merge two objects
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} Merged object
 */
export const deepMerge = (target, source) => {
  const result = clone(target)
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Format date for display
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'en-US') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Parse CSS value to number with unit
 * @param {string} value - CSS value (e.g., "10px", "2rem")
 * @returns {{value: number, unit: string}} Parsed value and unit
 */
export const parseCssValue = (value) => {
  const match = value.match(/^(-?\d*\.?\d+)(px|em|rem|%|vh|vw)?$/)
  if (!match) return { value: 0, unit: 'px' }
  return { value: parseFloat(match[1]), unit: match[2] || 'px' }
}

/**
 * Create CSS variable name from theme key
 * @param {string} key - Theme key
 * @returns {string} CSS variable name
 */
export const toCssVar = (key) => {
  return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
}
