# Admin Console

Classic enterprise admin shell — users, settings, and mock CRUD patterns.

## Run locally

From repository root:

```bash
npm run showcase:admin
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5101**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Users) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
