<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Progress from '../Progress/index.vue'
import Button from '../Button/index.vue'
import type { ChunkUploadProps, ChunkUploadEmits, ChunkFileItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<ChunkUploadProps>(), {
  modelValue: () => [],
  chunkSize: 1024 * 512,
  drag: true,
  accept: '*'
})

const emit = defineEmits<ChunkUploadEmits>()
const { t } = useLocale()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const timers = new Map<string, ReturnType<typeof setInterval>>()

const fileList = computed(() => props.modelValue ?? [])

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const clearTimer = (id: string) => {
  const timer = timers.get(id)
  if (timer) {
    clearInterval(timer)
    timers.delete(id)
  }
}

const simulateUpload = (item: ChunkFileItem) => {
  clearTimer(item.uid)
  const next = fileList.value.map((f) =>
    f.uid === item.uid ? { ...f, status: 'uploading' as const, progress: 0, uploadedChunks: 0 } : f
  )
  emit('update:modelValue', next)
  emit('change', next)
  emit('upload', item)

  const timer = setInterval(() => {
    const current = fileList.value.find((f) => f.uid === item.uid)
    if (!current || current.status !== 'uploading') {
      clearTimer(item.uid)
      return
    }
    const uploadedChunks = Math.min(current.chunks, current.uploadedChunks + 1)
    const progress = Math.round((uploadedChunks / current.chunks) * 100)
    const status = uploadedChunks >= current.chunks ? ('success' as const) : ('uploading' as const)
    const updated = fileList.value.map((f) =>
      f.uid === item.uid ? { ...f, uploadedChunks, progress, status } : f
    )
    emit('update:modelValue', updated)
    emit('change', updated)
    if (status === 'success') clearTimer(item.uid)
  }, 400)
  timers.set(item.uid, timer)
}

const addFiles = (files: FileList | File[]) => {
  const list = [...fileList.value]
  for (const raw of Array.from(files)) {
    const chunks = Math.max(1, Math.ceil(raw.size / props.chunkSize))
    const item: ChunkFileItem = {
      uid: uid(),
      name: raw.name,
      size: raw.size,
      progress: 0,
      status: 'ready',
      chunks,
      uploadedChunks: 0,
      raw
    }
    list.push(item)
    simulateUpload(item)
  }
  emit('update:modelValue', list)
  emit('change', list)
}

const openPicker = () => {
  if (props.disabled) return
  inputRef.value?.click()
}

const onInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    addFiles(input.files)
    input.value = ''
  }
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!props.disabled) isDragActive.value = true
}

const onDragLeave = () => {
  isDragActive.value = false
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragActive.value = false
  if (props.disabled || !e.dataTransfer?.files.length) return
  addFiles(e.dataTransfer.files)
}

const removeFile = (file: ChunkFileItem) => {
  clearTimer(file.uid)
  const next = fileList.value.filter((f) => f.uid !== file.uid)
  emit('update:modelValue', next)
  emit('change', next)
}

const retry = (file: ChunkFileItem) => simulateUpload(file)

onUnmounted(() => {
  timers.forEach((timer) => clearInterval(timer))
  timers.clear()
})
</script>

<template>
  <div :class="['vp-chunk-upload', props.class]" :style="style" data-component="ChunkUpload">
    <div
      v-if="drag"
      :class="['vp-chunk-upload__drop', { 'vp-chunk-upload__drop--active': isDragActive, 'vp-chunk-upload__drop--disabled': disabled }]"
      @click="openPicker"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span>{{ t('component.chunk-upload.lead') }}</span>
    </div>
    <input ref="inputRef" class="vp-chunk-upload__input" type="file" :accept="accept" :disabled="disabled" @change="onInputChange" />
    <ul v-if="fileList.length" class="vp-chunk-upload__list">
      <li v-for="file in fileList" :key="file.uid" class="vp-chunk-upload__item">
        <div class="vp-chunk-upload__meta">
          <span class="vp-chunk-upload__name">{{ file.name }}</span>
          <span class="vp-chunk-upload__chunks">{{ file.uploadedChunks }}/{{ file.chunks }}</span>
        </div>
        <Progress :percentage="file.progress" :status="file.status === 'error' ? 'danger' : file.status === 'success' ? 'success' : 'normal'" />
        <div class="vp-chunk-upload__actions">
          <Button v-if="file.status === 'error'" variant="text" size="sm" :label="t(LocaleKeys.button.refresh)" @click="retry(file)" />
          <Button variant="text" size="sm" severity="danger" :label="t(LocaleKeys.button.delete)" @click="removeFile(file)" />
        </div>
      </li>
    </ul>
  </div>
</template>
