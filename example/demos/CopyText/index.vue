<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { CopyText } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

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
  imports: [`import { CopyText } from '@amg-webui/core'`],
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
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
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
