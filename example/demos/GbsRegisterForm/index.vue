<script setup lang="ts">
import { computed } from 'vue'
import { GbsRegisterForm } from '@amg-webui/gb28181'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('GbsRegisterForm'))

const codeBasic = demoSfc({
  imports: [
    `import { GbsRegisterForm } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('GbsRegisterForm')`],
  template: [`  <GbsRegisterForm v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.gbsRegisterForm.when') }}</p>
    <DemoBlock
      :title="t('example.doc.gbsRegisterForm.demo.basic')"
      :description="t('example.doc.gbsRegisterForm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsRegisterForm v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
