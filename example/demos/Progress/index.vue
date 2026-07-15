<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { Button, Progress, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const live = ref(36)
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

onUnmounted(stopLive)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'percentage',
    description: t('example.doc.progress.prop.percentage'),
    type: 'number',
    defaultValue: '-'
  },
  {
    name: 'type',
    description: t('example.doc.progress.prop.type'),
    type: "'line' | 'circle'",
    defaultValue: "'line'"
  },
  {
    name: 'status',
    description: t('example.doc.progress.prop.status'),
    type: "'normal' | 'success' | 'warning' | 'danger'",
    defaultValue: "'normal'"
  },
  {
    name: 'showText',
    description: t('example.doc.progress.prop.showText'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'strokeWidth',
    description: t('example.doc.progress.prop.strokeWidth'),
    type: 'number | string',
    defaultValue: '-'
  },
  {
    name: '@change',
    description: t('example.doc.progress.emit.change'),
    type: '(percentage: number) => void',
    defaultValue: '-'
  },
  {
    name: '@finish',
    description: t('example.doc.progress.emit.finish'),
    type: '() => void',
    defaultValue: '-'
  }
])

const codeBasic = `<Progress :percentage="40" />
<Progress :percentage="70" />
<Progress :percentage="100" status="success" />`

const codeStatus = `<Progress :percentage="100" status="success" />
<Progress :percentage="60" status="warning" />
<Progress :percentage="30" status="danger" />`

const codeCircle = `<Progress type="circle" :percentage="75" />
<Progress type="circle" :percentage="100" status="success" />`

const codeStroke = `<Progress :percentage="50" :stroke-width="1" />
<Progress :percentage="50" :stroke-width="3" />
<Progress :percentage="50" :show-text="false" />`

const codeLive = `<Progress :percentage="live" />`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.progress.demo.basic')"
      :description="t('example.doc.progress.demo.basicDesc')"
      :code="codeBasic"
    >
      <div class="vp-progress-stack">
        <Progress :percentage="20" />
        <Progress :percentage="45" />
        <Progress :percentage="70" />
        <Progress :percentage="100" status="success" />
      </div>
    </DemoBlock>

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

.vp-progress-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 100%;
}
</style>
