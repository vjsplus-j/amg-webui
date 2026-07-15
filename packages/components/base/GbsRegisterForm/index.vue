<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsRegisterFormProps, GbsRegisterFormEmits, GbsRegister } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsRegisterFormProps>(), {
  modelValue: () => ({ deviceId: '34020000001320000001', sipDomain: '3402000000', expires: 3600, password: '' }),
  disabled: false
})
const emit = defineEmits<GbsRegisterFormEmits>()
const { t } = useLocale()
const form = ref<GbsRegister>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof GbsRegister>(k: K, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'expires' ? Number(raw) : raw) as GbsRegister[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('register', { ...form.value }) }
</script>
<template>
  <form :class="['vp-gbs-register-form', 'vp-gbs-register-form__panel', props.class]" :style="style" data-component="GbsRegisterForm" @submit.prevent="submit">
    <h3 class="vp-gbs-register-form__title">{{ t('industry.gbs.register') }}</h3>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.deviceId') }}</span><input class="vp-gbs-register-form__input" :value="form.deviceId" :disabled="disabled" @input="patch('deviceId', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.sipDomain') }}</span><input class="vp-gbs-register-form__input" :value="form.sipDomain" :disabled="disabled" @input="patch('sipDomain', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.expires') }}</span><input class="vp-gbs-register-form__input" type="number" :value="form.expires" :disabled="disabled" @input="patch('expires', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.password') }}</span><input class="vp-gbs-register-form__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <button type="submit" class="vp-gbs-register-form__btn" :disabled="disabled">{{ t('industry.gbs.register') }}</button>
  </form>
</template>