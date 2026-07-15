<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { FormGroupProps, FormGroupEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FormGroupProps>(), {
  collapsible: true,
  collapsed: false
})

const emit = defineEmits<FormGroupEmits>()
const { t } = useLocale()

const isCollapsed = ref(props.collapsed)

watch(
  () => props.collapsed,
  (val) => {
    isCollapsed.value = val
  }
)

const titleText = computed(() => props.title ?? t('component.form-group.title'))

const toggle = () => {
  if (!props.collapsible || props.disabled) return
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
  emit('toggle', isCollapsed.value)
}
</script>

<template>
  <section :class="['vp-form-group', props.class, { 'vp-form-group--collapsed': isCollapsed, 'vp-form-group--disabled': disabled }]" :style="style" data-component="FormGroup">
    <header class="vp-form-group__header">
      <button
        v-if="collapsible"
        type="button"
        class="vp-form-group__toggle"
        :disabled="disabled"
        :aria-expanded="!isCollapsed"
        @click="toggle"
      >
        <span class="vp-form-group__chevron" aria-hidden="true">{{ isCollapsed ? '+' : '-' }}</span>
        <h3 class="vp-form-group__title">{{ titleText }}</h3>
      </button>
      <h3 v-else class="vp-form-group__title">{{ titleText }}</h3>
      <slot name="extra" />
    </header>
    <div v-show="!isCollapsed" class="vp-form-group__body">
      <slot />
    </div>
  </section>
</template>
