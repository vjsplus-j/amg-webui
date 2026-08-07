<script setup lang="ts">
/**
 * Curated demo — Data wave1 Pagination
 */
import { ref } from 'vue'
import { Pagination } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from '@amg-webui/demos/pagination/Basic.vue'
import basicSource from '@amg-webui/demos/pagination/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const page = ref(1)
const pageSize = ref(10)
const total = 128

const codePageSize = demoCode(
  `<Pagination`,
  `  :total="128"`,
  `  v-model:page="page"`,
  `  v-model:page-size="pageSize"`,
  `  :page-sizes="[10, 20, 50]"`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.pagination.demo.basic')"
      :description="t('example.doc.pagination.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.pagination.demo.pageSize')"
      :description="t('example.doc.pagination.demo.pageSizeDesc')"
      :code="codePageSize"
    >
      <Pagination
        :total="total"
        v-model:page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
      />
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
