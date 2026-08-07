# Video Surveillance

VMS-style camera channel management sample (mock data only).

## Run locally

From repository root:

```bash
npm run showcase:video-surveillance
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5106**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (Cameras) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
