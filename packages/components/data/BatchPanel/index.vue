<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '@amg-webui/core/Button/index.vue'
import type { BatchPanelProps, BatchPanelEmits, BatchPanelAction } from './types'
import './style.scss'

const props = withDefaults(defineProps<BatchPanelProps>(), {
  selectedCount: 0,
  totalCount: 0,
  showEmpty: false,
  telemetry: undefined
})

const emit = defineEmits<BatchPanelEmits>()
const { t } = useLocale()

const hasSelection = computed(() => props.selectedCount > 0)

const countLabel = computed(() =>
  t(LocaleKeys.component.batchPanel.selected, {
    selected: props.selectedCount,
    total: props.totalCount
  })
)

const defaultActions = computed<BatchPanelAction[]>(() => [
  { key: 'edit', label: t(LocaleKeys.button.edit), variant: 'outlined', primary: false },
  {
    key: 'delete',
    label: t(LocaleKeys.button.delete),
    variant: 'outlined',
    severity: 'danger',
    primary: false
  },
  { key: 'export', label: t(LocaleKeys.common.export), variant: 'text', primary: false },
  { key: 'clear', label: t(LocaleKeys.button.cancel), variant: 'text', primary: false }
])

const resolvedActions = computed(() =>
  props.actions?.length ? props.actions : defaultActions.value
)

const onAction = (key: string) => {
  if (props.disabled) return
  if (key === 'clear') {
    emit('clear')
  } else {
    emit('action', key)
  }
  trackEmit({
    component: 'BatchPanel',
    type: key === 'clear' ? 'clear' : 'action',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { action: key, selectedCount: props.selectedCount }
  })
}
</script>

<template>
  <div
    v-show="hasSelection || showEmpty"
    :class="[
      'vp-batch-panel',
      props.class,
      {
        'vp-batch-panel--active': hasSelection,
        'vp-batch-panel--empty': !hasSelection,
        'vp-batch-panel--disabled': disabled
      }
    ]"
    :style="style"
    data-component="BatchPanel"
  >
    <template v-if="hasSelection">
      <span class="vp-batch-panel__count">{{ countLabel }}</span>
      <div class="vp-batch-panel__actions">
        <slot name="actions">
          <Button
            v-for="action in resolvedActions"
            :key="action.key"
            :variant="action.variant ?? (action.primary ? 'solid' : 'outlined')"
            :severity="action.severity"
            size="sm"
            :label="action.label ?? action.key"
            :disabled="disabled"
            @click="onAction(action.key)"
          />
        </slot>
      </div>
    </template>
    <p v-else class="vp-batch-panel__empty">
      {{ t(LocaleKeys.component.batchPanel.empty) }}
    </p>
    <slot />
  </div>
</template>
