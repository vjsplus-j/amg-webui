<script setup lang="ts">
/**
 * Curated demo — Form wave1 Textarea
 */
import { computed, ref } from 'vue'
import { Textarea } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const notes = ref('')
const counter = ref('')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Textarea } from '@amg-webui/form'`
  ],
  script: [`const notes = ref('')`],
  template: [
    `  <Textarea`,
    `    v-model="notes"`,
    `    :rows="3"`,
    `    :placeholder="t('example.doc.textarea.sample.placeholder')"`,
    `  />`,
    `  <Textarea v-model="notes" disabled :rows="3" />`
  ]
})

const codeCounter = demoCode(
  `<Textarea`,
  `  v-model="counter"`,
  `  :maxlength="120"`,
  `  show-counter`,
  `  auto-resize`,
  `  fluid`,
  `  :placeholder="t('example.doc.textarea.sample.placeholder')"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.textarea.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'rows / cols',
    description: t('example.doc.textarea.prop.rows'),
    type: 'number',
    defaultValue: '—'
  },
  {
    name: 'autoResize / showCounter',
    description: t('example.doc.textarea.prop.autoResize'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'maxlength / disabled',
    description: t('example.doc.textarea.prop.maxlength'),
    type: 'number / boolean',
    defaultValue: '— / false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.textarea.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.textarea.demo.basic')"
      :description="t('example.doc.textarea.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <Textarea
          v-model="notes"
          :rows="3"
          fluid
          :placeholder="t('example.doc.textarea.sample.placeholder')"
        />
        <Textarea v-model="notes" disabled :rows="3" fluid />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.textarea.demo.counter')"
      :description="t('example.doc.textarea.demo.counterDesc')"
      :code="codeCounter"
    >
      <div class="vp-curated__row">
        <Textarea
          v-model="counter"
          :maxlength="120"
          show-counter
          auto-resize
          fluid
          :placeholder="t('example.doc.textarea.sample.placeholder')"
        />
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
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
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
