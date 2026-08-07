<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

const props = defineProps<{
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const { t } = useLocale()
const inputRef = ref<HTMLInputElement | null>(null)

function syncIndeterminate() {
  if (inputRef.value) {
    inputRef.value.indeterminate = Boolean(props.indeterminate && !props.checked)
  }
}

onMounted(syncIndeterminate)
watch(() => [props.indeterminate, props.checked], syncIndeterminate)
</script>

<template>
  <input
    ref="inputRef"
    type="checkbox"
    class="vp-tree__checkbox"
    :checked="checked"
    :disabled="disabled"
    :aria-label="ariaLabel || t(LocaleKeys.common.selectAll)"
    @change="emit('change')"
  />
</template>
