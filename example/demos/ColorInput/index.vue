<script setup lang="ts">
import { ref } from 'vue'
import { ColorInput } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const color = ref('#3B82F6')
const disabledColor = ref('#10B981')
const smColor = ref('#6366F1')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { ColorInput } from '@amg-webui/form'`
  ],
  script: [`const color = ref('#3B82F6')`],
  template: [`  <ColorInput v-model="color" />`]
})

const codeDisabled = demoCode(`<ColorInput v-model="disabledColor" disabled />`)

const codeSize = demoCode(
  `<ColorInput v-model="smColor" size="sm" />`,
  `<ColorInput v-model="color" size="lg" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.colorInput.demo.basic')"
      :description="t('example.doc.colorInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <ColorInput v-model="color" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.colorInput.demo.disabled')"
      :description="t('example.doc.colorInput.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <ColorInput v-model="disabledColor" disabled />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.colorInput.demo.size')"
      :description="t('example.doc.colorInput.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <ColorInput v-model="smColor" size="sm" />
        <ColorInput v-model="color" size="lg" />
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
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
