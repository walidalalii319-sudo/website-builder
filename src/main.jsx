import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const templates = {
  hero: {
    type: 'hero',
    title: 'Launch a better website',
    subtitle:
      'Design, publish, and iterate on pages faster with a modern builder built for teams.',
    cta: 'Start building',
    secondary: 'Book a demo',
    accent: '#7c3aed',
  },
  features: {
    type: 'features',
    title: 'Everything you need to grow online',
    items: [
      { name: 'Custom pages', desc: 'Create polished landing pages with no-code speed.' },
      { name: 'Smart blocks', desc: 'Reuse layouts and sections across every project.' },
      { name: 'Built for SEO', desc: 'Optimize metadata, content, and structure from day one.' },
    ],
  },
  pricing: {
    type: 'pricing',
    title: 'Simple pricing for every stage',
    plans: [
      { name: 'Starter', price: '$29', desc: 'For new teams and simple sites.' },
      { name: 'Growth', price: '$79', desc: 'For businesses scaling content and campaigns.' },
      { name: 'Scale', price: '$149', desc: 'For larger product and ecommerce operations.' },
    ],
  },
  cta: {
    type: 'cta',
    title: 'Ready to build your next website?',
    subtitle: 'Turn ideas into polished experiences without code headaches.',
    cta: 'Get started',
  },
  text: {
    type: 'text',
    title: 'Your story starts here',
    body:
      'Use flexible sections and content blocks to build a website that reflects your brand and converts visitors into customers.',
  },
  footer: {
    type: 'footer',
    title: 'Northstar Studio',
    links: ['Home', 'Work', 'Pricing', 'Contact'],
  },
}

const defaultSections = [
  {
    id: 'hero-1',
    ...templates.hero,
  },
  {
    id: 'features-1',
    ...templates.features,
  },
  {
    id: 'pricing-1',
    ...templates.pricing,
  },
  {
    id: 'cta-1',
    ...templates.cta,
  },
  {
    id: 'footer-1',
    ...templates.footer,
  },
]

const componentCatalog = [
  { label: 'Hero', kind: 'hero' },
  { label: 'Features', kind: 'features' },
  { label: 'Pricing', kind: 'pricing' },
  { label: 'CTA', kind: 'cta' },
  { label: 'Text', kind: 'text' },
  { label: 'Footer', kind: 'footer' },
]

function createSection(kind) {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ...templates[kind],
  }
}

