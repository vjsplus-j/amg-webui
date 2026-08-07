<script setup lang="ts">
/**
 * Curated demo — Feedback wave2 Exception
 */
import { computed, ref } from 'vue'
import { Exception } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const status = ref<'403' | '404' | '500' | 'offline'>('404')
const last = ref('')

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Exception } from '@amg-webui/core'`],
  script: [`const status = ref('404')`],
  template: [`  <Exception :status="status" @action="last = status" />`]
})

const codeCustom = demoCode(
  `<Exception`,
  `  status="404"`,
  `  :title="t('example.doc.exception.sample.customTitle')"`,
  `  :description="t('example.doc.exception.sample.customDesc')"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'status',
    type: "'403' | '404' | '500' | 'offline'",
    defaultValue: "'404'",
    description: t('example.doc.exception.prop.status')
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: '-',
    description: t('example.doc.exception.prop.title')
  },
  {
    name: 'description',
    type: 'string',
    defaultValue: '-',
    description: t('example.doc.exception.prop.description')
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'action',
    description: t('example.doc.exception.event.action'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.exception.demo.basic')"
      :description="t('example.doc.exception.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-exception-demo__stack">
        <div class="vp-curated__row">
          <button
            v-for="s in (['403', '404', '500', 'offline'] as const)"
            :key="s"
            type="button"
            class="vp-demo-chip"
            :class="{ 'vp-demo-chip--on': status === s }"
            @click="status = s"
          >
            {{ s }}
          </button>
        </div>
        <Exception :status="status" @action="last = status" />
        <p v-if="last" class="vp-exception-demo__hint">
          {{ t('example.doc.exception.sample.action', { status: last }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.exception.demo.custom')"
      :description="t('example.doc.exception.demo.customDesc')"
      :code="codeCustom"
    >
      <Exception
        status="404"
        :title="t('example.doc.exception.sample.customTitle')"
        :description="t('example.doc.exception.sample.customDesc')"
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
.vp-exception-demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-demo-chip {
  appearance: none;
  height: var(--height-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.vp-demo-chip--on {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

.vp-exception-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
