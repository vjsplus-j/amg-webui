<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrBackupTaskProps, VcrBackupTaskEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrBackupTaskProps>(), {
  tasks: () => [
    { id: 'bk1', name: 'NVR-Main backup', progress: 72, status: 'running' },
    { id: 'bk2', name: 'IPC-Gate archive', progress: 0, status: 'pending' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrBackupTaskEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.backup))
const isEmpty = computed(() => !props.tasks?.length)

function statusLabel(status: string) {
  if (status === 'running') return t(LocaleKeys.industry.vcr.running)
  if (status === 'done') return t(LocaleKeys.industry.vcr.done)
  return t(LocaleKeys.industry.vcr.pending)
}

function startTask(id: string) {
  if (props.disabled || props.loading) return
  emit('start', id)
  trackEmit({ component: 'VcrBackupTask', type: 'start', trackId: props.trackId, telemetry: props.telemetry })
}

function refreshTasks() {
  trackEmit({ component: 'VcrBackupTask', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-vcr-backup-task', 'vp-vcr-backup-task__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-backup-task-title"
    data-component="VcrBackupTask"
  >
    <header class="vp-vcr-backup-task__header">
      <h3 id="vp-vcr-backup-task-title" class="vp-vcr-backup-task__title">{{ titleText }}</h3>
      <div class="vp-vcr-backup-task__status" role="status" aria-live="polite">{{ tasks?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-backup-task__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-backup-task__body">
      <div class="vp-vcr-backup-task__toolbar">
        <button type="button" class="vp-vcr-backup-task__btn" :disabled="disabled" @click="refreshTasks">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled" @click="refreshTasks">
          {{ t(LocaleKeys.button.create) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-backup-task__empty" role="status">{{ t(LocaleKeys.industry.common.noTasks) }}</p>
      <ul v-else class="vp-vcr-backup-task__list" role="list">
        <li v-for="task in tasks" :key="task.id" class="vp-vcr-backup-task__item">
          <span>{{ task.name }}</span>
          <div class="vp-vcr-backup-task__progress" role="progressbar" :aria-valuenow="task.progress" aria-valuemin="0" aria-valuemax="100">
            <div class="vp-vcr-backup-task__progress-bar" :style="{ width: task.progress + '%' }" />
          </div>
          <span class="vp-vcr-backup-task__muted">{{ statusLabel(task.status) }}</span>
          <button type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled || task.status === 'running'" @click="startTask(task.id)">
            {{ t(LocaleKeys.button.confirm) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
