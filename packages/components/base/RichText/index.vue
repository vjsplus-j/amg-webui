<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { sanitizeHtml, sanitizeUrl } from '@amg-webui/security'
import { trackEmit } from '@amg-webui/telemetry'
import Button from '../Button/index.vue'
import type { RichTextEmits, RichTextProps } from './types'
import {
  applyFormat,
  insertPlainText,
  insertSafeLink,
  isFormatActive,
  readSanitizedHtml,
  removeLink,
  warnIfSanitizeDisabled,
  writeSanitizedHtml,
  type FormatCommand
} from './useRichTextCommands'
import './style.scss'

const props = withDefaults(defineProps<RichTextProps>(), {
  modelValue: '',
  sanitize: true,
  historyLimit: 50,
  telemetry: undefined
})

const emit = defineEmits<RichTextEmits>()
const { t } = useLocale()

const editorRef = ref<HTMLDivElement | null>(null)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const linkDraft = ref('https://')
const syncing = ref(false)
let inputTimer: ReturnType<typeof setTimeout> | undefined

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(
  () => historyIndex.value >= 0 && historyIndex.value < history.value.length - 1
)

const activeTick = ref(0)
const refreshActive = () => {
  activeTick.value += 1
}
const formatPressed = (cmd: FormatCommand) => {
  void activeTick.value
  const el = editorRef.value
  return el ? isFormatActive(el, cmd) : false
}

const syncFromProp = () => {
  const el = editorRef.value
  if (!el || syncing.value) return
  const incoming = props.sanitize ? sanitizeHtml(props.modelValue || '') : props.modelValue || ''
  if (el.innerHTML === incoming) return
  writeSanitizedHtml(el, incoming, false)
}

watch(() => props.modelValue, syncFromProp)
watch(
  () => props.sanitize,
  (enabled) => warnIfSanitizeDisabled(enabled),
  { immediate: true }
)

const commit = (html: string, trackType?: string, coalesce = false) => {
  const safe = props.sanitize ? sanitizeHtml(html) : html
  if (coalesce && historyIndex.value >= 0 && history.value[historyIndex.value] !== undefined) {
    history.value[historyIndex.value] = safe
  } else {
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(safe)
    if (history.value.length > props.historyLimit) {
      const overflow = history.value.length - props.historyLimit
      history.value = history.value.slice(overflow)
    }
    historyIndex.value = history.value.length - 1
  }
  syncing.value = true
  emit('update:modelValue', safe)
  emit('change', safe)
  void nextTick(() => {
    syncing.value = false
  })
  if (trackType) {
    trackEmit({
      component: 'RichText',
      type: trackType,
      trackId: props.trackId,
      telemetry: props.telemetry
    })
  }
}

const pushFromEditor = (trackType = 'input', coalesce = false) => {
  const el = editorRef.value
  if (!el) return
  const html = readSanitizedHtml(el, props.sanitize)
  if (props.sanitize && el.innerHTML !== html) el.innerHTML = html
  commit(html, trackType, coalesce)
}

const runFormat = (command: FormatCommand) => {
  if (props.disabled || !editorRef.value) return
  applyFormat(editorRef.value, command)
  void nextTick(() => {
    pushFromEditor(command)
    refreshActive()
  })
}

