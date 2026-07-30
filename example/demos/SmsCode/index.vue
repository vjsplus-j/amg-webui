<script setup lang="ts">
/**
 * Curated demo — Form wave2 SmsCode
 */
import { computed, ref } from 'vue'
import { SmsCode } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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
    `import { SmsCode } from '@amg-webui/components/base'`
  ],
  script: [`const code = ref('')`],
  template: [
    `  <SmsCode v-model="code" :length="6" @send="onSend" @complete="onComplete" />`
  ]
})

const codeLoading = demoCode(
  `<SmsCode v-model="shortCode" :length="4" :countdown="30" :loading="loading" @send="onSend" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.smsCode.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'length',
    description: t('example.doc.smsCode.prop.length'),
    type: 'number',
    defaultValue: '6'
  },
  {
    name: 'countdown',
    description: t('example.doc.smsCode.prop.countdown'),
    type: 'number',
    defaultValue: '60'
  },
  {
    name: 'loading',
    description: t('example.doc.smsCode.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'send / complete',
    description: t('example.doc.smsCode.event.send'),
    type: '—',
    defaultValue: '-'
  }
])
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
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

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
