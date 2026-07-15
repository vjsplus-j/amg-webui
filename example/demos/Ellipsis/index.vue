<script setup lang="ts">
import { computed } from 'vue'
import { Ellipsis } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const propRows = computed<PropRow[]>(() => [
  {
    name: 'lines',
    description: t('example.doc.ellipsis.prop.lines'),
    type: 'number',
    defaultValue: '1'
  },
  {
    name: 'tooltip',
    description: t('example.doc.ellipsis.prop.tooltip'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'tooltipPlacement',
    description: t('example.doc.ellipsis.prop.tooltipPlacement'),
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'top'"
  },
  {
    name: 'content',
    description: t('example.doc.ellipsis.prop.content'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: '@overflow-change',
    description: t('example.doc.ellipsis.emit.overflowChange'),
    type: '(overflowing: boolean) => void',
    defaultValue: '-'
  }
])

const codeSingle = `<Ellipsis style="max-width: …">
  {{ longText }}
</Ellipsis>`

const codeMulti = `<Ellipsis :lines="2" style="max-width: …">
  {{ longText }}
</Ellipsis>
<Ellipsis :lines="3" style="max-width: …">
  {{ longText }}
</Ellipsis>`

const codeTooltip = `<Ellipsis :tooltip="true">…</Ellipsis>
<Ellipsis :tooltip="false">…</Ellipsis>
<Ellipsis tooltip-placement="bottom">…</Ellipsis>`

const codeWidth = `<div style="width: …">
  <Ellipsis>{{ longText }}</Ellipsis>
</div>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.ellipsis.demo.single')"
      :description="t('example.doc.ellipsis.demo.singleDesc')"
      :code="codeSingle"
    >
      <div class="vp-ellipsis-demo__box">
        <Ellipsis>{{ t('example.doc.ellipsis.sample.long') }}</Ellipsis>
      </div>
    </DemoBlock>

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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
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
  color: var(--text-primary);
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
</style>
