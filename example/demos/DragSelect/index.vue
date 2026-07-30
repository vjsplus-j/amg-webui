<script setup lang="ts">
/**
 * Curated demo — Form wave2 DragSelect
 */
import { computed, ref } from 'vue'
import { DragSelect } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const selected = ref<(string | number)[]>(['b'])
const compact = ref<(string | number)[]>(['x'])

const options = computed(() => [
  { id: 'a', label: t('example.doc.dragSelect.sample.optionA') },
  { id: 'b', label: t('example.doc.dragSelect.sample.optionB') },
  { id: 'c', label: t('example.doc.dragSelect.sample.optionC'), disabled: true },
  { id: 'd', label: t('example.doc.dragSelect.sample.optionD') }
])

const compactOptions = computed(() => [
  { id: 'x', label: t('example.doc.dragSelect.sample.optionA') },
  { id: 'y', label: t('example.doc.dragSelect.sample.optionB') },
  { id: 'z', label: t('example.doc.dragSelect.sample.optionD') }
])

const orderLabel = computed(() =>
  selected.value.length
    ? selected.value.join(' → ')
    : t('example.doc.dragSelect.sample.empty')
)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { DragSelect } from '@amg-webui/components/base'`
  ],
  script: [
    `const selected = ref(['b'])`,
    `const options = [/* … */]`
  ],
  template: [`  <DragSelect v-model="selected" :options="options" clearable />`]
})

const codeReorder = demoCode(
  `<DragSelect v-model="compact" :options="compactOptions" :clearable="false" />`,
  `<p>{{ t('example.doc.dragSelect.sample.order', { order: compact.join(' → ') }) }}</p>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.dragSelect.prop.modelValue'),
    type: '(string | number)[]',
    defaultValue: '[]'
  },
  {
    name: 'options',
    description: t('example.doc.dragSelect.prop.options'),
    type: 'DragSelectItem[]',
    defaultValue: '[]'
  },
  {
    name: 'clearable',
    description: t('example.doc.dragSelect.prop.clearable'),
    type: 'boolean',
    defaultValue: 'true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change / reorder / clear',
    description: t('example.doc.dragSelect.event.change'),
    type: '—',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.dragSelect.demo.basic')"
      :description="t('example.doc.dragSelect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <DragSelect v-model="selected" :options="options" clearable />
        <p class="vp-curated__hint">
          {{ t('example.doc.dragSelect.sample.order', { order: orderLabel }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dragSelect.demo.reorder')"
      :description="t('example.doc.dragSelect.demo.reorderDesc')"
      :code="codeReorder"
    >
      <div class="vp-curated__stack">
        <DragSelect v-model="compact" :options="compactOptions" :clearable="false" />
        <p class="vp-curated__hint">{{ t('example.doc.dragSelect.sample.reorderHint') }}</p>
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
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
