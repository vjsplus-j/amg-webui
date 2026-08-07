<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts`).
 */
import { ref, computed } from 'vue'
import { Avatar, Button, Card, Collapse, Progress, Space, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()
const open = ref('a')
const multi = ref(['a', 'b'])
const cardOpen = ref('profile')
const slotOpen = ref('a')
const eventOpen = ref('a')
const lastEvent = ref('')

const panels = computed(() => [
  {
    key: 'a',
    title: t('example.doc.collapse.sample.panelA'),
    content: t('example.doc.collapse.sample.bodyA')
  },
  {
    key: 'b',
    title: t('example.doc.collapse.sample.panelB'),
    content: t('example.doc.collapse.sample.bodyB')
  },
  {
    key: 'c',
    title: t('example.doc.collapse.sample.panelC'),
    content: t('example.doc.collapse.sample.bodyC'),
    disabled: true
  }
])

const cardPanels = computed(() => [
  { key: 'profile', title: t('example.doc.collapse.sample.cardProfile') },
  { key: 'progress', title: t('example.doc.collapse.sample.cardProgress') },
  { key: 'actions', title: t('example.doc.collapse.sample.cardActions') },
  { key: 'metric', title: t('example.doc.collapse.sample.cardMetric') }
])

const slotPanels = computed(() => [
  {
    key: 'a',
    title: t('example.doc.collapse.sample.panelA')
  },
  {
    key: 'b',
    title: t('example.doc.collapse.sample.panelB')
  }
])

function noteEvent(kind: string, detail?: string) {
  lastEvent.value = detail ? `${kind}:${detail}` : kind
}

function onChange(value: string | string[]) {
  noteEvent('change', Array.isArray(value) ? value.join(',') : value)
}

function onExpand(payload: { key: string; activeKeys: string | string[] }) {
  noteEvent('expand', payload.key)
}

function onCollapse(payload: { key: string; activeKeys: string | string[] }) {
  noteEvent('collapse', payload.key)
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Collapse } from '@amg-webui/core'`
  ],
  script: [
    `const open = ref('a')`,
    ``,
    `const panels = [`,
    `  {`,
    `    key: 'a',`,
    `    title: t('example.doc.collapse.sample.panelA'),`,
    `    content: t('example.doc.collapse.sample.bodyA')`,
    `  },`,
    `  {`,
    `    key: 'b',`,
    `    title: t('example.doc.collapse.sample.panelB'),`,
    `    content: t('example.doc.collapse.sample.bodyB')`,
    `  },`,
    `  {`,
    `    key: 'c',`,
    `    title: t('example.doc.collapse.sample.panelC'),`,
    `    content: t('example.doc.collapse.sample.bodyC'),`,
    `    disabled: true`,
    `  }`,
    `]`
  ],
  template: ['  <Collapse v-model="open" :panels="panels" />']
})

const codeGhost = demoCode(
  `<Collapse`,
  `  v-model="multi"`,
  `  ghost`,
  `  :accordion="false"`,
  `  :panels="panels.slice(0, 2)"`,
  `/>`
)

const codeCards = demoCode(
  `<Collapse v-model="cardOpen" :panels="cardPanels">`,
  `  <template #profile>`,
  `    <Card>`,
  `      <Space align="center" size="md">`,
  `        <Avatar text="VP" size="md" />`,
  `        <div>`,
  `          <strong>{{ t('example.doc.collapse.sample.userName') }}</strong>`,
  `          <span>{{ t('example.doc.collapse.sample.userRole') }}</span>`,
  `        </div>`,
  `        <Tag severity="success" size="sm">`,
  `          {{ t('example.doc.collapse.sample.online') }}`,
  `        </Tag>`,
  `      </Space>`,
  `      <template #footer>`,
  `        <Space>`,
  `          <Button size="sm" variant="outlined">`,
  `            {{ t('example.doc.collapse.sample.edit') }}`,
  `          </Button>`,
  `          <Button size="sm">`,
  `            {{ t('example.doc.collapse.sample.message') }}`,
  `          </Button>`,
  `        </Space>`,
  `      </template>`,
  `    </Card>`,
  `  </template>`,
  ``,
  `  <template #progress>`,
  `    <Card :title="t('example.doc.collapse.sample.uploadTitle')">`,
  `      <Progress :percentage="68" />`,
  `      <Progress :percentage="42" status="warning" />`,
  `      <Progress type="circle" :percentage="88" status="success" />`,
  `    </Card>`,
  `  </template>`,
  ``,
  `  <template #actions>`,
  `    <Card :header="t('example.doc.collapse.sample.quickActions')">`,
  `      <Space wrap>`,
  `        <Button size="sm" icon="Plus">`,
  `          {{ t('example.doc.collapse.sample.create') }}`,
  `        </Button>`,
  `        <Button size="sm" variant="outlined" icon="Upload">`,
  `          {{ t('example.doc.collapse.sample.import') }}`,
  `        </Button>`,
  `        <Button size="sm" variant="text" icon="Download">`,
  `          {{ t('example.doc.collapse.sample.export') }}`,
  `        </Button>`,
  `      </Space>`,
  `    </Card>`,
  `  </template>`,
  ``,
  `  <template #metric>`,
  `    <Card`,
  `      raised`,
  `      skeleton="metric"`,
  `      :loading="false"`,
  `      :title="t('example.doc.collapse.sample.metricTitle')"`,
  `    >`,
  `      <Space size="xl" wrap>`,
  `        <Avatar text="¥" size="lg" />`,
  `        <div>`,
  `          <span>128,650</span>`,
  `          <span>{{ t('example.doc.collapse.sample.metricHint') }}</span>`,
  `        </div>`,
  `        <Button size="sm" variant="outlined">`,
  `          {{ t('example.doc.collapse.sample.detail') }}`,
  `        </Button>`,
  `      </Space>`,
  `    </Card>`,
  `  </template>`,
  `</Collapse>`
)

