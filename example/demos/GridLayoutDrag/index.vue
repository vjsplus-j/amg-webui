<script setup lang="ts">
import { computed } from 'vue'
import { GridLayoutDrag } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GridLayoutDrag'))

const codeBasic = demoSfc({
  imports: [
    `import { GridLayoutDrag } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GridLayoutDrag')`],
  template: [`  <GridLayoutDrag v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.gridLayoutDrag.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gridLayoutDrag.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gridLayoutDrag.demo.basic')"
      :description="t('example.doc.gridLayoutDrag.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GridLayoutDrag v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
