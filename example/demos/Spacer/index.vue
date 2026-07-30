<script setup lang="ts">
/**
 * Curated demo — Layout wave2 Spacer
 */
import { computed, ref } from 'vue'
import { Spacer, Button, Space } from '@amg-webui/components/base'
import type { SpacerSize } from '@amg-webui/components/base/Spacer'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const flex = ref(true)
const size = ref<SpacerSize>('xl')

const codeFlex = demoSfc({
  imports: [`import { Spacer, Button } from '@amg-webui/components/base'`],
  template: [
    '  <div class="row">',
    `    <Button size="sm">{{ t('example.doc.spacer.sample.left') }}</Button>`,
    '    <Spacer :flex="true" />',
    `    <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.right') }}</Button>`,
    '  </div>'
  ]
})

const codeFixed = demoCode(
  `<div class="col">`,
  `  <Button size="sm">{{ t('example.doc.spacer.sample.top') }}</Button>`,
  `  <Spacer axis="vertical" size="lg" :flex="false" />`,
  `  <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.bottom') }}</Button>`,
  `</div>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'flex / grow / shrink',
    description: t('example.doc.spacer.prop.flex'),
    type: 'boolean / number',
    defaultValue: 'true / 1 / 1'
  },
  {
    name: 'size / axis / minSize',
    description: t('example.doc.spacer.prop.size'),
    type: 'spacing token / horizontal|vertical|both',
    defaultValue: '— / horizontal'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.spacer.demo.flex')"
      :description="t('example.doc.spacer.demo.flexDesc')"
      :code="codeFlex"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Button size="sm" variant="outlined" @click="flex = !flex">
          {{ flex ? t('example.doc.spacer.sample.flexOn') : t('example.doc.spacer.sample.flexOff') }}
        </Button>
        <div class="row">
          <Button size="sm">{{ t('example.doc.spacer.sample.left') }}</Button>
          <Spacer :flex="flex" :size="flex ? undefined : size" />
          <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.right') }}</Button>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spacer.demo.fixed')"
      :description="t('example.doc.spacer.demo.fixedDesc')"
      :code="codeFixed"
    >
      <Space wrap>
        <Button
          v-for="s in (['sm', 'md', 'lg', 'xl'] as const)"
          :key="s"
          size="sm"
          :variant="size === s ? 'solid' : 'outlined'"
          @click="size = s"
        >
          {{ s }}
        </Button>
      </Space>
      <div class="col">
        <Button size="sm">{{ t('example.doc.spacer.sample.top') }}</Button>
        <Spacer axis="vertical" :size="size" :flex="false" />
        <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.bottom') }}</Button>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: calc(var(--spacing-2xl) * 8);
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
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
