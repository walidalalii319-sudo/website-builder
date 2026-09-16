import { normalizeProject } from '../domain/project.js'

const STORAGE_KEY = 'website-builder-project'

export function loadProject() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? normalizeProject(JSON.parse(saved)) : normalizeProject(null)
  } catch {
    return normalizeProject(null)
  }
}

export function saveProject(project) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
}

export function downloadProject(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'website'}-project.json`
  link.click()
  URL.revokeObjectURL(url)
}
