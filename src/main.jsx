import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const sectionTemplates = {
  hero: { type: 'hero', title: 'Launch a better website', subtitle: 'Design, publish, and iterate on pages faster with a modern builder built for teams.', cta: 'Start building', secondary: 'Book a demo', accent: '#7c3aed' },
  features: { type: 'features', title: 'Everything you need to grow online', items: [{ name: 'Custom pages', desc: 'Create polished landing pages with no-code speed.' }, { name: 'Smart blocks', desc: 'Reuse layouts and sections across every project.' }, { name: 'Built for SEO', desc: 'Optimize metadata, content, and structure from day one.' }] },
  pricing: { type: 'pricing', title: 'Simple pricing for every stage', plans: [{ name: 'Starter', price: '$29', desc: 'For new teams and simple sites.' }, { name: 'Growth', price: '$79', desc: 'For businesses scaling content and campaigns.' }, { name: 'Scale', price: '$149', desc: 'For larger product and ecommerce operations.' }] },
  cta: { type: 'cta', title: 'Ready to build your next website?', subtitle: 'Turn ideas into polished experiences without code headaches.', cta: 'Get started' },
  text: { type: 'text', title: 'Your story starts here', body: 'Use flexible sections and content blocks to build a website that reflects your brand and converts visitors into customers.' },
  footer: { type: 'footer', title: 'Northstar Studio', links: ['Home', 'Work', 'Pricing', 'Contact'] },
}

