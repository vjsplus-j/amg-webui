<script setup lang="ts">
import { computed } from 'vue'
import { FreeLayoutDrag } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('FreeLayoutDrag'))

const codeBasic = demoSfc({
  imports: [
    `import { FreeLayoutDrag } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('FreeLayoutDrag')`],
  template: [`  <FreeLayoutDrag v-bind="mountProps" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.freeLayoutDrag.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.freeLayoutDrag.when') }}</p>
    <DemoBlock
      :title="t('example.doc.freeLayoutDrag.demo.basic')"
      :description="t('example.doc.freeLayoutDrag.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <FreeLayoutDrag v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
