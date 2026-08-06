<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useBodyScrollLock, useFocusTrap, useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type { MaskCloseReason, MaskEmits, MaskProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<MaskProps>(), {
  visible: false,
  dismissible: true,
  zIndex: 900,
  lockScroll: true,
  trapFocus: true,
  centered: true,
  blur: true,
  teleportTo: "body",
  closeOnPressEscape: true,
  telemetry: undefined,
});

const emit = defineEmits<MaskEmits>();
const { t } = useLocale();
const panelRef = ref<HTMLElement | null>(null);
const closing = ref(false);
const visibleRef = computed(() => props.visible);
const lockRef = computed(() => props.lockScroll);
const focusActive = computed(() => props.visible && props.trapFocus);

useBodyScrollLock(visibleRef, lockRef);
useFocusTrap(panelRef, focusActive);

const overlayStyle = computed(() => ({
  ...(props.style ?? {}),
  zIndex: String(props.zIndex),
}));

async function close(reason: MaskCloseReason = "programmatic", event?: Event) {
  if (closing.value) return;
  closing.value = true;
  try {
    if (props.beforeClose) {
      try {
        if ((await props.beforeClose(reason, event)) === false) return;
      } catch (error) {
        emit("error", error);
        return;
      }
    }
    trackEmit({
      component: "Mask",
      type: "close",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { reason },
    });
    emit("update:visible", false);
    emit("close", event, reason);
  } finally {
    closing.value = false;
  }
}

function onOverlay(event: MouseEvent) {
  if (props.dismissible && event.target === event.currentTarget) {
    void close("overlay", event);
  }
}

function onKeydown(event: KeyboardEvent) {
  if (props.closeOnPressEscape && event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    void close("escape", event);
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.trapFocus)
      void nextTick(() => panelRef.value?.focus());
  },
);
</script>

<template>
  <Teleport :to="teleportTo">
    <Transition
      name="vp-mask"
      @after-enter="emit('open')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="visible"
        :class="[
          'vp-mask',
          { 'vp-mask--centered': centered, 'vp-mask--blur': blur },
          props.class,
        ]"
        :style="overlayStyle"
        role="presentation"
        data-component="Mask"
        @click="onOverlay"
      >
        <div
          ref="panelRef"
          class="vp-mask__content"
          :role="trapFocus ? 'dialog' : undefined"
          :aria-modal="trapFocus || undefined"
          :aria-label="
            trapFocus ? ariaLabel || t('component.mask.aria') : undefined
          "
          :tabindex="trapFocus ? -1 : undefined"
          @click.stop
          @keydown="onKeydown"
        >
          <slot :close="close" :closing="closing" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
