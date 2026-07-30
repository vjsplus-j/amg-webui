<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Tooltip
 */
import { computed } from 'vue'
import { Tooltip, Button, Space } from '@amg-webui/components/base'
import type { TooltipPlacement } from '@amg-webui/components/base/Tooltip/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const placements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right']

const codeBasic = demoSfc({
  imports: [`import { Tooltip, Button } from '@amg-webui/components/base'`],
  template: [
    `  <Tooltip :content="t('example.doc.tooltip.sample.content')">`,
    `    <Button :label="t('example.doc.tooltip.sample.trigger')" />`,
    `  </Tooltip>`
  ]
})

const codePlacement = demoCode(
  `<Tooltip placement="top" :content="t('example.doc.tooltip.sample.content')">`,
  `  <Button :label="t('example.doc.tooltip.sample.trigger')" />`,
  `</Tooltip>`,
  `<Tooltip placement="bottom" :content="t('example.doc.tooltip.sample.content')">`,
  `  <Button :label="t('example.doc.tooltip.sample.trigger')" />`,
  `</Tooltip>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'content',
    description: t('example.doc.tooltip.prop.content'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'placement',
    description: t('example.doc.tooltip.prop.placement'),
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'top'"
  },
  {
    name: 'disabled / delay',
    description: t('example.doc.tooltip.prop.disabled'),
    type: 'boolean / number',
    defaultValue: 'false / 0'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.tooltip.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'content',
    description: t('example.doc.tooltip.slot.content'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tooltip.demo.basic')"
      :description="t('example.doc.tooltip.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Tooltip :content="t('example.doc.tooltip.sample.content')">
          <Button :label="t('example.doc.tooltip.sample.trigger')" />
        </Tooltip>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tooltip.demo.placement')"
      :description="t('example.doc.tooltip.demo.placementDesc')"
      :code="codePlacement"
    >
      <div class="vp-curated__row vp-curated__row--center">
        <Space>
          <Tooltip
            v-for="pl in placements"
            :key="pl"
            :placement="pl"
            :content="t('example.doc.tooltip.sample.content')"
          >
            <Button variant="outlined" size="sm" :label="pl" />
          </Tooltip>
        </Space>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
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

  &--center {
    justify-content: center;
    padding: var(--spacing-xl) 0;
  }
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
