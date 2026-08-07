# Device Management

IoT / edge device registry sample with device mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:device-management
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5105**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Devices) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
