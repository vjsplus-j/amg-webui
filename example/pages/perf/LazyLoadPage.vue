<script setup lang="ts">
/**
 * Perf · Lazy load lab
 * Spec: docs/APP_WORKFLOW.md §五 — route chunks / overlay lazy mount / biz on-demand / nav timing
 */
import { computed, defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Space, Tag } from '@amg-webui/core'
import { Dialog, Drawer } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, tDyn, locale } = useLocale()
const router = useRouter()

const pageSetupAt = performance.now()
const pageSetupSinceNav = ref(0)
const navType = ref('—')
const domReadyMs = ref<number | null>(null)

const checklist = computed(() => {
  void locale.value
  return [
    t('page.perf.lazy.c1'),
    t('page.perf.lazy.c2'),
    t('page.perf.lazy.c3'),
    t('page.perf.lazy.c4')
  ]
})

function formatMs(ms: number | null) {
  if (ms == null) return '—'
  return tDyn('page.perf.lazy.msValue', { ms: Math.round(ms) })
}

function formatBytes(bytes: number | null) {
  if (bytes == null || bytes <= 0) return tDyn('page.perf.lazy.bytesUnknown')
  return tDyn('page.perf.lazy.bytesValue', { kb: (bytes / 1024).toFixed(1) })
}

function readNavTiming() {
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  if (nav) {
    navType.value = nav.type
    domReadyMs.value = nav.domContentLoadedEventEnd
  } else {
    navType.value = 'legacy'
    const t = performance.timing
    if (t?.navigationStart) {
      domReadyMs.value = t.domContentLoadedEventEnd - t.navigationStart
    }
  }
  pageSetupSinceNav.value = Math.round(pageSetupAt)
}

function latestResourceFor(filter: (name: string) => boolean) {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const e = entries[i]!
    if (filter(e.name)) return e
  }
  return null
}

/* —— heavy route chunk —— */
const heavyLoading = ref(false)
const heavyReady = ref(false)
const heavyMs = ref<number | null>(null)
const heavyBytes = ref<number | null>(null)
const heavyRows = ref(0)
const heavyError = ref('')

async function loadHeavyChunk() {
  heavyLoading.value = true
  heavyError.value = ''
  const t0 = performance.now()
  try {
    const mod = await import('./chunks/heavyPayload')
    const summary = mod.summarizeHeavyChunk()
    heavyRows.value = summary.rows
    heavyMs.value = performance.now() - t0
    heavyReady.value = true
    const res = latestResourceFor(
      (name) => name.includes('heavyPayload') || name.includes('chunks/heavy')
    )
    heavyBytes.value = res?.transferSize || res?.encodedBodySize || null
  } catch (e) {
    heavyError.value = e instanceof Error ? e.message : String(e)
  } finally {
    heavyLoading.value = false
  }
}

/* —— overlay lazy mount —— */
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const dialogMounts = ref(0)
const drawerMounts = ref(0)

const DialogProbe = defineComponent({
  name: 'LazyDialogProbe',
  setup() {
    onMounted(() => {
      dialogMounts.value += 1
    })
    return () =>
      h('p', { class: 'vp-lazy__probe' }, tDyn('page.perf.lazy.probeLive', { n: dialogMounts.value }))
  }
})

const DrawerProbe = defineComponent({
  name: 'LazyDrawerProbe',
  setup() {
    onMounted(() => {
      drawerMounts.value += 1
    })
    return () =>
      h('p', { class: 'vp-lazy__probe' }, tDyn('page.perf.lazy.probeLive', { n: drawerMounts.value }))
  }
})

/* —— biz modules —— */
const bizLoading = ref(false)
const bizName = ref('—')
const bizMs = ref<number | null>(null)
const bizBytes = ref<number | null>(null)
const bizError = ref('')

async function loadBizModule(which: 'users' | 'orders') {
  bizLoading.value = true
  bizError.value = ''
  bizName.value = which
  const t0 = performance.now()
  try {
    if (which === 'users') {
      await import('../biz/UsersBizPage.vue')
    } else {
      await import('../biz/OrdersBizPage.vue')
    }
    bizMs.value = performance.now() - t0
    const needle = which === 'users' ? 'UsersBizPage' : 'OrdersBizPage'
    const res = latestResourceFor((name) => name.includes(needle))
    bizBytes.value = res?.transferSize || res?.encodedBodySize || null
  } catch (e) {
    bizError.value = e instanceof Error ? e.message : String(e)
  } finally {
    bizLoading.value = false
  }
}

function resetCounters() {
  dialogMounts.value = 0
  drawerMounts.value = 0
  heavyMs.value = null
  heavyBytes.value = null
  heavyRows.value = 0
  heavyReady.value = false
  bizMs.value = null
  bizBytes.value = null
  bizName.value = '—'
  heavyError.value = ''
  bizError.value = ''
}

onMounted(() => {
  readNavTiming()
})

onUnmounted(() => {
  dialogVisible.value = false
  drawerVisible.value = false
})
</script>

