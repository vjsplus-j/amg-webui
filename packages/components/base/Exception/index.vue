<script setup lang="ts">
import { computed } from "vue";
import Button from "../Button/index.vue";
import Icon from "../Icon/index.vue";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import { trackEmit } from "@amg-webui/telemetry";
import type { ExceptionEmits, ExceptionProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<ExceptionProps>(), {
  status: "404",
  telemetry: undefined,
  actionDisabled: false,
  ariaLive: "polite",
  showCode: true,
  compact: false,
  loading: false,
});

const emit = defineEmits<ExceptionEmits>();
const { t } = useLocale();

const titleText = computed(
  () => props.title ?? t(`component.exception.${props.status}.title`),
);
const leadText = computed(
  () => props.description ?? t(`component.exception.${props.status}.lead`),
);

function onAction(event: MouseEvent) {
  trackEmit({
    component: "Exception",
    type: "action",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { status: props.status },
  });
  emit("action", event);
}

function onSecondaryAction(event: MouseEvent) {
  trackEmit({
    component: "Exception",
    type: "secondaryAction",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { status: props.status },
  });
  emit("secondaryAction", event);
}

const iconName = computed(() => {
  if (props.status === "offline") return "WifiOff";
  if (props.status === "403") return "ShieldAlert";
  if (props.status === "500") return "ServerCrash";
  return "FileQuestion";
});
</script>

<template>
  <div
    :class="[
      'vp-exception',
      `vp-exception--${status}`,
      { 'vp-exception--compact': compact },
      props.class,
    ]"
    :style="style"
    role="status"
    :aria-live="ariaLive"
  >
    <div class="vp-exception__visual" aria-hidden="true">
      <slot name="illustration"><Icon :name="iconName" size="xl" /></slot>
    </div>
    <p v-if="showCode" class="vp-exception__code" aria-hidden="true">
      {{ status }}
    </p>
    <h1 class="vp-exception__title">{{ titleText }}</h1>
    <p class="vp-exception__lead">{{ leadText }}</p>
    <div v-if="$slots.details" class="vp-exception__details">
      <slot name="details" />
    </div>
    <div class="vp-exception__actions">
      <slot
        name="actions"
        :action="onAction"
        :secondary-action="onSecondaryAction"
      >
        <Button
          variant="solid"
          severity="primary"
          size="md"
          :loading="loading"
          :disabled="actionDisabled"
          @click="onAction"
        >
          {{ actionText ?? t(LocaleKeys.button.continue) }}
        </Button>
        <Button
          v-if="secondaryActionText"
          variant="outline"
          severity="secondary"
          size="md"
          :disabled="loading"
          @click="onSecondaryAction"
        >
          {{ secondaryActionText }}
        </Button>
      </slot>
    </div>
  </div>
</template>
