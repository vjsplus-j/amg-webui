<script setup lang="ts">
/**
 * Curated demo — Data wave1 Timeline
 */
import { computed, ref } from 'vue'
import { Timeline, TimelineItem, Button, Space, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import type { TimelineMode } from '@amg-webui/components/base/Timeline'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const mode = ref<TimelineMode>('left')
const pending = ref<boolean | string>(false)
const reverse = ref(false)

const codeSimple = demoSfc({
  imports: [`import { Timeline, TimelineItem } from '@amg-webui/components/base'`],
  template: [
    `  <Timeline mode="left">`,
    `    <TimelineItem color="success" :timestamp="t('example.doc.timeline.sample.t1')" :label="t('example.doc.timeline.sample.l1')">`,
    `      {{ t('example.doc.timeline.sample.c1') }}`,
    `    </TimelineItem>`,
    `    <TimelineItem color="primary" :timestamp="t('example.doc.timeline.sample.t2')">`,
    `      {{ t('example.doc.timeline.sample.c2') }}`,
    `    </TimelineItem>`,
    `  </Timeline>`
  ]
})

const codeInteractive = demoCode(
  `<Timeline :mode="mode" :pending="pending" :reverse="reverse">`,
  `  <TimelineItem`,
  `    color="success"`,
  `    :timestamp="t('example.doc.timeline.sample.t1')"`,
  `    :label="t('example.doc.timeline.sample.l1')"`,
  `  >`,
  `    {{ t('example.doc.timeline.sample.c1') }}`,
  `  </TimelineItem>`,
  `  <!-- more TimelineItem children -->`,
  `</Timeline>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'mode',
    description: t('example.doc.timeline.prop.mode'),
    type: "'left' | 'right' | 'alternate'",
    defaultValue: "'left'"
  },
  {
    name: 'pending',
    description: t('example.doc.timeline.prop.pending'),
    type: 'boolean | string',
    defaultValue: 'false'
  },
  {
    name: 'reverse',
    description: t('example.doc.timeline.prop.reverse'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.timeline.slot.default'),
    type: 'TimelineItem[]',
    defaultValue: '-'
  }
])

const itemPropRows = computed<PropRow[]>(() => [
  {
    name: 'color / hollow',
    description: t('example.doc.timeline.item.prop.color'),
    type: 'Severity | string / boolean',
    defaultValue: '—'
  },
  {
    name: 'timestamp / label',
    description: t('example.doc.timeline.item.prop.timestamp'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'side / placement',
    description: t('example.doc.timeline.item.prop.side'),
    type: "'left' | 'right' / 'top' | 'bottom'",
    defaultValue: '—'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.timeline.demo.simple')"
      :description="t('example.doc.timeline.demo.simpleDesc')"
      :code="codeSimple"
      default-open
    >
      <Timeline mode="left">
        <TimelineItem
          color="success"
          :timestamp="t('example.doc.timeline.sample.t1')"
          :label="t('example.doc.timeline.sample.l1')"
        >
          {{ t('example.doc.timeline.sample.c1') }}
        </TimelineItem>
        <TimelineItem
          color="primary"
          :timestamp="t('example.doc.timeline.sample.t2')"
          :label="t('example.doc.timeline.sample.l2')"
        >
          {{ t('example.doc.timeline.sample.c2') }}
        </TimelineItem>
        <TimelineItem color="warning" :timestamp="t('example.doc.timeline.sample.t3')">
          {{ t('example.doc.timeline.sample.c3') }}
        </TimelineItem>
      </Timeline>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.timeline.demo.interactive')"
      :description="t('example.doc.timeline.demo.interactiveDesc')"
      :code="codeInteractive"
    >
      <Space direction="vertical" block size="md">
        <div class="vp-curated__toolbar">
          <span class="vp-curated__hint">{{ t('example.doc.timeline.demo.modeLabel') }}</span>
          <Space wrap>
            <Button
              v-for="m in (['left', 'right', 'alternate'] as const)"
              :key="m"
              size="sm"
              :variant="mode === m ? 'solid' : 'outlined'"
              @click="mode = m"
            >
              {{ t(`example.doc.timeline.mode.${m}`) }}
            </Button>
          </Space>
        </div>
        <div class="vp-curated__toolbar">
          <Space wrap>
            <Button
              size="sm"
              :variant="pending ? 'solid' : 'outlined'"
              @click="pending = pending ? false : true"
            >
              {{ t('example.doc.timeline.demo.pendingToggle') }}
            </Button>
            <Button
              size="sm"
              :variant="typeof pending === 'string' ? 'solid' : 'outlined'"
              @click="
                pending =
                  typeof pending === 'string' ? true : t('example.doc.timeline.sample.pendingCustom')
              "
            >
              {{ t('example.doc.timeline.demo.pendingCustom') }}
            </Button>
            <Button
              size="sm"
              :variant="reverse ? 'solid' : 'outlined'"
              @click="reverse = !reverse"
            >
              {{ t('example.doc.timeline.demo.reverseToggle') }}
            </Button>
          </Space>
        </div>

        <Timeline :mode="mode" :pending="pending" :reverse="reverse">
          <TimelineItem
            color="success"
            :timestamp="t('example.doc.timeline.sample.t1')"
            :label="t('example.doc.timeline.sample.l1')"
          >
            {{ t('example.doc.timeline.sample.c1') }}
          </TimelineItem>
          <TimelineItem
            color="warning"
            hollow
            :timestamp="t('example.doc.timeline.sample.t2')"
            :label="t('example.doc.timeline.sample.l2')"
          >
            {{ t('example.doc.timeline.sample.c2') }}
          </TimelineItem>
          <TimelineItem color="primary" :timestamp="t('example.doc.timeline.sample.t3')">
            <template #dot>
              <Tag size="sm" severity="primary">{{ t('example.doc.timeline.sample.dot') }}</Tag>
            </template>
            {{ t('example.doc.timeline.sample.c3') }}
          </TimelineItem>
          <TimelineItem
            color="danger"
            :timestamp="t('example.doc.timeline.sample.t4')"
            side="right"
          >
            {{ t('example.doc.timeline.sample.c4') }}
          </TimelineItem>
        </Timeline>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
      <h3 class="vp-curated__api-sub">{{ t('example.doc.timeline.item.apiTitle') }}</h3>
      <PropsTable :rows="itemPropRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
