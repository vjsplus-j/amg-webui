<script setup lang="ts">
import { computed } from 'vue'
import { Timeline, TimelineItem } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeBasic = demoSfc({
  imports: [`import { Timeline, TimelineItem } from '@amg-webui/data'`],
  template: [
    `  <Timeline mode="left">`,
    `    <TimelineItem color="success" :timestamp="t('example.doc.timeline.sample.t1')">`,
    `      {{ t('example.doc.timeline.sample.c1') }}`,
    `    </TimelineItem>`,
    `    <TimelineItem color="primary" :timestamp="t('example.doc.timeline.sample.t2')">`,
    `      {{ t('example.doc.timeline.sample.c2') }}`,
    `    </TimelineItem>`,
    `  </Timeline>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t(LocaleKeys.exampleDoc.basicMountDesc))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <Timeline mode="left">
        <TimelineItem color="success" :timestamp="t('example.doc.timeline.sample.t1')">
          {{ t('example.doc.timeline.sample.c1') }}
        </TimelineItem>
        <TimelineItem color="primary" :timestamp="t('example.doc.timeline.sample.t2')">
          {{ t('example.doc.timeline.sample.c2') }}
        </TimelineItem>
      </Timeline>
    </DemoBlock>
  </div>
</template>
