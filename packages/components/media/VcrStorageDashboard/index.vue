<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue';
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type {
  VcrStorageDashboardEmits,
  VcrStorageDashboardProps,
  VcrStorageSummary,
  VcrStorageVolume,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<VcrStorageDashboardProps>(), {
  volumes: () => [],
  selectedId: null,
  disabled: false,
  loading: false,
  warningThreshold: 75,
  dangerThreshold: 90,
  telemetry: undefined,
});
const emit = defineEmits<VcrStorageDashboardEmits>();
const { t, locale } = useLocale();
function percent(volume: Pick<VcrStorageVolume, "used" | "total">) {
  if (!Number.isFinite(volume.total) || volume.total <= 0) return 0;
  return Math.min(
    100,
    Math.max(0, Math.round((Math.max(0, volume.used) / volume.total) * 100)),
  );
}
const summary = computed<VcrStorageSummary>(() => {
  const total = props.volumes.reduce(
    (sum, volume) => sum + Math.max(0, volume.total),
    0,
  );
  const used = Math.min(
    total,
    props.volumes.reduce((sum, volume) => sum + Math.max(0, volume.used), 0),
  );
  return {
    used,
    total,
    available: Math.max(0, total - used),
    percent: percent({ used, total }),
  };
});
function level(volume: VcrStorageVolume) {
  if (volume.status === "error" || volume.status === "offline") return "danger";
  if (volume.status === "warning") return "warning";
  const value = percent(volume);
  if (value >= props.dangerThreshold) return "danger";
  if (value >= props.warningThreshold) return "warning";
  return "normal";
}
function format(value: number) {
  return (
    props.valueFormatter?.(value) ??
    new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(
      value,
    )
  );
}
function refresh() {
  if (props.disabled || props.loading) return;
  emit("refresh");
  trackEmit({
    component: "VcrStorageDashboard",
    type: "refresh",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
function exportData() {
  if (props.disabled || props.loading || !props.volumes.length) return;
  emit("export", props.volumes, summary.value);
  trackEmit({
    component: "VcrStorageDashboard",
    type: "export",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { count: props.volumes.length },
  });
}
function select(volume: VcrStorageVolume) {
  if (props.disabled) return;
  emit("update:selectedId", volume.id);
  emit("select", volume);
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="[
      'vp-vcr-storage-dashboard',
      { 'vp-vcr-storage-dashboard--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t(LocaleKeys.industry.vcr.storage)"
    :aria-busy="loading"
    data-component="VcrStorageDashboard"
  >
    <header class="vp-vcr-storage-dashboard__header">
      <div>
        <h3>{{ title ?? t(LocaleKeys.industry.vcr.storage) }}</h3>
        <span>{{ volumes.length }}</span>
      </div>
      <div class="vp-vcr-storage-dashboard__actions">
        <button type="button" :disabled="disabled || loading" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button
          type="button"
          :disabled="disabled || loading || !volumes.length"
          @click="exportData"
        >
          {{ t(LocaleKeys.common.export) }}
        </button>
      </div>
    </header>
    <div v-if="loading" class="vp-vcr-storage-dashboard__state" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <template v-else-if="volumes.length">
      <div class="vp-vcr-storage-dashboard__summary">
        <div>
          <strong>{{ summary.percent }}%</strong
          ><span>{{ format(summary.used) }} / {{ format(summary.total) }}</span>
        </div>
        <div
          class="vp-vcr-storage-dashboard__progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="summary.percent"
        >
          <i :style="{ width: `${summary.percent}%` }" />
        </div>
      </div>
      <ul
        class="vp-vcr-storage-dashboard__volumes"
        role="listbox"
        :aria-disabled="disabled"
      >
        <li
          v-for="volume in volumes"
          :key="volume.id"
          :class="[
            'vp-vcr-storage-dashboard__volume',
            `vp-vcr-storage-dashboard__volume--${level(volume)}`,
            {
              'vp-vcr-storage-dashboard__volume--selected':
                selectedId === volume.id,
            },
          ]"
          role="option"
          :aria-selected="selectedId === volume.id"
          :tabindex="disabled ? -1 : 0"
          @click="select(volume)"
          @keydown.enter="select(volume)"
        >
          <div class="vp-vcr-storage-dashboard__volume-head">
            <strong>{{ volume.name }}</strong
            ><span>{{ percent(volume) }}%</span>
          </div>
          <div
            class="vp-vcr-storage-dashboard__progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="percent(volume)"
          >
            <i :style="{ width: `${percent(volume)}%` }" />
          </div>
          <div class="vp-vcr-storage-dashboard__meta">
            <span>{{ format(volume.used) }} / {{ format(volume.total) }}</span
            ><span v-if="volume.status">{{ volume.status }}</span>
          </div>
          <p v-if="volume.description">{{ volume.description }}</p>
        </li>
      </ul>
    </template>
    <div v-else class="vp-vcr-storage-dashboard__state" role="status">
      <slot name="empty">{{
        emptyText ?? t(LocaleKeys.industry.common.noData)
      }}</slot>
    </div>
    <slot name="footer" :summary="summary" />
  </section>
</template>
