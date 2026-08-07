# ONVIF Center

ONVIF discovery and channel registry sample with mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:onvif-center
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5108**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (ONVIF Devices) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
