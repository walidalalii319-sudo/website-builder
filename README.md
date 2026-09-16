# Website Builder

A React/Vite visual website builder MVP. The editor demonstrates the foundation needed for a larger no-code platform: reusable sections, a live responsive canvas, an inspector, project persistence, import/export, and undo/redo history.

## Current capabilities

- Add reusable Hero, Features, Pricing, CTA, Text, and Footer sections
- Select sections from the canvas or structure tree
- Edit section content and hero colors in the inspector
- Preview desktop, tablet, and mobile layouts
- Undo/redo changes with toolbar buttons or `Ctrl/Cmd+Z`
- Save projects to browser local storage
- Export and import project JSON
- Reset to the starter template
- View the generated page structure as JSON

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:3000`.

## Roadmap

The next production milestones are drag-and-drop ordering, richer style controls, multiple pages and routing, media uploads, forms, CMS collections, authentication, publishing, accessibility checks, and a backend API/database.
