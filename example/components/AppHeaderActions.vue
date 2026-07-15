<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Button, InputText, Icon } from '@amg-webui/components/base'
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

function onLocaleChange(event: Event) {
  const code = (event.target as HTMLSelectElement).value as LocaleCode
  LocaleService.setLocale(code)
}
</script>

<template>
  <div class="header-actions">
    <div class="search">
      <Icon name="Search" size="sm" class="search__icon" />
      <InputText
        v-model="searchText"
        :placeholder="`${t(LocaleKeys.common.search)}…`"
        class="p-inputtext-sm search__input"
        @keyup.enter="handleSearch"
      />
    </div>

    <select
      class="chrome-select chrome-select--locale"
      :value="currentLocale"
      :title="t(LocaleKeys.chrome.locale)"
      @change="onLocaleChange"
    >
      <option v-for="code in LOCALE_CODES" :key="code" :value="code">
        {{ LOCALE_META[code].label }}
      </option>
    </select>

    <select
      class="chrome-select"
      :value="currentDesign"
      :title="t(LocaleKeys.chrome.design)"
      @change="ThemeService.setStyle(($event.target as HTMLSelectElement).value as DesignStyleName)"
    >
      <option v-for="s in designStyles" :key="s.name" :value="s.name">{{ s.label }}</option>
    </select>

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

    <select
      class="chrome-select"
      :value="currentIconStyle"
      :title="t(LocaleKeys.chrome.icons)"
      @change="IconStyleService.setStyle(($event.target as HTMLSelectElement).value as IconStyleName)"
    >
      <option v-for="s in iconStyles" :key="s.name" :value="s.name">{{ s.label }}</option>
    </select>

    <select
      class="chrome-select"
      :value="currentFont"
      :title="t(LocaleKeys.chrome.font)"
      @change="FontService.setFont(($event.target as HTMLSelectElement).value as FontName)"
    >
      <option v-for="f in fonts" :key="f.name" :value="f.name">{{ f.label }}</option>
    </select>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  width: 11.25rem;
}

.search__icon {
  position: absolute;
  left: var(--spacing-sm);
  color: var(--text-muted);
  pointer-events: none;
  z-index: 1;
}

.search :deep(.search__input),
.search :deep(.p-inputtext) {
  width: 100%;
  padding-left: var(--spacing-xl);
  height: var(--height-sm, 1.75rem);
  font-size: var(--font-size-sm);
}

.chrome-select {
  height: var(--height-sm, 1.75rem);
  max-width: 7.5rem;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--border-radius-md);
  background: var(--surface-2);
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-xs);
  outline: none;
}

.chrome-select--locale {
  max-width: 8.5rem;
}

.chrome-select:focus {
  border-color: var(--ds-accent);
  box-shadow: 0 0 0 3px var(--ds-focus-ring);
}

@media (max-width: 1100px) {
  .search {
    display: none;
  }
}
</style>
