<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Tooltip
 */
import {  } from 'vue'
import { Tooltip, Button, Space } from '@amg-webui/core'
import type { TooltipPlacement } from '@amg-webui/core/Tooltip/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const placements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right']

const codeBasic = demoSfc({
  imports: [`import { Tooltip, Button } from '@amg-webui/core'`],
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
</style>
