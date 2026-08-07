<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale, useOverlay } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from "@amg-webui/core/Icon/index.vue";
import type { DrawerCloseReason, DrawerEmits, DrawerProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<DrawerProps>(), {
  visible: false,
  placement: "right",
  width: "",
  height: "",
  modal: true,
  closable: true,
  dismissible: true,
  closeOnClickOverlay: undefined,
  closeOnPressEscape: undefined,
  lockScroll: true,
  loading: false,
  teleportTo: "body",
  telemetry: undefined,
});

const emit = defineEmits<DrawerEmits>();
const { t } = useLocale();
const panelRef = ref<HTMLElement | null>(null);
const closing = ref(false);
const visibleRef = computed(() => props.visible);
const shouldLock = computed(() => props.modal && props.lockScroll);
const modalRef = computed(() => props.modal);
const closeOnOverlay = computed(
  () => props.closeOnClickOverlay ?? props.dismissible,
);
const closeOnEscape = computed(
  () => props.closeOnPressEscape ?? props.dismissible,
);

async function closeDrawer(
  reason: DrawerCloseReason = "programmatic",
  event?: Event,
) {
  if (closing.value || props.loading) return;
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
      component: "Drawer",
      type: "close",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { placement: props.placement, reason },
    });
    emit("update:visible", false);
    emit("close", event, reason);
  } finally {
    closing.value = false;
  }
}

const overlay = useOverlay({
  visible: visibleRef,
  kind: "drawer",
  container: panelRef,
  modal: modalRef,
  lockScroll: shouldLock,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape,
  zIndex: () => props.zIndex,
  teleportTo: () => props.teleportTo,
  onEscape: () => {
    if (closeOnEscape.value) void closeDrawer("escape");
  },
});

const closeLabel = computed(() => t(LocaleKeys.common.close));
const isHorizontal = computed(
  () => props.placement === "left" || props.placement === "right",
);

const drawerStyle = computed(() => ({
  ...(props.style ?? {}),
  ...(isHorizontal.value && props.width ? { width: props.width } : {}),
  ...(!isHorizontal.value && props.height ? { height: props.height } : {}),
}));

const overlayStyle = computed(() => {
  const z = overlay.zIndex.value ?? props.zIndex;
  return z === undefined ? undefined : { zIndex: String(z) };
});

function handleOverlayClick(event: MouseEvent) {
  if (
    props.modal &&
    closeOnOverlay.value &&
    event.target === event.currentTarget
  ) {
    void closeDrawer("overlay", event);
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      emit("show", new Event("show"));
    } else {
      emit("hide", new Event("hide"));
    }
  },
);
</script>

<template>
  <Teleport :to="overlay.teleportTo.value ?? 'body'">
    <Transition
      :name="`vp-drawer-${placement}`"
      @after-enter="emit('open')"
      @after-leave="emit('closed')"
    >
      <div
        v-if="visible"
        :class="['vp-drawer-layer', { 'vp-drawer-layer--modal': modal }]"
        :style="overlayStyle"
        role="presentation"
        @click="handleOverlayClick"
      >
        <aside
          ref="panelRef"
          :class="['vp-drawer', `vp-drawer--${placement}`, props.class]"
          :style="drawerStyle"
          role="dialog"
          :aria-modal="modal || undefined"
          :aria-labelledby="title ? overlay.titleId : undefined"
          :aria-label="!title ? ariaLabel : undefined"
          :aria-busy="loading || closing || undefined"
          tabindex="-1"
          data-component="Drawer"
          @click.stop
        >
          <header
            v-if="title || $slots.header || closable"
            class="vp-drawer__header"
          >
            <div class="vp-drawer__heading">
              <template v-if="$slots.header"><slot name="header" /></template>
              <h2 v-else-if="title" :id="overlay.titleId" class="vp-drawer__title">
                {{ title }}
              </h2>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-drawer__close"
              :aria-label="closeLabel"
              :disabled="loading || closing"
              @click="closeDrawer('close', $event)"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>
          <div class="vp-drawer__body"><slot /></div>
          <footer v-if="$slots.footer" class="vp-drawer__footer">
            <slot
              name="footer"
              :close="closeDrawer"
              :loading="loading || closing"
            />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
