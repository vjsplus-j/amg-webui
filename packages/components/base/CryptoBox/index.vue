<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CryptoBoxProps, CryptoBoxEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CryptoBoxProps>(), {
  modelValue: '',
  passphrase: '',
  masked: true,
  disabled: false
})

const emit = defineEmits<CryptoBoxEmits>()
const { t } = useLocale()
const reveal = ref(false)
const cipher = ref('')
const busy = ref(false)
const localPass = ref(props.passphrase)

const display = computed(() => {
  if (!props.modelValue) return ''
  if (!props.masked || reveal.value) return props.modelValue
  return '\u2022'.repeat(Math.min(props.modelValue.length, 12))
})

async function deriveKey(pass: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const material = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('vp-crypto'), iterations: 100000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encrypt() {
  if (!props.modelValue || !localPass.value || busy.value) return
  busy.value = true
  try {
    const key = await deriveKey(localPass.value)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const data = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(props.modelValue)
    )
    const out = btoa(String.fromCharCode(...iv, ...new Uint8Array(data)))
    cipher.value = out
    emit('encrypted', out)
  } finally {
    busy.value = false
  }
}

async function decrypt() {
  if (!cipher.value || !localPass.value || busy.value) return
  busy.value = true
  try {
    const raw = Uint8Array.from(atob(cipher.value), (c) => c.charCodeAt(0))
    const iv = raw.slice(0, 12)
    const data = raw.slice(12)
    const key = await deriveKey(localPass.value)
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    const text = new TextDecoder().decode(plain)
    emit('update:modelValue', text)
    emit('decrypted', text)
  } finally {
    busy.value = false
  }
}

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div
    :class="['vp-crypto-box', { 'vp-crypto-box--disabled': disabled }, props.class]"
    :style="style"
    data-component="CryptoBox"
  >
    <input
      v-if="!masked || reveal"
      class="vp-crypto-box__input"
      type="text"
      :value="modelValue"
      :disabled="disabled"
      :aria-label="t('component.crypto-box.title')"
      @input="onInput"
    />
    <output v-else class="vp-crypto-box__masked">{{ display }}</output>
    <input
      class="vp-crypto-box__input"
      type="password"
      :value="localPass"
      :disabled="disabled"
      :placeholder="t('auth.password')"
      @input="localPass = ($event.target as HTMLInputElement).value"
    />
    <div class="vp-crypto-box__toolbar">
      <button v-if="masked" type="button" class="vp-crypto-box__btn vp-crypto-box__btn--ghost" :disabled="disabled" @click="reveal = !reveal">
        {{ reveal ? t('component.crypto-box.mask') : t('component.crypto-box.reveal') }}
      </button>
      <button type="button" class="vp-crypto-box__btn" :disabled="disabled || busy" @click="encrypt">
        {{ t('component.crypto-box.encrypt') }}
      </button>
      <button type="button" class="vp-crypto-box__btn vp-crypto-box__btn--ghost" :disabled="disabled || busy || !cipher" @click="decrypt">
        {{ t('component.crypto-box.decrypt') }}
      </button>
    </div>
    <p v-if="cipher" class="vp-crypto-box__cipher">{{ cipher }}</p>
  </div>
</template>
