<script setup lang="ts">
/**
 * Curated demo — Form wave2 ColorPicker
 */
import { ref } from 'vue'
import { ColorPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
</style>
