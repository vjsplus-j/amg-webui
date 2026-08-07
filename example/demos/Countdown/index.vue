<script setup lang="ts">
/**
 * Curated demo — Display wave2 Countdown
 */
import { computed, ref } from 'vue'
import { Countdown, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const target = ref(Date.now() + 90_000)
const finished = ref(false)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Countdown } from '@amg-webui/core'`
  ],
  script: [`const target = ref(Date.now() + 90_000)`],
  template: [`  <Countdown :value="target" @finish="onFinish" />`]
})

const codeFormat = demoCode(
  `<Countdown :value="target" format="mm:ss" />`,
  `<Button size="sm" @click="reset">{{ t('example.doc.countdown.demo.reset') }}</Button>`
)

function onFinish() {
  finished.value = true
}

function reset() {
  finished.value = false
  target.value = Date.now() + 90_000
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'value',
    description: t('example.doc.countdown.prop.value'),
    type: 'number | Date',
    defaultValue: '—'
  },
  {
    name: 'format',
    description: t('example.doc.countdown.prop.format'),
    type: 'string',
    defaultValue: "'HH:mm:ss'"
  },
  {
    name: 'millisecond',
    description: t('example.doc.countdown.prop.millisecond'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'finish / tick',
    description: t('example.doc.countdown.event.finish'),
    type: '() => void / (remainingMs: number) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.countdown.demo.basic')"
      :description="t('example.doc.countdown.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="sm">
        <Countdown :value="target" @finish="onFinish" />
        <p v-if="finished" class="vp-countdown-demo__hint">
          {{ t('example.doc.countdown.sample.finished') }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.countdown.demo.format')"
      :description="t('example.doc.countdown.demo.formatDesc')"
      :code="codeFormat"
    >
      <Space align="center">
        <Countdown :value="target" format="mm:ss" />
        <Button size="sm" variant="outlined" @click="reset">
          {{ t('example.doc.countdown.demo.reset') }}
        </Button>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-countdown-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
