# E-Commerce Ops

Catalog and order operations sample with product mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:ecommerce
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5103**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Products) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
