<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifSettingPanelProps, OnvifSettingPanelEmits, OnvifSettings } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifSettingPanelProps>(), {
  modelValue: () => ({ username: 'admin', password: '', port: 80 }),
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifSettingPanelEmits>()
const { t } = useLocale()
const form = ref<OnvifSettings>({ ...props.modelValue! })

watch(() => props.modelValue, (v) => { if (v) form.value = { ...v } }, { deep: true })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.settings))

function patch(field: keyof OnvifSettings, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value = { ...form.value, [field]: field === 'port' ? Number(raw) : raw }
  emit('update:modelValue', { ...form.value })
}

function submit() {
  if (props.disabled || props.loading) return
  emit('submit', { ...form.value })
  trackEmit({ component: 'OnvifSettingPanel', type: 'submit', trackId: props.trackId, telemetry: props.telemetry })
}

function resetForm() {
  if (props.disabled || props.loading) return
  form.value = { ...(props.modelValue ?? { username: 'admin', password: '', port: 80 }) }
  trackEmit({ component: 'OnvifSettingPanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-setting-panel', 'vp-onvif-setting-panel__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-setting-panel-title"
    data-component="OnvifSettingPanel"
  >
    <header class="vp-onvif-setting-panel__header">
      <h3 id="vp-onvif-setting-panel-title" class="vp-onvif-setting-panel__title">{{ titleText }}</h3>
      <div class="vp-onvif-setting-panel__status" role="status" aria-live="polite">{{ form.port }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-setting-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-onvif-setting-panel__body" @submit.prevent="submit">
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.username) }}</span>
        <input class="vp-onvif-setting-panel__input" :value="form.username" :disabled="disabled" @input="patch('username', $event)" />
      </label>
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.password) }}</span>
        <input type="password" class="vp-onvif-setting-panel__input" :value="form.password" :disabled="disabled" @input="patch('password', $event)" />
      </label>
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.port) }}</span>
        <input type="number" class="vp-onvif-setting-panel__input" :value="form.port" :disabled="disabled" @input="patch('port', $event)" />
      </label>
      <div class="vp-onvif-setting-panel__toolbar">
        <button type="submit" class="vp-onvif-setting-panel__btn" :disabled="disabled">{{ t(LocaleKeys.button.submit) }}</button>
        <button type="button" class="vp-onvif-setting-panel__btn vp-onvif-setting-panel__btn--ghost" :disabled="disabled" @click="resetForm">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
