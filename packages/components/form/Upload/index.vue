<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { UploadProps, UploadEmits, UploadFile } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Upload' })

const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  multiple: false,
  drag: true
})

const emit = defineEmits<UploadEmits>()

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

const fileList = computed(() => props.modelValue ?? [])
const deleteLabel = computed(() => t(LocaleKeys.button.delete))

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const addFiles = async (files: FileList | File[]) => {
  const list = Array.from(files)
  const next = [...fileList.value]

  for (const raw of list) {
    emit('beforeUpload', raw)
    if (props.beforeUpload) {
      const allowed = await props.beforeUpload(raw)
      if (allowed === false) continue
    }

    next.push({
      uid: uid(),
      name: raw.name,
      size: raw.size,
      status: 'ready',
      raw
    })

    if (!props.multiple) break
  }

  emit('update:modelValue', next)
  emit('change', next)
  void validateOnChange()
}

const handleInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    addFiles(input.files)
    input.value = ''
  }
}

const openPicker = () => {
  if (isDisabled.value) return
  inputRef.value?.click()
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!isDisabled.value) isDragActive.value = true
}

const handleDragLeave = () => {
  isDragActive.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragActive.value = false
  if (isDisabled.value || !event.dataTransfer?.files.length) return
  addFiles(event.dataTransfer.files)
}

const removeFile = (file: UploadFile) => {
  const next = fileList.value.filter((f) => f.uid !== file.uid)
  emit('update:modelValue', next)
  emit('remove', file)
  emit('change', next)
  void validateOnChange()
}
</script>

<template>
  <div :class="['vp-upload', props.class]" :style="style">
    <div
      v-if="drag"
      v-bind="nativeAttrs"
      :id="inputId"
      :class="[
        'vp-upload__drop',
        {
          'vp-upload__drop--active': isDragActive,
          'vp-upload__drop--disabled': isDisabled
        }
      ]"
      role="button"
      tabindex="0"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <slot>
        <span>{{ t(LocaleKeys.button.confirm) }}</span>
      </slot>
    </div>

    <input
      ref="inputRef"
      class="vp-upload__input"
      type="file"
      :multiple="multiple"
      :accept="accept"
      :disabled="isDisabled"
      tabindex="-1"
      aria-hidden="true"
      @change="handleInputChange"
    />

    <button v-if="!drag" type="button" :disabled="isDisabled" @click="openPicker">
      {{ t(LocaleKeys.button.confirm) }}
    </button>

    <ul v-if="fileList.length" class="vp-upload__list">
      <li v-for="file in fileList" :key="file.uid" class="vp-upload__item">
        <span class="vp-upload__name" :title="file.name">{{ file.name }}</span>
        <button
          type="button"
          class="vp-upload__remove"
          :aria-label="deleteLabel"
          :disabled="isDisabled"
          @click="removeFile(file)"
        >
          ×
        </button>
      </li>
    </ul>
  </div>
</template>
