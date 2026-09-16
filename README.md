# Website Builder

This project is now organized for real-world growth instead of keeping the entire product in one file.

## Frontend structure

- `src/App.jsx` — application orchestration and editor state
- `src/components/` — visual UI components
- `src/domain/project.js` — project model, templates, defaults, and normalization
- `src/services/projectStorage.js` — persistence and export boundary
- `src/main.jsx` — React entry point
- `src/styles.css` — presentation styles

The current persistence adapter uses browser local storage. It is intentionally isolated so it can later be replaced with an API client without rewriting the editor UI.

## Run

```bash
npm install
npm run dev
npm run build
```

## Next production boundaries

1. Replace `projectStorage.js` with authenticated API calls.
2. Add a server/database layer for projects, pages, sections, blocks, media, and users.
3. Add route-level preview and publishing.
4. Add tests for project normalization and editor mutations.
