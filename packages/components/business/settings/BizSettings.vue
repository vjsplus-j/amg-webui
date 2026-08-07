<script setup lang="ts">
import { computed, ref, toRef, watch, useAttrs } from 'vue'
import { Button, Card, Empty } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import { ThemeService, designStyles } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys, LOCALE_CODES, LOCALE_META, type LocaleCode } from '@amg-webui/locale'
import type { BizSettingsProps, BizSettingsEmits, BizSettingsSection } from './types'
import { useSettingsTabs } from './composables/useSettingsTabs'
import { useBizSettings } from './composables/useBizSettings'
import { DEFAULT_BIZ_ACCESS } from '../_shared'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizSettingsProps>(), {
  title: undefined,
  profile: undefined,
  params: () => ({}),
  notifyMail: true,
  notifyPush: false,
  loading: false,
  error: null
})

const emit = defineEmits<BizSettingsEmits>()
const attrs = useAttrs()
const { t, locale, setLocale } = useLocale()
const { section, setSection } = useSettingsTabs(toRef(props, 'section'))
const usingAdapter = computed(() => Boolean(props.adapter))
const settingsApi = useBizSettings({
  adapter: () => props.adapter,
  immediate: Boolean(props.adapter)
})

const access = computed(() => ({
  ...DEFAULT_BIZ_ACCESS,
  changePassword: true,
  ...props.access
}))

const displayName = ref(props.profile?.displayName ?? '')
const email = ref(props.profile?.email ?? '')
const notifyMail = ref(props.notifyMail)
const notifyPush = ref(props.notifyPush)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const securityError = ref('')
const paramDraft = ref(
  Object.entries(props.params ?? {}).map(([key, value]) => ({ key, value: String(value) }))
)
const newParamKey = ref('')
const newParamValue = ref('')

function applySnapshot(snapshot: {
  profile?: { displayName?: string; email?: string }
  params?: Record<string, string | number | boolean>
  notifyMail?: boolean
  notifyPush?: boolean
}) {
  if (snapshot.profile?.displayName != null) displayName.value = snapshot.profile.displayName
  if (snapshot.profile?.email != null) email.value = snapshot.profile.email
  if (snapshot.notifyMail != null) notifyMail.value = snapshot.notifyMail
  if (snapshot.notifyPush != null) notifyPush.value = snapshot.notifyPush
  if (snapshot.params) {
    paramDraft.value = Object.entries(snapshot.params).map(([key, value]) => ({
      key,
      value: String(value)
    }))
  }
}

watch(
  () => props.profile,
  (p) => {
    if (!p || usingAdapter.value) return
    applySnapshot({ profile: p })
  },
  { deep: true }
)

watch(
  () => props.params,
  (p) => {
    if (usingAdapter.value) return
    paramDraft.value = Object.entries(p ?? {}).map(([key, value]) => ({ key, value: String(value) }))
  },
  { deep: true }
)

watch(
  () => settingsApi.snapshot.value,
  (snap) => {
    if (!snap) return
    applySnapshot(snap)
  },
  { deep: true }
)

const panelLoading = computed(() =>
  usingAdapter.value ? settingsApi.loading.value : props.loading
)
const panelError = computed(() =>
  usingAdapter.value ? settingsApi.error.value : props.error
)
const savePending = computed(() => settingsApi.saving.value)
const saveError = computed(() => settingsApi.saveError.value)

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.settingsTitle))

const tabs = computed(() => {
  void locale.value
  return [
    { id: 'general' as const, label: t('biz.settings.general') },
    { id: 'theme' as const, label: t('biz.settings.theme') },
    { id: 'locale' as const, label: t('biz.settings.locale') },
    { id: 'security' as const, label: t('biz.settings.security') },
    { id: 'params' as const, label: t('biz.settings.params') },
    { id: 'notify' as const, label: t('biz.settings.notify') }
  ]
})

const themeOptions = computed(() => designStyles.map((s) => ({ value: s.name, label: s.label })))
const currentTheme = ref(ThemeService.getCurrentStyle())
const localeOptions = computed(() =>
  LOCALE_CODES.map((code) => ({
    value: code,
    label: LOCALE_META[code]?.label ?? code
  }))
)

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

function onLocaleChange(code: unknown) {
  const next = String(code) as LocaleCode
  setLocale(next)
  emit('locale-change', next)
}

