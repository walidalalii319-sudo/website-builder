/**
 * Website Builder Components Library
 *
 * This module exports all components and services for the website builder.
 * Organized by feature area for easy importing.
 */

// Drag and Drop
export {
  DraggableItem,
  useDragAndDrop,
  SortableList
} from './drag-drop/DragDrop.jsx';

// Media Library
export {
  mediaLibrary,
  MediaPicker,
  MediaGallery
} from './media/MediaLibrary.jsx';

// Form Builder
export {
  FieldTypes,
  validators,
  FormField,
  FormBuilder,
  MultiStepForm
} from './forms/FormBuilder.jsx';

// CMS (Content Management System)
export {
  cms,
  CollectionManager,
  RecordEditor,
  DynamicList
} from './cms/CMS.jsx';

// E-commerce
export {
  ecommerce,
  CartContext,
  CartProvider,
  useCart,
  ProductCard,
  ShoppingCart,
  CheckoutForm
} from './ecommerce/Ecommerce.jsx';

// Authentication
export {
  auth,
  AuthContext,
  AuthProvider,
  useAuth,
  LoginForm,
  RegisterForm,
  ProtectedRoute,
  UserProfile
} from './auth/Auth.jsx';

// Responsive Controls
export {
  ResponsiveControls,
  useResponsive
} from './responsive/ResponsiveControls.jsx';

// Design System
export {
  TypographyPanel,
  ColorPanel,
  BorderPanel,
  DesignTokensPanel,
  AnimationPanel
} from './design-system/index.js';

// Layout Components
export {
  GridBuilder,
  ModalBuilder,
  VersionHistory,
  AbsolutePositioning,
  NestedComponents,
  LayersPanel
} from './layout/index.js';

// Analytics
export { default as AnalyticsDashboard } from './analytics/AnalyticsDashboard.jsx';

// Section Components
export { default as HeroSection } from './sections/HeroSection.jsx';
export { default as FeaturesSection } from './sections/FeaturesSection.jsx';
export { default as PricingSection } from './sections/PricingSection.jsx';
export { default as CtaSection } from './sections/CtaSection.jsx';
export { default as TextSection } from './sections/TextSection.jsx';
export { default as FooterSection } from './sections/FooterSection.jsx';
export { default as GallerySection } from './sections/GallerySection.jsx';
export { default as StatsSection } from './sections/StatsSection.jsx';
export { default as TeamSection } from './sections/TeamSection.jsx';
export { default as TestimonialSection } from './sections/TestimonialSection.jsx';
export { default as ContactSection } from './sections/ContactSection.jsx';

// Core Components
export { BuilderCanvas } from './BuilderCanvas.jsx';
export { Inspector } from './Inspector.jsx';
export { Sidebar } from './Sidebar.jsx';
export { SectionRenderer } from './SectionRenderer.jsx';
