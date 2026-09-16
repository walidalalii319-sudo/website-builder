* {
  box-sizing: border-box;
}

:root {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #0f172a;
  background: #f8fafc;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body, #root {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

body {
  min-height: 100vh;
  background: #eef2ff;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 300px;
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #e2e8f0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef2f7;
  margin-bottom: 18px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #2563eb);
  color: white;
  font-weight: 700;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  color: #64748b;
}

.panel-block h3 {
  margin: 0 0 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
}

.component-list,
.section-list,
.inspector-form,
.editor-stack,
.editor-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-button,
.section-item,
.viewport-controls button,
.primary-btn,
.secondary-btn,
.danger-btn,
.history-btn {
  border: 0;
  border-radius: 12px;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.component-button,
.section-item {
  width: 100%;
  text-align: left;
  background: #f8fafc;
  color: #0f172a;
  padding: 10px 12px;
  font-weight: 600;
}

.component-button:hover,
.section-item:hover,
.viewport-controls button:hover,
.primary-btn:hover,
.secondary-btn:hover,
.danger-btn:hover,
.history-btn:hover {
  transform: translateY(-1px);
}

.section-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-item.active {
  background: #ede9fe;
  color: #5b21b6;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8b5cf6;
}

.builder-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #e2e8f0;
  backdrop-filter: blur(10px);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-pill {
  background: #ecfdf5;
  color: #047857;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.history-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #334155;
  font-size: 20px;
}

.history-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.viewport-controls {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 5px;
}

.viewport-controls button {
  background: transparent;
  color: #475569;
  padding: 8px 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.viewport-controls button.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.primary-btn,
.secondary-btn,
.danger-btn {
  padding: 11px 16px;
  font-weight: 700;
}

.primary-btn {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
}

.primary-btn.small {
  padding: 10px 14px;
  font-size: 13px;
}

.secondary-btn {
  background: transparent;
  color: #0f172a;
  border: 1px solid #dbeafe;
}

.danger-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.canvas {
  flex: 1;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
}

.canvas-inner {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  padding: 30px 22px 20px;
}

.canvas.desktop .canvas-inner {
  width: 100%;
}

.canvas.tablet .canvas-inner {
  max-width: 768px;
}

.canvas.mobile .canvas-inner {
  max-width: 420px;
}

.selected-section {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
  border-radius: 14px;
}

.page-section,
.page-footer {
  padding: 28px 24px;
}

.hero-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  border-radius: 18px;
}

.eyebrow {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 10px;
}

.hero-copy h1,
.section-header h2,
.text-section h2,
.cta-box h2 {
  margin: 0 0 12px;
  line-height: 1.1;
  font-size: clamp(2.2rem, 3vw, 4rem);
}

.hero-copy p,
.text-section p,
.cta-box p,
.feature-card p,
.pricing-card p {
  margin: 0;
  color: #475569;
}

.hero-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-card {
  display: flex;
  justify-content: center;
}

.mini-window {
  width: min(100%, 360px);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  padding: 14px;
}

.window-header {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
}

.window-header span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
}

.content-lines {
  display: grid;
  gap: 10px;
}

.content-lines b {
  display: block;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
}

.section-header {
  text-align: center;
  margin-bottom: 22px;
}

.section-header h2,
.text-section h2,
.cta-box h2 {
  font-size: clamp(1.8rem, 2vw, 2.7rem);
}

.feature-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature-card,
.pricing-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 18px;
}

.feature-card h3,
.pricing-card h3 {
  margin: 16px 0 8px;
}

.icon-dot {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
}

.price {
  font-size: 2rem;
  font-weight: 800;
  margin: 8px 0;
}

.price span {
  font-size: 0.9rem;
  color: #64748b;
}

.cta-box {
  background: linear-gradient(135deg, #111827, #312e81);
  border-radius: 18px;
  padding: 36px 28px;
  text-align: center;
  color: white;
}

.cta-box p {
  color: rgba(255, 255, 255, 0.8);
}

.text-section {
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #fff;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  margin-top: 8px;
}

.page-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.page-footer a {
  color: #475569;
  text-decoration: none;
}

.muted {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

.project-tools {
  margin-top: 22px;
}

.file-button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.file-button input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.inspector-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}

.inspector-form input,
.inspector-form textarea {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 10px 12px;
  color: #0f172a;
}

.inspector-form input[type='color'] {
  min-height: 44px;
  padding: 6px;
}

.mini-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
}

.editor-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.code-block {
  width: 100%;
  max-height: 260px;
  overflow: auto;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1080px) {
  .app-shell {
    grid-template-columns: 220px minmax(0, 1fr) 260px;
  }
}

@media (max-width: 920px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border: 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .right-sidebar {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }

  .feature-grid,
  .pricing-grid,
  .hero-section {
    grid-template-columns: 1fr;
  }

  .topbar {
    gap: 12px;
    flex-wrap: wrap;
  }
}

@media (max-width: 620px) {
  .topbar-left {
    width: 100%;
    justify-content: space-between;
  }

  .status-pill {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .viewport-controls {
    order: 3;
    width: 100%;
    justify-content: center;
  }
}
