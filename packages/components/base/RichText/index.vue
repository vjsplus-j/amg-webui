<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '../Button/index.vue'
import type { RichTextProps, RichTextEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<RichTextProps>(), {
  modelValue: ''
})

const emit = defineEmits<RichTextEmits>()
const { t } = useLocale()

const editorRef = ref<HTMLDivElement | null>(null)
const history = ref<string[]>([])
const historyIndex = ref(-1)

const syncFromProp = () => {
  const el = editorRef.value
  if (!el || el.innerHTML === props.modelValue) return
  el.innerHTML = props.modelValue || ''
}

watch(() => props.modelValue, syncFromProp)

const pushHistory = () => {
  const html = editorRef.value?.innerHTML ?? ''
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(html)
  historyIndex.value = history.value.length - 1
  emit('update:modelValue', html)
  emit('change', html)
}

const exec = (command: string, value?: string) => {
  if (props.disabled) return
  document.execCommand(command, false, value)
  editorRef.value?.focus()
  pushHistory()
}

const undo = () => {
  if (historyIndex.value <= 0) return
  historyIndex.value -= 1
  const html = history.value[historyIndex.value] ?? ''
  if (editorRef.value) editorRef.value.innerHTML = html
  emit('update:modelValue', html)
  emit('change', html)
}

const redo = () => {
  if (historyIndex.value >= history.value.length - 1) return
  historyIndex.value += 1
  const html = history.value[historyIndex.value] ?? ''
  if (editorRef.value) editorRef.value.innerHTML = html
  emit('update:modelValue', html)
  emit('change', html)
}

const onInput = () => pushHistory()

const insertLink = () => {
  exec('createLink', 'https://')
}

onMounted(() => {
  syncFromProp()
  pushHistory()
})
</script>

<template>
  <div :class="['vp-rich-text', props.class, { 'vp-rich-text--disabled': disabled }]" :style="style" data-component="RichText">
    <div class="vp-rich-text__toolbar" role="toolbar">
      <Button variant="text" size="sm" label="B" :disabled="disabled" @click="exec('bold')" />
      <Button variant="text" size="sm" label="I" :disabled="disabled" @click="exec('italic')" />
      <Button variant="text" size="sm" label="U" :disabled="disabled" @click="exec('underline')" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.button.create)" :disabled="disabled" @click="exec('insertUnorderedList')" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.common.more)" :disabled="disabled" @click="insertLink" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.button.cancel)" :disabled="disabled || historyIndex <= 0" @click="undo" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.button.continue)" :disabled="disabled || historyIndex >= history.length - 1" @click="redo" />
    </div>
    <div
      ref="editorRef"
      class="vp-rich-text__editor"
      contenteditable="true"
      role="textbox"
      :aria-disabled="disabled"
      :data-placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>
