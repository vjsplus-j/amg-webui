<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Breadcrumb
 */
import { computed, ref } from 'vue'
import { Breadcrumb, BreadcrumbItem } from '@amg-webui/core'
import type { BreadcrumbItemData } from '@amg-webui/core/Breadcrumb'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const last = ref('')

const items = computed<BreadcrumbItemData[]>(() => [
  { label: t('example.doc.breadcrumb.sample.home'), href: '#', icon: 'House' },
  { label: t('example.doc.breadcrumb.sample.list'), href: '#' },
  { label: t('example.doc.breadcrumb.sample.catalog'), href: '#' },
  { label: t('example.doc.breadcrumb.sample.section'), href: '#' },
  { label: t('example.doc.breadcrumb.sample.detail') }
])

const codeBasic = demoSfc({
  imports: [`import { Breadcrumb, BreadcrumbItem } from '@amg-webui/core'`],
  template: [
    `  <Breadcrumb>`,
    `    <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.home') }}</BreadcrumbItem>`,
    `    <BreadcrumbItem href="#">{{ t('example.doc.breadcrumb.sample.list') }}</BreadcrumbItem>`,
    `    <BreadcrumbItem current>{{ t('example.doc.breadcrumb.sample.detail') }}</BreadcrumbItem>`,
    `  </Breadcrumb>`
  ]
})

const codeItems = demoSfc({
  imports: [`import { Breadcrumb } from '@amg-webui/core'`],
  template: [`  <Breadcrumb :items="items" @click="onClick" />`]
})

const codeMax = demoCode(`<Breadcrumb :items="items" :max-count="3" />`)

function onItemsClick(p: { index: number }) {
  last.value = String(p.index)
}
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.breadcrumb.demo.basic')"
      :description="t('example.doc.breadcrumb.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Breadcrumb>
        <BreadcrumbItem href="#" @click.prevent="last = 'home'">
          {{ t('example.doc.breadcrumb.sample.home') }}
        </BreadcrumbItem>
        <BreadcrumbItem href="#" @click.prevent="last = 'list'">
          {{ t('example.doc.breadcrumb.sample.list') }}
        </BreadcrumbItem>
        <BreadcrumbItem current>{{ t('example.doc.breadcrumb.sample.detail') }}</BreadcrumbItem>
      </Breadcrumb>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.breadcrumb.demo.items')"
      :description="t('example.doc.breadcrumb.demo.itemsDesc')"
      :code="codeItems"
    >
      <Breadcrumb :items="items" @click="onItemsClick" />
      <p v-if="last" class="vp-curated__hint">
        {{ t('example.doc.breadcrumb.sample.clicked', { name: last }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.breadcrumb.demo.maxCount')"
      :description="t('example.doc.breadcrumb.demo.maxCountDesc')"
      :code="codeMax"
    >
      <Breadcrumb :items="items" :max-count="3" />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: var(--spacing-md) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
