<script setup lang="ts">
/**
 * Curated demo — Form wave2 WeekPicker
 */
import { computed, ref } from 'vue'
import { WeekPicker, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const week = ref<string | null>('2026-W30')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { WeekPicker } from '@amg-webui/components/base'`
  ],
  script: [`const week = ref('2026-W30')`],
  template: [`  <WeekPicker v-model="week" />`]
})

const codeDisabled = demoCode(
  `<WeekPicker v-model="empty" />`,
  `<WeekPicker v-model="week" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.weekPicker.prop.modelValue'),
    type: 'string | null (ISO week, e.g. 2026-W30)',
    defaultValue: 'null'
  },
  {
    name: 'minYear / maxYear',
    description: t('example.doc.weekPicker.prop.yearBounds'),
    type: 'number',
    defaultValue: '2000 / 2100'
  },
  {
    name: 'disabled',
    description: t('example.doc.weekPicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.weekPicker.event.change'),
    type: '(value: string | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.weekPicker.demo.basic')"
      :description="t('example.doc.weekPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <WeekPicker v-model="week" />
      </div>
      <p class="vp-curated__hint">
        {{ t('example.doc.weekPicker.sample.selected', { week: week ?? '—' }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.weekPicker.demo.disabled')"
      :description="t('example.doc.weekPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <WeekPicker v-model="empty" />
          <WeekPicker v-model="week" disabled />
        </Space>
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
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-curated__hint {
  margin: var(--spacing-sm) 0 0;
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
