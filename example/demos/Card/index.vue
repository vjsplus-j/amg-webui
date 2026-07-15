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
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const WIDGET_STORAGE_KEY = 'vp-example-card-widgets-order-card-demo'
const DEFAULT_WIDGET_ORDER = ['a', 'b', 'c', 'd']

const widgetOrder = ref([...DEFAULT_WIDGET_ORDER])

const widgetsMeta = computed(() => [
  { key: 'a', title: t('example.doc.card.widgets.a') },
  { key: 'b', title: t('example.doc.card.widgets.b') },
  { key: 'c', title: t('example.doc.card.widgets.c') },
  { key: 'd', title: t('example.doc.card.widgets.d') }
])

const widgetOrderLabel = computed(
  () =>
    `${t('example.doc.card.widgets.order')}: ${widgetOrder.value.map((k) => k.toUpperCase()).join(' → ')}`
)

function loadWidgetOrder() {
  try {
    const raw = localStorage.getItem(WIDGET_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as unknown
    if (
      Array.isArray(parsed) &&
      parsed.length === DEFAULT_WIDGET_ORDER.length &&
      parsed.every((k) => typeof k === 'string' && DEFAULT_WIDGET_ORDER.includes(k))
    ) {
      widgetOrder.value = parsed as string[]
    }
  } catch {
    /* ignore */
  }
}

function onWidgetChange(next: string[]) {
  localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(next))
}

onMounted(loadWidgetOrder)

type CardSkeleton =
  | 'basic'
  | 'profile'
  | 'metric'
  | 'duo'
  | 'stats'
  | 'media'
  | 'actions'
  | 'list'
  | 'table'
  | 'chart'
  | 'form'
  | 'notice'
  | 'product'
  | 'article'
  | 'comment'
  | 'timeline'
  | 'toolbar'

const skLoading = ref(true)

/** Scenario groups for the skeleton gallery */
const skeletonGroups: { titleKey: string; items: CardSkeleton[] }[] = [
  {
    titleKey: 'example.doc.card.skeletonGroup.content',
    items: ['basic', 'article', 'notice', 'comment']
  },
  {
    titleKey: 'example.doc.card.skeletonGroup.people',
    items: ['profile', 'list', 'timeline']
  },
  {
    titleKey: 'example.doc.card.skeletonGroup.data',
    items: ['metric', 'duo', 'stats', 'chart', 'table']
  },
  {
    titleKey: 'example.doc.card.skeletonGroup.commerce',
    items: ['media', 'product', 'actions', 'form', 'toolbar']
  }
]

