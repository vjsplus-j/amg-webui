<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { DataTable } from '@amg-webui/data';
import { useLocale } from "@amg-webui/hooks";
import ExamplePageHero from "../../components/ExamplePageHero.vue";

type BenchRow = {
  id: number;
  name: string;
  status: string;
  amount: number;
  city: string;
  owner: string;
};

const { t } = useLocale();

const rows = ref<BenchRow[]>([]);
const loading = ref(false);
const fps = ref(0);
const memoryMb = ref<number | null>(null);
const domRowCount = ref(0);
const tableHost = ref<HTMLElement | null>(null);

const columns = computed(() => [
  {
    field: "id",
    header: t("page.perf.massive.colId"),
    width: "5rem",
    fixed: "left" as const,
    sortable: true,
  },
  {
    field: "name",
    header: t("page.perf.massive.colName"),
    width: "10rem",
    sortable: true,
  },
  {
    field: "status",
    header: t("page.perf.massive.colStatus"),
    width: "8rem",
    sortable: true,
  },
  {
    field: "amount",
    header: t("page.perf.massive.colAmount"),
    width: "8rem",
    sortable: true,
    align: "right" as const,
  },
  {
    field: "city",
    header: t("page.perf.massive.colCity"),
    width: "8rem",
  },
  {
    field: "owner",
    header: t("page.perf.massive.colOwner"),
    width: "8rem",
  },
]);

function buildRows(count: number): BenchRow[] {
  const next: BenchRow[] = new Array(count);
  for (let i = 0; i < count; i += 1) {
    next[i] = {
      id: i,
      name: `Row ${i}`,
      status: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
      amount: (i * 17) % 10_000,
      city: `C${i % 64}`,
      owner: `U${i % 128}`,
    };
  }
  return next;
}

async function loadDataset(count: number) {
  loading.value = true;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  rows.value = buildRows(count);
  loading.value = false;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  sampleDomRows();
}

function sampleDomRows() {
  const host = tableHost.value;
  if (!host) {
    domRowCount.value = 0;
    return;
  }
  domRowCount.value = host.querySelectorAll(".vp-datatable__body tbody tr").length;
}

function sampleMemory() {
  const perf = performance as Performance & {
    memory?: { usedJSHeapSize: number };
  };
  if (perf.memory?.usedJSHeapSize) {
    memoryMb.value = Math.round((perf.memory.usedJSHeapSize / (1024 * 1024)) * 10) / 10;
  } else {
    memoryMb.value = null;
  }
}

let rafId = 0;
let frames = 0;
let lastTs = 0;

function fpsLoop(ts: number) {
  if (!lastTs) lastTs = ts;
  frames += 1;
  const elapsed = ts - lastTs;
  if (elapsed >= 500) {
    fps.value = Math.round((frames * 1000) / elapsed);
    frames = 0;
    lastTs = ts;
    sampleMemory();
    sampleDomRows();
  }
  rafId = requestAnimationFrame(fpsLoop);
}

onMounted(() => {
  void loadDataset(10_000);
  rafId = requestAnimationFrame(fpsLoop);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});

watch(rows, () => {
  requestAnimationFrame(sampleDomRows);
});

const memoryText = computed(() => {
  if (memoryMb.value == null) return t("page.perf.massive.memoryUnavailable");
  return t("page.perf.massive.memoryValue", { mb: memoryMb.value });
});
</script>

<template>
  <div class="page vp-massive">
    <ExamplePageHero
      title-key="page.perf.massive.title"
      lead-key="page.perf.massive.lead"
    />

    <section class="vp-massive__toolbar">
      <button
        type="button"
        class="vp-massive__btn"
        :disabled="loading"
        @click="loadDataset(10_000)"
      >
        {{ t("page.perf.massive.load10k") }}
      </button>
      <button
        type="button"
        class="vp-massive__btn vp-massive__btn--primary"
        :disabled="loading"
        @click="loadDataset(100_000)"
      >
        {{ t("page.perf.massive.load100k") }}
      </button>
      <p class="vp-massive__hint">{{ t("page.perf.massive.scrollHint") }}</p>
    </section>

    <section class="vp-massive__metrics" aria-live="polite">
      <div class="vp-massive__metric">
        <span class="vp-massive__metric-label">{{ t("page.perf.massive.metricRows") }}</span>
        <strong>{{ rows.length.toLocaleString() }}</strong>
      </div>
      <div class="vp-massive__metric">
        <span class="vp-massive__metric-label">{{ t("page.perf.massive.metricDom") }}</span>
        <strong>{{ domRowCount }}</strong>
      </div>
      <div class="vp-massive__metric">
        <span class="vp-massive__metric-label">{{ t("page.perf.massive.metricFps") }}</span>
        <strong>{{ fps }}</strong>
      </div>
      <div class="vp-massive__metric">
        <span class="vp-massive__metric-label">{{ t("page.perf.massive.metricMemory") }}</span>
        <strong>{{ memoryText }}</strong>
      </div>
    </section>

    <section ref="tableHost" class="vp-massive__table">
      <DataTable
        :value="rows"
        :columns="columns"
        :loading="loading"
        :virtual="true"
        :virtual-height="90"
        :virtual-columns="true"
        striped
        filter-global
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-massive {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-massive__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-massive__btn {
  appearance: none;
  min-height: var(--height-md);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &--primary {
    background: var(--primary-500);
    border-color: var(--primary-500);
    color: var(--text-on-primary, var(--surface-0));
  }
}

.vp-massive__hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-massive__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-2xl) * 4), 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.vp-massive__metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);

  strong {
    font-size: var(--font-size-lg);
    color: var(--text-primary);
  }
}

.vp-massive__metric-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-massive__table {
  width: 100%;
  min-width: 0;
}
</style>
