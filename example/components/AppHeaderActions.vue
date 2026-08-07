<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Button } from '@amg-webui/core'
import { Search, Select } from '@amg-webui/form'
import type { SelectModelValue } from '@amg-webui/form/Select/types'
import {
  ThemeService,
  designStyles,
  type DesignStyleName,
  type ColorScheme,
  IconStyleService,
  iconStyles,
  type IconStyleName,
  FontService,
  fonts,
  type FontName,
  ToastService
} from '@amg-webui/theme'
import {
  LocaleService,
  LOCALE_CODES,
  LOCALE_META,
  LocaleKeys,
  type LocaleCode
} from '@amg-webui/locale'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()

const searchText = ref('')
const currentDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
const currentScheme = ref<ColorScheme>(ThemeService.getScheme())
const currentIconStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
const currentFont = ref<FontName>(FontService.getCurrentFont())
const currentLocale = ref<string>(LocaleService.getLocale())
const currentDir = ref(LocaleService.getDir())

const localeOptions = computed(() =>
  LOCALE_CODES.map((code) => ({ label: LOCALE_META[code].label, value: code }))
)

/** Registry labels are designmd brand themes (not placeholder data). */
const designOptions = computed(() =>
  designStyles.map((item) => ({
    label: `${item.category} · ${item.label}`,
    value: item.name
  }))
)

const iconOptions = computed(() =>
  iconStyles.map((item) => ({ label: item.label, value: item.name }))
)

const fontOptions = computed(() =>
  fonts.map((item) => ({ label: item.label, value: item.name }))
)

const schemeSupported = computed(
  () =>
    designStyles.find((item) => item.name === currentDesign.value)?.supportsScheme ===
    true
)

const schemeLabel = computed(() =>
  currentScheme.value === 'dark'
    ? t(LocaleKeys.chrome.schemeDark)
    : t(LocaleKeys.chrome.schemeLight)
)

const schemeToggleLabel = computed(() =>
  t(LocaleKeys.chrome.current, { label: schemeLabel.value })
)

const dirLabel = computed(() =>
  currentDir.value === 'rtl' ? t(LocaleKeys.chrome.dirRtl) : t(LocaleKeys.chrome.dirLtr)
)

const dirToggleLabel = computed(() =>
  t(LocaleKeys.chrome.current, { label: dirLabel.value })
)

let unsubDesign: (() => void) | undefined
let unsubScheme: (() => void) | undefined
let unsubIcon: (() => void) | undefined
let unsubFont: (() => void) | undefined
let unsubLocale: (() => void) | undefined
let unsubDir: (() => void) | undefined

onMounted(() => {
  unsubDesign = ThemeService.subscribe((s) => {
    currentDesign.value = s
  })
  unsubScheme = ThemeService.subscribeScheme((s) => {
    currentScheme.value = s
  })
  unsubIcon = IconStyleService.subscribe((s) => {
    currentIconStyle.value = s
  })
  unsubFont = FontService.subscribe((f) => {
    currentFont.value = f
  })
  unsubLocale = LocaleService.subscribe((code) => {
    currentLocale.value = code
  })
  unsubDir = LocaleService.subscribeDir((d) => {
    currentDir.value = d
  })
})

onUnmounted(() => {
  unsubDesign?.()
  unsubScheme?.()
  unsubIcon?.()
  unsubFont?.()
  unsubLocale?.()
  unsubDir?.()
})

const handleSearch = () => {
  if (searchText.value.trim()) {
    ToastService.info({
      summary: t(LocaleKeys.common.search),
      detail: searchText.value
    })
  }
}

function stringValue(value: SelectModelValue): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function onLocaleChange(value: SelectModelValue) {
  const next = stringValue(value) as LocaleCode | undefined
  if (next) LocaleService.setLocale(next)
}

function onDesignChange(value: SelectModelValue) {
  const next = stringValue(value) as DesignStyleName | undefined
  if (next) ThemeService.setStyle(next)
}

function onIconChange(value: SelectModelValue) {
  const next = stringValue(value) as IconStyleName | undefined
  if (next) IconStyleService.setStyle(next)
}

function onFontChange(value: SelectModelValue) {
  const next = stringValue(value) as FontName | undefined
  if (next) FontService.setFont(next)
}
</script>

