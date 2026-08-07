<script setup lang="ts">
/**
 * Curated demo — Form wave1 Password
 */
import { ref } from 'vue'
import { Password } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const secret = ref('')
const hidden = ref('amg-webui')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Password } from '@amg-webui/form'`
  ],
  script: [`const secret = ref('')`],
  template: [
    `  <Password`,
    `    v-model="secret"`,
    `    show-toggle`,
    `    :placeholder="t('example.doc.password.sample.placeholder')"`,
    `  />`
  ]
})

const codeToggle = demoCode(
  `<Password v-model="hidden" show-toggle />`,
  `<Password v-model="hidden" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.password.demo.basic')"
      :description="t('example.doc.password.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Password
          v-model="secret"
          show-toggle
          fluid
          :placeholder="t('example.doc.password.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.password.demo.toggle')"
      :description="t('example.doc.password.demo.toggleDesc')"
      :code="codeToggle"
    >
      <div class="vp-curated__row">
        <Space>
          <Password v-model="hidden" show-toggle />
          <Password v-model="hidden" disabled />
        </Space>
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
