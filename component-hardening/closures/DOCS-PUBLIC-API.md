# DOCS-PUBLIC-API Closure

Status: **CLOSED**

Closed at: 2026-08-08T04:05:00.000Z

## Phases

| Phase | Packages | Status |
|-------|----------|--------|
| P0 | core / form / data / overlay | CLOSED (224) |
| P1 | charts / editor | CLOSED (12) |
| P2 | business | CLOSED (N/A — 0 public inventory components) |
| P3 | media / gb28181 / onvif | CLOSED (34) |
| P4 | lowcode / experimental UI | CLOSED (17) |

## Gates

| Gate | Result |
|------|--------|
| Metadata SSOT (`component-metadata/*.json`) | PASS 287/287 |
| API Extract (`generated/component-api`) | PASS 287/287 |
| Docs pages (`docs/components/<kebab>.md`) | PASS 287/287 |
| Example demos present | PASS 287/287 |
| Example intro (`ComponentIntroCard` + generated metadata) | PASS 287 |
| Public export audit (barrel) | PASS 287/287 · P0 barrel FAIL 0 |
| `check:docs-quality --all` | PASS |
| `test:docs-code` (core Vue fences) | PASS |
| `test:docs-consumer-imports` | PASS |
| `docs:build` | PASS |
| `vue-tsc --noEmit` | PASS |

## Key fixes in this program

- Component Metadata SSOT + Example / Docs shared consumption
- Shared `toKebab` for docs filenames (fixes `PTZControl` → `ptz-control`)
- Package barrels re-export public component types from `./Name/types` (selective, collision-safe)
- DataTable public types (`DataTableProps`, `DataTableInstance`, `Column`, …) importable from `amg-webui/data`
- Lowcode UI barrel path audited via `packages/lowcode/ui/index.ts`
- CI permanent gates: extract / docs-quality / audit / docs-code / consumer-imports / coverage

## Commands

```bash
npm run extract:component-api
npm run generate:docs-public-api
npm run generate:entry
npm run check:docs-quality   # P0
node scripts/check-docs-quality.mjs --all
npm run audit:public-api
npm run test:docs-code
npm run test:docs-consumer-imports
npm run build:public-doc-coverage
npm run docs:build
```

## Notes

- `check:docs-drift` compares regenerated docs to **git HEAD**; commit regenerated `docs/components` + sidebar before CI green.
- Full packed `test:consumers` still requires `npm run build:lib` so dist `.d.ts` picks up new type re-exports.
- Batch 01–04 remain **paused** until explicitly resumed.
