# GB28181 Center

National standard video platform sample — SIP device catalog mock CRUD.

## Run locally

From repository root:

```bash
npm run showcase:gb28181-center
```

Or from this folder:

```bash
npm install
npm run dev
```

Dev server port: **5107**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home overview |
| `/manage` | Mock CRUD (GB Devices) |
| `/about` | Showcase metadata |

## Notes

- Uses AMG-WebUI via workspace Vite aliases (`@amg-webui/*` → `packages/`).
- Mock API: `showcases/_shared/mock-api/adapter.ts`.
- This is a **sample scaffold**, not a production app or STABLE component claim.
