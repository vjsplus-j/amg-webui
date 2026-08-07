<script setup lang="ts">
import { computed } from 'vue'
import { GroupNav } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GroupNav'))

const codeBasic = demoSfc({
  imports: [
    `import { GroupNav } from '@amg-webui/core'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GroupNav')`],
  template: [`  <GroupNav v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.groupNav.when') }}</p>
    <DemoBlock
      :title="t('example.doc.groupNav.demo.basic')"
      :description="t('example.doc.groupNav.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GroupNav v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
