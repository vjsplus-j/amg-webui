<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { highlightToLines } from './highlightCode'
import {
  DEMO_CODE_STYLES,
  getDemoCodeStyle,
  initDemoCodeStyle,
  setDemoCodeStyle,
  subscribeDemoCodeStyle,
  type DemoCodeStyleId
} from './codeStyleStore'

const props = withDefaults(
  defineProps<{
    code: string
    /** Language hint — vue / html / ts / js … */
    lang?: string
    /** Show gutter line numbers (CSS counters). */
    lineNumbers?: boolean
  }>(),
  {
    lang: 'vue',
    lineNumbers: true
  }
)

const { t } = useLocale()
const styleId = ref<DemoCodeStyleId>(initDemoCodeStyle())

const lines = computed(() => highlightToLines(props.code, props.lang))

const rootClass = computed(() => [
  'vp-demo-code',
  {
    'vp-demo-code--lines': props.lineNumbers
  }
])

function onStyleChange(event: Event) {
  const next = (event.target as HTMLSelectElement).value as DemoCodeStyleId
  setDemoCodeStyle(next)
  styleId.value = next
}

let unsub: (() => void) | undefined

onMounted(() => {
  styleId.value = getDemoCodeStyle()
  unsub = subscribeDemoCodeStyle((id) => {
    styleId.value = id
  })
})

onUnmounted(() => {
  unsub?.()
})
</script>

<template>
  <div :class="rootClass" :data-vp-code-style="styleId">
    <div class="vp-demo-code__toolbar">
      <label class="vp-demo-code__style">
        <span class="vp-demo-code__style-label">{{ t(LocaleKeys.exampleDoc.codeStyle) }}</span>
        <select
          class="vp-demo-code__style-select"
          :value="styleId"
          :aria-label="t(LocaleKeys.exampleDoc.codeStyle)"
          @change="onStyleChange"
        >
          <option v-for="opt in DEMO_CODE_STYLES" :key="opt.id" :value="opt.id">
            {{ t(opt.labelKey) }}
          </option>
        </select>
      </label>
    </div>

    <pre class="vp-demo-code__pre"><code class="vp-demo-code__code"><span
        v-for="(line, li) in lines"
        :key="li"
        class="vp-demo-code__line"
        :data-line="li + 1"
      ><span
          v-for="(tok, ti) in line.tokens"
          :key="ti"
          :class="['vp-tok', `vp-tok--${tok.kind}`]"
        >{{ tok.text }}</span></span></code></pre>
  </div>
</template>

<style scoped>
.vp-demo-code {
  position: relative;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border-top: 1px solid var(--ds-border);
  background: var(--vp-code-bg);
  border-radius: 0 0 var(--theme-card-radius) var(--theme-card-radius);
  /* Expand with content — page scrolls in .ln-content; avoid nested max-height box */
  overflow-x: auto;
  overflow-y: visible;
  color: var(--vp-code-fg);
}

.vp-demo-code__toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-sm) var(--theme-card-pad) 0;
  background: var(--vp-code-bg);
}

.vp-demo-code__style {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-sm);
  font-size: var(--font-size-xs);
  color: var(--vp-code-gutter);
}

.vp-demo-code__style-label {
  white-space: nowrap;
}

.vp-demo-code__style-select {
  min-height: var(--height-sm);
  padding: 0 var(--spacing-sm);
  border: 1px solid color-mix(in srgb, var(--vp-code-fg) 18%, transparent);
  border-radius: var(--theme-input-radius, var(--theme-btn-radius));
  background: color-mix(in srgb, var(--vp-code-bg) 88%, var(--vp-code-fg));
  color: var(--vp-code-fg);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
  cursor: pointer;
}

.vp-demo-code__style-select:hover,
.vp-demo-code__style-select:focus-visible {
  border-color: color-mix(in srgb, var(--vp-code-fg) 36%, transparent);
  outline: none;
}

.vp-demo-code__pre {
  margin: 0;
  padding: var(--spacing-sm) var(--theme-card-pad) var(--spacing-md);
  background: transparent;
  overflow: visible;
  font-size: var(--font-size-xs);
  line-height: 1.45;
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  tab-size: 2;
}

.vp-demo-code__code {
  display: block;
  counter-reset: demo-line;
  color: var(--vp-code-fg);
  font-family: inherit;
  line-height: inherit;
  white-space: normal;
  word-break: normal;
}

.vp-demo-code__line {
  display: block;
  margin: 0;
  padding-block: 0;
  padding-inline-start: 0;
  line-height: 1.45;
  min-height: 1.45em;
  white-space: pre;
}

.vp-demo-code--lines .vp-demo-code__line {
  padding-inline-start: calc(var(--spacing-2xl) + var(--spacing-md));
  position: relative;
}

.vp-demo-code--lines .vp-demo-code__line::before {
  counter-increment: demo-line;
  content: counter(demo-line);
  position: absolute;
  inset-inline-start: 0;
  width: var(--spacing-2xl);
  text-align: end;
  color: var(--vp-code-gutter);
  opacity: 0.72;
  user-select: none;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.vp-tok--comment {
  color: var(--vp-code-comment);
  font-style: italic;
}

.vp-tok--string {
  color: var(--vp-code-string);
}

.vp-tok--keyword {
  color: var(--vp-code-keyword);
}

.vp-tok--tag {
  color: var(--vp-code-tag);
}

.vp-tok--attr {
  color: var(--vp-code-attr);
}

.vp-tok--directive {
  color: var(--vp-code-directive);
}

.vp-tok--punctuation {
  color: var(--vp-code-punctuation);
}

.vp-tok--number {
  color: var(--vp-code-number);
}

.vp-tok--boolean {
  color: var(--vp-code-boolean);
}

.vp-tok--plain {
  color: var(--vp-code-fg);
}
</style>

<!-- Unscoped: published theme palettes (see codeHighlightThemes.scss) -->
<style src="./codeHighlightThemes.scss"></style>
