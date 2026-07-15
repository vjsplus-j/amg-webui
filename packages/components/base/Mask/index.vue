<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { MaskProps, MaskEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<MaskProps>(), {
  visible: false,
  dismissible: true,
  zIndex: 900
})
const emit = defineEmits<MaskEmits>()

const overlayStyle = computed(() => ({
  ...props.style,
  zIndex: String(props.zIndex)
}))

function close(_e?: Event) {
  emit('update:visible', false)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-mask-fade">
      <div
        v-if="visible"
        :class="['vp-mask', props.class]"
        :style="overlayStyle"
        @click="onOverlay"
      >
        <div class="vp-mask__content" @click.stop>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
