<script setup lang="ts">
/**
 * Lab · Visual theme matrix
 * - Side-by-side ThemeProvider cells for all official designs (human scan)
 * - Host coordinate controls + fixed capture fixtures for Playwright (scripts/visual/matrix.mjs)
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Space, Tag, ThemeProvider } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { DataTable } from '@amg-webui/data'
import { Dialog } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import {
  ThemeService,
  designStyles,
  type ColorScheme,
  type DesignStyleName
} from '@amg-webui/theme'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

/** Keep in sync with scripts/visual/matrix.mjs */
const SCHEME_SUPPORTED = new Set<DesignStyleName>(['linear', 'apple', 'wechat', 'alipay'])
const MATRIX_FIXTURES = ['button', 'input-text', 'select', 'data-table', 'dialog'] as const
const MATRIX_DIRS = ['ltr', 'rtl'] as const

const { tDyn, dir, setDirection } = useLocale()
const route = useRoute()
const router = useRouter()

const activeDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
const activeScheme = ref<ColorScheme>(ThemeService.getScheme())
const selectValue = ref<string | undefined>('alpha')
const dialogOpen = ref(false)
const matrixCellScheme = ref<ColorScheme>('light')

let unsubDesign: (() => void) | undefined
let unsubScheme: (() => void) | undefined

const selectOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

const tableRows = [
  { id: 1, name: 'Alpha', role: 'admin' },
  { id: 2, name: 'Beta', role: 'user' },
  { id: 3, name: 'Gamma', role: 'user' }
]

const tableColumns = [
  { field: 'id', header: 'ID', width: '4rem' },
  { field: 'name', header: 'Name' },
  { field: 'role', header: 'Role', width: '6rem' }
]

const caseCount = computed(() => {
  let n = 0
  for (const style of designStyles) {
    const schemes = SCHEME_SUPPORTED.has(style.name) ? (['light', 'dark'] as const) : (['dark'] as const)
    n += schemes.length * MATRIX_DIRS.length * MATRIX_FIXTURES.length
  }
  return n
})

const activeCoord = computed(
  () => `${activeDesign.value} · ${activeScheme.value} · ${dir.value}`
)

const hostSupportsScheme = computed(() => SCHEME_SUPPORTED.has(activeDesign.value))

function syncUrl() {
  const qs = new URLSearchParams()
  qs.set('design', activeDesign.value)
  qs.set('scheme', activeScheme.value)
  qs.set('dir', dir.value)
  const next = `${route.path}?${qs.toString()}`
  if (route.fullPath !== next) {
    void router.replace({ path: route.path, query: Object.fromEntries(qs) })
  }
}

function applyHost(design: DesignStyleName, scheme?: ColorScheme) {
  activeDesign.value = design
  ThemeService.setStyle(design)
  const nextScheme =
    scheme ??
    (SCHEME_SUPPORTED.has(design) ? activeScheme.value : 'dark')
  if (!SCHEME_SUPPORTED.has(design)) {
    activeScheme.value = 'dark'
  } else {
    activeScheme.value = nextScheme
  }
  ThemeService.setScheme(activeScheme.value)
  syncUrl()
}

function setHostScheme(scheme: ColorScheme) {
  if (!SCHEME_SUPPORTED.has(activeDesign.value)) return
  activeScheme.value = scheme
  ThemeService.setScheme(scheme)
  syncUrl()
}

function setHostDir(next: 'ltr' | 'rtl') {
  setDirection(next)
  syncUrl()
}

function cellSchemeFor(design: DesignStyleName): ColorScheme {
  if (!SCHEME_SUPPORTED.has(design)) return 'dark'
  return matrixCellScheme.value
}

