<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { escapeHtml, sanitizeHtml } from '@amg-webui/security'
import Select from '../Select/index.vue'
import Button from '../Button/index.vue'
import type { CodeEditorProps, CodeEditorEmits, CodeLanguage } from './types'
import './style.scss'

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: 'javascript',
  readonly: false
})

const emit = defineEmits<CodeEditorEmits>()
const { t } = useLocale()

const localLang = ref<CodeLanguage>(props.language)

const langOptions = computed(() =>
  (['javascript', 'typescript', 'html', 'css', 'json', 'sql'] as CodeLanguage[]).map((value) => ({
    label: value,
    value
  }))
)

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const formatCode = () => {
  if (props.readonly || props.disabled) return
  try {
    if (localLang.value === 'json') {
      emitValue(JSON.stringify(JSON.parse(props.modelValue || '{}'), null, 2))
    } else {
      emitValue(
        (props.modelValue || '')
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
      )
    }
  } catch {
    /* keep raw */
  }
}

const highlightLine = (line: string) => {
  let escaped = escapeHtml(line)
  if (localLang.value === 'json') {
    escaped = escaped.replace(/&quot;([^&]+)&quot;/g, '<span class="vp-code-editor__str">&quot;$1&quot;</span>')
    escaped = escaped.replace(/\b(true|false|null)\b/g, '<span class="vp-code-editor__kw">$1</span>')
  } else {
    escaped = escaped.replace(
      /\b(const|let|var|function|return|if|else|import|export|from|class|interface|type|async|await)\b/g,
      '<span class="vp-code-editor__kw">$1</span>'
    )
    escaped = escaped.replace(
      /(&#39;.*?&#39;|&quot;.*?&quot;)/g,
      '<span class="vp-code-editor__str">$1</span>'
    )
    escaped = escaped.replace(/(\/\/.*$)/g, '<span class="vp-code-editor__comment">$1</span>')
  }
  return sanitizeHtml(escaped, {
    allowedTags: ['span'],
    allowedAttributes: { span: ['class'], '*': [] }
  })
}

const highlighted = computed(() =>
  (props.modelValue || '').split('\n').map((line, i) => ({
    num: i + 1,
    html: highlightLine(line)
  }))
)

const onScroll = (event: Event) => {
  const ta = event.target as HTMLTextAreaElement
  const pre = ta.previousElementSibling as HTMLElement | null
  if (pre) pre.scrollTop = ta.scrollTop
}

const setLang = (value: unknown) => {
  localLang.value = value as CodeLanguage
}
</script>

<template>
  <div :class="['vp-code-editor', props.class, { 'vp-code-editor--disabled': disabled, 'vp-code-editor--readonly': readonly }]" :style="style" data-component="CodeEditor">
    <div class="vp-code-editor__toolbar">
      <Select
        class="vp-code-editor__lang"
        :model-value="localLang"
        :options="langOptions"
        :disabled="disabled || readonly"
        @update:model-value="setLang"
      />
      <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.save)" :disabled="disabled || readonly" @click="formatCode" />
    </div>
    <div class="vp-code-editor__body">
      <pre class="vp-code-editor__highlight" aria-hidden="true"><code><span v-for="row in highlighted" :key="row.num" class="vp-code-editor__line"><span class="vp-code-editor__gutter">{{ row.num }}</span><span v-html="row.html || '\n'" /></span></code></pre>
      <textarea
        class="vp-code-editor__textarea"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        spellcheck="false"
        :aria-label="t('component.code-editor.title')"
        @input="emitValue(($event.target as HTMLTextAreaElement).value)"
        @scroll="onScroll"
      />
    </div>
  </div>
</template>
