<script setup lang="ts">
/**
 * Curated demo — Form wave2 ColorPicker
 */
import { computed, ref } from 'vue'
import { ColorPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const color = ref('#2563eb')
const empty = ref('')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { ColorPicker } from '@amg-webui/form'`
  ],
  script: [`const color = ref('#2563eb')`],
  template: [`  <ColorPicker v-model="color" />`]
})

const codePresets = demoCode(
  `<ColorPicker v-model="color" />`,
  `<ColorPicker v-model="empty" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.colorPicker.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'presets',
    description: t('example.doc.colorPicker.prop.presets'),
    type: 'string[]',
    defaultValue: 'theme tokens'
  },
  {
    name: 'disabled',
    description: t('example.doc.colorPicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.colorPicker.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.colorPicker.demo.basic')"
      :description="t('example.doc.colorPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <ColorPicker v-model="color" />
        <p class="vp-colorpicker-demo__hint">
          {{ t('example.doc.colorPicker.sample.selected', { color }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.colorPicker.demo.disabled')"
      :description="t('example.doc.colorPicker.demo.disabledDesc')"
      :code="codePresets"
    >
      <div class="vp-curated__row">
        <Space>
          <ColorPicker v-model="color" />
          <ColorPicker v-model="empty" disabled />
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
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-colorpicker-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
