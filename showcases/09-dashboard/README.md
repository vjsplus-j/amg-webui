# Analytics Dashboard

KPI dashboard shell plus widget registry mock CRUD for demo tiles.

## Run locally

From repository root:

```bash
npm run showcase:dashboard
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5109**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Widgets) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
