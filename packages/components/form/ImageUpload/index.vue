<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '@amg-webui/core/Button/index.vue'
import type { ImageUploadProps, ImageUploadEmits, ImageFileItem } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'ImageUpload' })

const props = withDefaults(defineProps<ImageUploadProps>(), {
  modelValue: () => [],
  multiple: true,
  maxCount: 9,
  accept: 'image/*'
})

const emit = defineEmits<ImageUploadEmits>()
const { t } = useLocale()

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

const inputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const objectUrls: string[] = []

const fileList = computed(() => props.modelValue ?? [])

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const addFiles = (files: FileList | File[]) => {
  const list = [...fileList.value]
  for (const raw of Array.from(files)) {
    if (!raw.type.startsWith('image/')) continue
    if (list.length >= props.maxCount) break
    const url = URL.createObjectURL(raw)
    objectUrls.push(url)
    list.push({ uid: uid(), name: raw.name, url, status: 'success', raw })
    if (!props.multiple) break
  }
  emit('update:modelValue', list)
  emit('change', list)
  void validateOnChange()
}

const openPicker = () => {
  if (isDisabled.value || fileList.value.length >= props.maxCount) return
  inputRef.value?.click()
}

const removeFile = (file: ImageFileItem) => {
  if (file.url.startsWith('blob:')) URL.revokeObjectURL(file.url)
  const next = fileList.value.filter((f) => f.uid !== file.uid)
  emit('update:modelValue', next)
  emit('change', next)
  void validateOnChange()
}

onUnmounted(() => {
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
})
</script>

<template>
  <div :class="['vp-image-upload', props.class]" :style="style" data-component="ImageUpload">
    <div class="vp-image-upload__grid">
      <div
        v-for="file in fileList"
        :key="file.uid"
        class="vp-image-upload__thumb"
      >
        <img :src="file.url" :alt="file.name" class="vp-image-upload__img" />
        <Button
          class="vp-image-upload__remove"
          variant="text"
          size="sm"
          severity="danger"
          :label="t(LocaleKeys.button.delete)"
          @click="removeFile(file)"
        />
      </div>
      <button
        v-if="fileList.length < maxCount"
        v-bind="nativeAttrs"
        :id="inputId"
        type="button"
        :class="['vp-image-upload__add', { 'vp-image-upload__add--active': isDragActive }]"
        :disabled="isDisabled"
        :aria-invalid="isInvalid || undefined"
        :aria-required="isRequired || undefined"
        :aria-describedby="ariaDescribedby"
        @click="openPicker"
        @dragover.prevent="isDragActive = !isDisabled"
        @dragleave="isDragActive = false"
        @drop.prevent="(e) => { isDragActive = false; if (!isDisabled && e.dataTransfer?.files.length) addFiles(e.dataTransfer.files) }"
      >
        +
      </button>
    </div>
    <input ref="inputRef" class="vp-image-upload__input" type="file" :multiple="multiple" :accept="accept" :disabled="isDisabled" tabindex="-1" aria-hidden="true" @change="(e) => { const i = e.target as HTMLInputElement; if (i.files?.length) { addFiles(i.files); i.value = '' } }" />
  </div>
</template>
