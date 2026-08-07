<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Breadcrumb
 */
import { computed, ref } from 'vue'
import { Breadcrumb, BreadcrumbItem } from '@amg-webui/core'
import type { BreadcrumbItemData } from '@amg-webui/core/Breadcrumb'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'items',
    description: t('example.doc.breadcrumb.prop.items'),
    type: 'BreadcrumbItemData[]',
    defaultValue: '—'
  },
  {
    name: 'separator',
    description: t('example.doc.breadcrumb.prop.separator'),
    type: 'string',
    defaultValue: "'/'"
  },
  {
    name: 'maxCount',
    description: t('example.doc.breadcrumb.prop.maxCount'),
    type: 'number',
    defaultValue: '—'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.breadcrumb.prop.ariaLabel'),
    type: 'string',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'click',
    description: t('example.doc.breadcrumb.event.click'),
    type: '({ index, href, to, event }) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default / separator',
    description: t('example.doc.breadcrumb.slot.default'),
    type: 'BreadcrumbItem | VNode',
    defaultValue: '-'
  }
])

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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
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

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
