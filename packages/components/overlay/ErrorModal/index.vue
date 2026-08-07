<script setup lang="ts">
import StatusModal from "../../internal/StatusModal.vue";
import type { ErrorModalEmits, ErrorModalProps } from "./types";

const props = withDefaults(defineProps<ErrorModalProps>(), {
  severity: "danger",
});
const emit = defineEmits<ErrorModalEmits>();
</script>

<template>
  <StatusModal role="dialog" aria-modal="true"
    v-bind="props"
    @update:visible="emit('update:visible', $event)"
    @confirm="emit('confirm', $event)"
    @cancel="(event, reason) => emit('cancel', event, reason)"
    @close="(reason, event) => emit('close', reason, event)"
    @open="emit('open')"
    @closed="emit('closed')"
    @error="(error, action) => emit('error', error, action)"
  >
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template #default><slot /></template>
    <template v-if="$slots.footer" #footer="slotProps"
      ><slot name="footer" v-bind="slotProps"
    /></template>
  </StatusModal>
</template>
