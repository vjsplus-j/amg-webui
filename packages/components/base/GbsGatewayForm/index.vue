<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsGatewayFormProps, GbsGatewayFormEmits, GbsGateway } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsGatewayFormProps>(), {
  modelValue: () => ({ gatewayId: '34020000001320000001', sipDomain: '3402000000', sipPort: 5060, password: '', realm: '3402000000' }),
  disabled: false
})
const emit = defineEmits<GbsGatewayFormEmits>()
const { t } = useLocale()
const form = ref<GbsGateway>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof GbsGateway>(k: K, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'sipPort' ? Number(raw) : raw) as GbsGateway[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('submit', { ...form.value }) }
</script>
<template>
  <form :class="['vp-gbs-gateway-form', 'vp-gbs-gateway-form__panel', props.class]" :style="style" data-component="GbsGatewayForm" @submit.prevent="submit">
    <h3 class="vp-gbs-gateway-form__title">{{ t('industry.gbs.gatewayId') }}</h3>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.gatewayId') }}</span><input class="vp-gbs-gateway-form__input" :value="form.gatewayId" :disabled="disabled" @input="patch('gatewayId', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipDomain') }}</span><input class="vp-gbs-gateway-form__input" :value="form.sipDomain" :disabled="disabled" @input="patch('sipDomain', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipPort') }}</span><input class="vp-gbs-gateway-form__input" type="number" :value="form.sipPort" :disabled="disabled" @input="patch('sipPort', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.realm') }}</span><input class="vp-gbs-gateway-form__input" :value="form.realm" :disabled="disabled" @input="patch('realm', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.password') }}</span><input class="vp-gbs-gateway-form__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <button type="submit" class="vp-gbs-gateway-form__btn" :disabled="disabled">{{ t('button.save') }}</button>
  </form>
</template>