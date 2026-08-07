<script setup lang="ts">
import { ref, computed } from 'vue'
import { DetailPanel } from '@amg-webui/data'
import { Button, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const loading = ref(false)

const sections = computed(() => [
  {
    id: 'basic',
    title: t('example.doc.detailPanel.sample.sectionBasic'),
    fields: [
      { key: 'name', label: t('example.doc.detailPanel.sample.name'), value: 'Ada Lovelace' },
      { key: 'email', label: t('example.doc.detailPanel.sample.email'), value: 'ada@example.com', span: 2 }
    ]
  },
  {
    id: 'meta',
    title: t('example.doc.detailPanel.sample.sectionMeta'),
    collapsed: true,
    fields: [
      { key: 'role', label: t('example.doc.detailPanel.sample.role'), value: 'admin' },
      { key: 'status', label: t('example.doc.detailPanel.sample.status'), value: 'active' }
    ]
  }
])

const codeBasic = demoSfc({
  imports: [`import { DetailPanel } from '@amg-webui/data'`],
  template: [
    '  <DetailPanel :title="title" :sections="sections">',
    '    <template #extra><Tag label="Live" severity="success" size="sm" /></template>',
    '    <template #footer><Button size="sm">{{ t(\'button.edit\') }}</Button></template>',
    '  </DetailPanel>'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.detailPanel.when') }}</p>

    <DemoBlock
      :title="t('example.doc.detailPanel.demo.tabs')"
      :description="t('example.doc.detailPanel.demo.tabsDesc')"
      :code="codeBasic"
    >
      <DetailPanel
        :title="t('example.doc.detailPanel.sample.title')"
        layout="tabs"
        :sections="sections"
      >
        <template #extra>
          <Tag :label="t('example.doc.detailPanel.sample.live')" severity="success" size="sm" />
        </template>
        <template #footer>
          <Button size="sm" variant="outlined" :label="t('button.edit')" />
        </template>
      </DetailPanel>
    </DemoBlock>

    <DemoBlock :title="t('example.doc.detailPanel.demo.stack')" :description="t('example.doc.detailPanel.demo.stackDesc')">
      <DetailPanel layout="stack" collapsible :sections="sections" />
    </DemoBlock>

    <DemoBlock :title="t('example.doc.detailPanel.demo.states')" :description="t('example.doc.detailPanel.demo.statesDesc')">
      <div class="vp-curated__stack">
        <Button size="sm" variant="outlined" :label="t('example.doc.detailPanel.sample.toggleLoading')" @click="loading = !loading" />
        <DetailPanel v-if="loading" loading />
        <DetailPanel v-else empty />
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}
</style>
