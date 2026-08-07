# Component Page Template (VitePress)

Stable public components in `docs/components/` must include these sections in order.
Apply this template to v0.1 core pages first (Button, DataTable, Form, …); do not hand-edit all 287 pages in one pass.

## Required sections

| Section | Purpose |
| --- | --- |
| **Overview** | What the component is, stability, hardening status |
| **When To Use / When Not To Use** | Decision guidance + related components |
| **Examples** | Minimal import snippet + `<DocsDemo name="…" />` when a shared demo exists |
| **API** | Props, Events, Slots, Expose, Models, Public types (generated from `generated/component-api/*.json`) |
| **Accessibility** | Keyboard, ARIA, focus; link to `component-hardening/evidence/<Component>/` |
| **Stability** | maturity / apiFreeze / API extract path |

## Skeleton

```md
# ComponentName

ComponentName 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 生成。

## Overview

…

## When To Use

…

## When Not To Use

…

## Related Components

- [Other](./other)

## Examples

\`\`\`vue
<script setup>
import { ComponentName } from '@amg-webui/…'
</script>

<template>
  <ComponentName />
</template>
\`\`\`

Curated demo：`example/demos/ComponentName/index.vue`

<DocsDemo name="component-basic" />

## API

### Props
…

### Events
…

### Slots
…

### Expose
…

### Models
…

### Public types
…

## Accessibility

交互行为与键盘路径以 `component-hardening/evidence/ComponentName/a11y.json` · `keyboard.json` 为准。

## Stability

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/ComponentName.json` |
```

## Notes

- **Examples** must use `<DocsDemo />` when `docs/demos/registry.ts` lists the demo; otherwise link to `example/demos/`.
- **API** tables are SSOT from `npm run hardening:extract-api`; avoid partial hand-maintained tables.
- Bilingual headings: English section titles (`Overview`, `Examples`, `API`, `Accessibility`) are required for v0.1 core pages; body may stay zh-CN where already localized.
