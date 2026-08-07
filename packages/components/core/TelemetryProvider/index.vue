<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  watch,
} from "vue";
import {
  TelemetryService,
  TELEMETRY_CONFIG_KEY,
  trackEmit,
  type VpTelemetryConfig,
} from "@amg-webui/telemetry";
import type { TelemetryProviderEmits, TelemetryProviderProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TelemetryProviderProps>(), {
  enabled: undefined,
  tag: "div",
  restoreOnUnmount: true,
  trackLifecycle: false,
  eager: false,
  display: "contents",
  telemetry: undefined,
});

const emit = defineEmits<TelemetryProviderEmits>();
const providedConfig = reactive<VpTelemetryConfig>({});
let previousConfig: VpTelemetryConfig | undefined;
let mounted = false;

provide(TELEMETRY_CONFIG_KEY, providedConfig);

const effectiveConfig = computed<VpTelemetryConfig>(() => ({
  ...(props.config ?? {}),
  ...(props.enabled === undefined ? {} : { enabled: props.enabled }),
}));

const rootClass = computed(() => [
  "vp-telemetry-provider",
  `vp-telemetry-provider--${props.display}`,
  props.class,
]);

function syncProvidedConfig(config: VpTelemetryConfig) {
  for (const key of Object.keys(
    providedConfig,
  ) as (keyof VpTelemetryConfig)[]) {
    delete providedConfig[key];
  }
  Object.assign(providedConfig, config);
}

function apply() {
  try {
    const config = effectiveConfig.value;
    syncProvidedConfig(config);
    TelemetryService.configure(config);
    if (props.enabled === true) TelemetryService.enable();
    else if (props.enabled === false) TelemetryService.disable();
    const applied = TelemetryService.getConfig();
    emit("applied", applied);
    emit("enabled-change", Boolean(applied.enabled));
  } catch (error) {
    emit("error", error);
  }
}

if (props.eager) apply();

watch(
  effectiveConfig,
  () => {
    if (mounted) apply();
  },
  { deep: true },
);

onMounted(() => {
  previousConfig = {
    ...TelemetryService.getConfig(),
    categories: { ...TelemetryService.getConfig().categories },
    redactKeys: [...(TelemetryService.getConfig().redactKeys ?? [])],
    sinks: [...(TelemetryService.getConfig().sinks ?? [])],
  };
  mounted = true;
  apply();
  if (props.trackLifecycle) {
    trackEmit({
      component: "TelemetryProvider",
      type: "mount",
      category: "lifecycle",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
  }
});

onBeforeUnmount(() => {
  if (props.trackLifecycle) {
    trackEmit({
      component: "TelemetryProvider",
      type: "unmount",
      category: "lifecycle",
      trackId: props.trackId,
      telemetry: props.telemetry,
    });
  }
  if (props.restoreOnUnmount && previousConfig) {
    TelemetryService.replaceConfig(previousConfig);
    emit("restored", TelemetryService.getConfig());
  }
  mounted = false;
});

defineExpose({ apply, config: providedConfig });
</script>

<template>
  <component
    :is="tag"
    :class="rootClass"
    :style="style"
    data-component="TelemetryProvider"
    :aria-label="ariaLabel"
  >
    <slot
      :config="providedConfig"
      :enabled="Boolean(providedConfig.enabled)"
      :apply="apply"
    />
  </component>
</template>