const codeSlots = demoCode(
  `<Collapse v-model="slotOpen" :panels="slotPanels">`,
  `  <template #a>`,
  `    <p>{{ t('example.doc.collapse.sample.bodyA') }}</p>`,
  `  </template>`,
  `  <template #b>`,
  `    <p>{{ t('example.doc.collapse.sample.bodyB') }}</p>`,
  `  </template>`,
  `</Collapse>`
)

const codeEvents = demoCode(
  `<Collapse`,
  `  v-model="eventOpen"`,
  `  :panels="panels"`,
  `  @change="onChange"`,
  `  @expand="onExpand"`,
  `  @collapse="onCollapse"`,
  `/>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.collapse.demo.basic')"
      :description="t('example.doc.collapse.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Collapse v-model="open" :panels="panels" />
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.collapse.demo.ghost')"
      :description="t('example.doc.collapse.demo.ghostDesc')"
      :code="codeGhost"
    >
      <Collapse
        v-model="multi"
        ghost
        :accordion="false"
        :panels="panels.slice(0, 2)"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.collapse.demo.cards')"
      :description="t('example.doc.collapse.demo.cardsDesc')"
      :code="codeCards"
    >
      <Collapse v-model="cardOpen" :panels="cardPanels">
        <template #profile>
          <Card>
            <Space align="center" size="md">
              <Avatar text="VP" size="md" />
              <div class="vp-collapse-demo__meta">
                <strong>{{ t('example.doc.collapse.sample.userName') }}</strong>
                <span>{{ t('example.doc.collapse.sample.userRole') }}</span>
              </div>
              <Tag severity="success" size="sm">{{ t('example.doc.collapse.sample.online') }}</Tag>
            </Space>
            <template #footer>
              <Space>
                <Button size="sm" variant="outlined">{{ t('example.doc.collapse.sample.edit') }}</Button>
                <Button size="sm">{{ t('example.doc.collapse.sample.message') }}</Button>
              </Space>
            </template>
          </Card>
        </template>

        <template #progress>
          <Card :title="t('example.doc.collapse.sample.uploadTitle')">
            <Progress :percentage="68" />
            <Progress :percentage="42" status="warning" />
            <Progress type="circle" :percentage="88" status="success" />
          </Card>
        </template>

        <template #actions>
          <Card :header="t('example.doc.collapse.sample.quickActions')">
            <Space wrap>
              <Button size="sm" icon="Plus">{{ t('example.doc.collapse.sample.create') }}</Button>
              <Button size="sm" variant="outlined" icon="Upload">
                {{ t('example.doc.collapse.sample.import') }}
              </Button>
              <Button size="sm" variant="text" icon="Download">
                {{ t('example.doc.collapse.sample.export') }}
              </Button>
            </Space>
          </Card>
        </template>

        <template #metric>
          <Card
            raised
            skeleton="metric"
            :loading="false"
            :title="t('example.doc.collapse.sample.metricTitle')"
          >
            <Space size="xl" wrap>
              <Avatar text="¥" size="lg" />
              <div class="vp-collapse-demo__metric">
                <span class="vp-collapse-demo__value">128,650</span>
                <span>{{ t('example.doc.collapse.sample.metricHint') }}</span>
              </div>
              <Button size="sm" variant="outlined">{{ t('example.doc.collapse.sample.detail') }}</Button>
            </Space>
          </Card>
        </template>
      </Collapse>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.collapse.demo.slots')"
      :description="t('example.doc.collapse.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Collapse v-model="slotOpen" :panels="slotPanels">
        <template #a>
          <p class="vp-collapse-demo__slot-body">{{ t('example.doc.collapse.sample.bodyA') }}</p>
        </template>
        <template #b>
          <p class="vp-collapse-demo__slot-body">{{ t('example.doc.collapse.sample.bodyB') }}</p>
        </template>
      </Collapse>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.collapse.demo.events')"
      :description="t('example.doc.collapse.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-collapse-demo__events">
        <Collapse
          v-model="eventOpen"
          :panels="panels"
          @change="onChange"
          @expand="onExpand"
          @collapse="onCollapse"
        />
        <p class="vp-collapse-demo__log">
          {{
            t('example.doc.collapse.sample.eventLog', {
              event: lastEvent || t('example.doc.collapse.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. API: Props → Events → Slots -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-collapse-demo__meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
  flex: 1 1 auto;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-collapse-demo__meta strong {
  color: var(--text-primary);
  font-weight: var(--font-weight-heading, 600);
}

.vp-collapse-demo__metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-collapse-demo__value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.vp-collapse-demo__slot-body {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-collapse-demo__events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-collapse-demo__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