const starterSections = ['hero', 'features', 'pricing', 'cta', 'footer'].map((type, index) => ({ id: `${type}-${index}`, ...sectionTemplates[type] }))
const catalog = Object.keys(sectionTemplates)
const clone = (value) => JSON.parse(JSON.stringify(value))
const makeSection = (type) => ({ id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`, ...clone(sectionTemplates[type]) })

function SectionRenderer({ section }) {
  if (section.type === 'hero') return <section className="page-section hero-section" style={{ background: `linear-gradient(135deg, ${section.accent}22, #fff)` }}><div className="hero-copy"><span className="eyebrow">Website builder</span><h1>{section.title}</h1><p>{section.subtitle}</p><div className="hero-actions"><button className="primary-btn">{section.cta}</button><button className="secondary-btn">{section.secondary}</button></div></div><div className="hero-card"><div className="mini-window"><div className="window-header"><span /><span /><span /></div><div className="content-lines"><b style={{ background: section.accent }} /><b /><b /><b /></div></div></div></section>
  if (section.type === 'features') return <section className="page-section"><div className="section-header"><span className="eyebrow">Features</span><h2>{section.title}</h2></div><div className="feature-grid">{section.items.map((item) => <div className="feature-card" key={item.name}><div className="icon-dot" /><h3>{item.name}</h3><p>{item.desc}</p></div>)}</div></section>
  if (section.type === 'pricing') return <section className="page-section"><div className="section-header"><span className="eyebrow">Pricing</span><h2>{section.title}</h2></div><div className="pricing-grid">{section.plans.map((plan) => <div className="pricing-card" key={plan.name}><h3>{plan.name}</h3><div className="price">{plan.price}<span>/mo</span></div><p>{plan.desc}</p><button className="primary-btn small">Choose</button></div>)}</div></section>
  if (section.type === 'cta') return <section className="page-section"><div className="cta-box"><h2>{section.title}</h2><p>{section.subtitle}</p><button className="primary-btn">{section.cta}</button></div></section>
  if (section.type === 'text') return <section className="page-section text-section"><span className="eyebrow">Content block</span><h2>{section.title}</h2><p>{section.body}</p></section>
  return <footer className="page-footer"><strong>{section.title}</strong><nav>{section.links.map((link) => <a href="#" key={link}>{link}</a>)}</nav></footer>
}

function App() {
  const [sections, setSections] = useState(() => { try { return JSON.parse(localStorage.getItem('website-builder-sections')) || clone(starterSections) } catch { return clone(starterSections) } })
  const [activeId, setActiveId] = useState(starterSections[0].id)
  const [viewport, setViewport] = useState('desktop')
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])
  const [notice, setNotice] = useState('All changes saved locally')
  const active = useMemo(() => sections.find((item) => item.id === activeId) || sections[0], [sections, activeId])
  const json = useMemo(() => JSON.stringify(sections, null, 2), [sections])

  useEffect(() => { localStorage.setItem('website-builder-sections', json) }, [json])
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo() }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveProject() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const commit = (next) => { setHistory((items) => [...items.slice(-29), clone(sections)]); setFuture([]); setSections(next); setNotice('Unsaved changes') }
  const updateActive = (changes) => commit(sections.map((item) => item.id === activeId ? { ...item, ...changes } : item))
  const addSection = (type) => { const item = makeSection(type); commit([...sections, item]); setActiveId(item.id) }
  const removeSection = () => { if (sections.length === 1) return; const next = sections.filter((item) => item.id !== activeId); commit(next); setActiveId(next[0].id) }
  const undo = () => { if (!history.length) return; setFuture((items) => [clone(sections), ...items]); setSections(history.at(-1)); setHistory((items) => items.slice(0, -1)); setNotice('Undid last change') }
  const redo = () => { if (!future.length) return; setHistory((items) => [...items, clone(sections)]); setSections(future[0]); setFuture((items) => items.slice(1)); setNotice('Redid change') }
  const resetProject = () => { commit(clone(starterSections)); setActiveId(starterSections[0].id); setNotice('Starter template restored') }
  const saveProject = () => { localStorage.setItem('website-builder-sections', json); setNotice('Project saved locally') }
  const exportProject = () => { const blob = new Blob([json], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'website-builder-project.json'; link.click(); URL.revokeObjectURL(url); setNotice('Project exported') }
  const importProject = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const next = JSON.parse(reader.result); if (!Array.isArray(next) || !next.length) throw new Error(); commit(next); setActiveId(next[0].id); setNotice('Project imported') } catch { setNotice('Invalid project file') } }; reader.readAsText(file); event.target.value = '' }

  return <div className="app-shell">
    <aside className="sidebar left-sidebar"><div><div className="brand"><div className="brand-mark">W</div><div><strong>Website Builder</strong><small>Design studio</small></div></div><div className="panel-block"><h3>Components</h3><div className="component-list">{catalog.map((type) => <button className="component-button" key={type} onClick={() => addSection(type)}>+ {type}</button>)}</div></div><div className="panel-block project-tools"><h3>Project</h3><button className="component-button" onClick={resetProject}>↻ Reset template</button><button className="component-button" onClick={exportProject}>↓ Export JSON</button><label className="component-button file-button">↑ Import JSON<input type="file" accept="application/json" onChange={importProject} /></label></div></div><div className="panel-block"><h3>Structure</h3><div className="section-list">{sections.map((item) => <button className={`section-item ${item.id === activeId ? 'active' : ''}`} key={item.id} onClick={() => setActiveId(item.id)}><span className="dot" />{item.type}</button>)}</div></div></aside>
    <main className="builder-main"><header className="topbar"><div className="topbar-left"><span className="status-pill">● {notice}</span><button className="history-btn" disabled={!history.length} onClick={undo} title="Undo (Ctrl/Cmd+Z)">↶</button><button className="history-btn" disabled={!future.length} onClick={redo} title="Redo (Ctrl/Cmd+Shift+Z)">↷</button></div><div className="viewport-controls">{['desktop', 'tablet', 'mobile'].map((mode) => <button className={viewport === mode ? 'active' : ''} key={mode} onClick={() => setViewport(mode)}>{mode}</button>)}</div><button className="primary-btn small" onClick={saveProject}>Save</button></header><div className={`canvas ${viewport}`}><div className="canvas-inner">{sections.map((item) => <div key={item.id} className={item.id === activeId ? 'selected-section' : ''} onClick={() => setActiveId(item.id)}><SectionRenderer section={item} /></div>)}</div></div></main>
    <aside className="sidebar right-sidebar"><div className="panel-block"><h3>Inspector <span className="muted">/{active?.type}</span></h3>{active && <div className="inspector-form"><label>Title<input value={active.title || ''} onChange={(event) => updateActive({ title: event.target.value })} /></label>{['hero', 'cta'].includes(active.type) && <label>Subtitle<textarea rows="3" value={active.subtitle || ''} onChange={(event) => updateActive({ subtitle: event.target.value })} /></label>}{active.type === 'text' && <label>Body<textarea rows="5" value={active.body || ''} onChange={(event) => updateActive({ body: event.target.value })} /></label>}{active.type === 'hero' && <label>Accent color<input type="color" value={active.accent} onChange={(event) => updateActive({ accent: event.target.value })} /></label>}{active.type === 'features' && <label>Feature count<input type="number" min="1" max="6" value={active.items.length} onChange={(event) => updateActive({ items: Array.from({ length: Math.max(1, Math.min(6, Number(event.target.value) || 1)) }, (_, index) => active.items[index] || { name: `Feature ${index + 1}`, desc: 'Describe this feature for your visitors.' }) })} /></label>}<button className="danger-btn" onClick={removeSection}>Remove section</button></div>}</div><div className="panel-block"><h3>Generated JSON</h3><pre className="code-block">{json}</pre></div></aside>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