const undo = () => {
  if (!canUndo.value || !editorRef.value) return
  historyIndex.value -= 1
  const html = history.value[historyIndex.value] ?? ''
  writeSanitizedHtml(editorRef.value, html, false)
  syncing.value = true
  emit('update:modelValue', html)
  emit('change', html)
  void nextTick(() => {
    syncing.value = false
  })
  trackEmit({
    component: 'RichText',
    type: 'undo',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const redo = () => {
  if (!canRedo.value || !editorRef.value) return
  historyIndex.value += 1
  const html = history.value[historyIndex.value] ?? ''
  writeSanitizedHtml(editorRef.value, html, false)
  syncing.value = true
  emit('update:modelValue', html)
  emit('change', html)
  void nextTick(() => {
    syncing.value = false
  })
  trackEmit({
    component: 'RichText',
    type: 'redo',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const onInput = () => {
  if (inputTimer) clearTimeout(inputTimer)
  inputTimer = setTimeout(() => pushFromEditor('input', true), 280)
}

const onPaste = (event: ClipboardEvent) => {
  if (props.disabled) return
  if (!props.sanitize) {
    warnIfSanitizeDisabled(false)
    return
  }
  event.preventDefault()
  const html = event.clipboardData?.getData('text/html')
  const text = event.clipboardData?.getData('text/plain') ?? ''
  const safe = html
    ? sanitizeHtml(html, props.sanitizeOptions)
    : sanitizeHtml(`<p>${text}</p>`, props.sanitizeOptions)
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || !editorRef.value) return
  const range = sel.getRangeAt(0)
  range.deleteContents()
  const template = document.createElement('template')
  template.innerHTML = safe
  range.insertNode(template.content)
  void nextTick(() => pushFromEditor('paste'))
}

const insertLink = () => {
  if (props.disabled || !editorRef.value) return
  const href = sanitizeUrl(linkDraft.value)
  if (!href) return
  const ok = insertSafeLink(editorRef.value, href)
  if (ok) {
    linkDraft.value = 'https://'
    void nextTick(() => pushFromEditor('link'))
  }
}

const unlink = () => {
  if (props.disabled || !editorRef.value) return
  if (removeLink(editorRef.value)) void nextTick(() => pushFromEditor('unlink'))
}

const pastePlain = async () => {
  if (props.disabled || !editorRef.value) return
  try {
    const text = await navigator.clipboard.readText()
    insertPlainText(editorRef.value, text)
    void nextTick(() => pushFromEditor('pastePlain'))
  } catch {
    /* clipboard permission denied */
  }
}

onMounted(() => {
  syncFromProp()
  const initial = props.sanitize ? sanitizeHtml(props.modelValue || '') : props.modelValue || ''
  history.value = [initial]
  historyIndex.value = 0
  document.addEventListener('selectionchange', refreshActive)
})

onBeforeUnmount(() => {
  if (inputTimer) clearTimeout(inputTimer)
  document.removeEventListener('selectionchange', refreshActive)
})
</script>

<template>
  <div
    :class="['vp-rich-text', props.class, { 'vp-rich-text--disabled': disabled }]"
    :style="style"
    data-component="RichText"
  >
    <div
      class="vp-rich-text__toolbar"
      role="toolbar"
      :aria-label="t(LocaleKeys.component.richText.toolbar)"
    >
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.bold)"
        :disabled="disabled"
        :aria-pressed="formatPressed('bold')"
        @click="runFormat('bold')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.italic)"
        :disabled="disabled"
        :aria-pressed="formatPressed('italic')"
        @click="runFormat('italic')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.underline)"
        :disabled="disabled"
        :aria-pressed="formatPressed('underline')"
        @click="runFormat('underline')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.heading)"
        :disabled="disabled"
        :aria-pressed="formatPressed('heading')"
        @click="runFormat('heading')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.list)"
        :disabled="disabled"
        :aria-pressed="formatPressed('unorderedList')"
        @click="runFormat('unorderedList')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.orderedList)"
        :disabled="disabled"
        :aria-pressed="formatPressed('orderedList')"
        @click="runFormat('orderedList')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.quote)"
        :disabled="disabled"
        :aria-pressed="formatPressed('blockquote')"
        @click="runFormat('blockquote')"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.code)"
        :disabled="disabled"
        :aria-pressed="formatPressed('code')"
        @click="runFormat('code')"
      />
      <div class="vp-rich-text__link-row">
        <input
          v-model="linkDraft"
          class="vp-rich-text__link-input"
          type="url"
          :disabled="disabled"
          :aria-label="t(LocaleKeys.component.richText.linkHref)"
          :placeholder="t(LocaleKeys.component.richText.linkHref)"
          @keydown.enter.prevent="insertLink"
        />
        <Button
          variant="text"
          size="sm"
          :label="t(LocaleKeys.component.richText.link)"
          :disabled="disabled"
          @click="insertLink"
        />
        <Button
          variant="text"
          size="sm"
          :label="t(LocaleKeys.component.richText.unlink)"
          :disabled="disabled"
          @click="unlink"
        />
        <Button
          variant="text"
          size="sm"
          :label="t(LocaleKeys.component.richText.pastePlain)"
          :disabled="disabled"
          @click="pastePlain"
        />
      </div>
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.undo)"
        :disabled="disabled || !canUndo"
        @click="undo"
      />
      <Button
        variant="text"
        size="sm"
        :label="t(LocaleKeys.component.richText.redo)"
        :disabled="disabled || !canRedo"
        @click="redo"
      />
    </div>
    <div
      ref="editorRef"
      class="vp-rich-text__editor"
      :contenteditable="disabled ? 'false' : 'true'"
      role="textbox"
      aria-multiline="true"
      :aria-disabled="disabled || undefined"
      :data-placeholder="placeholder ?? t(LocaleKeys.component.richText.placeholder)"
      @input="onInput"
      @paste="onPaste"
    />
  </div>
</template>