<template>
  <div class="header-actions">
    <Search
      v-model="searchText"
      class="header-actions__search"
      size="sm"
      :placeholder="t(LocaleKeys.common.search)"
      @search="handleSearch"
    />

    <span class="header-actions__divider" aria-hidden="true" />

    <div class="header-actions__group">
      <Select
        :model-value="currentLocale"
        :options="localeOptions"
        size="sm"
        class="header-actions__select header-actions__select--locale"
        :placeholder="t(LocaleKeys.chrome.locale)"
        @update:model-value="onLocaleChange"
      />

      <Select
        :model-value="currentDesign"
        :options="designOptions"
        size="sm"
        class="header-actions__select header-actions__select--design"
        :placeholder="t(LocaleKeys.chrome.design)"
        @update:model-value="onDesignChange"
      />

      <Button
        v-if="schemeSupported"
        class="header-actions__scheme"
        size="sm"
        variant="outlined"
        :aria-label="`${t(LocaleKeys.chrome.toggle)} · ${schemeToggleLabel}`"
        :title="schemeToggleLabel"
        @click="ThemeService.toggleScheme()"
      >
        {{ schemeLabel }}
      </Button>

      <Button
        class="header-actions__dir"
        size="sm"
        variant="outlined"
        :aria-label="`${t(LocaleKeys.chrome.direction)} · ${dirToggleLabel}`"
        :title="dirToggleLabel"
        @click="LocaleService.toggleDirection()"
      >
        {{ dirLabel }}
      </Button>
    </div>

    <span class="header-actions__divider" aria-hidden="true" />

    <div class="header-actions__group">
      <Select
        :model-value="currentIconStyle"
        :options="iconOptions"
        size="sm"
        class="header-actions__select header-actions__select--icon"
        :placeholder="t(LocaleKeys.chrome.icons)"
        @update:model-value="onIconChange"
      />

      <Select
        :model-value="currentFont"
        :options="fontOptions"
        size="sm"
        class="header-actions__select header-actions__select--font"
        :placeholder="t(LocaleKeys.chrome.font)"
        @update:model-value="onFontChange"
      />
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  max-width: 100%;
  min-width: 0;
  /* Narrow viewports may still pan horizontally; never show a native track
     (reads as a fake “progress bar” under the chrome). */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.header-actions::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.header-actions__group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 0 0 auto;
}

.header-actions__divider {
  flex: 0 0 1px;
  align-self: stretch;
  min-height: var(--height-sm);
  margin-block: var(--spacing-2xs, 2px);
  background: var(--border-color);
  opacity: 0.85;
}

.header-actions__search {
  flex: 0 0 auto;
  width: calc(var(--spacing-2xl) * 5.5);
  min-width: calc(var(--spacing-2xl) * 4);
}

.header-actions__select {
  flex: 0 0 auto;
}

.header-actions__select :deep(.vp-select) {
  width: 100%;
  min-width: 0;
  max-width: none;
}

.header-actions__select--locale {
  width: calc(var(--spacing-2xl) * 4.25);
}

.header-actions__select--design {
  width: calc(var(--spacing-2xl) * 5.5);
}

.header-actions__select--icon,
.header-actions__select--font {
  width: calc(var(--spacing-2xl) * 3.75);
}

.header-actions__scheme,
.header-actions__dir {
  flex: 0 0 auto;
  min-width: calc(var(--spacing-2xl) * 2.75);
}

/* Toolbar Search: match chrome density — no solid primary CTA block */
.header-actions__search :deep(.vp-search__btn) {
  background: var(--surface-3);
  color: var(--text-secondary);
}

.header-actions__search :deep(.vp-search__btn:hover:not(:disabled)) {
  background: var(--surface-2);
  color: var(--text-primary);
}

.header-actions__search :deep(.vp-search:focus-within .vp-search__btn) {
  color: var(--primary-500);
}

@media (max-width: 1200px) {
  .header-actions__search {
    display: none;
  }

  .header-actions__divider:first-of-type {
    display: none;
  }
}

@media (max-width: 900px) {
  .header-actions__select--icon,
  .header-actions__select--font {
    display: none;
  }

  .header-actions__divider:last-of-type {
    display: none;
  }
}
</style>
