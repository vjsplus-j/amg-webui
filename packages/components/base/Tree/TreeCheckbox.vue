<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

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
    @change="emit('change')"
  />
</template>
