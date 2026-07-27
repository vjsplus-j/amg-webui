<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 * CardWidgets full page is Wave5; this page only teasers it with complete code.
 */
import { computed, ref } from 'vue'
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
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const widgetOrder = ref(['a', 'b', 'c', 'd'])
const clickCount = ref(0)
const lastEvent = ref('')
const skLoading = ref(true)

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

const widgetsMeta = computed(() => [
  { key: 'a', title: t('example.doc.card.widgets.a') },
  { key: 'b', title: t('example.doc.card.widgets.b') },
  { key: 'c', title: t('example.doc.card.widgets.c') },
  { key: 'd', title: t('example.doc.card.widgets.d') }
])

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

function noteEvent(kind: string) {
  lastEvent.value = kind
}

function onCardClick() {
  clickCount.value += 1
  noteEvent('click')
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [
    `import { Avatar, Button, Card, Progress, Space, Tag } from '@amg-webui/components/base'`
  ],
  template: [
    '  <Card :header="t(\'example.doc.card.sample.header\')">',
    '    <p>{{ t(\'example.doc.card.sample.body\') }}</p>',
    '    <template #footer>',
    '      <Button size="sm">{{ t(\'example.doc.card.sample.ok\') }}</Button>',
    '    </template>',
    '  </Card>',
    '',
    '  <Card',
    '    :title="t(\'example.doc.card.sample.title\')"',
    '    :subtitle="t(\'example.doc.card.sample.subtitle\')"',
    '  >',
    '    <Space align="center">',
    '      <Avatar text="AM" size="sm" />',
    '      <Tag size="sm" severity="info">{{ t(\'example.doc.card.sample.tag\') }}</Tag>',
    '    </Space>',
    '    <Progress :percentage="56" />',
    '  </Card>'
  ]
})

const codeChrome = demoCode(
  `<Card hoverable :title="t('example.doc.card.sample.hover')">`,
  `  <p>{{ t('example.doc.card.sample.hoverBody') }}</p>`,
  `</Card>`,
  `<Card raised :title="t('example.doc.card.sample.raised')">`,
  `  <p>{{ t('example.doc.card.sample.raisedBody') }}</p>`,
  `</Card>`,
  `<Card :bordered="false" :title="t('example.doc.card.sample.borderless')">`,
  `  <p>{{ t('example.doc.card.sample.borderlessBody') }}</p>`,
  `</Card>`
)

const codeSkeleton = demoCode(
  `<Button size="sm" variant="outlined" @click="skLoading = !skLoading">`,
  `  {{`,
  `    skLoading`,
  `      ? t('example.doc.card.sample.hideSkeleton')`,
  `      : t('example.doc.card.sample.showSkeleton')`,
  `  }}`,
  `</Button>`,
  ``,
  `<!-- content -->`,
  `<Card :loading="skLoading" skeleton="basic" :header="t('example.doc.card.skeleton.basic')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="article" :header="t('example.doc.card.skeleton.article')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="notice" :header="t('example.doc.card.skeleton.notice')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="comment" :header="t('example.doc.card.skeleton.comment')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  ``,
  `<!-- people -->`,
  `<Card :loading="skLoading" skeleton="profile" :header="t('example.doc.card.skeleton.profile')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="list" :header="t('example.doc.card.skeleton.list')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="timeline" :header="t('example.doc.card.skeleton.timeline')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  ``,
  `<!-- data -->`,
  `<Card :loading="skLoading" skeleton="metric" :header="t('example.doc.card.skeleton.metric')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="duo" :header="t('example.doc.card.skeleton.duo')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="stats" :header="t('example.doc.card.skeleton.stats')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="chart" :header="t('example.doc.card.skeleton.chart')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="table" :header="t('example.doc.card.skeleton.table')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  ``,
  `<!-- commerce -->`,
  `<Card :loading="skLoading" skeleton="media" :header="t('example.doc.card.skeleton.media')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="product" :header="t('example.doc.card.skeleton.product')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="actions" :header="t('example.doc.card.skeleton.actions')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="form" :header="t('example.doc.card.skeleton.form')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`,
  `<Card :loading="skLoading" skeleton="toolbar" :header="t('example.doc.card.skeleton.toolbar')">`,
  `  <p>{{ t('example.doc.card.sample.ready') }}</p>`,
  `</Card>`
)

const codeWidgets = demoCode(
  `<Card :header="t('example.doc.card.sample.header')">`,
  `  <CardWidgets`,
  `    v-model="widgetOrder"`,
  `    :cols="2"`,
  `    :widgets="widgetsMeta"`,
  `  >`,
  `    <template #a>`,
  `      <Statistic`,
  `        :title="t('example.doc.card.widgets.visitors')"`,
  `        :value="1284"`,
  `        animate`,
  `      />`,
  `    </template>`,
  `    <template #b>`,
  `      <Space direction="vertical" block size="sm">`,
  `        <span>{{ t('example.doc.card.widgets.rate') }}</span>`,
  `        <Progress :percentage="72" />`,
  `      </Space>`,
  `    </template>`,
  `    <template #c>`,
  `      <Space align="center">`,
  `        <Avatar text="AM" size="sm" />`,
  `        <span>{{ t('example.doc.card.widgets.member') }}</span>`,
  `      </Space>`,
  `    </template>`,
  `    <template #d>`,
  `      <Button size="sm">{{ t('example.doc.card.widgets.action') }}</Button>`,
  `    </template>`,
  `  </CardWidgets>`,
  `</Card>`
)

