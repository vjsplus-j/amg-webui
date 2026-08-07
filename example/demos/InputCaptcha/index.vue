<script setup lang="ts">
import { computed } from 'vue'
import { InputCaptcha } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('InputCaptcha'))

const codeBasic = demoSfc({
  imports: [
    `import { InputCaptcha } from '@amg-webui/form'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`
  ],
  script: [`const mountProps = getSampleMountProps('InputCaptcha')`],
  template: [`  <InputCaptcha v-bind="mountProps" />`]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.inputCaptcha.when') }}</p>
    <DemoBlock
      :title="t('example.doc.inputCaptcha.demo.basic')"
      :description="t('example.doc.inputCaptcha.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <InputCaptcha v-bind="mountProps" />
    </DemoBlock>
</div>
</template>
