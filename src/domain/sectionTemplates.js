// Section templates for the website builder

/**
 * @typedef {Object} SectionTemplate
 * @property {string} type - Section type identifier
 * @property {string} [title] - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {string} [body] - Body text for text sections
 * @property {string} [cta] - Call-to-action button text
 * @property {string} [secondary] - Secondary button text
 * @property {Array<{name: string, desc: string}>} [items] - Feature items
 * @property {Array<{name: string, price: string, desc: string}>} [plans] - Pricing plans
 * @property {Array<string>} [links] - Footer links
 */

/** @type {Record<string, SectionTemplate>} */
export const sectionTemplates = {
  hero: {
    type: 'hero',
    title: 'Launch a better website',
    subtitle: 'Design, publish, and iterate on pages faster with a modern builder built for teams.',
    cta: 'Start building',
    secondary: 'Book a demo',
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
    body: 'Use flexible sections and content blocks to build a website that reflects your brand and converts visitors into customers.',
  },
  footer: {
    type: 'footer',
    title: 'Northstar Studio',
    links: ['Home', 'Work', 'Pricing', 'Contact'],
  },
  // New section types for expanded functionality
  gallery: {
    type: 'gallery',
    title: 'Our Work',
    subtitle: 'Explore our latest projects and case studies',
    images: [
      { src: '', alt: 'Project 1', caption: 'Project One' },
      { src: '', alt: 'Project 2', caption: 'Project Two' },
      { src: '', alt: 'Project 3', caption: 'Project Three' },
      { src: '', alt: 'Project 4', caption: 'Project Four' },
    ],
  },
  testimonial: {
    type: 'testimonial',
    title: 'What Our Clients Say',
    items: [
      { name: 'Jane Doe', role: 'CEO, TechCorp', content: 'This builder transformed how we create websites.', avatar: '' },
      { name: 'John Smith', role: 'Founder, StartupXYZ', content: 'Incredibly intuitive and powerful.', avatar: '' },
    ],
  },
  stats: {
    type: 'stats',
    title: 'By The Numbers',
    items: [
      { value: '500+', label: 'Projects Completed' },
      { value: '98%', label: 'Client Satisfaction' },
      { value: '24/7', label: 'Support Available' },
      { value: '10x', label: 'Faster Development' },
    ],
  },
  team: {
    type: 'team',
    title: 'Meet Our Team',
    subtitle: 'The talented people behind our success',
    members: [
      { name: 'Alice Johnson', role: 'CEO', bio: 'Leading with vision.', avatar: '' },
      { name: 'Bob Williams', role: 'CTO', bio: 'Building the future.', avatar: '' },
      { name: 'Carol Davis', role: 'Design Lead', bio: 'Crafting beautiful experiences.', avatar: '' },
    ],
  },
  contact: {
    type: 'contact',
    title: 'Get In Touch',
    subtitle: 'We would love to hear from you',
    email: 'hello@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, Country',
  },
  video: {
    type: 'video',
    title: 'Watch Our Story',
    subtitle: 'Learn more about what we do',
    videoUrl: '',
    thumbnail: '',
  },
  faq: {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      { question: 'How does it work?', answer: 'Simply drag and drop components to build your site.' },
      { question: 'Can I export my code?', answer: 'Yes, you can export clean, production-ready code.' },
      { question: 'Is hosting included?', answer: 'We offer managed hosting with SSL and CDN.' },
    ],
  },
  newsletter: {
    type: 'newsletter',
    title: 'Subscribe to Our Newsletter',
    subtitle: 'Stay updated with our latest news and offers',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
  },
  logos: {
    type: 'logos',
    title: 'Trusted By',
    subtitle: 'Companies that love our platform',
    logos: [
      { name: 'Company A', src: '' },
      { name: 'Company B', src: '' },
      { name: 'Company C', src: '' },
      { name: 'Company D', src: '' },
    ],
  },
}

/**
 * Get all available section types
 * @returns {string[]} Array of section type names
 */
export const getSectionTypes = () => Object.keys(sectionTemplates)

/**
 * Get a specific section template
 * @param {string} type - Section type
 * @returns {SectionTemplate|undefined} Section template or undefined
 */
export const getSectionTemplate = (type) => sectionTemplates[type]