const propRows = computed<PropRow[]>(() => [
  {
    name: 'header / title / subtitle',
    description: t('example.doc.card.prop.title'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'hover / hoverable / raised / bordered',
    description: t('example.doc.card.prop.chrome'),
    type: 'boolean',
    defaultValue: 'false / false / false / true'
  },
  {
    name: 'loading',
    description: t('example.doc.card.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'skeleton',
    description: t('example.doc.card.prop.skeleton'),
    type: "CardSkeleton — basic | profile | metric | duo | stats | media | actions | list | table | chart | form | notice | product | article | comment | timeline | toolbar",
    defaultValue: "'basic'"
  },
  {
    name: 'CardWidgets (slot body)',
    description: t('example.doc.card-widgets.prop.order'),
    type: 'CardWidgets v-model string[]',
    defaultValue: "['a','b','c','d']"
  },
  {
    name: 'CardWidgets @change / @swap / @drag-end',
    description: t('example.doc.card-widgets.emit.change'),
    type: 'events',
    defaultValue: '-'
  }
])

const codeBasic = `<Card header="…" title="…">
  …
  <template #footer><Button>…</Button></template>
</Card>`

const codeChrome = `<Card hoverable>…</Card>
<Card raised>…</Card>
<Card :bordered="false">…</Card>`

const codeSkeleton = `<Card loading skeleton="list" />
<Card loading skeleton="table" />
<Card loading skeleton="chart" />
<Card loading skeleton="form" />
<Card loading skeleton="stats" />`

const codeWidgets = `<CardWidgets
  v-model="order"
  @change="(next) => localStorage.setItem(key, JSON.stringify(next))"
  @swap="onSwap"
  @drag-end="onDragEnd"
>
  <template #a>…</template>
  …
</CardWidgets>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.card.demo.basic')"
      :description="t('example.doc.card.demo.basicDesc')"
      :code="codeBasic"
    >
      <div class="vp-card-demo__grid">
        <Card :header="t('example.doc.card.sample.header')">
          <p>{{ t('example.doc.card.sample.body') }}</p>
          <template #footer>
            <Button size="sm">{{ t('example.doc.card.sample.ok') }}</Button>
          </template>
        </Card>
        <Card
          :title="t('example.doc.card.sample.title')"
          :subtitle="t('example.doc.card.sample.subtitle')"
        >
          <Space align="center">
            <Avatar text="AM" size="sm" />
            <Tag size="sm" severity="info">{{ t('example.doc.card.sample.tag') }}</Tag>
          </Space>
          <Progress :percentage="56" />
        </Card>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.card.demo.widgets')"
      :description="t('example.doc.card.demo.widgetsDesc')"
      :code="codeWidgets"
    >
      <Space direction="vertical" block size="md">
        <Tag size="sm" severity="info">{{ widgetOrderLabel }}</Tag>
        <Card :header="t('example.doc.card.sample.header')">
          <CardWidgets
            v-model="widgetOrder"
            :cols="2"
            :widgets="widgetsMeta"
            @change="onWidgetChange"
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
                <span class="vp-card-demo__widget-label">{{
                  t('example.doc.card.widgets.rate')
                }}</span>
                <Progress :percentage="72" />
              </Space>
            </template>
            <template #c>
              <Space align="center">
                <Avatar text="AM" size="sm" />
                <span class="vp-card-demo__widget-label">{{
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

    <DemoBlock
      :title="t('example.doc.card.demo.chrome')"
      :description="t('example.doc.card.demo.chromeDesc')"
      :code="codeChrome"
    >
      <div class="vp-card-demo__grid">
        <Card hoverable :title="t('example.doc.card.sample.hover')">
          <p>{{ t('example.doc.card.sample.hoverBody') }}</p>
        </Card>
        <Card raised :title="t('example.doc.card.sample.raised')">
          <p>{{ t('example.doc.card.sample.raisedBody') }}</p>
        </Card>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.card.demo.skeleton')"
      :description="t('example.doc.card.demo.skeletonDesc')"
      :code="codeSkeleton"
    >
      <Space direction="vertical" block size="lg">
        <Button size="sm" variant="outlined" @click="skLoading = !skLoading">
          {{
            skLoading
              ? t('example.doc.card.sample.hideSkeleton')
              : t('example.doc.card.sample.showSkeleton')
          }}
        </Button>
        <section v-for="group in skeletonGroups" :key="group.titleKey" class="vp-card-demo__group">
          <h3 class="vp-card-demo__group-title">{{ t(group.titleKey) }}</h3>
          <div class="vp-card-demo__grid">
            <Card
              v-for="sk in group.items"
              :key="sk"
              :loading="skLoading"
              :skeleton="sk"
              :header="t(`example.doc.card.skeleton.${sk}`)"
            >
              <p>{{ t('example.doc.card.sample.ready') }}</p>
            </Card>
          </div>
        </section>
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

.vp-card-demo__group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-card-demo__group-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-card-demo__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--theme-section-gap);
  width: 100%;

  > * {
    flex: 1 1 calc(50% - var(--theme-section-gap) / 2);
    min-width: 0;
  }

  p {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: var(--line-height-body);
  }
}

.vp-card-demo__widget-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
