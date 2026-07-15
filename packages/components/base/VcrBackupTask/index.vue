<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrBackupTaskProps, VcrBackupTaskEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrBackupTaskProps>(), {
  tasks: () => [
    { id: 'bk1', name: 'NVR-Main backup', progress: 72, status: 'running' },
    { id: 'bk2', name: 'IPC-Gate archive', progress: 0, status: 'pending' },
  ],
  disabled: false
})
const emit = defineEmits<VcrBackupTaskEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-vcr-backup-task', 'vp-vcr-backup-task__panel', props.class]" :style="style" data-component="VcrBackupTask">
    <h3 class="vp-vcr-backup-task__title">{{ t('industry.vcr.backup') }}</h3>
    <ul class="vp-vcr-backup-task__list">
      <li v-for="task in tasks" :key="task.id" class="vp-vcr-backup-task__item">
        <span>{{ task.name }}</span>
        <div class="vp-vcr-backup-task__progress" style="width:6rem"><div class="vp-vcr-backup-task__progress-bar" :style="{ width: task.progress + '%' }" /></div>
        <button v-if="task.status === 'pending'" type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled" @click="emit('start', task.id)">{{ t('common.play') }}</button>
      </li>
    </ul>
  </div>
</template>