// Base section renderer that delegates to specific section components

import React from 'react'
import { HeroSection } from './HeroSection.jsx'
import { FeaturesSection } from './FeaturesSection.jsx'
import { PricingSection } from './PricingSection.jsx'
import { CtaSection } from './CtaSection.jsx'
import { TextSection } from './TextSection.jsx'
import { FooterSection } from './FooterSection.jsx'
import { GallerySection } from './GallerySection.jsx'
import { TestimonialSection } from './TestimonialSection.jsx'
import { StatsSection } from './StatsSection.jsx'
import { TeamSection } from './TeamSection.jsx'
import { ContactSection } from './ContactSection.jsx'
import { VideoSection } from './VideoSection.jsx'
import { FaqSection } from './FaqSection.jsx'
import { NewsletterSection } from './NewsletterSection.jsx'
import { LogosSection } from './LogosSection.jsx'

const sectionComponentMap = {
  hero: HeroSection,
  features: FeaturesSection,
  pricing: PricingSection,
  cta: CtaSection,
  text: TextSection,
  footer: FooterSection,
  gallery: GallerySection,
  testimonial: TestimonialSection,
  stats: StatsSection,
  team: TeamSection,
  contact: ContactSection,
  video: VideoSection,
  faq: FaqSection,
  newsletter: NewsletterSection,
  logos: LogosSection,
}

/**
 * Render a section based on its type
 * @param {object} props - Component props
 * @param {object} props.section - Section data
 * @param {string} props.accent - Accent color from theme
 * @param {object} props.theme - Full theme object
 * @param {boolean} [props.isPreview] - Whether rendering in preview mode
 * @param {function} [props.onEdit] - Edit callback for builder mode
 * @returns {JSX.Element} Rendered section
 */
export function SectionRenderer({ section, accent, theme, isPreview = false, onEdit }) {
  const Component = sectionComponentMap[section.type]
  
  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`)
    return (
      <section className="page-section unknown-section">
        <p>Unknown section type: {section.type}</p>
      </section>
    )
  }

  return (
    <Component
      section={section}
      accent={accent}
      theme={theme}
      isPreview={isPreview}
      onEdit={onEdit}
    />
  )
}
