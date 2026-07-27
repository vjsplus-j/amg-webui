<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode` / `demoSfc`).
 */
import { computed, onMounted, ref } from 'vue'
import {
  Avatar,
  Button,
  Card,
  CardWidgets,
  Progress,
  Space,
  Statistic,
  Tag
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ToastService } from '@amg-webui/theme'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const STORAGE_KEY = 'vp-example-card-widgets-order'
const DEFAULT_ORDER = ['a', 'b', 'c', 'd']

const { t } = useLocale()

const order = ref([...DEFAULT_ORDER])
const orderBasic = ref([...DEFAULT_ORDER])
const orderCols = ref([...DEFAULT_ORDER])
const orderDisabled = ref([...DEFAULT_ORDER])
const orderHandle = ref([...DEFAULT_ORDER])
const orderSlots = ref([...DEFAULT_ORDER])
const orderEvents = ref([...DEFAULT_ORDER])
const lastEvent = ref('')
const eventsLog = ref('')

const widgets = computed(() => [
  { key: 'a', title: t('example.doc.card.widgets.a') },
  { key: 'b', title: t('example.doc.card.widgets.b') },
  { key: 'c', title: t('example.doc.card.widgets.c') },
  { key: 'd', title: t('example.doc.card.widgets.d') }
])

const orderLabel = computed(() =>
  `${t('example.doc.card.widgets.order')}: ${order.value.map((k) => k.toUpperCase()).join(' → ')}`
)

function loadOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as unknown
    if (
      Array.isArray(parsed) &&
      parsed.length === DEFAULT_ORDER.length &&
      parsed.every((k) => typeof k === 'string' && DEFAULT_ORDER.includes(k))
    ) {
      order.value = parsed as string[]
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function persistOrder(next: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  lastEvent.value = t('example.doc.card-widgets.sample.persisted', {
    order: next.map((k) => k.toUpperCase()).join(' → ')
  })
}

function onChange(next: string[]) {
  persistOrder(next)
}

function onSwap(payload: { from: string; to: string; order: string[] }) {
  ToastService.success({
    summary: t('example.doc.card-widgets.sample.swapped'),
    detail: t('example.doc.card-widgets.sample.swapDetail', {
      from: payload.from.toUpperCase(),
      to: payload.to.toUpperCase()
    })
  })
}

function onDragEnd(payload: {
  order: string[]
  swapped: boolean
  from?: string
  to?: string
}) {
  if (!payload.swapped) {
    lastEvent.value = t('example.doc.card-widgets.sample.cancelled')
    return
  }
  lastEvent.value = t('example.doc.card-widgets.sample.dragEnd', {
    from: (payload.from || '').toUpperCase(),
    to: (payload.to || '').toUpperCase()
  })
}

function onEventsChange(next: string[]) {
  eventsLog.value = t('example.doc.card-widgets.sample.persisted', {
    order: next.map((k) => k.toUpperCase()).join(' → ')
  })
}

function onEventsSwap(payload: { from: string; to: string; order: string[] }) {
  ToastService.success({
    summary: t('example.doc.card-widgets.sample.swapped'),
    detail: t('example.doc.card-widgets.sample.swapDetail', {
      from: payload.from.toUpperCase(),
      to: payload.to.toUpperCase()
    })
  })
}

function onEventsDragEnd(payload: {
  order: string[]
  swapped: boolean
  from?: string
  to?: string
}) {
  if (!payload.swapped) {
    eventsLog.value = t('example.doc.card-widgets.sample.cancelled')
    return
  }
  eventsLog.value = t('example.doc.card-widgets.sample.dragEnd', {
    from: (payload.from || '').toUpperCase(),
    to: (payload.to || '').toUpperCase()
  })
}

function resetOrder() {
  order.value = [...DEFAULT_ORDER]
  localStorage.removeItem(STORAGE_KEY)
  lastEvent.value = t('example.doc.card-widgets.sample.reset')
}

onMounted(loadOrder)

/** Named slot bodies at `indent` spaces (preview ↔ code 1:1). */
function widgetSlotLines(indent: number): string[] {
  const p = ' '.repeat(indent)
  const p2 = ' '.repeat(indent + 2)
  const p4 = ' '.repeat(indent + 4)
  return [
    `${p}<template #a>`,
    `${p2}<Statistic`,
    `${p4}:title="t('example.doc.card.widgets.visitors')"`,
    `${p4}:value="1284"`,
    `${p4}animate`,
    `${p2}/>`,
    `${p}</template>`,
    `${p}<template #b>`,
    `${p2}<Space direction="vertical" block size="sm">`,
    `${p4}<span>{{ t('example.doc.card.widgets.rate') }}</span>`,
    `${p4}<Progress :percentage="72" />`,
    `${p2}</Space>`,
    `${p}</template>`,
    `${p}<template #c>`,
    `${p2}<Space align="center">`,
    `${p4}<Avatar text="AM" size="sm" />`,
    `${p4}<span>{{ t('example.doc.card.widgets.member') }}</span>`,
    `${p2}</Space>`,
    `${p}</template>`,
    `${p}<template #d>`,
    `${p2}<Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>`,
    `${p}</template>`
  ]
}

