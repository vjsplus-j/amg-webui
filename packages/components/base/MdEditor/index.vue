<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Button from '../Button/index.vue'
import type { MdEditorProps, MdEditorEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<MdEditorProps>(), {
  modelValue: '',
  preview: true
})

const emit = defineEmits<MdEditorEmits>()
const { t } = useLocale()

const showPreview = ref(props.preview)

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const wrapSelection = (before: string, after: string) => {
  const ta = document.querySelector('.vp-md-editor__textarea') as HTMLTextAreaElement | null
  if (!ta || props.disabled) return
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = props.modelValue.slice(start, end)
  const next = props.modelValue.slice(0, start) + before + selected + after + props.modelValue.slice(end)
  emitValue(next)
}

const previewHtml = computed(() => {
  let html = props.modelValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/\n/g, '<br />')
  return html
})
</script>

<template>
  <div :class="['vp-md-editor', props.class, { 'vp-md-editor--disabled': disabled }]" :style="style" data-component="MdEditor">
    <div class="vp-md-editor__toolbar">
      <Button variant="text" size="sm" label="H1" :disabled="disabled" @click="wrapSelection('# ', '')" />
      <Button variant="text" size="sm" label="H2" :disabled="disabled" @click="wrapSelection('## ', '')" />
      <Button variant="text" size="sm" label="B" :disabled="disabled" @click="wrapSelection('**', '**')" />
      <Button variant="text" size="sm" label="I" :disabled="disabled" @click="wrapSelection('*', '*')" />
      <Button variant="text" size="sm" label="`" :disabled="disabled" @click="wrapSelection('`', '`')" />
      <Button variant="text" size="sm" :label="t(LocaleKeys.common.more)" :disabled="disabled" @click="wrapSelection('- ', '')" />
      <Button
        variant="outlined"
        size="sm"
        :label="showPreview ? t(LocaleKeys.common.close) : t(LocaleKeys.button.enter)"
        @click="showPreview = !showPreview"
      />
    </div>
    <div class="vp-md-editor__panes">
      <textarea
        class="vp-md-editor__textarea"
        :value="modelValue"
        :disabled="disabled"
        :aria-label="t('component.md-editor.title')"
        @input="emitValue(($event.target as HTMLTextAreaElement).value)"
      />
      <div v-if="showPreview" class="vp-md-editor__preview" v-html="previewHtml" />
    </div>
  </div>
</template>
