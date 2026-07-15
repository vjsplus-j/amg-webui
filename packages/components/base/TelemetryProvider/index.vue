<script setup lang="ts">
import { provide, watch, onMounted } from 'vue'
import {
  TelemetryService,
  TELEMETRY_CONFIG_KEY,
  type VpTelemetryConfig
} from '@amg-webui/telemetry'

const props = withDefaults(
  defineProps<{
    /** Merge into TelemetryService.configure — `enabled` defaults false unless set */
    config?: VpTelemetryConfig
    /** Shorthand: when true, calls enable(); when false, disable() */
    enabled?: boolean
  }>(),
  {
    enabled: undefined
  }
)

provide(TELEMETRY_CONFIG_KEY, props.config ?? {})

function apply() {
  try {
    if (props.config) {
      TelemetryService.configure(props.config)
    }
    if (props.enabled === true) TelemetryService.enable()
    else if (props.enabled === false) TelemetryService.disable()
  } catch {
    /* never break host tree */
  }
}

watch(
  () => [props.config, props.enabled] as const,
  () => apply(),
  { deep: true }
)

onMounted(apply)
</script>

<template>
  <div class="vp-telemetry-provider">
    <slot />
  </div>
</template>
