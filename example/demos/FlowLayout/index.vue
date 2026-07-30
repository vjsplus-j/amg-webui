<script setup lang="ts">
/**
 * Curated demo — Layout wave2 FlowLayout
 */
import { computed, ref } from 'vue'
import { FlowLayout, Button, Space, Tag } from '@amg-webui/components/base'
import type { FlowAlign, FlowGap, FlowJustify } from '@amg-webui/components/base/FlowLayout'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const gap = ref<FlowGap>('md')
const justify = ref<FlowJustify>('start')
const align = ref<FlowAlign>('center')
const chipCount = ref(12)

const chips = computed(() =>
  Array.from({ length: chipCount.value }, (_, i) =>
    t('example.doc.flowLayout.sample.chip', { n: i + 1 })
  )
)

const codeWrap = demoSfc({
  imports: [`import { FlowLayout, Tag } from '@amg-webui/components/base'`],
  template: [
    '  <FlowLayout gap="md" class="host">',
    '    <Tag v-for="n in 8" :key="n" :label="`Tag ${n}`" />',
    '  </FlowLayout>'
  ]
})

const codeAlign = demoSfc({
  imports: [`import { FlowLayout } from '@amg-webui/components/base'`],
  template: [
    '  <FlowLayout gap="lg" justify="space-between" align="center" class="host">',
    '    <div class="item">A</div>',
    '    <div class="item">B</div>',
    '    <div class="item">C</div>',
    '  </FlowLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'gap / rowGap / columnGap',
    description: t('example.doc.flowLayout.prop.gap'),
    type: 'spacing token',
    defaultValue: "'md'"
  },
  {
    name: 'align / justify',
    description: t('example.doc.flowLayout.prop.align'),
    type: 'flex align / justify',
    defaultValue: "'start'"
  },
  {
    name: 'reverse',
    description: t('example.doc.flowLayout.prop.reverse'),
    type: 'boolean',
    defaultValue: 'false'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.flowLayout.demo.wrap')"
      :description="t('example.doc.flowLayout.demo.wrapDesc')"
      :code="codeWrap"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="g in (['sm', 'md', 'lg', 'section'] as const)"
            :key="g"
            size="sm"
            :variant="gap === g ? 'solid' : 'outlined'"
            @click="gap = g"
          >
            {{ g }}
          </Button>
          <Button size="sm" variant="outlined" @click="chipCount = Math.max(4, chipCount - 2)">−</Button>
          <Button size="sm" variant="outlined" @click="chipCount += 2">+</Button>
        </Space>
        <FlowLayout :gap="gap" class="host">
          <Tag v-for="(label, i) in chips" :key="i" size="sm" :label="label" />
        </FlowLayout>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.flowLayout.demo.align')"
      :description="t('example.doc.flowLayout.demo.alignDesc')"
      :code="codeAlign"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="j in (['start', 'center', 'space-between', 'space-around'] as const)"
            :key="j"
            size="sm"
            :variant="justify === j ? 'solid' : 'outlined'"
            @click="justify = j"
          >
            {{ j }}
          </Button>
        </Space>
        <Space wrap>
          <Button
            v-for="a in (['start', 'center', 'end', 'stretch'] as const)"
            :key="a"
            size="sm"
            :variant="align === a ? 'solid' : 'outlined'"
            @click="align = a"
          >
            {{ a }}
          </Button>
        </Space>
        <FlowLayout :gap="'lg'" :justify="justify" :align="align" class="host host--tall">
          <div class="item">{{ t('example.doc.flowLayout.sample.a') }}</div>
          <div class="item item--tall">{{ t('example.doc.flowLayout.sample.b') }}</div>
          <div class="item">{{ t('example.doc.flowLayout.sample.c') }}</div>
        </FlowLayout>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.host {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.host--tall {
  min-height: calc(var(--spacing-2xl) * 4);
}

.item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.item--tall {
  padding-block: var(--spacing-xl);
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
