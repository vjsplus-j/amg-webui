<script setup lang="ts">
import { computed } from 'vue'
import { PermissionPanel } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('PermissionPanel'))

const codeBasic = demoSfc({
  imports: [
    `import { PermissionPanel } from '@amg-webui/form'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('PermissionPanel')`],
  template: [`  <PermissionPanel v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.permissionPanel.when') }}</p>
    <DemoBlock
      :title="t('example.doc.permissionPanel.demo.basic')"
      :description="t('example.doc.permissionPanel.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PermissionPanel v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
