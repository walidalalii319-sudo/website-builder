// Domain models for the website builder

import { clone, generateId, generateSlug } from '../utils/helpers.js'
import { sectionTemplates } from './sectionTemplates.js'

/**
 * @typedef {Object} Section
 * @property {string} id - Unique section identifier
 * @property {string} type - Section type
 * @property {string} [title] - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {any} [content] - Section-specific content
 */

/**
 * Create a new section from template
 * @param {string} type - Section type
 * @returns {Section} New section instance
 */
export const createSection = (type) => {
  const template = sectionTemplates[type] || sectionTemplates.text
  return {
    id: generateId(type),
    ...clone(template),
  }
}

/**
 * @typedef {Object} Page
 * @property {string} id - Unique page identifier
 * @property {string} title - Page title
 * @property {string} slug - URL slug
 * @property {string} status - Page status (draft, published, scheduled)
 * @property {string} [seoTitle] - SEO title
 * @property {string} [seoDescription] - SEO description
 * @property {Section[]} sections - Array of sections
 * @property {string} [template] - Page template name
 * @property {object} [styles] - Page-specific styles
 * @property {string} [parentPageId] - Parent page for nested routes
 * @property {boolean} [isProtected] - Whether page requires authentication
 * @property {string[]} [allowedRoles] - Roles allowed to access protected page
 */

/**
 * Create a new page
 * @param {string} title - Page title
 * @param {string} [slug] - Optional slug (auto-generated if not provided)
 * @returns {Page} New page instance
 */
export const createPage = (title, slug) => {
  const pageSlug = slug || generateSlug(title)
  return {
    id: generateId('page'),
    title,
    slug: pageSlug,
    status: 'draft',
    seoTitle: title,
    seoDescription: '',
    sections: [createSection('text')],
    template: 'default',
    styles: {},
    parentPageId: null,
    isProtected: false,
    allowedRoles: [],
  }
}

/**
 * @typedef {Object} Theme
 * @property {string} accent - Accent color
 * @property {string} background - Background color
 * @property {string} text - Text color
 * @property {string} surface - Surface/card background color
 * @property {string} fontFamily - Font family
 * @property {number} radius - Border radius in px
 * @property {number} containerWidth - Max container width in px
 * @property {object} [typography] - Typography settings
 * @property {object} [spacing] - Spacing scale
 * @property {object} [breakpoints] - Responsive breakpoints
 * @property {boolean} [darkMode] - Dark mode enabled
 */

/**
 * Default theme configuration
 * @type {Theme}
 */
export const defaultTheme = {
  accent: '#7c3aed',
  background: '#f8fafc',
  text: '#0f172a',
  surface: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
  radius: 18,
  containerWidth: 1200,
  typography: {
    baseSize: 16,
    scaleRatio: 1.25,
    headings: {
      h1: { size: 48, weight: 700, lineHeight: 1.1 },
      h2: { size: 36, weight: 600, lineHeight: 1.2 },
      h3: { size: 24, weight: 600, lineHeight: 1.3 },
      h4: { size: 20, weight: 500, lineHeight: 1.4 },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  darkMode: false,
}

/**
 * @typedef {Object} Block
 * @property {string} id - Unique block identifier
 * @property {string} name - Block display name
 * @property {string} type - Block type
 * @property {Section} content - Block content/section
 * @property {string} [category] - Block category for organization
 * @property {string} [thumbnail] - Thumbnail image URL
 * @property {string[]} [tags] - Search tags
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique project identifier
 * @property {string} name - Project name
 * @property {Theme} theme - Theme configuration
 * @property {Page[]} pages - Array of pages
 * @property {Block[]} blocks - Saved reusable blocks
 * @property {object} [settings] - Project settings
 * @property {string} [language] - Default language
 * @property {string[]} [languages] - Supported languages
 * @property {string} [timezone] - Project timezone
 */

/**
 * Create initial project structure
 * @returns {Project} New project instance
 */
export const createInitialProject = () => ({
  id: generateId('project'),
  name: 'My Website',
  theme: clone(defaultTheme),
  pages: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      status: 'draft',
      seoTitle: 'Welcome to our website',
      seoDescription: 'A modern website built with our powerful builder.',
      sections: ['hero', 'features', 'cta', 'footer'].map((type) => createSection(type)),
      template: 'default',
      styles: {},
      parentPageId: null,
      isProtected: false,
      allowedRoles: [],
    },
    {
      id: generateId('page'),
      title: 'About',
      slug: 'about',
      status: 'draft',
      seoTitle: 'About us',
      seoDescription: 'Learn more about our team and mission.',
      sections: [createSection('text'), createSection('team')],
      template: 'default',
      styles: {},
      parentPageId: null,
      isProtected: false,
      allowedRoles: [],
    },
  ],
  blocks: [],
  settings: {
    favicon: '',
    logo: '',
    socialImage: '',
    analyticsId: '',
    customHead: '',
    customFooter: '',
  },
  language: 'en',
  languages: ['en'],
  timezone: 'UTC',
})

/**
 * Normalize and validate project data
 * @param {any} value - Raw project data
 * @returns {Project} Normalized project
 */
export function normalizeProject(value) {
  const fallback = createInitialProject()
  
  if (!value || typeof value !== 'object') return fallback
  if (Array.isArray(value)) {
    return {
      ...fallback,
      pages: [{ ...fallback.pages[0], sections: value.map((s, i) => ({ id: `section-${i}`, ...s })) }],
    }
  }

  return {
    ...fallback,
    ...value,
    id: value.id || generateId('project'),
    name: value.name || 'My Website',
    theme: { ...defaultTheme, ...(value.theme || {}) },
    pages: Array.isArray(value.pages) && value.pages.length
      ? value.pages.map((page, index) => normalizePage(page, index))
      : fallback.pages,
    blocks: Array.isArray(value.blocks) ? value.blocks : [],
    settings: { ...fallback.settings, ...(value.settings || {}) },
    language: value.language || 'en',
    languages: Array.isArray(value.languages) && value.languages.length
      ? value.languages
      : ['en'],
    timezone: value.timezone || 'UTC',
  }
}

/**
 * Normalize a single page
 * @param {any} page - Raw page data
 * @param {number} index - Page index for fallback naming
 * @returns {Page} Normalized page
 */
function normalizePage(page, index) {
  const fallback = createPage(`Page ${index + 1}`)
  return {
    ...fallback,
    ...page,
    id: page.id || generateId('page'),
    title: page.title || `Page ${index + 1}`,
    slug: page.slug || generateSlug(page.title || `page-${index + 1}`),
    status: page.status || 'draft',
    sections: Array.isArray(page.sections) && page.sections.length
      ? page.sections.map((section, i) => ({
          id: section.id || generateId(section.type || 'section'),
          ...section,
        }))
      : [createSection('text')],
  }
}
