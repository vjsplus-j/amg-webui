<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { onUnmounted, ref } from 'vue'
import { Button, Progress, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()

const live = ref(36)
const lastEvent = ref('')
let timer: ReturnType<typeof setInterval> | 0 = 0

function startLive() {
  if (timer) return
  timer = setInterval(() => {
    live.value = live.value >= 100 ? 0 : live.value + 8
  }, 600)
}

function stopLive() {
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
}

function noteChange(pct: number) {
  lastEvent.value = t('example.doc.progress.sample.changeLog', { pct })
}

function noteFinish() {
  lastEvent.value = t('example.doc.progress.sample.finishLog')
}

onUnmounted(stopLive)

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Progress } from '@amg-webui/core'`],
  template: [
    `  <Progress :percentage="20" />`,
    `  <Progress :percentage="45" />`,
    `  <Progress :percentage="70" />`,
    `  <Progress :percentage="100" status="success" />`
  ]
})

const codeStatus = demoCode(
  `<Progress :percentage="100" status="success" />`,
  `<Progress :percentage="62" status="warning" />`,
  `<Progress :percentage="28" status="danger" />`,
  `<Progress :percentage="48" status="normal" />`
)

const codeCircle = demoCode(
  `<Progress type="circle" :percentage="25" />`,
  `<Progress type="circle" :percentage="55" />`,
  `<Progress type="circle" :percentage="75" status="warning" />`,
  `<Progress type="circle" :percentage="100" status="success" />`
)

const codeStroke = demoCode(
  `<Progress :percentage="50" :stroke-width="1" />`,
  `<Progress :percentage="50" :stroke-width="2" />`,
  `<Progress :percentage="50" :stroke-width="3" />`,
  `<Progress :percentage="68" :show-text="false" />`
)

const codeLive = demoCode(
  `<Button size="sm" @click="startLive">`,
  `  {{ t('example.doc.progress.sample.start') }}`,
  `</Button>`,
  `<Button size="sm" variant="outlined" @click="stopLive">`,
  `  {{ t('example.doc.progress.sample.stop') }}`,
  `</Button>`,
  `<Progress :percentage="live" />`,
  `<Progress type="circle" :percentage="live" />`
)

const codeEvents = demoCode(
  `<Progress`,
  `  :percentage="live"`,
  `  @change="onChange"`,
  `  @finish="onFinish"`,
  `/>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic -->
    <DemoBlock
      :title="t('example.doc.progress.demo.basic')"
      :description="t('example.doc.progress.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-progress-stack">
        <Progress :percentage="20" />
        <Progress :percentage="45" />
        <Progress :percentage="70" />
        <Progress :percentage="100" status="success" />
      </div>
    </DemoBlock>

    <!-- 2. Features -->
    <DemoBlock
      :title="t('example.doc.progress.demo.status')"
      :description="t('example.doc.progress.demo.statusDesc')"
      :code="codeStatus"
    >
      <div class="vp-progress-stack">
        <Progress :percentage="100" status="success" />
        <Progress :percentage="62" status="warning" />
        <Progress :percentage="28" status="danger" />
        <Progress :percentage="48" status="normal" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.progress.demo.circle')"
      :description="t('example.doc.progress.demo.circleDesc')"
      :code="codeCircle"
    >
      <Space size="xl" wrap align="center">
        <Progress type="circle" :percentage="25" />
        <Progress type="circle" :percentage="55" />
        <Progress type="circle" :percentage="75" status="warning" />
        <Progress type="circle" :percentage="100" status="success" />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.progress.demo.stroke')"
      :description="t('example.doc.progress.demo.strokeDesc')"
      :code="codeStroke"
    >
      <div class="vp-progress-stack">
        <Progress :percentage="50" :stroke-width="1" />
        <Progress :percentage="50" :stroke-width="2" />
        <Progress :percentage="50" :stroke-width="3" />
        <Progress :percentage="68" :show-text="false" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.progress.demo.live')"
      :description="t('example.doc.progress.demo.liveDesc')"
      :code="codeLive"
    >
      <div class="vp-progress-stack">
        <Space>
          <Button size="sm" @click="startLive">{{ t('example.doc.progress.sample.start') }}</Button>
          <Button size="sm" variant="outlined" @click="stopLive">
            {{ t('example.doc.progress.sample.stop') }}
          </Button>
        </Space>
        <Progress :percentage="live" />
        <Space size="xl" wrap align="center">
          <Progress type="circle" :percentage="live" />
        </Space>
      </div>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.progress.demo.events')"
      :description="t('example.doc.progress.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-progress-events">
        <Space>
          <Button size="sm" @click="startLive">{{ t('example.doc.progress.sample.start') }}</Button>
          <Button size="sm" variant="outlined" @click="stopLive">
            {{ t('example.doc.progress.sample.stop') }}
          </Button>
        </Space>
        <Progress
          :percentage="live"
          @change="noteChange"
          @finish="noteFinish"
        />
        <p class="vp-progress-events__log">
          {{ lastEvent || t('example.doc.progress.sample.eventIdle') }}
        </p>
      </div>
    </DemoBlock>

    <!-- 7. API -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-progress-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 100%;
}

.vp-progress-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-progress-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
