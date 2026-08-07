<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Progress from '@amg-webui/core/Progress/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import type { BatchUploadProps, BatchUploadEmits, BatchFileItem } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'BatchUpload' })

const props = withDefaults(defineProps<BatchUploadProps>(), {
  modelValue: () => [],
  concurrent: 2,
  drag: true,
  accept: '*'
})

const emit = defineEmits<BatchUploadEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid
})

const { nativeAttrs } = useNativeInputAttrs()

const { t } = useLocale()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const timers = new Map<string, ReturnType<typeof setInterval>>()
const activeCount = ref(0)

const fileList = computed(() => props.modelValue ?? [])

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const clearTimer = (id: string) => {
  const timer = timers.get(id)
  if (timer) {
    clearInterval(timer)
    timers.delete(id)
  }
}

const pumpQueue = () => {
  while (activeCount.value < props.concurrent) {
    const pending = fileList.value.find((f) => f.status === 'pending')
    if (!pending) break
    startUpload(pending)
  }
}

const startUpload = (item: BatchFileItem) => {
  activeCount.value += 1
  const next = fileList.value.map((f) =>
    f.uid === item.uid ? { ...f, status: 'uploading' as const, progress: 0 } : f
  )
  emit('update:modelValue', next)
  emit('change', next)

  const timer = setInterval(() => {
    const current = fileList.value.find((f) => f.uid === item.uid)
    if (!current) {
      clearTimer(item.uid)
      return
    }
    const progress = Math.min(100, current.progress + 8 + Math.floor(Math.random() * 12))
    const status = progress >= 100 ? ('success' as const) : ('uploading' as const)
    const updated = fileList.value.map((f) =>
      f.uid === item.uid ? { ...f, progress: progress >= 100 ? 100 : progress, status } : f
    )
    emit('update:modelValue', updated)
    emit('change', updated)
    if (status === 'success') {
      clearTimer(item.uid)
      activeCount.value = Math.max(0, activeCount.value - 1)
      pumpQueue()
    }
  }, 350)
  timers.set(item.uid, timer)
}

const addFiles = (files: FileList | File[]) => {
  const list = [...fileList.value]
  for (const raw of Array.from(files)) {
    list.push({
      uid: uid(),
      name: raw.name,
      size: raw.size,
      progress: 0,
      status: 'pending',
      raw
    })
  }
  emit('update:modelValue', list)
  emit('change', list)
  void validateOnChange()
  pumpQueue()
}

const openPicker = () => {
  if (isDisabled.value) return
  inputRef.value?.click()
}

const retry = (file: BatchFileItem) => {
  const next = fileList.value.map((f) =>
    f.uid === file.uid ? { ...f, status: 'pending' as const, progress: 0 } : f
  )
  emit('update:modelValue', next)
  emit('change', next)
  pumpQueue()
}

const removeFile = (file: BatchFileItem) => {
  clearTimer(file.uid)
  if (file.status === 'uploading') activeCount.value = Math.max(0, activeCount.value - 1)
  const next = fileList.value.filter((f) => f.uid !== file.uid)
  emit('update:modelValue', next)
  emit('change', next)
  void validateOnChange()
  pumpQueue()
}

onUnmounted(() => {
  timers.forEach((timer) => clearInterval(timer))
  timers.clear()
})
</script>

<template>
  <div :class="['vp-batch-upload', props.class]" :style="style" data-component="BatchUpload">
    <div
      v-bind="nativeAttrs"
      :id="inputId"
      :class="['vp-batch-upload__drop', { 'vp-batch-upload__drop--active': isDragActive, 'vp-batch-upload__drop--disabled': isDisabled }]"
      role="button"
      tabindex="0"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover.prevent="isDragActive = !isDisabled"
      @dragleave="isDragActive = false"
      @drop.prevent="(e) => { isDragActive = false; if (!isDisabled && e.dataTransfer?.files.length) addFiles(e.dataTransfer.files) }"
    >
      <span>{{ t('component.batch-upload.lead') }}</span>
    </div>
    <input ref="inputRef" class="vp-batch-upload__input" type="file" multiple :accept="accept" :disabled="isDisabled" tabindex="-1" aria-hidden="true" @change="(e) => { const i = e.target as HTMLInputElement; if (i.files?.length) { addFiles(i.files); i.value = '' } }" />
    <ul v-if="fileList.length" class="vp-batch-upload__list">
      <li v-for="file in fileList" :key="file.uid" class="vp-batch-upload__item">
        <span class="vp-batch-upload__name">{{ file.name }}</span>
        <Progress :percentage="file.progress" :status="file.status === 'error' ? 'danger' : file.status === 'success' ? 'success' : 'normal'" />
        <div class="vp-batch-upload__actions">
          <Button v-if="file.status === 'error'" variant="text" size="sm" :label="t(LocaleKeys.button.refresh)" @click="retry(file)" />
          <Button variant="text" size="sm" severity="danger" :label="t(LocaleKeys.button.delete)" @click="removeFile(file)" />
        </div>
      </li>
    </ul>
  </div>
</template>
