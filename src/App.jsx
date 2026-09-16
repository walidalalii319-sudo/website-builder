import React, { useEffect, useMemo, useState } from 'react'
import { BuilderCanvas } from './components/BuilderCanvas.jsx'
import { Inspector } from './components/Inspector.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { SectionRenderer } from './components/SectionRenderer.jsx'
import { ResponsiveControls, useResponsive } from './components/responsive/ResponsiveControls.jsx'
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard.jsx'
import './components/responsive/ResponsiveControls.css'
import { createInitialProject, createSection } from './domain/project.js'
import { clone } from './utils/helpers.js'
import { downloadProject, loadProject, saveProject } from './services/projectStorage.js'

export default function App() {
  const [project, setProject] = useState(loadProject)
  const [activePageId, setActivePageId] = useState('home')
  const [activeSectionId, setActiveSectionId] = useState('hero-0')
  const [history, setHistory] = useState([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // Use responsive hook for viewport management with keyboard shortcuts
  const { viewport, setViewport: changeViewport } = useResponsive('desktop')

  const page = useMemo(() => project.pages.find((item) => item.id === activePageId) || project.pages[0], [project, activePageId])
  const section = page?.sections.find((item) => item.id === activeSectionId) || page?.sections[0]
  
  useEffect(() => { saveProject(project) }, [project])
  useEffect(() => { if (page && !page.sections.some((item) => item.id === activeSectionId)) setActiveSectionId(page.sections[0]?.id) }, [page, activeSectionId])

  const commit = (next) => { 
    setHistory((items) => [...items.slice(-29), clone(project)]); 
    setProject(next) 
  }
  
  const updatePage = (field, value) => commit({ ...project, pages: project.pages.map((item) => item.id === page.id ? { ...item, [field]: value } : item) })
  const updateTheme = (field, value) => commit({ ...project, theme: { ...project.theme, [field]: value } })
  const updateSection = (changes) => commit({ ...project, pages: project.pages.map((item) => item.id === page.id ? { ...item, sections: item.sections.map((entry) => entry.id === section.id ? { ...entry, ...changes } : entry) } : item) })
  const updateSettings = (settings) => commit({ ...project, settings: { ...project.settings, ...settings } })
  
  const addSection = (type) => { 
    const next = createSection(type); 
    commit({ ...project, pages: project.pages.map((item) => item.id === page.id ? { ...item, sections: [...item.sections, next] } : item) }); 
    setActiveSectionId(next.id) 
  }
  
  const addPage = () => { 
    const next = { id: `page-${Date.now()}`, title: `Page ${project.pages.length + 1}`, slug: `page-${project.pages.length + 1}`, status: 'draft', sections: [createSection('text')] }; 
    commit({ ...project, pages: [...project.pages, next] }); 
    setActivePageId(next.id); 
    setActiveSectionId(next.sections[0].id) 
  }
  
  const addBlock = (block) => { 
    const next = { id: `${block.type}-${Date.now()}`, ...clone(block.content) }; 
    commit({ ...project, pages: project.pages.map((item) => item.id === page.id ? { ...item, sections: [...item.sections, next] } : item) }); 
    setActiveSectionId(next.id) 
  }
  
  const saveBlock = () => { 
    if (section) commit({ ...project, blocks: [...project.blocks, { id: `block-${Date.now()}`, name: `${section.type} block`, type: section.type, content: clone(section) }] }) 
  }
  
  const removeSection = () => { 
    if (!page || page.sections.length <= 1) return; 
    commit({ ...project, pages: project.pages.map((item) => item.id === page.id ? { ...item, sections: item.sections.filter((entry) => entry.id !== section.id) } : item) }) 
  }
  
  // Drag and drop reordering of sections
  const reorderSections = (draggedId, targetId) => {
    if (!page || draggedId === targetId) return;
    
    const newSections = [...page.sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedId);
    const targetIndex = newSections.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Remove the dragged section
    const [removed] = newSections.splice(draggedIndex, 1);
    // Insert it at the target position
    newSections.splice(targetIndex, 0, removed);
    
    commit({ 
      ...project, 
      pages: project.pages.map((item) => 
        item.id === page.id ? { ...item, sections: newSections } : item
      ) 
    });
  }
  
  // Undo/Redo
  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setProject(previous);
  }
  
  const redo = () => {
    // For simplicity, we only support undo in this version
    // A full implementation would need a separate redo stack
  }
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Ctrl+S for save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProject(project);
      }
      // Ctrl+A for analytics toggle
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setShowAnalytics(prev => !prev);
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, project]);

  if (showAnalytics) {
    return <AnalyticsDashboard />;
  }

  return (
    <div className="app-shell">
      <Sidebar 
        project={project} 
        activePageId={page?.id} 
        activeSectionId={section?.id} 
        onPageSelect={setActivePageId} 
        onSectionSelect={setActiveSectionId} 
        onAddPage={addPage} 
        onAddSection={addSection} 
        onAddBlock={addBlock} 
        onExport={() => downloadProject(project)} 
        onReset={() => { 
          const next = createInitialProject(); 
          commit(next); 
          setActivePageId('home'); 
          setActiveSectionId('hero-0') 
        }}
        onToggleAnalytics={() => setShowAnalytics(false)}
      />
      <ResponsiveControls viewport={viewport} onViewportChange={changeViewport}>
        <BuilderCanvas 
          page={page} 
          project={project} 
          viewport={viewport} 
          activeSectionId={section?.id} 
          onSelect={setActiveSectionId}
          onReorderSections={reorderSections}
        />
      </ResponsiveControls>
      <Inspector 
        page={page} 
        section={section} 
        project={project} 
        onPageChange={updatePage} 
        onThemeChange={updateTheme} 
        onSectionChange={updateSection} 
        onSaveBlock={saveBlock} 
        onRemoveSection={removeSection}
        onSettingsChange={updateSettings}
      />
    </div>
  )
}
