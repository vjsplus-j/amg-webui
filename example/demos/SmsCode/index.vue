<script setup lang="ts">
/**
 * Curated demo — Form wave2 SmsCode
 */
import { ref } from 'vue'
import { SmsCode } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const code = ref('')
const shortCode = ref('')
const lastEvent = ref('—')
const loading = ref(false)

const onSend = () => {
  loading.value = true
  lastEvent.value = t('example.doc.smsCode.sample.sent')
  window.setTimeout(() => {
    loading.value = false
  }, 1200)
}

const onComplete = (value: string) => {
  lastEvent.value = t('example.doc.smsCode.sample.complete', { value })
}

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { SmsCode } from '@amg-webui/form'`
  ],
  script: [`const code = ref('')`],
  template: [
    `  <SmsCode v-model="code" :length="6" @send="onSend" @complete="onComplete" />`
  ]
})

const codeLoading = demoCode(
  `<SmsCode v-model="shortCode" :length="4" :countdown="30" :loading="loading" @send="onSend" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.smsCode.demo.basic')"
      :description="t('example.doc.smsCode.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <SmsCode v-model="code" :length="6" @send="onSend" @complete="onComplete" />
        <p class="vp-curated__hint">{{ lastEvent }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.smsCode.demo.loading')"
      :description="t('example.doc.smsCode.demo.loadingDesc')"
      :code="codeLoading"
    >
      <SmsCode
        v-model="shortCode"
        :length="4"
        :countdown="30"
        :loading="loading"
        @send="onSend"
        @complete="onComplete"
      />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
