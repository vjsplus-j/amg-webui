<script setup lang="ts">
/**
 * Curated demo — Layout wave2 Scrollbar
 */
import { computed } from 'vue'
import { Scrollbar } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const lines = Array.from({ length: 24 }, (_, i) => i + 1)
const wideItems = Array.from({ length: 12 }, (_, i) => i + 1)

const codeBasic = demoSfc({
  imports: [`import { Scrollbar } from '@amg-webui/components/base'`],
  template: [
    '  <Scrollbar :max-height="40">',
    `    <p v-for="n in 24" :key="n">{{ t('example.doc.scrollbar.sample.line', { n }) }}</p>`,
    '  </Scrollbar>'
  ]
})

const codeNative = demoCode(
  `<Scrollbar native :max-height="40">`,
  `  <p v-for="n in 24" :key="n">{{ t('example.doc.scrollbar.sample.line', { n }) }}</p>`,
  `</Scrollbar>`,
  `<Scrollbar :max-height="40" class="horizontal">`,
  `  <div class="row">`,
  `    <span v-for="n in 12" :key="n">{{ t('example.doc.scrollbar.sample.chip', { n }) }}</span>`,
  `  </div>`,
  `</Scrollbar>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'height / maxHeight',
    type: 'string | number',
    defaultValue: '-',
    description: t('example.doc.scrollbar.prop.height')
  },
  {
    name: 'native',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.scrollbar.prop.native')
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'scroll',
    description: t('example.doc.scrollbar.event.scroll'),
    type: '(event: Event) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.scrollbar.demo.basic')"
      :description="t('example.doc.scrollbar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Scrollbar :max-height="40" class="vp-scrollbar-demo">
        <p v-for="n in lines" :key="n" class="vp-scrollbar-demo__line">
          {{ t('example.doc.scrollbar.sample.line', { n }) }}
        </p>
      </Scrollbar>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.scrollbar.demo.native')"
      :description="t('example.doc.scrollbar.demo.nativeDesc')"
      :code="codeNative"
    >
      <div class="vp-scrollbar-demo__stack">
        <Scrollbar native :max-height="40" class="vp-scrollbar-demo">
          <p v-for="n in lines" :key="`n-${n}`" class="vp-scrollbar-demo__line">
            {{ t('example.doc.scrollbar.sample.line', { n }) }}
          </p>
        </Scrollbar>
        <Scrollbar :max-height="40" class="vp-scrollbar-demo vp-scrollbar-demo--horizontal">
          <div class="vp-scrollbar-demo__row">
            <span v-for="n in wideItems" :key="`h-${n}`" class="vp-scrollbar-demo__chip">
              {{ t('example.doc.scrollbar.sample.chip', { n }) }}
            </span>
          </div>
        </Scrollbar>
      </div>
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
.vp-scrollbar-demo {
  width: 100%;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-md);
  background: var(--surface-1);
  box-sizing: border-box;
}

.vp-scrollbar-demo--horizontal {
  overflow-x: auto;
}

.vp-scrollbar-demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-scrollbar-demo__line {
  margin: 0;
  padding: var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-scrollbar-demo__row {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--spacing-md);
  width: max-content;
  min-width: 100%;
}

.vp-scrollbar-demo__chip {
  flex: 0 0 auto;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
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