onMounted(() => {
  const q = route.query
  const qDesign = typeof q.design === 'string' ? q.design : null
  const qScheme = typeof q.scheme === 'string' ? q.scheme : null
  const qDir = typeof q.dir === 'string' ? q.dir : null

  if (qDesign && designStyles.some((s) => s.name === qDesign)) {
    activeDesign.value = qDesign as DesignStyleName
    ThemeService.setStyle(activeDesign.value)
  }
  if (qScheme === 'light' || qScheme === 'dark') {
    activeScheme.value = qScheme
    ThemeService.setScheme(qScheme)
  }
  if (qDir === 'ltr' || qDir === 'rtl') {
    setDirection(qDir)
  }

  unsubDesign = ThemeService.subscribe((s) => {
    activeDesign.value = s
  })
  unsubScheme = ThemeService.subscribeScheme((s) => {
    activeScheme.value = s
  })
  syncUrl()
})

onUnmounted(() => {
  unsubDesign?.()
  unsubScheme?.()
})

watch(dir, () => syncUrl())
</script>

<template>
  <div class="lab-visual-matrix">
    <ExamplePageHero
      title-key="page.lab.visualMatrix.title"
      lead-key="page.lab.visualMatrix.lead"
    />

    <Card class="lab-visual-matrix__card" :header="tDyn('page.lab.visualMatrix.whatTitle')">
      <p class="lab-visual-matrix__body">{{ tDyn('page.lab.visualMatrix.whatBody') }}</p>
    </Card>

    <Card class="lab-visual-matrix__card" :header="tDyn('page.lab.visualMatrix.dimsTitle')">
      <div class="lab-visual-matrix__dims">
        <div class="lab-visual-matrix__dim">
          <span class="lab-visual-matrix__dim-label">{{ tDyn('page.lab.visualMatrix.dimDesign') }}</span>
          <strong>{{ designStyles.length }}</strong>
        </div>
        <div class="lab-visual-matrix__dim">
          <span class="lab-visual-matrix__dim-label">{{ tDyn('page.lab.visualMatrix.dimScheme') }}</span>
          <strong>light / dark</strong>
        </div>
        <div class="lab-visual-matrix__dim">
          <span class="lab-visual-matrix__dim-label">{{ tDyn('page.lab.visualMatrix.dimDir') }}</span>
          <strong>ltr / rtl</strong>
        </div>
        <div class="lab-visual-matrix__dim">
          <span class="lab-visual-matrix__dim-label">{{ tDyn('page.lab.visualMatrix.dimFixture') }}</span>
          <strong>{{ MATRIX_FIXTURES.length }}</strong>
        </div>
        <div class="lab-visual-matrix__dim lab-visual-matrix__dim--accent">
          <span class="lab-visual-matrix__dim-label">{{ tDyn('page.lab.visualMatrix.caseCount') }}</span>
          <strong>{{ caseCount }}</strong>
        </div>
      </div>
      <p class="lab-visual-matrix__hint">{{ tDyn('page.lab.visualMatrix.schemeNote') }}</p>
    </Card>

    <Card class="lab-visual-matrix__card" :header="tDyn('page.lab.visualMatrix.controlsTitle')">
      <p class="lab-visual-matrix__desc">{{ tDyn('page.lab.visualMatrix.controlsDesc') }}</p>
      <Tag size="sm" :label="`${tDyn('page.lab.visualMatrix.activeCoord')}: ${activeCoord}`" />
      <div class="lab-visual-matrix__controls">
        <Space wrap>
          <Button
            v-for="style in designStyles"
            :key="style.name"
            size="sm"
            :variant="activeDesign === style.name ? 'solid' : 'outlined'"
            :label="style.label"
            :track-id="`lab.visual-matrix.design.${style.name}`"
            @click="applyHost(style.name)"
          />
        </Space>
        <Space wrap>
          <Button
            size="sm"
            :variant="activeScheme === 'light' ? 'solid' : 'outlined'"
            :disabled="!hostSupportsScheme"
            label="light"
            track-id="lab.visual-matrix.scheme.light"
            @click="setHostScheme('light')"
          />
          <Button
            size="sm"
            :variant="activeScheme === 'dark' ? 'solid' : 'outlined'"
            :disabled="!hostSupportsScheme"
            label="dark"
            track-id="lab.visual-matrix.scheme.dark"
            @click="setHostScheme('dark')"
          />
          <Button
            size="sm"
            :variant="dir === 'ltr' ? 'solid' : 'outlined'"
            label="ltr"
            track-id="lab.visual-matrix.dir.ltr"
            @click="setHostDir('ltr')"
          />
          <Button
            size="sm"
            :variant="dir === 'rtl' ? 'solid' : 'outlined'"
            label="rtl"
            track-id="lab.visual-matrix.dir.rtl"
            @click="setHostDir('rtl')"
          />
        </Space>
      </div>
    </Card>

    <Card class="lab-visual-matrix__card" :header="tDyn('page.lab.visualMatrix.liveTitle')">
      <p class="lab-visual-matrix__desc">{{ tDyn('page.lab.visualMatrix.liveDesc') }}</p>
      <Space wrap class="lab-visual-matrix__cell-scheme">
        <span>{{ tDyn('page.lab.visualMatrix.cellScheme') }}</span>
        <Button
          size="sm"
          :variant="matrixCellScheme === 'light' ? 'solid' : 'outlined'"
          label="light"
          @click="matrixCellScheme = 'light'"
        />
        <Button
          size="sm"
          :variant="matrixCellScheme === 'dark' ? 'solid' : 'outlined'"
          label="dark"
          @click="matrixCellScheme = 'dark'"
        />
      </Space>
      <div class="lab-visual-matrix__live" role="list">
        <ThemeProvider
          v-for="style in designStyles"
          :key="style.name"
          class="lab-visual-matrix__cell"
          role="listitem"
          :design="style.name"
          :scheme="cellSchemeFor(style.name)"
          :persist="false"
          :storage-namespace="`lab-vmatrix-${style.name}`"
          :data-matrix-design="style.name"
        >
          <header class="lab-visual-matrix__cell-head">
            <div class="lab-visual-matrix__swatch" aria-hidden="true">
              <i :style="{ background: style.preview.primary }" />
              <i :style="{ background: style.preview.background }" />
            </div>
            <div>
              <strong>{{ style.label }}</strong>
              <code>{{ style.name }}</code>
            </div>
            <Tag
              size="sm"
              :label="
                SCHEME_SUPPORTED.has(style.name)
                  ? cellSchemeFor(style.name)
                  : tDyn('page.lab.visualMatrix.unsupportedScheme')
              "
            />
          </header>
          <div class="lab-visual-matrix__cell-body">
            <Space wrap>
              <Button size="sm" severity="primary" :label="tDyn('page.lab.visualMatrix.samplePrimary')" />
              <Button size="sm" variant="outlined" :label="tDyn('page.lab.visualMatrix.sampleOutlined')" />
            </Space>
            <InputText
              model-value="AMG"
              size="sm"
              :placeholder="tDyn('page.lab.visualMatrix.samplePlaceholder')"
              :aria-label="tDyn('page.lab.visualMatrix.samplePlaceholder')"
            />
            <Tag size="sm" :label="style.category" effect="light" />
          </div>
          <Button
            size="sm"
            variant="text"
            :label="tDyn('page.lab.visualMatrix.applyHost')"
            @click="applyHost(style.name, cellSchemeFor(style.name))"
          />
        </ThemeProvider>
      </div>
    </Card>

    <Card class="lab-visual-matrix__card" :header="tDyn('page.lab.visualMatrix.harnessTitle')">
      <p class="lab-visual-matrix__desc">{{ tDyn('page.lab.visualMatrix.harnessDesc') }}</p>
      <div class="lab-visual-matrix__grid">
        <section
          class="lab-visual-matrix__fixture"
          data-visual-matrix="button"
          :aria-label="tDyn('page.lab.visualMatrix.fixtureButton')"
        >
          <Button variant="solid">{{ tDyn('page.lab.visualMatrix.samplePrimary') }}</Button>
          <Button variant="outlined">{{ tDyn('page.lab.visualMatrix.sampleOutlined') }}</Button>
          <Button variant="dashed">{{ tDyn('page.lab.visualMatrix.sampleDashed') }}</Button>
        </section>

        <section
          class="lab-visual-matrix__fixture"
          data-visual-matrix="input-text"
          :aria-label="tDyn('page.lab.visualMatrix.fixtureInput')"
        >
          <InputText
            model-value="AMG-WebUI"
            :placeholder="tDyn('page.lab.visualMatrix.samplePlaceholder')"
            :aria-label="tDyn('page.lab.visualMatrix.samplePlaceholder')"
          />
        </section>

        <section
          class="lab-visual-matrix__fixture"
          data-visual-matrix="select"
          :aria-label="tDyn('page.lab.visualMatrix.fixtureSelect')"
        >
          <Select
            v-model="selectValue"
            :options="selectOptions"
            :placeholder="tDyn('page.lab.visualMatrix.samplePlaceholder')"
            style="min-width: 12rem"
          />
        </section>

        <section
          class="lab-visual-matrix__fixture lab-visual-matrix__fixture--wide"
          data-visual-matrix="data-table"
          :aria-label="tDyn('page.lab.visualMatrix.fixtureTable')"
        >
          <DataTable :value="tableRows" :columns="tableColumns" />
        </section>

        <section
          class="lab-visual-matrix__fixture"
          data-visual-matrix="dialog"
          :aria-label="tDyn('page.lab.visualMatrix.fixtureDialog')"
        >
          <div data-testid="v-matrix-dialog-open">
            <Button @click="dialogOpen = true">
              {{ tDyn('page.lab.visualMatrix.openDialog') }}
            </Button>
          </div>
        </section>
      </div>
    </Card>

    <Dialog
      v-model:visible="dialogOpen"
      :title="tDyn('page.lab.visualMatrix.dialogTitle')"
      :close-on-press-escape="true"
      :dismissible="true"
    >
      <p>{{ tDyn('page.lab.visualMatrix.dialogBody') }}</p>
      <template #footer>
        <Button @click="dialogOpen = false">
          {{ tDyn('page.lab.visualMatrix.close') }}
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.lab-visual-matrix {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.lab-visual-matrix__card {
  width: 100%;
}

.lab-visual-matrix__body,
.lab-visual-matrix__desc,
.lab-visual-matrix__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--ds-text-secondary);
  line-height: var(--line-height-normal, 1.5);
  max-width: none;
}

