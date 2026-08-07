<script setup lang="ts">
/**
 * Curated demo — Form wave1 Textarea
 */
import { ref } from 'vue'
import { Textarea } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
</style>
