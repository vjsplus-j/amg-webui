<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { useLocale, useOverlay } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import Icon from "../Icon/index.vue";
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
const uid = useId();
const panelRef = ref<HTMLElement | null>(null);
const closing = ref(false);
const visibleRef = computed(() => props.visible);
const shouldLock = computed(() => props.modal && props.lockScroll);
const closeOnEscape = computed(
  () => props.closeOnPressEscape ?? props.dismissible,
);
const explicitZ = computed(() => props.zIndex);

const { zIndex } = useOverlay({
  visible: visibleRef,
  container: panelRef,
  modal: shouldLock,
  trapFocus: true,
  closeOnEscape,
  zIndex: explicitZ,
  onClose: (reason) => {
    if (reason === "escape") void closeDrawer("escape");
  },
});

const closeLabel = computed(() => t(LocaleKeys.common.close));
const titleId = `${uid}-title`;
const closeOnOverlay = computed(
  () => props.closeOnClickOverlay ?? props.dismissible,
);
const isHorizontal = computed(
  () => props.placement === "left" || props.placement === "right",
);

const drawerStyle = computed(() => ({
  ...(props.style ?? {}),
  ...(isHorizontal.value && props.width ? { width: props.width } : {}),
  ...(!isHorizontal.value && props.height ? { height: props.height } : {}),
}));

const overlayStyle = computed(() => ({
  zIndex: String(zIndex.value),
}));


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

function handleOverlayClick(event: MouseEvent) {
  if (
    props.modal &&
    closeOnOverlay.value &&
    event.target === event.currentTarget
  ) {
    void closeDrawer("overlay", event);
  }
}

function focusInitial() {
  const autofocus = panelRef.value?.querySelector<HTMLElement>("[autofocus]");
  const first = panelRef.value?.querySelector<HTMLElement>(
    'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
  );
  (autofocus ?? first ?? panelRef.value)?.focus();
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      emit("show", new Event("show"));
      void nextTick(focusInitial);
    } else {
      emit("hide", new Event("hide"));
    }
  },
);
</script>

<template>
  <Teleport :to="teleportTo">
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
          :aria-labelledby="title ? titleId : undefined"
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
              <h2 v-else-if="title" :id="titleId" class="vp-drawer__title">
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
