export const sectionTemplates = {
  hero: { type: 'hero', title: 'Launch a better website', subtitle: 'Design, publish, and iterate on pages faster with a modern builder built for teams.', cta: 'Start building', secondary: 'Book a demo' },
  features: { type: 'features', title: 'Everything you need to grow online', items: [{ name: 'Custom pages', desc: 'Create polished landing pages with no-code speed.' }, { name: 'Smart blocks', desc: 'Reuse layouts and sections across every project.' }, { name: 'Built for SEO', desc: 'Optimize metadata, content, and structure from day one.' }] },
  pricing: { type: 'pricing', title: 'Simple pricing for every stage', plans: [{ name: 'Starter', price: '$29', desc: 'For new teams and simple sites.' }, { name: 'Growth', price: '$79', desc: 'For businesses scaling content and campaigns.' }, { name: 'Scale', price: '$149', desc: 'For larger product and ecommerce operations.' }] },
  cta: { type: 'cta', title: 'Ready to build your next website?', subtitle: 'Turn ideas into polished experiences without code headaches.', cta: 'Get started' },
  text: { type: 'text', title: 'Your story starts here', body: 'Use flexible sections and content blocks to build a website that reflects your brand and converts visitors into customers.' },
  footer: { type: 'footer', title: 'Northstar Studio', links: ['Home', 'Work', 'Pricing', 'Contact'] },
}

export const clone = (value) => JSON.parse(JSON.stringify(value))
export const createSection = (type) => ({ id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`, ...clone(sectionTemplates[type]) })

export const createInitialProject = () => ({
  id: 'project-1', name: 'Moonbrand Studio',
  theme: { accent: '#7c3aed', background: '#f8fafc', containerWidth: 1200, radius: 18 },
  pages: [
    { id: 'home', title: 'Home', slug: 'home', status: 'draft', seoTitle: 'Launch better digital experiences', seoDescription: '', sections: ['hero', 'features', 'pricing', 'cta', 'footer'].map((type, index) => ({ id: `${type}-${index}`, ...clone(sectionTemplates[type]) })) },
    { id: 'about', title: 'About', slug: 'about', status: 'draft', seoTitle: 'About us', seoDescription: '', sections: [{ id: 'about-text', ...clone(sectionTemplates.text) }] },
  ],
  blocks: [],
})

export function normalizeProject(value) {
  const fallback = createInitialProject()
  if (!value || typeof value !== 'object') return fallback
  if (Array.isArray(value)) return { ...fallback, pages: [{ ...fallback.pages[0], sections: value }] }
  return {
    ...fallback, ...value,
    theme: { ...fallback.theme, ...(value.theme || {}) },
    pages: Array.isArray(value.pages) && value.pages.length ? value.pages : fallback.pages,
    blocks: Array.isArray(value.blocks) ? value.blocks : [],
  }
}
