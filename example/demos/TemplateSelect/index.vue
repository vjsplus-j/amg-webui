<script setup lang="ts">
import { ref, computed } from 'vue'
import { TemplateSelect } from '@amg-webui/lowcode'
import { StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const selected = ref<string | null>('tpl-a')
const applied = ref('')

const templates = computed(() => [
  {
    id: 'tpl-a',
    name: t('example.doc.templateSelect.sample.tplA'),
    description: t('example.doc.templateSelect.sample.tplADesc'),
    data: { role: 'admin', theme: 'linear' }
  },
  {
    id: 'tpl-b',
    name: t('example.doc.templateSelect.sample.tplB'),
    description: t('example.doc.templateSelect.sample.tplBDesc'),
    preview: '{ "layout": "compact", "density": "sm" }',
    data: { layout: 'compact', density: 'sm' }
  },
  {
    id: 'tpl-c',
    name: t('example.doc.templateSelect.sample.tplC'),
    description: t('example.doc.templateSelect.sample.tplCDesc'),
    data: { layout: 'wide', density: 'md' }
  },
  {
    id: 'tpl-d',
    name: t('example.doc.templateSelect.sample.tplD'),
    data: { role: 'viewer' }
  }
])

const codeBasic = demoSfc({
  imports: [`import { TemplateSelect } from '@amg-webui/lowcode'`],
  template: [
    '  <TemplateSelect v-model="id" :templates="templates" @apply="onApply" />'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.templateSelect.when') }}</p>

    <DemoBlock
      :title="t('example.doc.templateSelect.demo.dropdown')"
      :description="t('example.doc.templateSelect.demo.dropdownDesc')"
      :code="codeBasic"
    >
      <div class="vp-curated__stack">
        <TemplateSelect v-model="selected" :templates="templates" @apply="applied = JSON.stringify($event)" />
        <StatusTip v-if="applied" severity="success" :message="t('example.doc.templateSelect.sample.applied', { data: applied })" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.templateSelect.demo.cards')"
      :description="t('example.doc.templateSelect.demo.cardsDesc')"
    >
      <TemplateSelect v-model="selected" layout="cards" :templates="templates" />
    </DemoBlock>

    <DemoBlock :title="t('example.doc.templateSelect.demo.empty')" :description="t('example.doc.templateSelect.demo.emptyDesc')">
      <TemplateSelect :templates="[]" />
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
