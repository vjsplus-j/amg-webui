# AMG-WebUI Application Showcases

Consumer-facing **application samples** (not the library-author `example/` playground).

Each folder is a standalone Vite + Vue 3 app with domain-specific routes and mock data.

Shared mock APIs: [`_shared/mock-api`](./_shared/mock-api/) · list shell: [`DataPageShell`](./_shared/components/DataPageShell.vue).

## Deepened samples (P1)

| Folder | Routes / pages |
|--------|----------------|
| [01-admin](./01-admin/) | Dashboard · Users (CRUD) · Settings (form sections) |
| [02-saas](./02-saas/) | Overview · Tenants · Organizations · Members · Subscriptions · Plans · Usage · Billing |
| [03-ecommerce](./03-ecommerce/) | Overview · Products · SKU · Orders · Order detail · Customers · Inventory · Promotions |
| [04-content-management](./04-content-management/) | Overview · Articles · Categories · Tags · Drafts · Publish · Media · Editor |
| [05-device-management](./05-device-management/) | Overview · Device list · Detail · Online · Groups · Telemetry · Alarms · Operations |
| [06-video-surveillance](./06-video-surveillance/) | Overview · Device tree · Video grid · Player · Stream · PTZ · Snapshot · Recording · Alarms |
| [07-gb28181-center](./07-gb28181-center/) | Overview · Device list · Channel list · SIP status |
| [08-onvif-center](./08-onvif-center/) | WS-Discovery · Device list · Media profiles |
| [09-dashboard](./09-dashboard/) | KPI cards · chart placeholders · orders table |
| [10-mobile-admin](./10-mobile-admin/) | Drawer nav · card list tasks · profile |

All showcases smoke-tested via `npm run test:showcases`.

## Build all showcases

```bash
npm run test:showcases
```

## Samples

| Folder | Title | Port | Root script |
|--------|-------|------|-------------|
| [01-admin](./01-admin/) | Admin Console | 5101 | `npm run showcase:admin` |
| [02-saas](./02-saas/) | SaaS Console | 5102 | `npm run showcase:saas` |
| [03-ecommerce](./03-ecommerce/) | E-Commerce Ops | 5103 | `npm run showcase:ecommerce` |
| [04-content-management](./04-content-management/) | Content CMS | 5104 | `npm run showcase:content-management` |
| [05-device-management](./05-device-management/) | Device Management | 5105 | `npm run showcase:device-management` |
| [06-video-surveillance](./06-video-surveillance/) | Video Surveillance | 5106 | `npm run showcase:video-surveillance` |
| [07-gb28181-center](./07-gb28181-center/) | GB28181 Center | 5107 | `npm run showcase:gb28181-center` |
| [08-onvif-center](./08-onvif-center/) | ONVIF Center | 5108 | `npm run showcase:onvif-center` |
| [09-dashboard](./09-dashboard/) | Analytics Dashboard | 5109 | `npm run showcase:dashboard` |
| [10-mobile-admin](./10-mobile-admin/) | Mobile Admin | 5110 | `npm run showcase:mobile-admin` |

## First-time setup

Install dependencies per showcase (or run from root scripts which delegate with `--prefix`):

```bash
npm install --prefix showcases/01-admin
```

## Development

```bash
npm run showcase:admin
# … see table above for other slugs
```

These scaffolds compile against workspace sources; build the library first if you prefer `dist/` artifacts:

```bash
npm run build:lib
```
