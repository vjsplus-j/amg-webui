#!/usr/bin/env node
/**
 * Upgrade w5_industry MVP stubs to real implementations.
 * Run: node scripts/upgrade-w5-industry.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = path.join(ROOT, 'packages/components/base')

function write(comp, files) {
  const dir = path.join(BASE, comp)
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, 'utf8')
  }
  console.log(`✓ ${comp}`)
}

const panelScss = (pfx) => `.${pfx} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);

  &__title { margin: 0 0 var(--spacing-sm); font-size: var(--font-size-lg); font-weight: 600; }
  &__body { display: flex; flex-direction: column; gap: var(--spacing-md); min-width: 0; }
  &__panel {
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    padding: var(--theme-card-pad, var(--spacing-md));
  }
  &__muted { color: var(--text-secondary); font-size: var(--font-size-sm); }
  &__toolbar { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; }
  &__btn, &__action {
    appearance: none;
    border: 1px solid transparent;
    background: var(--primary-500);
    color: var(--surface-0, var(--surface-1));
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-lg);
    cursor: pointer;
    font-size: var(--font-size-sm);
  }
  &__btn:disabled, &__action:disabled { opacity: 0.55; cursor: not-allowed; }
  &__input, &__select {
    flex: 1;
    min-width: 6rem;
    height: var(--height-md, 2.25rem);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-input-radius, var(--border-radius-md));
    padding: 0 var(--spacing-md);
    background: var(--surface-0, var(--surface-1));
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }
  &__range { flex: 1; accent-color: var(--primary-500); }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

// ─── 404 pages ───────────────────────────────────────────────
const NOT_FOUND_404 = [
  ['Simple404', 'simple404', ''],
  ['Cartoon404', 'cartoon404', `
  &__art { position: relative; width: 100%; max-width: 12rem; height: 6rem; margin: 0 auto; }
  &__blob {
    position: absolute; border-radius: 50%;
    background: var(--primary-200, var(--primary-500));
    opacity: 0.35;
    animation: vp-cartoon404-bounce 2s ease-in-out infinite;
  }
  &__blob--a { width: 3rem; height: 3rem; left: 0; top: 1rem; }
  &__blob--b { width: 2rem; height: 2rem; right: 1rem; top: 0; animation-delay: 0.4s; }
  &__code { position: relative; z-index: 1; font-size: var(--font-size-2xl); font-weight: 700; color: var(--primary-500); }
  @keyframes vp-cartoon404-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(calc(var(--spacing-sm) * -1))} }`],
  ['Tech404', 'tech404', `
  background-image:
    linear-gradient(var(--ds-border, var(--border-color)) 1px, transparent 1px),
    linear-gradient(90deg, var(--ds-border, var(--border-color)) 1px, transparent 1px);
  background-size: var(--spacing-lg) var(--spacing-lg);
  &__code { font-family: var(--font-family-mono, monospace); letter-spacing: 0.15em; color: var(--text-primary); }`],
  ['Business404', 'business404', `
  &__bars { display: flex; gap: var(--spacing-sm); align-items: flex-end; justify-content: center; height: 4rem; }
  &__bar {
    width: var(--spacing-lg);
    background: var(--primary-300, var(--primary-500));
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    opacity: 0.6;
  }`],
  ['Doodle404', 'doodle404', `
  border-style: dashed;
  border-width: 2px;
  transform: rotate(-0.5deg);
  &__code { font-weight: 700; text-decoration: underline wavy var(--primary-500); }`],
  ['Space404', 'space404', `
  background: radial-gradient(circle at 30% 40%, var(--primary-200, var(--primary-500)) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, var(--surface-2, var(--surface-1)) 0%, transparent 40%),
    var(--surface-1);
  &__stars {
    height: 3rem;
    background-image: radial-gradient(circle, var(--text-secondary) 1px, transparent 1px);
    background-size: var(--spacing-lg) var(--spacing-lg);
    opacity: 0.4;
  }`],
  ['Ink404', 'ink404', `
  border-bottom: 4px solid var(--primary-500);
  &__code { font-weight: 700; letter-spacing: 0.3em; }`],
  ['Pixel404', 'pixel404', `
  &__grid { display: grid; grid-template-columns: repeat(3, var(--spacing-lg)); gap: 2px; margin: 0 auto; width: fit-content; }
  &__pixel { width: var(--spacing-lg); height: var(--spacing-lg); background: var(--primary-500); opacity: 0.7; }
  &__pixel--off { opacity: 0.15; background: var(--text-secondary); }`],
  ['Plant404', 'plant404', `
  &__leaf {
    width: 2rem; height: 2rem; margin: 0 auto;
    background: var(--primary-400, var(--primary-500));
    border-radius: 50% 0 50% 0;
    opacity: 0.5;
  }`],
  ['Machine404', 'machine404', `
  background: repeating-conic-gradient(
    from 0deg at 50% 50%,
    var(--surface-2, var(--surface-1)) 0deg 15deg,
    var(--ds-border, var(--border-color)) 15deg 30deg
  );
  opacity: 1;
  &__gear { font-size: var(--font-size-2xl); color: var(--text-secondary); }`],
]

for (const [name, variant, extraScss] of NOT_FOUND_404) {
  const pfx = `vp-${variant}`
  const artMap = {
    cartoon404: `<div class="${pfx}__art" aria-hidden="true"><span class="${pfx}__blob ${pfx}__blob--a" /><span class="${pfx}__blob ${pfx}__blob--b" /><span class="${pfx}__code">404</span></div>`,
    tech404: `<p class="${pfx}__code" aria-hidden="true">404</p>`,
    business404: `<div class="${pfx}__bars" aria-hidden="true"><span class="${pfx}__bar" style="height:60%" /><span class="${pfx}__bar" style="height:90%" /><span class="${pfx}__bar" style="height:40%" /><span class="${pfx}__bar" style="height:75%" /></div>`,
    doodle404: `<p class="${pfx}__code" aria-hidden="true">404</p>`,
    space404: `<div class="${pfx}__stars" aria-hidden="true" /><p class="${pfx}__code" aria-hidden="true">404</p>`,
    ink404: `<p class="${pfx}__code" aria-hidden="true">404</p>`,
    pixel404: `<div class="${pfx}__grid" aria-hidden="true">${[1,1,1,1,0,1,1,0,1].map((on,i)=>`<span class="${pfx}__pixel${on?'':' '+pfx+'__pixel--off'}" />`).join('')}</div>`,
    plant404: `<div class="${pfx}__leaf" aria-hidden="true" /><p class="${pfx}__code" aria-hidden="true">404</p>`,
    machine404: `<p class="${pfx}__gear" aria-hidden="true">⚙</p><p class="${pfx}__code" aria-hidden="true">404</p>`,
    simple404: `<p class="${pfx}__code" aria-hidden="true">404</p>`,
  }
  const art = artMap[variant] || artMap.simple404
  write(name, {
    'index.vue': `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = defineProps<${name}Props>()
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.${variant}.lead'))
</script>

<template>
  <div :class="['${pfx}', '${pfx}__panel', props.class]" :style="style" data-variant="${variant}">
    <div class="${pfx}__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      ${art}
      <h1 class="${pfx}__title">{{ titleText }}</h1>
      <p class="${pfx}__muted">{{ leadText }}</p>
      <div class="${pfx}__toolbar">
        <slot>
          <button type="button" class="${pfx}__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
`,
    'style.scss': panelScss(pfx) + extraScss,
  })
}

// Update 404 leads in zh-CN and en-US component.ts
const leads404 = {
  'component.simple404.lead': { 'zh-CN': '您访问的页面不存在。', 'en-US': 'The page you are looking for does not exist.' },
  'component.cartoon404.lead': { 'zh-CN': '哎呀！页面走丢了。', 'en-US': 'Oops! This page wandered off.' },
  'component.tech404.lead': { 'zh-CN': '信号丢失，路由未找到。', 'en-US': 'Signal lost. Route not found.' },
  'component.business404.lead': { 'zh-CN': '该报表链接已失效。', 'en-US': 'This report link is no longer available.' },
  'component.doodle404.lead': { 'zh-CN': '草图未找到——走错路了！', 'en-US': 'Sketch not found — wrong turn!' },
  'component.space404.lead': { 'zh-CN': '迷失太空——这里没有页面。', 'en-US': 'Lost in space — no page here.' },
  'component.ink404.lead': { 'zh-CN': '墨迹已淡——页面缺失。', 'en-US': 'The ink faded — page missing.' },
  'component.pixel404.lead': { 'zh-CN': '关卡未找到，游戏结束？', 'en-US': 'Level not found. Game over?' },
  'component.plant404.lead': { 'zh-CN': '这条路还没长出来。', 'en-US': 'This path has not grown yet.' },
  'component.machine404.lead': { 'zh-CN': '齿轮卡住——页面不可用。', 'en-US': 'Gear jam — page unavailable.' },
}
for (const [locale, file] of [['zh-CN', 'zh-CN'], ['en-US', 'en-US']]) {
  const fp = path.join(ROOT, `packages/locale/${file}/component.ts`)
  let src = fs.readFileSync(fp, 'utf8')
  for (const [key, vals] of Object.entries(leads404)) {
    const val = vals[locale]
    const re = new RegExp(`'${key}': '[^']*'`)
    if (re.test(src)) src = src.replace(re, `'${key}': '${val}'`)
  }
  fs.writeFileSync(fp, src, 'utf8')
}
console.log('✓ 404 leads updated (zh-CN, en-US)')

console.log('Part 1 done — run part 2 for video/onvif/gbs/vcr')
