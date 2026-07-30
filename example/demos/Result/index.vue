<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Result
 */
import { computed } from 'vue'
import { Result, Button } from '@amg-webui/components/base'
import type { ResultStatus } from '@amg-webui/components/base/Result/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const statuses: ResultStatus[] = ['success', 'warning', 'error', 'info']
const subKey: Record<ResultStatus, string> = {
  success: 'example.doc.result.sample.sub',
  warning: 'example.doc.result.sample.subWarning',
  error: 'example.doc.result.sample.subError',
  info: 'example.doc.result.sample.subInfo'
}

const codeBasic = demoSfc({
  imports: [`import { Result, Button } from '@amg-webui/components/base'`],
  template: [
    `  <Result status="success" :sub-title="t('example.doc.result.sample.sub')">`,
    `    <template #extra>`,
    `      <Button size="sm" severity="primary">{{ t('button.continue') }}</Button>`,
    `    </template>`,
    `  </Result>`
  ]
})

const codeStatus = demoCode(
  `<Result status="success" :sub-title="t('example.doc.result.sample.sub')" />`,
  `<Result status="warning" :sub-title="t('example.doc.result.sample.subWarning')" />`,
  `<Result status="error" :sub-title="t('example.doc.result.sample.subError')" />`,
  `<Result status="info" :sub-title="t('example.doc.result.sample.subInfo')" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'status',
    description: t('example.doc.result.prop.status'),
    type: "'success' | 'warning' | 'error' | 'info'",
    defaultValue: "'info'"
  },
  {
    name: 'title / subTitle',
    description: t('example.doc.result.prop.title'),
    type: 'string',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'extra-click',
    description: t('example.doc.result.event.extraClick'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'icon / title / subTitle / extra / default',
    description: t('example.doc.result.slot.extra'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.result.demo.basic')"
      :description="t('example.doc.result.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Result status="success" :sub-title="t('example.doc.result.sample.sub')">
          <template #extra>
            <Button size="sm" variant="solid" severity="primary">
              {{ t(LocaleKeys.button.continue) }}
            </Button>
          </template>
        </Result>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.result.demo.status')"
      :description="t('example.doc.result.demo.statusDesc')"
      :code="codeStatus"
    >
      <div class="vp-curated__grid">
        <Result
          v-for="st in statuses"
          :key="st"
          :status="st"
          :sub-title="t(subKey[st])"
        />
      </div>
    </DemoBlock>

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

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
  justify-content: center;
}

.vp-curated__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
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
