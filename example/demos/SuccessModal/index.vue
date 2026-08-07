<script setup lang="ts">
import { computed } from 'vue'
import { SuccessModal } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('SuccessModal'))

const codeBasic = demoSfc({
  imports: [
    `import { SuccessModal } from '@amg-webui/overlay'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('SuccessModal')`],
  template: [`  <SuccessModal v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.successModal.when') }}</p>
    <DemoBlock
      :title="t('example.doc.successModal.demo.basic')"
      :description="t('example.doc.successModal.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <SuccessModal v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