/* ─── Code snippets: must mirror preview 1:1 (no ellipsis placeholders) ─── */

const codeBasic = demoSfc({
  imports: [
    `import { Avatar, Button, CardWidgets, Progress, Space, Statistic } from '@amg-webui/components/base'`,
    `import { ref } from 'vue'`
  ],
  script: [
    `const order = ref(['a', 'b', 'c', 'd'])`,
    `const widgets = [`,
    `  { key: 'a', title: t('example.doc.card.widgets.a') },`,
    `  { key: 'b', title: t('example.doc.card.widgets.b') },`,
    `  { key: 'c', title: t('example.doc.card.widgets.c') },`,
    `  { key: 'd', title: t('example.doc.card.widgets.d') }`,
    `]`
  ],
  template: [
    `  <CardWidgets v-model="order" :cols="2" :widgets="widgets">`,
    ...widgetSlotLines(4),
    `  </CardWidgets>`
  ]
})

const codeCols = demoCode(
  `<CardWidgets v-model="order" :cols="4" :widgets="widgets">`,
  ...widgetSlotLines(2),
  `</CardWidgets>`
)

const codeDisabled = demoCode(
  `<CardWidgets`,
  `  v-model="order"`,
  `  :cols="2"`,
  `  disabled`,
  `  :widgets="widgets"`,
  `>`,
  ...widgetSlotLines(2),
  `</CardWidgets>`
)

const codeHandle = demoCode(
  `<CardWidgets`,
  `  v-model="order"`,
  `  :cols="2"`,
  `  :show-handle="false"`,
  `  :widgets="widgets"`,
  `>`,
  ...widgetSlotLines(2),
  `</CardWidgets>`
)

const codePersist = demoCode(
  `const order = ref(['a', 'b', 'c', 'd'])`,
  ``,
  `onMounted(() => {`,
  `  const raw = localStorage.getItem('vp-example-card-widgets-order')`,
  `  if (raw) order.value = JSON.parse(raw)`,
  `})`,
  ``,
  `function onChange(next) {`,
  `  localStorage.setItem('vp-example-card-widgets-order', JSON.stringify(next))`,
  `}`,
  ``,
  `<Card`,
  `  :header="t('example.doc.card.sample.header')"`,
  `>`,
  `  <CardWidgets`,
  `    v-model="order"`,
  `    :cols="2"`,
  `    :widgets="widgets"`,
  `    @change="onChange"`,
  `    @swap="onSwap"`,
  `    @drag-end="onDragEnd"`,
  `  >`,
  ...widgetSlotLines(4),
  `  </CardWidgets>`,
  `</Card>`
)

const codeSlots = demoCode(
  `<!-- Named slots match widget keys (a / b / c / d by default) -->`,
  `<CardWidgets v-model="order" :cols="2" :widgets="widgets">`,
  ...widgetSlotLines(2),
  `</CardWidgets>`
)

