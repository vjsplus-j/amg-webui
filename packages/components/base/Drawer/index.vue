<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { DrawerProps, DrawerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DrawerProps>(), {
  visible: false,
  placement: 'right',
  width: '320px',
  closable: true,
  dismissible: true
})

const emit = defineEmits<DrawerEmits>()

const { t } = useLocale()
const closeLabel = computed(() => t(LocaleKeys.common.close))

const drawerStyle = computed(() => ({
  width: props.width,
  ...props.style
}))

const transitionName = computed(() =>
  props.placement === 'left' ? 'vp-drawer-slide-left' : 'vp-drawer-slide-right'
)

const closeDrawer = (event?: Event) => {
  emit('update:visible', false)
  emit('close', event)
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.dismissible && event.target === event.currentTarget) {
    closeDrawer(event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && props.dismissible && event.key === 'Escape') {
    closeDrawer(event)
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) emit('show', new Event('show'))
    else emit('hide', new Event('hide'))
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div v-if="visible" class="vp-drawer-overlay" @click="handleOverlayClick">
        <aside
          :class="['vp-drawer', `vp-drawer--${placement}`, props.class]"
          :style="drawerStyle"
          @click.stop
        >
          <header v-if="title || $slots.header || closable" class="vp-drawer__header">
            <template v-if="$slots.header">
              <slot name="header" />
            </template>
            <span v-else-if="title" class="vp-drawer__title">{{ title }}</span>
            <button
              v-if="closable"
              type="button"
              class="vp-drawer__close"
              :aria-label="closeLabel"
              @click="closeDrawer"
            >
              ×
            </button>
          </header>
          <div class="vp-drawer__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="vp-drawer__footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
