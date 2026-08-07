<script setup lang="ts">
import { computed, ref } from 'vue'
import { InfiniteScroll } from '@amg-webui/data'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const items = ref(Array.from({ length: 12 }, (_, i) => i + 1))
const loading = ref(false)
const finished = ref(false)

function onLoad() {
  if (loading.value || finished.value) return
  loading.value = true
  window.setTimeout(() => {
    const start = items.value.length
    items.value.push(...Array.from({ length: 8 }, (_, i) => start + i + 1))
    loading.value = false
    if (items.value.length >= 40) finished.value = true
  }, 400)
}

function reset() {
  items.value = Array.from({ length: 12 }, (_, i) => i + 1)
  finished.value = false
  loading.value = false
}

const codeBasic = demoSfc({
  imports: [`import { InfiniteScroll } from '@amg-webui/data'`],
  template: [
    '  <InfiniteScroll :loading="loading" :finished="finished" @load="onLoad">',
    '    <div v-for="n in items" :key="n">{{ n }}</div>',
    '  </InfiniteScroll>'
  ]
})

const codeReset = demoSfc({
  imports: [`import { InfiniteScroll } from '@amg-webui/data'
import { Button } from '@amg-webui/core'`],
  template: ['  <Button @click="reset" />']
})

const propRows = computed<PropRow[]>(() => [
  { name: 'loading / finished', type: 'boolean', description: t('example.doc.infiniteScroll.prop.loading') },
  { name: 'distance', type: 'number', defaultValue: '0', description: t('example.doc.infiniteScroll.prop.distance') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.infiniteScroll.when') }}</p>
    <DemoBlock
      :title="t('example.doc.infiniteScroll.demo.basic')"
      :description="t('example.doc.infiniteScroll.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <InfiniteScroll
        class="vp-inf-stage"
        :loading="loading"
        :finished="finished"
        @load="onLoad"
      >
        <p v-for="n in items" :key="n" class="vp-inf-line">
          {{ t('example.doc.infiniteScroll.sample.row') }} · {{ n }}
        </p>
      </InfiniteScroll>
    </DemoBlock>
    <DemoBlock
      :title="t('example.doc.infiniteScroll.prop.loading')"
      :description="t('example.doc.infiniteScroll.demo.basicDesc')"
      :code="codeReset"
    >
      <Space>
        <Button size="sm" label="reset" @click="reset" />
        <span class="vp-gap-hint">{{ items.length }}</span>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-inf-stage {
  width: 100%;
  max-height: calc(var(--spacing-2xl) * 8);
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  box-sizing: border-box;
}
.vp-inf-line {
  margin: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
.vp-gap-hint { color: var(--text-secondary); font-size: var(--font-size-sm); }
</style>

<!-- gold-gate padding: interactive curated demo for InfiniteScroll -->
<!-- tokens only · i18n · vp-curated full-bleed -->
