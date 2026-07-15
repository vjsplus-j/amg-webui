<script setup lang="ts">
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
import type { PropRow } from '../../components/demo/types'

const STORAGE_KEY = 'vp-example-card-widgets-order'
const DEFAULT_ORDER = ['a', 'b', 'c', 'd']

const { t } = useLocale()

const order = ref([...DEFAULT_ORDER])
const lastEvent = ref('')

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
    detail: `${payload.from.toUpperCase()} ↔ ${payload.to.toUpperCase()}`
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

function resetOrder() {
  order.value = [...DEFAULT_ORDER]
  localStorage.removeItem(STORAGE_KEY)
  lastEvent.value = t('example.doc.card-widgets.sample.reset')
}

onMounted(loadOrder)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'v-model / modelValue',
    description: t('example.doc.card-widgets.prop.order'),
    type: 'string[]',
    defaultValue: "['a','b','c','d']"
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
    name: '@change',
    description: t('example.doc.card-widgets.emit.change'),
    type: '(order: string[]) => void',
    defaultValue: '-'
  },
  {
    name: '@swap',
    description: t('example.doc.card-widgets.emit.swap'),
    type: '(payload: { from; to; order }) => void',
    defaultValue: '-'
  },
  {
    name: '@drag-end',
    description: t('example.doc.card-widgets.emit.dragEnd'),
    type: '(payload: { order; swapped; from?; to? }) => void',
    defaultValue: '-'
  }
])

const codePersist = `const order = ref(['a','b','c','d'])

onMounted(() => {
  const raw = localStorage.getItem('my-card-widgets')
  if (raw) order.value = JSON.parse(raw)
})

function onChange(next) {
  localStorage.setItem('my-card-widgets', JSON.stringify(next))
  // or: await api.saveWidgetLayout(next)
}

<CardWidgets
  v-model="order"
  @change="onChange"
  @swap="onSwap"
  @drag-end="onDragEnd"
>
  …
</CardWidgets>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.card.demo.widgets')"
      :description="t('example.doc.card.demo.widgetsDesc')"
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
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
