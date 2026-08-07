# Mobile Admin

Mobile-first admin layout with compact nav and field mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:mobile-admin
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5110**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Tasks) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