.lab-visual-matrix__dims {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.lab-visual-matrix__dim {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--ds-bg-elevated, var(--ds-bg));
}

.lab-visual-matrix__dim--accent {
  border-color: var(--ds-primary, var(--ds-border));
}

.lab-visual-matrix__dim-label {
  font-size: var(--font-size-sm);
  color: var(--ds-text-secondary);
}

.lab-visual-matrix__dim strong {
  font-size: var(--font-size-lg);
  color: var(--ds-text);
}

.lab-visual-matrix__controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.lab-visual-matrix__cell-scheme {
  margin-bottom: var(--spacing-md);
  align-items: center;
}

.lab-visual-matrix__live {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--spacing-md);
}

.lab-visual-matrix__cell {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  box-sizing: border-box;
  min-height: 12rem;
  padding: var(--spacing-md);
  background: var(--ds-bg);
  color: var(--ds-text);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.lab-visual-matrix__cell-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.lab-visual-matrix__cell-head strong {
  display: block;
  color: var(--ds-text);
}

.lab-visual-matrix__cell-head code {
  font-size: var(--font-size-xs);
  color: var(--ds-text-secondary);
}

.lab-visual-matrix__swatch {
  display: flex;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm, 4px);
  overflow: hidden;
  border: 1px solid var(--ds-border);
  flex-shrink: 0;
}

.lab-visual-matrix__swatch i {
  flex: 1;
  display: block;
}

.lab-visual-matrix__cell-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.lab-visual-matrix__grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.lab-visual-matrix__fixture {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  box-sizing: border-box;
  width: 448px;
  min-width: 448px;
  max-width: 448px;
  padding: var(--spacing-lg);
  background: var(--ds-bg);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.lab-visual-matrix__fixture--wide {
  width: 576px;
  min-width: 576px;
  max-width: 576px;
}
</style>
