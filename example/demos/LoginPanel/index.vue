<script setup lang="ts">
import { ref } from 'vue'
import { LoginPanel } from '@amg-webui/form'
import { StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const model = ref({ username: '', password: '', remember: true, captcha: '' })
const eventLog = ref('')

const codeBasic = demoSfc({
  imports: [`import { LoginPanel } from '@amg-webui/form'`],
  template: [
    '  <LoginPanel',
    '    v-model="model"',
    '    :show-captcha="false"',
    '    @submit="onSubmit"',
    '    @forgot-password="onForgot"',
    '    @register="onRegister"',
    '  />'
  ]
})

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.loginPanel.when') }}</p>

    <DemoBlock
      :title="t('example.doc.loginPanel.demo.basic')"
      :description="t('example.doc.loginPanel.demo.basicDesc')"
      :code="codeBasic"
    >
      <div class="vp-curated__row">
        <LoginPanel
          v-model="model"
          :show-captcha="false"
          @submit="eventLog = t('example.doc.loginPanel.sample.submitted')"
          @forgot-password="eventLog = t('example.doc.loginPanel.sample.forgot')"
          @register="eventLog = t('example.doc.loginPanel.sample.register')"
        />
        <StatusTip
          v-if="eventLog"
          severity="info"
          :message="eventLog"
        />
      </div>
    </DemoBlock>
</div>
</template>

<style scoped>
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--theme-section-gap);
  width: 100%;
  align-items: flex-start;
}
</style>
