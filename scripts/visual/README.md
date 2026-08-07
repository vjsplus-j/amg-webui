# Visual theme regression matrix

Official design themes are screenshot-compared across **8 brands × light/dark (where supported) × LTR/RTL** for core components:

- Button
- InputText
- Select
- DataTable
- Dialog

Matrix SSOT: [`matrix.mjs`](./matrix.mjs)  
Harness page: `example/pages/lab/VisualThemeMatrixPage.vue`
- Human: side-by-side `ThemeProvider` cells for all 8 official designs
- CI: fixed `data-visual-matrix` capture strip driven by `?design&scheme&dir`
Playwright spec: `tests/e2e/visual-theme-matrix.spec.ts`
Baselines: `tests/e2e/visual-theme-matrix.spec.ts-snapshots/`

## Prerequisites

```bash
npm ci
npm run build:example
npx playwright install chromium
```

## Run compare (FAIL on regression)

```bash
npm run test:visual:matrix
# or
node scripts/visual/run-matrix.mjs
```

Uses Playwright `toHaveScreenshot` with:

- `maxDiffPixelRatio: 0.01` (1% pixels may differ)
- `threshold: 0.15` per-pixel color distance

Do **not** lower these values to force a green run. If a theme fails contrast or visual drift, fix the theme or update baselines intentionally.

## Update baselines

After an **intentional** visual change (token tweak, component polish):

```bash
npm run test:visual:matrix:update
# or
node scripts/visual/run-matrix.mjs --update
```

Review diff in `tests/e2e/visual-theme-matrix.spec.ts-snapshots/` and commit the PNGs with your theme/component change.

**Note:** Baselines were generated on Chromium with fixed 1280×900 viewport. CI runs on Linux — if font rasterization differs, regenerate baselines in CI once via `--update-snapshots` on the nightly runner, then commit.

## CI

Nightly workflow runs full `npm run test:e2e`, which includes this matrix on Chromium after `build:example`.

## Matrix size

| Theme | Schemes tested |
|-------|----------------|
| mercedes, porsche, lamborghini, ferrari | dark only |
| linear, apple, wechat, alipay | light + dark |

Directions: `ltr`, `rtl` for all.  
Total cases: **120** component snapshots (as of matrix.mjs).
