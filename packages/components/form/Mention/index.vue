<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import {
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { MentionProps, MentionEmits, MentionOption } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Mention' })

const props = withDefaults(defineProps<MentionProps>(), {
  modelValue: '',
  options: () => [],
  prefix: '@',
  rows: 3,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<MentionEmits>()
const { t } = useLocale()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  name: resolvedName,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(0)
const mentionStart = ref(-1)
const mentionQuery = ref('')
const floatingPanelStyle = ref<Record<string, string>>({})

const filteredOptions = computed(() => {
  const q = mentionQuery.value.toLowerCase()
  return (props.options ?? []).filter((opt) => {
    if (opt.disabled) return false
    if (!q) return true
    return (
      opt.label.toLowerCase().includes(q) ||
      opt.value.toLowerCase().includes(q)
    )
  })
})

const showPopup = computed(
  () => isOpen.value && (filteredOptions.value.length > 0 || props.loading)
)

const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

function syncFloating() {
  if (!showPopup.value || !textareaRef.value) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(textareaRef.value, popupRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

const rootClass = computed(() => [
  'vp-mention',
  {
    'vp-mention--disabled': isDisabled.value,
    'vp-mention--open': showPopup.value
  },
  props.class
])

const closePopup = () => {
  isOpen.value = false
  mentionStart.value = -1
  mentionQuery.value = ''
  activeIndex.value = 0
  floatingPanelStyle.value = {}
}

const detectMention = (value: string, cursor: number) => {
  const before = value.slice(0, cursor)
  const prefixIdx = before.lastIndexOf(props.prefix)

  if (prefixIdx < 0) {
    closePopup()
    return
  }

  const afterPrefix = before.slice(prefixIdx + props.prefix.length)
  if (/\s/.test(afterPrefix)) {
    closePopup()
    return
  }

  mentionStart.value = prefixIdx
  mentionQuery.value = afterPrefix
  isOpen.value = true
  activeIndex.value = 0
  emit('search', afterPrefix)
}

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

const onInput = (event: Event) => {
  if (isDisabled.value) return
  const target = event.target as HTMLTextAreaElement
  emitValue(target.value)
  detectMention(target.value, target.selectionStart ?? target.value.length)
}

const insertMention = (opt: MentionOption) => {
  const el = textareaRef.value
  if (!el || mentionStart.value < 0) return

  const cursor = el.selectionStart ?? el.value.length
  const before = el.value.slice(0, mentionStart.value)
  const after = el.value.slice(cursor)
  const insert = `${props.prefix}${opt.value} `
  const next = before + insert + after

  emitValue(next)
  emit('select', opt)
  trackEmit({
    component: 'Mention',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: opt.value }
  })
  closePopup()

  nextTick(() => {
    const pos = before.length + insert.length
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

const onKeydown = (event: KeyboardEvent) => {
  if (!showPopup.value) return

  const len = filteredOptions.value.length
  if (!len && !props.loading) return

  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') {
    if (event.key === 'Tab') closePopup()
    return
  }
  // Keep typing Space in textarea
  if (action === 'select' && event.key === ' ') return
  event.preventDefault()
  if (action === 'close') {
    closePopup()
    return
  }
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    if (len) {
      activeIndex.value = moveRovingIndex(activeIndex.value, action, len, true)
    }
    return
  }
  if (action === 'select' && len) {
    insertMention(filteredOptions.value[activeIndex.value])
  }
}

const handleOutsideClick = (event: MouseEvent) => {
  if (!showPopup.value) return
  const target = event.target as HTMLElement
  if (
    !textareaRef.value?.contains(target) &&
    !popupRef.value?.contains(target)
  ) {
    closePopup()
  }
}

const handleBlur = () => {
  void validateOnBlur()
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

watch(showPopup, (open) => {
  if (open) nextTick(syncFloating)
  else floatingPanelStyle.value = {}
})
</script>

<template>
  <div :class="rootClass" :style="style" data-component="Mention">
    <textarea
      ref="textareaRef"
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-mention__input"
      :name="resolvedName"
      :value="modelValue"
      :placeholder="placeholder ?? t(LocaleKeys.component.mention.placeholder)"
      :disabled="isDisabled"
      :rows="rows"
      :maxlength="maxLength"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @input="onInput"
      @keydown="onKeydown"
      @blur="handleBlur"
    />

    <ul
      v-if="showPopup"
      ref="popupRef"
      class="vp-mention__popup"
      role="listbox"
      :style="panelMergedStyle"
      :aria-label="t(LocaleKeys.component.mention.listAria)"
    >
      <li v-if="loading" class="vp-mention__option vp-mention__option--loading">
        {{ t(LocaleKeys.component.mention.loading) }}
      </li>
      <li
        v-else-if="!filteredOptions.length"
        class="vp-mention__option vp-mention__option--empty"
      >
        {{ t(LocaleKeys.component.mention.empty) }}
      </li>
      <template v-else>
        <li
          v-for="(opt, idx) in filteredOptions"
          :key="opt.value"
          role="option"
          class="vp-mention__option"
          :class="{
            'vp-mention__option--active': activeIndex === idx,
            'vp-mention__option--disabled': opt.disabled
          }"
          :aria-selected="activeIndex === idx"
          @click="!opt.disabled && insertMention(opt)"
          @mouseenter="activeIndex = idx"
        >
          <span class="vp-mention__option-label">{{ opt.label }}</span>
          <span class="vp-mention__option-value">{{ prefix }}{{ opt.value }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>
