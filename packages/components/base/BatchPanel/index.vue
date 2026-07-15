<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '../Button/index.vue'
import Tag from '../Tag/index.vue'
import type { BatchPanelProps, BatchPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BatchPanelProps>(), {
  selectedCount: 0,
  totalCount: 0
})

const emit = defineEmits<BatchPanelEmits>()
const { t } = useLocale()

const hasSelection = computed(() => props.selectedCount > 0)

const countLabel = computed(() =>
  t(LocaleKeys.common.all) + `: ${props.selectedCount}/${props.totalCount}`
)
</script>

<template>
  <div
    v-show="hasSelection"
    :class="['vp-batch-panel', props.class, { 'vp-batch-panel--disabled': disabled }]"
    :style="style"
    data-component="BatchPanel"
  >
    <Tag :label="countLabel" severity="primary" />
    <div class="vp-batch-panel__actions">
      <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.edit)" :disabled="disabled" @click="emit('action', 'edit')" />
      <Button variant="outlined" size="sm" severity="danger" :label="t(LocaleKeys.button.delete)" :disabled="disabled" @click="emit('action', 'delete')" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.common.copy)" :disabled="disabled" @click="emit('action', 'export')" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.button.cancel)" :disabled="disabled" @click="emit('clear')" />
    </div>
    <slot />
  </div>
</template>