const codeSlots = demoCode(
  `<Card>`,
  `  <template #header>`,
  `    <span>{{ t('example.doc.card.sample.header') }}</span>`,
  `  </template>`,
  `  <template #extra>`,
  `    <Tag size="sm" severity="info">{{ t('example.doc.card.sample.extra') }}</Tag>`,
  `  </template>`,
  `  <template #cover>`,
  `    <div class="vp-card-demo__cover">{{ t('example.doc.card.sample.cover') }}</div>`,
  `  </template>`,
  `  <p>{{ t('example.doc.card.sample.body') }}</p>`,
  `  <template #footer>`,
  `    <Button size="sm">{{ t('example.doc.card.sample.ok') }}</Button>`,
  `  </template>`,
  `</Card>`
)

const codeEvents = demoCode(
  `<Card`,
  `  hoverable`,
  `  :title="t('example.doc.card.sample.hover')"`,
  `  @click="onCardClick"`,
  `>`,
  `  <p>{{ t('example.doc.card.sample.hoverBody') }}</p>`,
  `</Card>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'header / title / subtitle',
    description: t('example.doc.card.prop.title'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'footer',
    description: t('example.doc.card.prop.footer'),
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
    type: 'CardSkeleton',
    defaultValue: "'basic'"
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.card.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'click',
    description: t('example.doc.card.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.card.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'header',
    description: t('example.doc.card.slot.header'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'extra',
    description: t('example.doc.card.slot.extra'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'cover',
    description: t('example.doc.card.slot.cover'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'footer',
    description: t('example.doc.card.slot.footer'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.card.demo.basic')"
      :description="t('example.doc.card.demo.basicDesc')"
      :code="codeBasic"
      default-open
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

    <!-- 2. Feature blocks -->
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
        <Card :bordered="false" :title="t('example.doc.card.sample.borderless')">
          <p>{{ t('example.doc.card.sample.borderlessBody') }}</p>
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

    <!-- Related teaser (full page: CardWidgets / Wave5) -->
    <DemoBlock
      :title="t('example.doc.card.demo.widgets')"
      :description="t('example.doc.card.demo.widgetsTeaserDesc')"
      :code="codeWidgets"
    >
      <Card :header="t('example.doc.card.sample.header')">
        <CardWidgets v-model="widgetOrder" :cols="2" :widgets="widgetsMeta">
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
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.card.demo.slots')"
      :description="t('example.doc.card.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Card>
        <template #header>
          <span>{{ t('example.doc.card.sample.header') }}</span>
        </template>
        <template #extra>
          <Tag size="sm" severity="info">{{ t('example.doc.card.sample.extra') }}</Tag>
        </template>
        <template #cover>
          <div class="vp-card-demo__cover">{{ t('example.doc.card.sample.cover') }}</div>
        </template>
        <p>{{ t('example.doc.card.sample.body') }}</p>
        <template #footer>
          <Button size="sm">{{ t('example.doc.card.sample.ok') }}</Button>
        </template>
      </Card>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.card.demo.events')"
      :description="t('example.doc.card.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-card-demo__events">
        <Card
          hoverable
          :title="t('example.doc.card.sample.hover')"
          @click="onCardClick"
        >
          <p>{{ t('example.doc.card.sample.hoverBody') }}</p>
        </Card>
        <p class="vp-card-demo__log">
          {{
            t('example.doc.card.sample.eventLog', {
              event: lastEvent || t('example.doc.card.sample.eventIdle'),
              count: clickCount
            })
          }}
        </p>
      </div>
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

<style scoped>
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
}

.vp-card-demo__grid > * {
  flex: 1 1 calc(50% - var(--theme-section-gap) / 2);
  min-width: 0;
}

.vp-card-demo__grid p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-card-demo__widget-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-card-demo__cover {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--height-xl);
  padding: var(--spacing-md);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-card-demo__events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-card-demo__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
