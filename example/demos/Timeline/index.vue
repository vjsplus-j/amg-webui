<script setup lang="ts">
/**
 * Curated demo — Data wave1 Timeline
 */
import { ref } from 'vue'
import { Timeline, TimelineItem } from '@amg-webui/data'
import { Button, Space, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { TimelineMode } from '@amg-webui/data/Timeline'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const mode = ref<TimelineMode>('left')
const pending = ref<boolean | string>(false)
const reverse = ref(false)

const codeSimple = demoSfc({
  imports: [`import { Timeline, TimelineItem } from '@amg-webui/data'`],
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
</style>
