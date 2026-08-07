<script setup lang="ts">
/**
 * Lab · A11y
 * Spec: docs/APP_WORKFLOW.md §六 — keyboard · focus trap · aria · high contrast
 */
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Button, Card, Icon, Space, Tag } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useFocusTrap, useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, tDyn, locale } = useLocale()

const checklist = computed(() => {
  void locale.value
  return [
    t('page.lab.a11y.c1'),
    t('page.lab.a11y.c2'),
    t('page.lab.a11y.c3'),
    t('page.lab.a11y.c4')
  ]
})

/* —— keyboard path —— */
const items = [1, 2, 3, 4, 5]
const activeIndex = ref(0)
const lastKey = ref('—')
const focusLog = ref<string[]>([])

function pushFocusLog(label: string) {
  focusLog.value = [label, ...focusLog.value].slice(0, 8)
}

function onToolbarKeydown(e: KeyboardEvent) {
  lastKey.value = e.key
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % items.length
    focusToolbarItem(activeIndex.value)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + items.length) % items.length
    focusToolbarItem(activeIndex.value)
  } else if (e.key === 'Home') {
    e.preventDefault()
    activeIndex.value = 0
    focusToolbarItem(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    activeIndex.value = items.length - 1
    focusToolbarItem(activeIndex.value)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    focusLog.value = []
    lastKey.value = 'Escape'
  }
}

function focusToolbarItem(index: number) {
  const el = document.getElementById(`a11y-tool-${index}`)
  el?.focus()
}

function onItemFocus(index: number) {
  activeIndex.value = index
  pushFocusLog(tDyn('page.lab.a11y.item', { n: index + 1 }))
}

/* —— focus trap —— */
const trapOpen = ref(false)
const trapPanel = ref<HTMLElement | null>(null)
const trapTrigger = ref<HTMLElement | null>(null)
const trapField = ref('')

useFocusTrap(trapPanel, trapOpen, { restoreFocus: true })

async function openTrap() {
  trapOpen.value = true
  await nextTick()
  const first = trapPanel.value?.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')
  first?.focus()
}

function closeTrap() {
  trapOpen.value = false
}

/* —— aria / live —— */
const announceCount = ref(0)
const liveMessage = ref('')
const describedValue = ref('')

function announce() {
  announceCount.value += 1
  liveMessage.value = tDyn('page.lab.a11y.announceMsg', { n: announceCount.value })
}

/* —— high contrast —— */
const hcPreview = ref(false)
const contrastRatio = ref('—')
const sampleBox = ref<HTMLElement | null>(null)

