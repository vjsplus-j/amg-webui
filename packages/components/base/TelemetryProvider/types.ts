import type { BaseProps } from "@amg-webui/types";
import type { VpTelemetryConfig } from "@amg-webui/telemetry";

export interface TelemetryProviderProps extends BaseProps {
  /** Configuration applied while this provider is mounted. */
  config?: VpTelemetryConfig;
  /** Explicit enabled override; omitted keeps `config.enabled` or the current state. */
  enabled?: boolean;
  /** Render element. The provider uses `display: contents` by default. */
  tag?: string;
  /** Restore the previous global telemetry configuration on unmount. */
  restoreOnUnmount?: boolean;
  /** Record provider mount/unmount lifecycle events when telemetry is enabled. */
  trackLifecycle?: boolean;
  /** Accessible label when a visible wrapper tag is used. */
  ariaLabel?: string;
  /** Apply changes immediately before mount (useful for SSR-safe setup). */
  eager?: boolean;
  /** Wrapper layout mode; contents preserves zero-layout behavior. */
  display?: "contents" | "block" | "inline";
}

export interface TelemetryProviderEmits {
  (e: "applied", config: Readonly<VpTelemetryConfig>): void;
  (e: "error", error: unknown): void;
  (e: "restored", config: Readonly<VpTelemetryConfig>): void;
  (e: "enabled-change", enabled: boolean): void;
}
