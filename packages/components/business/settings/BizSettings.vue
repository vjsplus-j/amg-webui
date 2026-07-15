<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { Button, InputText, Card, Select } from '@amg-webui/components/base'
import { ThemeService, designStyles } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizSettingsProps, BizSettingsEmits, BizSettingsSection } from './types'
import { useSettingsTabs } from './composables/useSettingsTabs'
import './style.scss'

const props = withDefaults(defineProps<BizSettingsProps>(), {
  title: undefined
})

const emit = defineEmits<BizSettingsEmits>()
const { t, locale } = useLocale()
const { section, setSection } = useSettingsTabs(toRef(props, 'section'))

const displayName = ref('AMG Operator')
const email = ref('ops@example.com')
const notifyMail = ref(true)
const notifyPush = ref(false)

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.settingsTitle))

const tabs = computed(() => {
  void locale.value
  return [
    { id: 'general' as const, label: t('biz.settings.general') },
    { id: 'theme' as const, label: t('biz.settings.theme') },
    { id: 'security' as const, label: t('biz.settings.security') },
    { id: 'notify' as const, label: t('biz.settings.notify') }
  ]
})

const themeOptions = computed(() =>
  designStyles.map((s) => ({ value: s.name, label: s.label }))
)
const currentTheme = ref(ThemeService.getCurrentStyle())

function selectTab(id: BizSettingsSection) {
  setSection(id)
  emit('update:section', id)
}

function onThemeChange(name: unknown) {
  const style = String(name)
  ThemeService.setStyle(style as Parameters<typeof ThemeService.setStyle>[0])
  currentTheme.value = ThemeService.getCurrentStyle()
  emit('theme-change', style)
}

function save() {
  emit('save', {
    displayName: displayName.value,
    email: email.value,
    notifyMail: notifyMail.value,
    notifyPush: notifyPush.value,
    theme: currentTheme.value
  })
}
</script>

<template>
  <div class="biz-settings">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">Business · Settings</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <div class="theme-kit-tabs biz-settings__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="theme-kit-tab"
        :class="{ 'is-active': section === tab.id }"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <Card v-if="section === 'general'" class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.profile') }}</h3>
      <div class="biz-settings__form">
        <label>
          <span>{{ t('biz.settings.displayName') }}</span>
          <InputText v-model="displayName" fluid />
        </label>
        <label>
          <span>{{ t(LocaleKeys.auth.email) }}</span>
          <InputText v-model="email" type="email" fluid />
        </label>
      </div>
    </Card>

    <Card v-else-if="section === 'theme'" class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.themeHeading') }}</h3>
      <p class="theme-kit-body-lg">{{ t('biz.settings.themeDesc') }}</p>
      <Select
        :model-value="currentTheme"
        :options="themeOptions"
        @update:model-value="onThemeChange"
      />
    </Card>

    <Card v-else-if="section === 'security'" class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.security') }}</h3>
      <p class="theme-kit-body-lg">{{ t('biz.settings.securityDesc') }}</p>
      <Button severity="primary" variant="outlined">{{ t('biz.settings.changePassword') }}</Button>
    </Card>

    <Card v-else class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.notify') }}</h3>
      <label class="biz-settings__check">
        <input v-model="notifyMail" type="checkbox" /> {{ t('biz.settings.mailNotify') }}
      </label>
      <label class="biz-settings__check">
        <input v-model="notifyPush" type="checkbox" /> {{ t('biz.settings.pushNotify') }}
      </label>
    </Card>

    <div class="biz-settings__actions">
      <Button severity="primary" variant="solid" @click="save">{{ t('biz.settings.save') }}</Button>
    </div>
  </div>
</template>