function SectionRenderer({ section }) {
  if (section.type === 'hero') {
    return (
      <section className="page-section hero-section" style={{ background: `linear-gradient(135deg, ${section.accent}22, #ffffff)` }}>
        <div className="hero-copy">
          <span className="eyebrow">Website builder</span>
          <h1>{section.title}</h1>
          <p>{section.subtitle}</p>
          <div className="hero-actions">
            <button className="primary-btn">{section.cta}</button>
            <button className="secondary-btn">{section.secondary}</button>
          </div>
        </div>
        <div className="hero-card">
          <div className="mini-window">
            <div className="window-header">
              <span />
              <span />
              <span />
            </div>
            <div className="content-lines">
              <b style={{ background: section.accent }} />
              <b />
              <b />
              <b />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'features') {
    return (
      <section className="page-section">
        <div className="section-header">
          <span className="eyebrow">Features</span>
          <h2>{section.title}</h2>
        </div>
        <div className="feature-grid">
          {(section.items || []).map((item) => (
            <div className="feature-card" key={item.name}>
              <div className="icon-dot" />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (section.type === 'pricing') {
    return (
      <section className="page-section">
        <div className="section-header">
          <span className="eyebrow">Pricing</span>
          <h2>{section.title}</h2>
        </div>
        <div className="pricing-grid">
          {(section.plans || []).map((plan) => (
            <div className="pricing-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}<span>/mo</span></div>
              <p>{plan.desc}</p>
              <button className="primary-btn small">Choose</button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (section.type === 'cta') {
    return (
      <section className="page-section cta-section">
        <div className="cta-box">
          <h2>{section.title}</h2>
          <p>{section.subtitle}</p>
          <button className="primary-btn">{section.cta}</button>
        </div>
      </section>
    )
  }

  if (section.type === 'text') {
    return (
      <section className="page-section text-section">
        <span className="eyebrow">Content block</span>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
      </section>
    )
  }

  if (section.type === 'footer') {
    return (
      <footer className="page-footer">
        <div>
          <strong>{section.title}</strong>
        </div>
        <nav>
          {(section.links || []).map((link) => (
            <a href="#" key={link}>{link}</a>
          ))}
        </nav>
      </footer>
    )
  }

  return null
}

function App() {
  const [sections, setSections] = useState(defaultSections)
  const [activeId, setActiveId] = useState(defaultSections[0].id)
  const [viewport, setViewport] = useState('desktop')

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId, sections],
  )

  const addSection = (kind) => {
    const section = createSection(kind)
    setSections((current) => [...current, section])
    setActiveId(section.id)
  }

  const updateActiveSection = (changes) => {
    setSections((current) =>
      current.map((section) =>
        section.id === activeId ? { ...section, ...changes } : section,
      ),
    )
  }

  const removeSelectedSection = () => {
    if (sections.length <= 1) return
    setSections((current) => current.filter((section) => section.id !== activeId))
    const remaining = sections.filter((section) => section.id !== activeId)
    if (remaining.length) setActiveId(remaining[0].id)
  }

  const codePreview = useMemo(
    () => JSON.stringify(sections, null, 2),
    [sections],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar left-sidebar">
        <div>
          <div className="brand">
            <div className="brand-mark">W</div>
            <div>
              <strong>Website Builder</strong>
              <small>Design studio</small>
            </div>
          </div>

          <div className="panel-block">
            <h3>Components</h3>
            <div className="component-list">
              {componentCatalog.map((component) => (
                <button
                  key={component.kind}
                  className="component-button"
                  onClick={() => addSection(component.kind)}
                >
                  + {component.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-block">
          <h3>Structure</h3>
          <div className="section-list">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`section-item ${section.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(section.id)}
              >
                <span className="dot" />
                {section.type}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="builder-main">
        <header className="topbar">
          <div className="status-pill">Live canvas</div>

          <div className="viewport-controls">
            {['desktop', 'tablet', 'mobile'].map((mode) => (
              <button
                key={mode}
                className={viewport === mode ? 'active' : ''}
                onClick={() => setViewport(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <button className="primary-btn small">Publish</button>
        </header>

        <div className={`canvas ${viewport}`}>
          <div className="canvas-inner">
            {sections.map((section) => (
              <div
                key={section.id}
                className={section.id === activeId ? 'selected-section' : ''}
                onClick={() => setActiveId(section.id)}
              >
                <SectionRenderer section={section} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <aside className="sidebar right-sidebar">
        <div className="panel-block">
          <h3>Inspector</h3>
          {activeSection ? (
            <div className="inspector-form">
              {activeSection.type === 'hero' && (
                <>
                  <label>
                    Title
                    <input
                      value={activeSection.title}
                      onChange={(event) => updateActiveSection({ title: event.target.value })}
                    />
                  </label>
                  <label>
                    Subtitle
                    <textarea
                      rows="3"
                      value={activeSection.subtitle}
                      onChange={(event) => updateActiveSection({ subtitle: event.target.value })}
                    />
                  </label>
                  <label>
                    Accent color
                    <input
                      type="color"
                      value={activeSection.accent || '#7c3aed'}
                      onChange={(event) => updateActiveSection({ accent: event.target.value })}
                    />
                  </label>
                </>
              )}

              {(activeSection.type === 'text' || activeSection.type === 'cta') && (
                <>
                  <label>
                    Title
                    <input
                      value={activeSection.title}
                      onChange={(event) => updateActiveSection({ title: event.target.value })}
                    />
                  </label>
                  <label>
                    Body
                    <textarea
                      rows="4"
                      value={activeSection.body || activeSection.subtitle || ''}
                      onChange={(event) =>
                        updateActiveSection({
                          [activeSection.body ? 'body' : 'subtitle']: event.target.value,
                        })
                      }
                    />
                  </label>
                </>
              )}

              {activeSection.type === 'features' && (
                <>
                  <label>
                    Title
                    <input
                      value={activeSection.title}
                      onChange={(event) => updateActiveSection({ title: event.target.value })}
                    />
                  </label>
                  <label>
                    Feature count
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={activeSection.items?.length || 3}
                      onChange={(event) => {
                        const count = Number(event.target.value)
                        const nextItems = Array.from({ length: count }, (_, index) => ({
                          name: `Feature ${index + 1}`,
                          desc: 'Add a useful feature description for your visitors.',
                        }))
                        updateActiveSection({ items: nextItems })
                      }}
                    />
                  </label>
                </>
              )}

              {activeSection.type === 'pricing' && (
                <>
                  <label>
                    Title
                    <input
                      value={activeSection.title}
                      onChange={(event) => updateActiveSection({ title: event.target.value })}
                    />
                  </label>
                </>
              )}

              {activeSection.type === 'footer' && (
                <>
                  <label>
                    Brand name
                    <input
                      value={activeSection.title}
                      onChange={(event) => updateActiveSection({ title: event.target.value })}
                    />
                  </label>
                </>
              )}

              <button className="danger-btn" onClick={removeSelectedSection}>
                Remove section
              </button>
            </div>
          ) : null}
        </div>

        <div className="panel-block">
          <h3>Generated JSON</h3>
          <pre className="code-block">{codePreview}</pre>
        </div>
      </aside>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
