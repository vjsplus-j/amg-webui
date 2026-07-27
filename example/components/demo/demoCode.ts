/**
 * Curated play-page code-example helpers.
 *
 * Gold-standard reference: `example/demos/Avatar/index.vue`
 * Code panel UI: `DemoBlock` → `DemoCode` (in-house tokenizer; published theme palettes).
 *
 * Structure (every curated demo should follow):
 * 1. **Basic** — pasteable SFC (import + template); preview ↔ code 1:1; prefer `default-open`
 * 2. **Feature DemoBlocks** — one concern each; no `…` placeholders; use Token vars / `t('…')`
 * 3. **Slots** — if the component exposes slots
 * 4. **Events** — if it emits; show handlers that match the live preview
 * 5. **Motion** — MotionLivePanel + `formatMotionLiveCode` when MotionProps apply
 * 6. **Related** — sibling kits only as a complete teaser (or link to their own page)
 * 7. **API** — PropsTable sections: Props → Events → Slots (no orphan group props)
 */

/** Join lines into a DemoBlock `:code` string. */
export function demoCode(...lines: Array<string | false | null | undefined>): string {
  return lines.filter((line): line is string => typeof line === 'string').join('\n')
}

/**
 * Pasteable `<script setup>` + `<template>` fragment for the Basic block.
 * Keep body indented as it should appear inside `<template>`.
 */
export function demoSfc(opts: {
  imports: string[]
  /** Lines inside `<template>` (already indented with 2 spaces preferred) */
  template: string[]
  /** Optional extra script lines after imports */
  script?: string[]
}): string {
  const scriptBody = [
    ...opts.imports.map((line) => (line.endsWith(';') ? line : line)),
    ...(opts.script?.length ? ['', ...opts.script] : [])
  ]
  return demoCode(
    '<script setup lang="ts">',
    ...scriptBody,
    '</script>',
    '',
    '<template>',
    ...opts.template,
    '</template>'
  )
}