function submitPassword() {
  securityError.value = ''
  if (!access.value.changePassword) return
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    securityError.value = t('biz.settings.passwordRequired')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    securityError.value = t('biz.settings.passwordMismatch')
    return
  }
  const payload = { oldPassword: oldPassword.value, newPassword: newPassword.value }
  if (usingAdapter.value && props.adapter?.changePassword) {
    void settingsApi.changePassword(payload).then(() => {
      if (settingsApi.saveError.value) {
        securityError.value = settingsApi.saveError.value
        return
      }
      emit('change-password', payload)
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    })
    return
  }
  emit('change-password', payload)
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function addParam() {
  if (!newParamKey.value.trim()) return
  paramDraft.value = [
    ...paramDraft.value,
    { key: newParamKey.value.trim(), value: newParamValue.value }
  ]
  newParamKey.value = ''
  newParamValue.value = ''
  syncParams()
}

function syncParams() {
  const next: Record<string, string> = {}
  for (const row of paramDraft.value) {
    if (row.key) next[row.key] = row.value
  }
  emit('update:params', next)
}

function save() {
  if (!access.value.update) return
  const params: Record<string, string> = {}
  for (const row of paramDraft.value) {
    if (row.key) params[row.key] = row.value
  }
  const payload = {
    displayName: displayName.value,
    email: email.value,
    notifyMail: notifyMail.value,
    notifyPush: notifyPush.value,
    theme: currentTheme.value,
    locale: locale.value,
    params
  }
  if (usingAdapter.value) {
    void settingsApi
      .save({
        profile: { displayName: displayName.value, email: email.value },
        params,
        notifyMail: notifyMail.value,
        notifyPush: notifyPush.value
      })
      .then((saved) => {
        if (settingsApi.saveError.value || !saved) return
        emit('save', payload)
      })
    return
  }
  emit('save', payload)
}
</script>

<template>
  <div class="biz-settings" v-bind="attrs">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
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

    <Message v-if="panelError" severity="danger" :closable="false">
      <slot name="error" :error="panelError">{{ panelError }}</slot>
    </Message>
    <Message v-if="saveError" severity="danger" :closable="false">
      <slot name="mutation-error" :error="saveError">{{ saveError }}</slot>
    </Message>

    <slot v-if="panelLoading" name="loading">
      <Empty :description="t(LocaleKeys.common.loading)" />
    </slot>

    <template v-else>
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
      <Select :model-value="currentTheme" :options="themeOptions" @update:model-value="onThemeChange" />
    </Card>

    <Card v-else-if="section === 'locale'" class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.locale') }}</h3>
      <p class="theme-kit-body-lg">{{ t('biz.settings.localeDesc') }}</p>
      <Select :model-value="locale" :options="localeOptions" @update:model-value="onLocaleChange" />
    </Card>

    <Card v-else-if="section === 'security'" class="biz-settings__panel">
      <slot name="section-security">
        <h3 class="theme-kit-heading">{{ t('biz.settings.security') }}</h3>
        <p class="theme-kit-body-lg">{{ t('biz.settings.securityDesc') }}</p>
        <Message v-if="securityError" severity="danger" :closable="false">{{ securityError }}</Message>
        <div class="biz-settings__form">
          <label>
            <span>{{ t('biz.settings.oldPassword') }}</span>
            <InputText v-model="oldPassword" type="password" fluid />
          </label>
          <label>
            <span>{{ t('biz.settings.newPassword') }}</span>
            <InputText v-model="newPassword" type="password" fluid />
          </label>
          <label>
            <span>{{ t('biz.settings.confirmPassword') }}</span>
            <InputText v-model="confirmPassword" type="password" fluid />
          </label>
          <Button severity="primary" variant="outlined" @click="submitPassword">
            {{ t('biz.settings.changePassword') }}
          </Button>
        </div>
      </slot>
    </Card>

    <Card v-else-if="section === 'params'" class="biz-settings__panel">
      <h3 class="theme-kit-heading">{{ t('biz.settings.params') }}</h3>
      <p class="theme-kit-body-lg">{{ t('biz.settings.paramsDesc') }}</p>
      <div class="biz-settings__params">
        <div v-for="(row, idx) in paramDraft" :key="idx" class="biz-settings__param-row">
          <InputText v-model="row.key" :placeholder="t('biz.settings.paramKey')" @change="syncParams" />
          <InputText v-model="row.value" :placeholder="t('biz.settings.paramValue')" @change="syncParams" />
        </div>
        <div class="biz-settings__param-row">
          <InputText v-model="newParamKey" :placeholder="t('biz.settings.paramKey')" />
          <InputText v-model="newParamValue" :placeholder="t('biz.settings.paramValue')" />
          <Button size="sm" variant="outlined" @click="addParam">{{ t('biz.settings.addParam') }}</Button>
        </div>
      </div>
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
      <Button
        v-if="access.update"
        severity="primary"
        variant="solid"
        :loading="savePending"
        @click="save"
      >
        {{ t('biz.settings.save') }}
      </Button>
    </div>
    </template>
  </div>
</template>
