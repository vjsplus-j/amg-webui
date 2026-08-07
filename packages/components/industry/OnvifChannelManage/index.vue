<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifChannelManageProps, OnvifChannelManageEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifChannelManageProps>(), {
  channels: () => [{ id: 'ch1', name: 'Channel-01' }, { id: 'ch2', name: 'Channel-02' }],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifChannelManageEmits>()
const { t } = useLocale()
const draft = ref('')

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.channel))
const isEmpty = computed(() => !props.channels?.length)

function addChannel() {
  if (props.disabled || props.loading || !draft.value.trim()) return
  emit('add', draft.value.trim())
  draft.value = ''
  trackEmit({ component: 'OnvifChannelManage', type: 'add', trackId: props.trackId, telemetry: props.telemetry })
}

function removeChannel(id: string) {
  if (props.disabled || props.loading) return
  emit('remove', id)
  trackEmit({ component: 'OnvifChannelManage', type: 'remove', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-channel-manage', 'vp-onvif-channel-manage__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-channel-manage-title"
    data-component="OnvifChannelManage"
  >
    <header class="vp-onvif-channel-manage__header">
      <h3 id="vp-onvif-channel-manage-title" class="vp-onvif-channel-manage__title">{{ titleText }}</h3>
      <div class="vp-onvif-channel-manage__status" role="status" aria-live="polite">{{ channels?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-channel-manage__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-channel-manage__body">
      <label class="vp-onvif-channel-manage__field">
        <span class="vp-onvif-channel-manage__label">{{ t(LocaleKeys.industry.onvif.channelName) }}</span>
        <input v-model="draft" class="vp-onvif-channel-manage__input" :disabled="disabled" />
      </label>
      <div class="vp-onvif-channel-manage__toolbar">
        <button type="button" class="vp-onvif-channel-manage__btn" :disabled="disabled || !draft.trim()" @click="addChannel">
          {{ t(LocaleKeys.industry.onvif.addChannel) }}
        </button>
        <button type="button" class="vp-onvif-channel-manage__btn vp-onvif-channel-manage__btn--ghost" :disabled="disabled" @click="draft = ''">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-onvif-channel-manage__empty" role="status">{{ t(LocaleKeys.industry.common.noChannels) }}</p>
      <ul v-else class="vp-onvif-channel-manage__list" role="list">
        <li v-for="ch in channels" :key="ch.id" class="vp-onvif-channel-manage__item">
          <span>{{ ch.name }}</span>
          <button type="button" class="vp-onvif-channel-manage__btn vp-onvif-channel-manage__btn--danger" :disabled="disabled" @click="removeChannel(ch.id)">
            {{ t(LocaleKeys.industry.onvif.removeChannel) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
