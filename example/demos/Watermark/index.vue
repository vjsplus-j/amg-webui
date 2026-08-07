<script setup lang="ts">
/**
 * Curated demo — Display wave2 Watermark
 */
import { ref } from 'vue'
import { Watermark } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const opacity = ref(0.15)

const codeBasic = demoSfc({
  imports: [`import { Watermark } from '@amg-webui/core'`],
  template: [
    `  <Watermark :content="t('example.doc.watermark.sample.text')">`,
    `    <div class="panel">{{ t('example.doc.watermark.sample.body') }}</div>`,
    `  </Watermark>`
  ]
})

const codeOpacity = demoCode(
  `<Watermark`,
  `  :content="t('example.doc.watermark.sample.text')"`,
  `  :opacity="opacity"`,
  `  :gap="[48, 48]"`,
  `>`,
  `  <div>{{ t('example.doc.watermark.sample.body') }}</div>`,
  `</Watermark>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.watermark.demo.basic')"
      :description="t('example.doc.watermark.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Watermark :content="t('example.doc.watermark.sample.text')">
        <div class="vp-watermark-demo__panel">
          {{ t('example.doc.watermark.sample.body') }}
        </div>
      </Watermark>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.watermark.demo.opacity')"
      :description="t('example.doc.watermark.demo.opacityDesc')"
      :code="codeOpacity"
    >
      <div class="vp-watermark-demo__controls">
        <label class="vp-watermark-demo__label">
          <span>{{ t('example.doc.watermark.sample.opacityLabel') }}</span>
          <input
            v-model.number="opacity"
            type="range"
            min="0.05"
            max="0.4"
            step="0.05"
            class="vp-watermark-demo__range"
          />
        </label>
        <Watermark
          :content="t('example.doc.watermark.sample.text')"
          :opacity="opacity"
          :gap="[48, 48]"
        >
          <div class="vp-watermark-demo__panel">
            {{ t('example.doc.watermark.sample.body') }}
          </div>
        </Watermark>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-watermark-demo__panel {
  min-height: calc(var(--spacing-2xl) * 4);
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-watermark-demo__controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-watermark-demo__label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-watermark-demo__range {
  width: 100%;
  max-width: 100%;
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
