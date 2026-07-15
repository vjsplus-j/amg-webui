<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifUrlFormProps, OnvifUrlFormEmits } from './types'
import './style.scss'
const BLOCKED = /^javascript:/i
const props = withDefaults(defineProps<OnvifUrlFormProps>(), { modelValue: 'rtsp://192.168.1.101/stream1', disabled: false })
const emit = defineEmits<OnvifUrlFormEmits>()
const { t } = useLocale()
const url = ref(props.modelValue ?? '')
const invalid = computed(() => BLOCKED.test(url.value.trim()))
watch(() => props.modelValue, v => { url.value = v ?? '' })
function onInput(e: Event) { const v = (e.target as HTMLInputElement).value; url.value = v; emit('update:modelValue', v) }
function test() { if (invalid.value) { emit('invalid'); return } emit('test', url.value.trim()) }
</script>
<template>
  <form :class="['vp-onvif-url-form', 'vp-onvif-url-form__panel', props.class]" :style="style" data-component="OnvifUrlForm" @submit.prevent="test">
    <h3 class="vp-onvif-url-form__title">{{ t('industry.onvif.url') }}</h3>
    <input class="vp-onvif-url-form__input" type="url" :value="url" :disabled="disabled" @input="onInput" />
    <p v-if="invalid" class="vp-onvif-url-form__error">{{ t('industry.onvif.invalidProtocol') }}</p>
    <button type="submit" class="vp-onvif-url-form__btn" :disabled="disabled || invalid">{{ t('industry.onvif.testConnection') }}</button>
  </form>
</template>