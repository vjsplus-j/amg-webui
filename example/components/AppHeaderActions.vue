<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Button, Search, Select } from '@amg-webui/components/base'
import type { SelectModelValue } from '@amg-webui/components/base/Select/types'
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
const currentLocale = ref<LocaleCode>(LocaleService.getLocale())

const localeOptions = computed(() =>
  LOCALE_CODES.map((code) => ({ label: LOCALE_META[code].label, value: code }))
)
const designOptions = computed(() =>
  designStyles.map((item) => ({ label: item.label, value: item.name }))
)
const iconOptions = computed(() =>
  iconStyles.map((item) => ({ label: item.label, value: item.name }))
)
const fontOptions = computed(() =>
  fonts.map((item) => ({ label: item.label, value: item.name }))
)

let unsubDesign: (() => void) | undefined
let unsubScheme: (() => void) | undefined
let unsubIcon: (() => void) | undefined
let unsubFont: (() => void) | undefined
let unsubLocale: (() => void) | undefined

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
})

onUnmounted(() => {
  unsubDesign?.()
  unsubScheme?.()
  unsubIcon?.()
  unsubFont?.()
  unsubLocale?.()
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

    <Select
      :model-value="currentLocale"
      :options="localeOptions"
      size="sm"
      class="header-actions__select"
      :placeholder="t(LocaleKeys.chrome.locale)"
      @update:model-value="onLocaleChange"
    />

    <Select
      :model-value="currentDesign"
      :options="designOptions"
      size="sm"
      class="header-actions__select"
      :placeholder="t(LocaleKeys.chrome.design)"
      @update:model-value="onDesignChange"
    />

    <Button
      v-if="currentDesign === 'linear'"
      size="sm"
      variant="outlined"
      @click="ThemeService.toggleScheme()"
    >
      {{
        currentScheme === 'dark'
          ? t(LocaleKeys.chrome.schemeLight)
          : t(LocaleKeys.chrome.schemeDark)
      }}
    </Button>

    <Select
      :model-value="currentIconStyle"
      :options="iconOptions"
      size="sm"
      class="header-actions__select"
      :placeholder="t(LocaleKeys.chrome.icons)"
      @update:model-value="onIconChange"
    />

    <Select
      :model-value="currentFont"
      :options="fontOptions"
      size="sm"
      class="header-actions__select"
      :placeholder="t(LocaleKeys.chrome.font)"
      @update:model-value="onFontChange"
    />
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-actions__search,
.header-actions__select {
  flex: 0 1 calc(var(--spacing-2xl) * 4);
  min-width: calc(var(--spacing-2xl) * 3);
}

@media (max-width: 1100px) {
  .header-actions__search {
    display: none;
  }
}
</style>
