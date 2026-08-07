<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { Ellipsis } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()

const lastOverflow = ref<boolean | null>(null)

function onOverflowChange(overflowing: boolean) {
  lastOverflow.value = overflowing
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Ellipsis } from '@amg-webui/core'`],
  template: [
    `  <div class="vp-ellipsis-demo__box">`,
    `    <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
    `  </div>`
  ]
})

const codeMulti = demoCode(
  `<div class="vp-ellipsis-demo__box">`,
  `  <Ellipsis :lines="2">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  `</div>`,
  `<div class="vp-ellipsis-demo__box">`,
  `  <Ellipsis :lines="3">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  `</div>`
)

const codeTooltip = demoCode(
  `<div class="vp-ellipsis-demo__box">`,
  `  <Ellipsis :tooltip="true" tooltip-placement="bottom">`,
  `    {{ t('example.doc.ellipsis.sample.long') }}`,
  `  </Ellipsis>`,
  `</div>`,
  `<div class="vp-ellipsis-demo__box">`,
  `  <Ellipsis :tooltip="false">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  `</div>`
)

const codeWidth = demoCode(
  `<div class="vp-ellipsis-demo__narrow">`,
  `  <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  `</div>`,
  `<div class="vp-ellipsis-demo__wide">`,
  `  <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  `</div>`
)

const codeSlots = demoCode(
  `<Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>`,
  ``,
  `<Ellipsis :content="t('example.doc.ellipsis.sample.long')" />`
)

const codeEvents = demoCode(
  `<Ellipsis @overflow-change="onOverflowChange">`,
  `  {{ t('example.doc.ellipsis.sample.long') }}`,
  `</Ellipsis>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic -->
    <DemoBlock
      :title="t('example.doc.ellipsis.demo.basic')"
      :description="t('example.doc.ellipsis.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-ellipsis-demo__box">
        <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
      </div>
    </DemoBlock>

    <!-- 2. Features -->
    <DemoBlock
      :title="t('example.doc.ellipsis.demo.multi')"
      :description="t('example.doc.ellipsis.demo.multiDesc')"
      :code="codeMulti"
    >
      <div class="vp-ellipsis-demo__stack">
        <div class="vp-ellipsis-demo__box">
          <Ellipsis :lines="2">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
        <div class="vp-ellipsis-demo__box">
          <Ellipsis :lines="3">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.ellipsis.demo.tooltip')"
      :description="t('example.doc.ellipsis.demo.tooltipDesc')"
      :code="codeTooltip"
    >
      <div class="vp-ellipsis-demo__stack">
        <div class="vp-ellipsis-demo__box">
          <Ellipsis :tooltip="true" tooltip-placement="bottom">
            {{ t('example.doc.ellipsis.sample.long') }}
          </Ellipsis>
        </div>
        <div class="vp-ellipsis-demo__box">
          <Ellipsis :tooltip="false">{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.ellipsis.demo.width')"
      :description="t('example.doc.ellipsis.demo.widthDesc')"
      :code="codeWidth"
    >
      <div class="vp-ellipsis-demo__widths">
        <div class="vp-ellipsis-demo__narrow">
          <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
        <div class="vp-ellipsis-demo__wide">
          <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.ellipsis.demo.slots')"
      :description="t('example.doc.ellipsis.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-ellipsis-demo__stack">
        <div class="vp-ellipsis-demo__box">
          <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
        </div>
        <div class="vp-ellipsis-demo__box">
          <Ellipsis :content="t('example.doc.ellipsis.sample.long')" />
        </div>
      </div>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.ellipsis.demo.events')"
      :description="t('example.doc.ellipsis.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-ellipsis-demo__events">
        <div class="vp-ellipsis-demo__box">
          <Ellipsis @overflow-change="onOverflowChange">
            {{ t('example.doc.ellipsis.sample.long') }}
          </Ellipsis>
        </div>
        <p class="vp-ellipsis-demo__log">
          {{
            lastOverflow === null
              ? t('example.doc.ellipsis.sample.eventIdle')
              : t('example.doc.ellipsis.sample.eventLog', {
                  event: lastOverflow
                    ? t('example.doc.ellipsis.sample.overflowOn')
                    : t('example.doc.ellipsis.sample.overflowOff')
                })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 7. API -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-ellipsis-demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-ellipsis-demo__box {
  max-width: 100%;
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.vp-ellipsis-demo__widths {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.vp-ellipsis-demo__narrow {
  width: 30%;
  min-width: 0;
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.vp-ellipsis-demo__wide {
  flex: 1;
  min-width: 0;
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.vp-ellipsis-demo__events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-ellipsis-demo__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
