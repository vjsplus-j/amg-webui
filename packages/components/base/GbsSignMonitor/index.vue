<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type {
  GbsSignEntry,
  GbsSignMonitorEmits,
  GbsSignMonitorProps,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<GbsSignMonitorProps>(), {
  logs: () => [],
  disabled: false,
  loading: false,
  filter: "",
  type: "",
  selectedId: null,
  autoFollow: true,
  clearable: true,
  telemetry: undefined,
});
const emit = defineEmits<GbsSignMonitorEmits>();
const { t, locale } = useLocale();
const entries = ref<GbsSignEntry[]>([...props.logs]);
const logRef = ref<HTMLElement | null>(null);
const query = ref(props.filter);
const selectedType = ref(props.type);
watch(
  () => props.filter,
  (value) => {
    query.value = value;
  },
);
watch(
  () => props.type,
  (value) => {
    selectedType.value = value;
  },
);
watch(
  () => props.logs,
  (value) => {
    entries.value = [...value];
    if (props.autoFollow) void nextTick(follow);
  },
  { deep: true },
);
const types = computed(() => [
  ...new Set(entries.value.map((entry) => entry.type)),
]);
const filtered = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase();
  return entries.value.filter(
    (entry) =>
      (!selectedType.value || entry.type === selectedType.value) &&
      (!keyword ||
        `${entry.type} ${entry.message} ${entry.status ?? ""}`
          .toLocaleLowerCase()
          .includes(keyword)),
  );
});
function follow() {
  if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight;
}
function formatTime(value: GbsSignEntry["time"]) {
  if (value instanceof Date || typeof value === "number")
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(value);
  return value;
}
function refresh() {
  if (props.disabled || props.loading) return;
  emit("refresh");
  trackEmit({
    component: "GbsSignMonitor",
    type: "refresh",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
function clear() {
  if (props.disabled || props.loading || !entries.value.length) return;
  entries.value = [];
  emit("update:logs", []);
  emit("clear");
  trackEmit({
    component: "GbsSignMonitor",
    type: "clear",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
function search(event: Event) {
  query.value = (event.target as HTMLInputElement).value;
  emit("update:filter", query.value);
  emit("filterChange", query.value, selectedType.value);
}
function changeType(event: Event) {
  selectedType.value = (event.target as HTMLSelectElement).value;
  emit("update:type", selectedType.value);
  emit("filterChange", query.value, selectedType.value);
}
function select(entry: GbsSignEntry) {
  if (props.disabled) return;
  emit("update:selectedId", entry.id);
  emit("select", entry);
}
</script>

<template>
  <section
    :class="[
      'vp-gbs-sign-monitor',
      { 'vp-gbs-sign-monitor--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? title ?? t(LocaleKeys.industry.gbs.signLog)"
    :aria-busy="loading"
    data-component="GbsSignMonitor"
  >
    <header class="vp-gbs-sign-monitor__header">
      <div>
        <h3>{{ title ?? t(LocaleKeys.industry.gbs.signLog) }}</h3>
        <span>{{ filtered.length }} / {{ entries.length }}</span>
      </div>
      <div class="vp-gbs-sign-monitor__actions">
        <button type="button" :disabled="disabled || loading" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button
          v-if="clearable"
          type="button"
          :disabled="disabled || loading || !entries.length"
          @click="clear"
        >
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
    </header>
    <div class="vp-gbs-sign-monitor__filters">
      <input
        type="search"
        :value="query"
        :disabled="disabled"
        :placeholder="t(LocaleKeys.common.search)"
        :aria-label="t(LocaleKeys.common.search)"
        @input="search"
      />
      <select
        :value="selectedType"
        :disabled="disabled"
        :aria-label="t(LocaleKeys.common.all)"
        @change="changeType"
      >
        <option value="">{{ t(LocaleKeys.common.all) }}</option>
        <option v-for="item in types" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div v-if="loading" class="vp-gbs-sign-monitor__state" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <ul
      v-else-if="filtered.length"
      ref="logRef"
      class="vp-gbs-sign-monitor__list"
      role="log"
      aria-live="polite"
    >
      <li
        v-for="entry in filtered"
        :key="entry.id"
        :class="[
          'vp-gbs-sign-monitor__entry',
          { 'vp-gbs-sign-monitor__entry--selected': selectedId === entry.id },
        ]"
        role="button"
        :tabindex="disabled ? -1 : 0"
        :aria-pressed="selectedId === entry.id"
        @click="select(entry)"
        @keydown.enter="select(entry)"
      >
        <span
          :class="[
            'vp-gbs-sign-monitor__direction',
            `vp-gbs-sign-monitor__direction--${entry.direction ?? 'in'}`,
          ]"
          >{{ entry.direction === "out" ? "↑" : "↓" }}</span
        >
        <span class="vp-gbs-sign-monitor__content"
          ><strong>{{ entry.type }}</strong
          ><span>{{ entry.message }}</span></span
        >
        <span class="vp-gbs-sign-monitor__meta"
          ><span v-if="entry.status != null">{{ entry.status }}</span
          ><time>{{ formatTime(entry.time) }}</time></span
        >
      </li>
    </ul>
    <div v-else class="vp-gbs-sign-monitor__state" role="status">
      <slot name="empty">{{
        emptyText ?? t(LocaleKeys.industry.common.noLogs)
      }}</slot>
    </div>
    <slot name="footer" :entries="filtered" />
  </section>
</template>
