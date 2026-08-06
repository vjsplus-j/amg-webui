import TelemetryProvider from "./index.vue";
import type { VpTelemetryConfig } from "@amg-webui/telemetry";
import { TELEMETRY_CONFIG_KEY } from "@amg-webui/telemetry";
import type { TelemetryProviderEmits, TelemetryProviderProps } from "./types";

export { TelemetryProvider, TELEMETRY_CONFIG_KEY };
export type {
  VpTelemetryConfig,
  TelemetryProviderProps,
  TelemetryProviderEmits,
};
export default TelemetryProvider;
