# Content CMS

Editorial CMS sample for articles/pages with content entry mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:content-management
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5104**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Articles) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