function relativeLuminance(r: number, g: number, b: number) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!
}

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function sampleContrast() {
  const el = sampleBox.value
  if (!el) {
    contrastRatio.value = '—'
    return
  }
  const styles = getComputedStyle(el)
  const fg = parseRgb(styles.color)
  const bg = parseRgb(styles.backgroundColor)
  if (!fg || !bg) {
    contrastRatio.value = '—'
    return
  }
  const l1 = relativeLuminance(...fg)
  const l2 = relativeLuminance(...bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  contrastRatio.value = `${ratio.toFixed(2)}:1`
}

function toggleHc() {
  hcPreview.value = !hcPreview.value
  requestAnimationFrame(sampleContrast)
}

onMounted(() => {
  sampleContrast()
  window.addEventListener('resize', sampleContrast, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', sampleContrast)
  trapOpen.value = false
})
</script>

<template>
  <div class="page vp-lab-a11y" :class="{ 'vp-lab-a11y--hc': hcPreview }">
    <ExamplePageHero title-key="page.lab.a11y.title" lead-key="page.lab.a11y.lead" />

    <Card class="vp-lab-a11y__card" :header="tDyn('page.lab.a11y.checklistTitle')">
      <ul class="vp-lab-a11y__checklist">
        <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
      </ul>
    </Card>

    <!-- 1. Keyboard -->
    <Card class="vp-lab-a11y__card" :header="tDyn('page.lab.a11y.sectionKeyboard')">
      <p class="vp-lab-a11y__desc">{{ tDyn('page.lab.a11y.sectionKeyboardDesc') }}</p>
      <div class="vp-lab-a11y__tags">
        <Tag size="sm" :label="`${tDyn('page.lab.a11y.lastKey')}: ${lastKey}`" />
      </div>
      <div
        class="vp-lab-a11y__toolbar"
        role="toolbar"
        :aria-label="tDyn('page.lab.a11y.toolbarLabel')"
        @keydown="onToolbarKeydown"
      >
        <button
          v-for="(n, index) in items"
          :id="`a11y-tool-${index}`"
          :key="n"
          type="button"
          class="vp-lab-a11y__tool"
          :tabindex="activeIndex === index ? 0 : -1"
          :aria-current="activeIndex === index ? 'true' : undefined"
          @focus="onItemFocus(index)"
          @click="onItemFocus(index)"
        >
          {{ tDyn('page.lab.a11y.item', { n }) }}
        </button>
      </div>
      <div class="vp-lab-a11y__log-block">
        <div class="vp-lab-a11y__log-head">
          <strong>{{ tDyn('page.lab.a11y.focusLog') }}</strong>
          <Button size="sm" variant="text" :label="tDyn('page.lab.a11y.clearLog')" @click="focusLog = []" />
        </div>
        <ul class="vp-lab-a11y__log" aria-live="polite">
          <li v-for="(line, i) in focusLog" :key="i">{{ line }}</li>
        </ul>
      </div>
    </Card>

    <!-- 2. Focus trap -->
    <Card class="vp-lab-a11y__card" :header="tDyn('page.lab.a11y.sectionTrap')">
      <p class="vp-lab-a11y__desc">{{ tDyn('page.lab.a11y.sectionTrapDesc') }}</p>
      <div class="vp-lab-a11y__tags">
        <Tag
          size="sm"
          :severity="trapOpen ? 'warning' : 'info'"
          :label="`${tDyn('page.lab.a11y.trapActive')}: ${trapOpen ? tDyn('page.lab.a11y.trapOn') : tDyn('page.lab.a11y.trapOff')}`"
        />
      </div>
      <Button
        ref="trapTrigger"
        size="sm"
        severity="primary"
        :label="tDyn('page.lab.a11y.openTrap')"
        @click="openTrap"
      />

      <div
        v-show="trapOpen"
        ref="trapPanel"
        class="vp-lab-a11y__trap"
        role="dialog"
        aria-modal="true"
        :aria-label="tDyn('page.lab.a11y.trapTitle')"
      >
        <h3 class="vp-lab-a11y__trap-title">{{ tDyn('page.lab.a11y.trapTitle') }}</h3>
        <p class="vp-lab-a11y__desc">{{ tDyn('page.lab.a11y.trapBody') }}</p>
        <InputText v-model="trapField" fluid :placeholder="tDyn('page.lab.a11y.trapField')" />
        <Space wrap>
          <Button size="sm" :label="t(LocaleKeys.button.confirm)" @click="closeTrap" />
          <Button
            size="sm"
            variant="outlined"
            :label="tDyn('page.lab.a11y.closeTrap')"
            @click="closeTrap"
          />
        </Space>
      </div>
    </Card>

    <!-- 3. aria -->
    <Card class="vp-lab-a11y__card" :header="tDyn('page.lab.a11y.sectionAria')">
      <p class="vp-lab-a11y__desc">{{ tDyn('page.lab.a11y.sectionAriaDesc') }}</p>
      <Space wrap>
        <Button
          size="sm"
          severity="secondary"
          icon="Search"
          :ariaLabel="tDyn('page.lab.a11y.iconOnly')"
        />
        <Button size="sm" severity="primary" :label="tDyn('page.lab.a11y.announce')" @click="announce" />
      </Space>
      <div class="vp-lab-a11y__field">
        <label class="vp-lab-a11y__label" for="a11y-described">{{ tDyn('page.lab.a11y.described') }}</label>
        <InputText
          id="a11y-described"
          v-model="describedValue"
          fluid
          aria-describedby="a11y-described-hint a11y-sr-only"
        />
        <p id="a11y-described-hint" class="vp-lab-a11y__hint">{{ tDyn('page.lab.a11y.describedHint') }}</p>
        <span id="a11y-sr-only" class="vp-lab-a11y__sr-only">{{ tDyn('page.lab.a11y.srOnly') }}</span>
      </div>
      <div class="vp-lab-a11y__live" aria-live="polite" aria-atomic="true">
        <strong>{{ tDyn('page.lab.a11y.liveRegion') }}:</strong>
        <span>{{ liveMessage || '—' }}</span>
      </div>
    </Card>

    <!-- 4. High contrast -->
    <Card class="vp-lab-a11y__card" :header="tDyn('page.lab.a11y.sectionContrast')">
      <p class="vp-lab-a11y__desc">{{ tDyn('page.lab.a11y.sectionContrastDesc') }}</p>
      <Space wrap>
        <Button
          size="sm"
          :severity="hcPreview ? 'warning' : 'primary'"
          :label="hcPreview ? tDyn('page.lab.a11y.disableHc') : tDyn('page.lab.a11y.enableHc')"
          @click="toggleHc"
        />
      </Space>
      <div ref="sampleBox" class="vp-lab-a11y__contrast-sample">
        <p>{{ tDyn('page.lab.a11y.contrastSample') }}</p>
        <Button size="sm" severity="primary" :label="t(LocaleKeys.button.save)" />
        <Icon name="Info" size="md" aria-hidden="true" />
      </div>
      <div class="vp-lab-a11y__tags">
        <Tag size="sm" :label="`${tDyn('page.lab.a11y.contrastRatio')}: ${contrastRatio}`" />
      </div>
      <p class="vp-lab-a11y__hint">{{ tDyn('page.lab.a11y.forcedNote') }}</p>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.vp-lab-a11y {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-lab-a11y__card {
  width: 100%;
}

.vp-lab-a11y__desc,
.vp-lab-a11y__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lab-a11y__checklist {
  margin: 0;
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lab-a11y__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-lab-a11y__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-lab-a11y__tool {
  appearance: none;
  min-height: var(--height-md);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  &[aria-current='true'] {
    border-color: var(--primary-500);
    background: var(--primary-50, var(--surface-2));
  }
}

.vp-lab-a11y__log-block {
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  padding: var(--spacing-md);
  background: var(--surface-1);
}

.vp-lab-a11y__log-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.vp-lab-a11y__log {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.vp-lab-a11y__trap {
  margin-top: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 2px solid var(--primary-500);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-lab-a11y__trap-title {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.vp-lab-a11y__field {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-width: 28rem;
}

.vp-lab-a11y__label {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.vp-lab-a11y__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.vp-lab-a11y__live {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.vp-lab-a11y__contrast-sample {
  margin-top: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);

  p {
    margin: 0;
    flex: 1 1 12rem;
    color: var(--text-secondary);
  }
}

.vp-lab-a11y--hc {
  .vp-lab-a11y__card,
  .vp-lab-a11y__trap,
  .vp-lab-a11y__contrast-sample,
  .vp-lab-a11y__log-block,
  .vp-lab-a11y__live {
    background: Canvas;
    color: CanvasText;
    border-color: CanvasText;
  }

  .vp-lab-a11y__desc,
  .vp-lab-a11y__hint,
  .vp-lab-a11y__contrast-sample p,
  .vp-lab-a11y__log {
    color: GrayText;
  }

  .vp-lab-a11y__tool {
    background: ButtonFace;
    color: ButtonText;
    border-color: ButtonText;

    &[aria-current='true'] {
      outline: 2px solid Highlight;
      background: Highlight;
      color: HighlightText;
    }
  }
}
</style>
