<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import FeedbackNotice from "../../internal/FeedbackNotice.vue";
import type { NotificationEmits, NotificationProps } from "./types";

const props = defineProps<NotificationProps>();
const emit = defineEmits<NotificationEmits>();
const instance = getCurrentInstance();
const forwardedProps = computed(() => {
  const value: Partial<NotificationProps> = { ...props };
  if (
    !Object.prototype.hasOwnProperty.call(
      instance?.vnode.props ?? {},
      "visible",
    )
  )
    delete value.visible;
  return value;
});
</script>

<template>
  <FeedbackNotice role="status" aria-live="polite"
    v-bind="forwardedProps"
    kind="notification"
    @update:visible="emit('update:visible', $event)"
    @close="(reason, event) => emit('close', reason, event)"
    @action="emit('action', $event)"
    @click="emit('click', $event)"
    @open="emit('open')"
    @closed="emit('closed')"
  >
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template #default><slot /></template>
    <template v-if="$slots.actions" #actions="slotProps"
      ><slot name="actions" v-bind="slotProps"
    /></template>
  </FeedbackNotice>
</template>
