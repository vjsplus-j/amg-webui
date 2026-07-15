<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CanvasMaterialItem } from '@amg-webui/utils'
import type { DragMaterialProps, DragMaterialEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragMaterialProps>(), {
  materials: () => [
    { type: 'button', label: 'Button', group: 'base' },
    { type: 'input', label: 'Input', group: 'base' },
    { type: 'card', label: 'Card', group: 'layout' }
  ],
  filter: ''
})

const emit = defineEmits<DragMaterialEmits>()
const { t } = useLocale()
const query = ref(props.filter)

const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.materials
  return props.materials.filter((m) => m.label.toLowerCase().includes(q) || m.type.toLowerCase().includes(q))
})

function onDragStart(e: DragEvent, item: CanvasMaterialItem) {
  e.dataTransfer?.setData('application/vp-material-type', item.type)
  e.dataTransfer?.setData('application/vp-material-label', item.label)
  e.dataTransfer!.effectAllowed = 'copy'
  emit('drag-start', item)
}
</script>

<template>
  <aside :class="['vp-drag-material', props.class]" :style="style" data-component="DragMaterial">
    <input v-model="query" class="vp-drag-material__search" type="search" :placeholder="t('common.search')" />
    <ul class="vp-drag-material__list">
      <li
        v-for="item in list"
        :key="item.type + item.label"
        class="vp-drag-material__item"
        draggable="true"
        @dragstart="onDragStart($event, item)"
      >
        <span class="vp-drag-material__label">{{ item.label }}</span>
        <span class="vp-drag-material__type">{{ item.type }}</span>
      </li>
    </ul>
    <slot />
  </aside>
</template>
