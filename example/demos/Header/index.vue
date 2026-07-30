<script setup lang="ts">
import { computed, ref } from 'vue'
import { Header, Button, Space, InputText, Avatar, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const sticky = ref(true)
const bordered = ref(true)
const size = ref<'sm' | 'md' | 'lg'>('md')
const query = ref('')

const codeSlots = demoSfc({
  imports: [`import { Header, Button, InputText, Avatar } from '@amg-webui/components/base'`],
  template: [
    '  <Header sticky bordered size="md">',
    `    <template #title>{{ t('example.doc.header.sample.title') }}</template>`,
    '    <template #extra><Tag>…</Tag></template>',
    '    <template #actions>',
    '      <InputText size="sm" />',
    '      <Avatar size="sm" text="AM" />',
    '      <Button size="sm">…</Button>',
    '    </template>',
    '  </Header>'
  ]
})

const codeSticky = demoSfc({
  imports: [`import { Header } from '@amg-webui/components/base'`],
  template: [
    '  <div class="scroll-host">',
    '    <Header sticky>',
    `      <template #title>{{ t('example.doc.header.sample.title') }}</template>`,
    '    </Header>',
    '    <div class="scroll-body">…long…</div>',
    '  </div>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'sticky', type: 'boolean', defaultValue: 'false', description: t('example.doc.header.prop.sticky') },
  { name: 'bordered', type: 'boolean', defaultValue: 'true', description: t('example.doc.header.prop.bordered') },
  { name: 'size', type: "'sm'|'md'|'lg'", defaultValue: "'md'", description: t('example.doc.header.prop.size') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.header.when') }}</p>

    <DemoBlock
      :title="t('example.doc.header.demo.slots')"
      :description="t('example.doc.header.demo.slotsDesc')"
      :code="codeSlots"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="s in (['sm', 'md', 'lg'] as const)"
            :key="s"
            size="sm"
            :variant="size === s ? 'solid' : 'outlined'"
            @click="size = s"
          >
            {{ s }}
          </Button>
          <Button
            size="sm"
            :variant="bordered ? 'solid' : 'outlined'"
            @click="bordered = !bordered"
          >
            {{ t('example.doc.header.sample.bordered') }}
          </Button>
        </Space>
        <div class="header-stage">
          <Header :size="size" :bordered="bordered">
            <template #title>{{ t('example.doc.header.sample.title') }}</template>
            <template #extra>
              <Tag severity="info">{{ t('example.doc.header.sample.extra') }}</Tag>
            </template>
            <template #actions>
              <InputText
                v-model="query"
                size="sm"
                class="header-search"
                :placeholder="t('example.doc.header.sample.searchPh')"
              />
              <Avatar size="sm" text="AM" />
              <Button size="sm">{{ t('example.doc.header.sample.action') }}</Button>
            </template>
          </Header>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.header.demo.sticky')"
      :description="t('example.doc.header.demo.stickyDesc')"
      :code="codeSticky"
    >
      <Space direction="vertical" block size="md">
        <Button
          size="sm"
          :variant="sticky ? 'solid' : 'outlined'"
          @click="sticky = !sticky"
        >
          sticky: {{ sticky }}
        </Button>
        <div class="scroll-host">
          <Header :sticky="sticky" bordered>
            <template #title>{{ t('example.doc.header.sample.title') }}</template>
            <template #actions>
              <Button size="sm" variant="outlined">{{ t('example.doc.header.sample.action') }}</Button>
            </template>
          </Header>
          <div class="scroll-body">
            <p v-for="n in 12" :key="n" class="line">
              {{ t('example.doc.header.sample.line', { n }) }}
            </p>
          </div>
        </div>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.header-stage {
  width: 100%;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  background: var(--surface-0);
}

.header-search {
  width: calc(var(--spacing-2xl) * 6);
  max-width: 100%;
}

.scroll-host {
  width: 100%;
  height: calc(var(--spacing-2xl) * 10);
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-0);
  box-sizing: border-box;
}

.scroll-body {
  padding: var(--theme-page-pad);
}

.line {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
