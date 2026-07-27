<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { computed, ref } from 'vue'
import { CopyText } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sampleId = 'usr_8f3a2c91e0b7d4'
const sampleSecretValue = 'sk_live_demo_secret_value'
const sampleSecretLabel = 'sk_live_********************************'
const lastEvent = ref('')

function noteCopy(text: string) {
  lastEvent.value = `copy:${text}`
}

function noteCopyError() {
  lastEvent.value = 'copyError'
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { CopyText } from '@amg-webui/components/base'`],
  script: [`const sampleId = '${sampleId}'`],
  template: [`  <CopyText :text="sampleId" />`]
})

const codeMask = demoCode(
  `<CopyText`,
  `  text="${sampleSecretValue}"`,
  `  label="${sampleSecretLabel}"`,
  `/>`
)

const codeSize = demoCode(
  `<CopyText :text="sampleId" size="sm" />`,
  `<CopyText :text="sampleId" size="md" />`,
  `<CopyText :text="sampleId" size="lg" />`
)

const codeTruncate = demoCode(
  `<CopyText`,
  `  :text="sampleId"`,
  `  truncate`,
  `  max-width="8rem"`,
  `/>`,
  `<CopyText :text="sampleId" :truncate="false" />`
)

const codeSlots = demoCode(
  `<CopyText :text="sampleId">`,
  `  <span>{{ t('example.doc.copyText.sample.slotLabel') }}</span>`,
  `</CopyText>`
)

const codeEvents = demoCode(
  `<CopyText`,
  `  :text="sampleId"`,
  `  @copy="onCopy"`,
  `  @copy-error="onCopyError"`,
  `/>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'text',
    description: t('example.doc.copyText.prop.text'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'label',
    description: t('example.doc.copyText.prop.label'),
    type: 'string',
    defaultValue: 'text'
  },
  {
    name: 'truncate / maxWidth',
    description: t('example.doc.copyText.prop.truncate'),
    type: 'boolean / string',
    defaultValue: 'true / -'
  },
  {
    name: 'size',
    description: t('example.doc.copyText.prop.size'),
    type: 'Size',
    defaultValue: "'md'"
  },
  {
    name: 'showButton',
    description: t('example.doc.copyText.prop.showButton'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'copyTooltip',
    description: t('example.doc.copyText.prop.copyTooltip'),
    type: 'string',
    defaultValue: 'common.copy'
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.copyText.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'copy',
    description: t('example.doc.copyText.emit.copy'),
    type: '(text: string) => void',
    defaultValue: '-'
  },
  {
    name: 'copyError / error',
    description: t('example.doc.copyText.emit.copyError'),
    type: '(error: unknown) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.copyText.slot.default'),
    type: 'VNode',
    defaultValue: 'label ?? text'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.copyText.demo.basic')"
      :description="t('example.doc.copyText.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-copy-stack">
        <CopyText :text="sampleId" />
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.copyText.demo.mask')"
      :description="t('example.doc.copyText.demo.maskDesc')"
      :code="codeMask"
    >
      <CopyText :text="sampleSecretValue" :label="sampleSecretLabel" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.copyText.demo.size')"
      :description="t('example.doc.copyText.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-copy-stack">
        <CopyText :text="sampleId" size="sm" />
        <CopyText :text="sampleId" size="md" />
        <CopyText :text="sampleId" size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.copyText.demo.truncate')"
      :description="t('example.doc.copyText.demo.truncateDesc')"
      :code="codeTruncate"
    >
      <div class="vp-copy-stack">
        <CopyText :text="sampleId" truncate max-width="8rem" />
        <CopyText :text="sampleId" :truncate="false" />
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.copyText.demo.slots')"
      :description="t('example.doc.copyText.demo.slotsDesc')"
      :code="codeSlots"
    >
      <CopyText :text="sampleId">
        <span>{{ t('example.doc.copyText.sample.slotLabel') }}</span>
      </CopyText>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.copyText.demo.events')"
      :description="t('example.doc.copyText.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-copy-events">
        <CopyText :text="sampleId" @copy="noteCopy" @copy-error="noteCopyError" />
        <p class="vp-copy-events__log">
          {{
            t('example.doc.copyText.sample.eventLog', {
              event: lastEvent || t('example.doc.copyText.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. API: Props → Events → Slots -->
    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub:first-of-type {
  margin-top: 0;
}

.vp-copy-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.vp-copy-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-copy-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
