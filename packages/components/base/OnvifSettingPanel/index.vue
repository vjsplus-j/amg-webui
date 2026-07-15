<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifSettingPanelProps, OnvifSettingPanelEmits, OnvifSettings } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifSettingPanelProps>(), {
  modelValue: () => ({ username: 'admin', password: '', port: 80 }), disabled: false
})
const emit = defineEmits<OnvifSettingPanelEmits>()
const { t } = useLocale()
const form = ref<OnvifSettings>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof OnvifSettings>(k: K, e: Event) {
  form.value[k] = (k === 'port' ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value) as OnvifSettings[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('submit', { ...form.value }) }
</script>
<template>
  <form :class="['vp-onvif-setting-panel', 'vp-onvif-setting-panel__panel', props.class]" :style="style" data-component="OnvifSettingPanel" @submit.prevent="submit">
    <h3 class="vp-onvif-setting-panel__title">{{ t('industry.onvif.settings') }}</h3>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.username') }}</span><input class="vp-onvif-setting-panel__input" type="text" :value="form.username" :disabled="disabled" @input="patch('username', $event)" /></label>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.password') }}</span><input class="vp-onvif-setting-panel__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.port') }}</span><input class="vp-onvif-setting-panel__input" type="number" :value="form.port" :disabled="disabled" @input="patch('port', $event)" /></label>
    <button type="submit" class="vp-onvif-setting-panel__btn" :disabled="disabled">{{ t('button.save') }}</button>
  </form>
</template>