<template>
  <div class="page vp-lazy">
    <ExamplePageHero title-key="page.perf.lazy.title" lead-key="page.perf.lazy.lead" />

    <Card class="vp-lazy__card" :header="tDyn('page.perf.lazy.checklistTitle')">
      <ul class="vp-lazy__checklist">
        <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
      </ul>
      <Button size="sm" variant="text" :label="tDyn('page.perf.lazy.reset')" @click="resetCounters" />
    </Card>

    <!-- 1. Route chunk -->
    <Card class="vp-lazy__card" :header="tDyn('page.perf.lazy.sectionRoute')">
      <p class="vp-lazy__desc">{{ tDyn('page.perf.lazy.sectionRouteDesc') }}</p>
      <div class="vp-lazy__metrics">
        <Tag
          size="sm"
          :severity="heavyReady ? 'success' : 'info'"
          :label="heavyReady ? tDyn('page.perf.lazy.heavyReady') : tDyn('page.perf.lazy.loadHeavy')"
        />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricChunkMs')}: ${formatMs(heavyMs)}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricChunkBytes')}: ${formatBytes(heavyBytes)}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricChunkRows')}: ${heavyRows}`" />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :loading="heavyLoading"
          :label="heavyLoading ? tDyn('page.perf.lazy.loadingHeavy') : tDyn('page.perf.lazy.loadHeavy')"
          @click="loadHeavyChunk"
        />
      </Space>
      <p v-if="heavyError" class="vp-lazy__error">{{ heavyError }}</p>
    </Card>

    <!-- 2. Overlay lazy mount -->
    <Card class="vp-lazy__card" :header="tDyn('page.perf.lazy.sectionOverlay')">
      <p class="vp-lazy__desc">{{ tDyn('page.perf.lazy.sectionOverlayDesc') }}</p>
      <div class="vp-lazy__metrics">
        <Tag
          size="sm"
          :label="`${tDyn('page.perf.lazy.metricDialogMounts')}: ${dialogMounts}`"
        />
        <Tag
          size="sm"
          :label="`${tDyn('page.perf.lazy.metricDrawerMounts')}: ${drawerMounts}`"
        />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :label="tDyn('page.perf.lazy.openDialog')"
          @click="dialogVisible = true"
        />
        <Button
          size="sm"
          severity="primary"
          :label="tDyn('page.perf.lazy.openDrawer')"
          @click="drawerVisible = true"
        />
        <Button
          size="sm"
          variant="outlined"
          :label="tDyn('page.perf.lazy.close')"
          @click="
            () => {
              dialogVisible = false
              drawerVisible = false
            }
          "
        />
      </Space>

      <Dialog
        :visible="dialogVisible"
        :title="tDyn('page.perf.lazy.dialogTitle')"
        @update:visible="(v) => (dialogVisible = v)"
      >
        <DialogProbe />
      </Dialog>

      <Drawer
        :visible="drawerVisible"
        :title="tDyn('page.perf.lazy.drawerTitle')"
        @update:visible="(v) => (drawerVisible = v)"
      >
        <DrawerProbe />
      </Drawer>
    </Card>

    <!-- 3. Biz on-demand -->
    <Card class="vp-lazy__card" :header="tDyn('page.perf.lazy.sectionBiz')">
      <p class="vp-lazy__desc">{{ tDyn('page.perf.lazy.sectionBizDesc') }}</p>
      <div class="vp-lazy__metrics">
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricBizName')}: ${bizName}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricBizMs')}: ${formatMs(bizMs)}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricChunkBytes')}: ${formatBytes(bizBytes)}`" />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="secondary"
          :loading="bizLoading"
          :label="tDyn('page.perf.lazy.loadUsers')"
          @click="loadBizModule('users')"
        />
        <Button
          size="sm"
          severity="secondary"
          :loading="bizLoading"
          :label="tDyn('page.perf.lazy.loadOrders')"
          @click="loadBizModule('orders')"
        />
      </Space>
      <p v-if="bizError" class="vp-lazy__error">{{ bizError }}</p>
    </Card>

    <!-- 4. Navigation timing -->
    <Card class="vp-lazy__card" :header="tDyn('page.perf.lazy.sectionTiming')">
      <p class="vp-lazy__desc">{{ tDyn('page.perf.lazy.sectionTimingDesc') }}</p>
      <div class="vp-lazy__metrics">
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricNavType')}: ${navType}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.lazy.metricDomReady')}: ${formatMs(domReadyMs)}`" />
        <Tag
          size="sm"
          :label="`${tDyn('page.perf.lazy.metricPageEval')}: ${tDyn('page.perf.lazy.sinceNav', { ms: pageSetupSinceNav })}`"
        />
      </div>
      <Space wrap>
        <Button
          size="sm"
          variant="outlined"
          :label="tDyn('page.perf.lazy.goMassive')"
          @click="router.push({ name: 'perf-massive' })"
        />
        <Button
          size="sm"
          variant="outlined"
          :label="tDyn('page.perf.lazy.goHighFreq')"
          @click="router.push({ name: 'perf-high-frequency' })"
        />
      </Space>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.vp-lazy {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-lazy__card {
  width: 100%;
}

.vp-lazy__desc {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lazy__checklist {
  margin: 0 0 var(--spacing-md);
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-lazy__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-lazy__error {
  margin: var(--spacing-sm) 0 0;
  color: var(--severity-danger);
  font-size: var(--font-size-sm);
}

.vp-lazy__probe {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
}
</style>
