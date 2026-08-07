<script setup lang="ts">
/**
 * Curated demo — Data wave1 Transfer
 */
import { computed, ref } from 'vue'
import { Transfer } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { TransferItem } from '@amg-webui/form/Transfer'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<(string | number)[]>(['a'])
const filterSelected = ref<(string | number)[]>([])

const transferData = computed<TransferItem[]>(() => [
  { key: 'a', label: t('example.doc.transfer.sample.a') },
  { key: 'b', label: t('example.doc.transfer.sample.b') },
  { key: 'c', label: t('example.doc.transfer.sample.c') },
  { key: 'd', label: t('example.doc.transfer.sample.d') },
  { key: 'e', label: t('example.doc.transfer.sample.e') },
  { key: 'f', label: t('example.doc.transfer.sample.f') }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Transfer } from '@amg-webui/form'`
  ],
  script: [
    `const selected = ref(['a'])`,
    `const transferData = computed(() => [/* … */])`
  ],
  template: [`  <Transfer v-model="selected" :data="transferData" />`]
})

const codeFilterable = demoCode(
  `<Transfer`,
  `  v-model="filterSelected"`,
  `  :data="transferData"`,
  `  filterable`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.transfer.demo.basic')"
      :description="t('example.doc.transfer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Transfer v-model="selected" :data="transferData" />
        <p class="vp-curated__hint">
          {{ t('example.doc.transfer.sample.selected') }}:
          {{ selected.length ? selected.join(', ') : '—' }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.transfer.demo.filterable')"
      :description="t('example.doc.transfer.demo.filterableDesc')"
      :code="codeFilterable"
    >
      <Transfer v-model="filterSelected" :data="transferData" filterable />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
