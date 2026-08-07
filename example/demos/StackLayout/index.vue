<script setup lang="ts">
/**
 * Curated demo — Layout wave2 StackLayout
 */
import { ref } from 'vue'
import { StackLayout, Button, Space } from '@amg-webui/core'
import type { StackAlign, StackGap, StackJustify } from '@amg-webui/core/StackLayout'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const direction = ref<'vertical' | 'horizontal'>('vertical')
const gap = ref<StackGap>('md')
const align = ref<StackAlign>('stretch')
const justify = ref<StackJustify>('start')
const wrap = ref(false)

const codeStack = demoSfc({
  imports: [`import { StackLayout } from '@amg-webui/core'`],
  template: [
    '  <StackLayout direction="vertical" gap="md">',
    `    <div class="item">{{ t('example.doc.stackLayout.sample.a') }}</div>`,
    `    <div class="item">{{ t('example.doc.stackLayout.sample.b') }}</div>`,
    `    <div class="item">{{ t('example.doc.stackLayout.sample.c') }}</div>`,
    '  </StackLayout>'
  ]
})

const codeAlign = demoSfc({
  imports: [`import { StackLayout } from '@amg-webui/core'`],
  template: [
    '  <StackLayout direction="horizontal" gap="md" align="center" justify="space-between" wrap>',
    '    <div class="item">A</div>',
    '    <div class="item">B</div>',
    '    <div class="item">C</div>',
    '  </StackLayout>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.stackLayout.demo.basic')"
      :description="t('example.doc.stackLayout.demo.basicDesc')"
      :code="codeStack"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="direction === 'vertical' ? 'solid' : 'outlined'"
            @click="direction = 'vertical'"
          >
            vertical
          </Button>
          <Button
            size="sm"
            :variant="direction === 'horizontal' ? 'solid' : 'outlined'"
            @click="direction = 'horizontal'"
          >
            horizontal
          </Button>
          <Button
            v-for="g in (['sm', 'md', 'lg', 'section'] as const)"
            :key="g"
            size="sm"
            :variant="gap === g ? 'solid' : 'outlined'"
            @click="gap = g"
          >
            {{ g }}
          </Button>
        </Space>
        <StackLayout :direction="direction" :gap="gap" class="host">
          <div class="item">{{ t('example.doc.stackLayout.sample.a') }}</div>
          <div class="item">{{ t('example.doc.stackLayout.sample.b') }}</div>
          <div class="item">{{ t('example.doc.stackLayout.sample.c') }}</div>
        </StackLayout>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.stackLayout.demo.align')"
      :description="t('example.doc.stackLayout.demo.alignDesc')"
      :code="codeAlign"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="j in (['start', 'center', 'space-between'] as const)"
            :key="j"
            size="sm"
            :variant="justify === j ? 'solid' : 'outlined'"
            @click="justify = j"
          >
            {{ j }}
          </Button>
          <Button
            size="sm"
            :variant="wrap ? 'solid' : 'outlined'"
            @click="wrap = !wrap"
          >
            wrap
          </Button>
        </Space>
        <StackLayout
          direction="horizontal"
          gap="md"
          :align="align"
          :justify="justify"
          :wrap="wrap"
          class="host host--narrow"
        >
          <div v-for="n in 6" :key="n" class="item">
            {{ t('example.doc.stackLayout.sample.item', { n }) }}
          </div>
        </StackLayout>
      </Space>
    </DemoBlock>
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

.host--narrow {
  max-width: calc(var(--spacing-2xl) * 12);
}

.item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