const codeEvents = demoCode(
  `<CardWidgets`,
  `  v-model="order"`,
  `  :cols="2"`,
  `  :widgets="widgets"`,
  `  @change="onChange"`,
  `  @swap="onSwap"`,
  `  @drag-end="onDragEnd"`,
  `>`,
  ...widgetSlotLines(2),
  `</CardWidgets>`
)

/* ─── API tables: Props → Events → Slots ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'v-model / modelValue',
    description: t('example.doc.card-widgets.prop.order'),
    type: 'string[]',
    defaultValue: "['a','b','c','d']"
  },
  {
    name: 'widgets',
    description: t('example.doc.card-widgets.prop.widgets'),
    type: 'CardWidgetItem[]',
    defaultValue: '-'
  },
  {
    name: 'cols',
    description: t('example.doc.card-widgets.prop.cols'),
    type: '1 | 2 | 3 | 4',
    defaultValue: '2'
  },
  {
    name: 'disabled',
    description: t('example.doc.card-widgets.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'showHandle',
    description: t('example.doc.card-widgets.prop.showHandle'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.card-widgets.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue',
    description: t('example.doc.card-widgets.emit.update'),
    type: '(order: string[]) => void',
    defaultValue: '-'
  },
  {
    name: 'change',
    description: t('example.doc.card-widgets.emit.change'),
    type: '(order: string[]) => void',
    defaultValue: '-'
  },
  {
    name: 'swap',
    description: t('example.doc.card-widgets.emit.swap'),
    type: '(payload: { from; to; order }) => void',
    defaultValue: '-'
  },
  {
    name: 'dragEnd',
    description: t('example.doc.card-widgets.emit.dragEnd'),
    type: '(payload: { order; swapped; from?; to? }) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: '[key]',
    description: t('example.doc.card-widgets.slot.named'),
    type: '{ keyName: string }',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.card-widgets.demo.basic')"
      :description="t('example.doc.card-widgets.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <CardWidgets v-model="orderBasic" :cols="2" :widgets="widgets">
        <template #a>
          <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
        </template>
        <template #b>
          <Space direction="vertical" block size="sm">
            <span class="vp-card-widgets-demo__label">{{ t('example.doc.card.widgets.rate') }}</span>
            <Progress :percentage="72" />
          </Space>
        </template>
        <template #c>
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <span class="vp-card-widgets-demo__label">{{
              t('example.doc.card.widgets.member')
            }}</span>
          </Space>
        </template>
        <template #d>
          <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
        </template>
      </CardWidgets>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.card-widgets.demo.cols')"
      :description="t('example.doc.card-widgets.demo.colsDesc')"
      :code="codeCols"
    >
      <CardWidgets v-model="orderCols" :cols="4" :widgets="widgets">
        <template #a>
          <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
        </template>
        <template #b>
          <Space direction="vertical" block size="sm">
            <span class="vp-card-widgets-demo__label">{{ t('example.doc.card.widgets.rate') }}</span>
            <Progress :percentage="72" />
          </Space>
        </template>
        <template #c>
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <span class="vp-card-widgets-demo__label">{{
              t('example.doc.card.widgets.member')
            }}</span>
          </Space>
        </template>
        <template #d>
          <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
        </template>
      </CardWidgets>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.card-widgets.demo.disabled')"
      :description="t('example.doc.card-widgets.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <CardWidgets v-model="orderDisabled" :cols="2" disabled :widgets="widgets">
        <template #a>
          <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
        </template>
        <template #b>
          <Space direction="vertical" block size="sm">
            <span class="vp-card-widgets-demo__label">{{ t('example.doc.card.widgets.rate') }}</span>
            <Progress :percentage="72" />
          </Space>
        </template>
        <template #c>
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <span class="vp-card-widgets-demo__label">{{
              t('example.doc.card.widgets.member')
            }}</span>
          </Space>
        </template>
        <template #d>
          <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
        </template>
      </CardWidgets>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.card-widgets.demo.handle')"
      :description="t('example.doc.card-widgets.demo.handleDesc')"
      :code="codeHandle"
    >
      <CardWidgets v-model="orderHandle" :cols="2" :show-handle="false" :widgets="widgets">
        <template #a>
          <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
        </template>
        <template #b>
          <Space direction="vertical" block size="sm">
            <span class="vp-card-widgets-demo__label">{{ t('example.doc.card.widgets.rate') }}</span>
            <Progress :percentage="72" />
          </Space>
        </template>
        <template #c>
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <span class="vp-card-widgets-demo__label">{{
              t('example.doc.card.widgets.member')
            }}</span>
          </Space>
        </template>
        <template #d>
          <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
        </template>
      </CardWidgets>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.card-widgets.demo.persist')"
      :description="t('example.doc.card-widgets.demo.persistDesc')"
      :code="codePersist"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Tag size="sm" severity="info">{{ orderLabel }}</Tag>
          <Button size="sm" variant="outlined" @click="resetOrder">
            {{ t('example.doc.card-widgets.sample.resetBtn') }}
          </Button>
        </Space>
        <p v-if="lastEvent" class="vp-card-widgets-demo__event">{{ lastEvent }}</p>
        <Card :header="t('example.doc.card.sample.header')">
          <CardWidgets
            v-model="order"
            :cols="2"
            :widgets="widgets"
            @change="onChange"
            @swap="onSwap"
            @drag-end="onDragEnd"
          >
            <template #a>
              <Statistic
                :title="t('example.doc.card.widgets.visitors')"
                :value="1284"
                animate
              />
            </template>
            <template #b>
              <Space direction="vertical" block size="sm">
                <span class="vp-card-widgets-demo__label">{{
                  t('example.doc.card.widgets.rate')
                }}</span>
                <Progress :percentage="72" />
              </Space>
            </template>
            <template #c>
              <Space align="center">
                <Avatar text="AM" size="sm" />
                <span class="vp-card-widgets-demo__label">{{
                  t('example.doc.card.widgets.member')
                }}</span>
              </Space>
            </template>
            <template #d>
              <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
            </template>
          </CardWidgets>
        </Card>
      </Space>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.card-widgets.demo.slots')"
      :description="t('example.doc.card-widgets.demo.slotsDesc')"
      :code="codeSlots"
    >
      <CardWidgets v-model="orderSlots" :cols="2" :widgets="widgets">
        <template #a>
          <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
        </template>
        <template #b>
          <Space direction="vertical" block size="sm">
            <span class="vp-card-widgets-demo__label">{{ t('example.doc.card.widgets.rate') }}</span>
            <Progress :percentage="72" />
          </Space>
        </template>
        <template #c>
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <span class="vp-card-widgets-demo__label">{{
              t('example.doc.card.widgets.member')
            }}</span>
          </Space>
        </template>
        <template #d>
          <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
        </template>
      </CardWidgets>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.card-widgets.demo.events')"
      :description="t('example.doc.card-widgets.demo.eventsDesc')"
      :code="codeEvents"
    >
      <Space direction="vertical" block size="md">
        <p class="vp-card-widgets-demo__event">
          {{
            t('example.doc.card-widgets.sample.eventLog', {
              event: eventsLog || t('example.doc.card-widgets.sample.eventIdle')
            })
          }}
        </p>
        <CardWidgets
          v-model="orderEvents"
          :cols="2"
          :widgets="widgets"
          @change="onEventsChange"
          @swap="onEventsSwap"
          @drag-end="onEventsDragEnd"
        >
          <template #a>
            <Statistic :title="t('example.doc.card.widgets.visitors')" :value="1284" animate />
          </template>
          <template #b>
            <Space direction="vertical" block size="sm">
              <span class="vp-card-widgets-demo__label">{{
                t('example.doc.card.widgets.rate')
              }}</span>
              <Progress :percentage="72" />
            </Space>
          </template>
          <template #c>
            <Space align="center">
              <Avatar text="AM" size="sm" />
              <span class="vp-card-widgets-demo__label">{{
                t('example.doc.card.widgets.member')
              }}</span>
            </Space>
          </template>
          <template #d>
            <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>
          </template>
        </CardWidgets>
      </Space>
    </DemoBlock>

    <!-- 5. API: Props → Events → Slots -->
    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub:first-of-type {
  margin-top: 0;
}

.vp-card-widgets-demo__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-card-widgets-demo__event {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
