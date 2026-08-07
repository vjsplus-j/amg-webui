# Migration Guide (0.1 → 1.0)

> **Status:** skeleton for Release Step 6 compliance prep. Not final until 1.0 API freeze.

## Audience

Teams upgrading from **amg-webui@0.1.x** (trial subset) to **1.0.0** (stable contract).

## Anticipated breaking changes

### Prefix & class names

| 0.1 (trial) | 1.0 (target) |
|-------------|--------------|
| Legacy `p-` prefixes in docs/examples | **`vp-` only** in library surface |
| Mixed BEM in experimental components | Unified `vp-*` + token-driven SCSS |

Run codemods / search-replace on app templates and global overrides before upgrading.

### API freeze & subset SLA

- **0.1:** API **mutable**; only the v0.1 subset (`docs/V0_1_SUBSET.md`) carries informal SLA.
- **1.0:** Subset graduates to full catalog coverage targets; **semver-major** only for documented breaks.
- Experimental components may be renamed, moved under `@amg-webui/experimental`, or removed without minor bump until 1.0.

### SSR / Nuxt

- **0.1 Step 5:** `isClient` / `getDocument` / `getWindow` helpers; overlay listeners guarded — **best-effort**, not full Nuxt module yet.
- **1.0:** Official SSR/Nuxt adapter, `ClientOnly` patterns documented, service APIs (Toast / MessageBox / Confirm) split into SSR-safe stubs.

### Theming & tokens

- Custom themes via Theme Studio export remain; internal token renames will be listed in CHANGELOG with migration table.
- Hardcoded hex/px in consumer apps must migrate to `--ds-*` / `--theme-*` (see `packages/theme/TOKENS.md`).

### i18n

- Missing locale keys become **compile-time errors** in 1.0 toolchain (typed i18n).
- Add keys to **all** packs: `zh-CN` · `zh-HK` · `en-US` · `hi-IN` · `ja-JP` · `ko-KR` · `ko-KP` · `ru-RU` · `ar-SA` · `ug-CN`.

### Telemetry

- Default **off** in both 0.1 and 1.0; opt-in via `TelemetryService.configure`.
- Event shape stable; sink interfaces may gain optional fields (non-breaking).

## Recommended upgrade path

1. Pin `0.1.x`, complete app test suite under current subset.
2. Replace bare `window` / `document` usage with `@amg-webui/utils/env` helpers where touching AMG APIs.
3. Run `npm run test:ssr` in CI once on Node without DOM (or mocked `window`).
4. Watch CHANGELOG for `[Breaking]` entries during 0.2–0.9.
5. Upgrade to `1.0.0` after migration doc section **Final checklist** is published (Step 6).

## Final checklist (Step 6 — placeholder)

- [ ] API freeze sign-off
- [ ] Codemod `p-` → `vp-` published
- [ ] VitePress docs complete for v0.1 subset + 1.0 delta
- [ ] Nuxt / SSR example app in `example/` (local only)
- [ ] npm provenance + license audit
- [ ] CHANGELOG 1.0.0 section complete

## See also

- `docs/RELEASE_0.1.md` — trial contract
- `docs/V0_1_SUBSET.md` — promised components
- `docs/LIBRARY_PLAN.md` — P4–P5 release gates
- `CHANGELOG.md`
