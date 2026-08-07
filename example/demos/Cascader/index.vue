<script setup lang="ts">
/**
 * Curated demo — Form wave1 Cascader
 */
import { computed, ref } from 'vue'
import { Cascader } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { CascaderOption } from '@amg-webui/form/Cascader/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const region = ref<unknown>(['east', 'sh'])
const empty = ref<unknown>(null)

const options = computed<CascaderOption[]>(() => [
  {
    label: t('example.doc.cascader.sample.regionA'),
    value: 'east',
    children: [
      { label: t('example.doc.cascader.sample.citySh'), value: 'sh' },
      { label: t('example.doc.cascader.sample.cityHz'), value: 'hz' }
    ]
  },
  {
    label: t('example.doc.cascader.sample.regionB'),
    value: 'south',
    children: [{ label: t('example.doc.cascader.sample.cityGz'), value: 'gz' }]
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Cascader } from '@amg-webui/form'`
  ],
  script: [
    `const region = ref(['east', 'sh'])`,
    `const options = computed(() => [/* region tree */])`
  ],
  template: [
    `  <Cascader`,
    `    v-model="region"`,
    `    :options="options"`,
    `    :placeholder="t('example.doc.cascader.sample.placeholder')"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<Cascader`,
  `  v-model="empty"`,
  `  :options="options"`,
  `  :placeholder="t('example.doc.cascader.sample.placeholder')"`,
  `/>`,
  `<Cascader v-model="region" :options="options" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.cascader.demo.basic')"
      :description="t('example.doc.cascader.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Cascader
          v-model="region"
          :options="options"
          :placeholder="t('example.doc.cascader.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.cascader.demo.disabled')"
      :description="t('example.doc.cascader.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <Cascader
            v-model="empty"
            :options="options"
            :placeholder="t('example.doc.cascader.sample.placeholder')"
          />
          <Cascader v-model="region" :options="options" disabled />
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
