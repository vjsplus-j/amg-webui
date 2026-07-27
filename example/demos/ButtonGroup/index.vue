<script setup lang="ts">
/**
 * Curated demo — mirrors Avatar gold standard (demoCode / demoSfc / API sections).
 */
import { computed } from 'vue'
import { Button, ButtonGroup } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Button, ButtonGroup } from '@amg-webui/components/base'`],
  template: [
    '  <ButtonGroup>',
    `    <Button>{{ t('button.cancel') }}</Button>`,
    `    <Button severity="primary">{{ t('button.confirm') }}</Button>`,
    '  </ButtonGroup>'
  ]
})

const codeSize = demoCode(
  `<ButtonGroup size="xs">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup size="sm">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup size="md">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup size="lg">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup size="xl">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`
)

const codeVariant = demoCode(
  `<ButtonGroup variant="outlined" severity="primary">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button>{{ t('button.save') }}</Button>`,
  `  <Button>{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup variant="dashed">`,
  `  <Button>{{ t('button.edit') }}</Button>`,
  `  <Button>{{ t('button.create') }}</Button>`,
  `</ButtonGroup>`
)

const codeNeon = demoCode(
  `<ButtonGroup variant="neon" severity="primary">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button>{{ t('button.save') }}</Button>`,
  `  <Button>{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup variant="neon" severity="success">`,
  `  <Button>{{ t('button.edit') }}</Button>`,
  `  <Button>{{ t('button.create') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup variant="neon" severity="warning">`,
  `  <Button>{{ t('button.edit') }}</Button>`,
  `  <Button>{{ t('button.create') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup variant="neon" severity="danger">`,
  `  <Button>{{ t('button.edit') }}</Button>`,
  `  <Button>{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`
)

const codeBlock = demoCode(
  `<ButtonGroup block>`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.submit') }}</Button>`,
  `</ButtonGroup>`
)

const codeMix = demoCode(
  `<ButtonGroup>`,
  `  <Button icon="ChevronLeft" :aria-label="t('common.previous')" />`,
  `  <Button>{{ t('common.play') }}</Button>`,
  `  <Button icon="ChevronRight" :aria-label="t('common.next')" />`,
  `</ButtonGroup>`
)

const codeDirection = demoCode(
  `<ButtonGroup direction="vertical" :aria-label="t('example.doc.buttonGroup.sample.toolbar')">`,
  `  <Button>{{ t('button.edit') }}</Button>`,
  `  <Button>{{ t('button.save') }}</Button>`,
  `  <Button>{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`
)

const codeState = demoCode(
  `<ButtonGroup disabled :aria-label="t('example.doc.buttonGroup.sample.disabled')">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`,
  `<ButtonGroup loading :aria-label="t('example.doc.buttonGroup.sample.loading')">`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`
)

const codeSlots = demoCode(
  `<ButtonGroup>`,
  `  <Button>{{ t('button.cancel') }}</Button>`,
  `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
  `</ButtonGroup>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'size',
    description: t('example.doc.buttonGroup.prop.size'),
    type: 'Size',
    defaultValue: '-'
  },
  {
    name: 'severity',
    description: t('example.doc.buttonGroup.prop.severity'),
    type: 'ButtonSeverity',
    defaultValue: '-'
  },
  {
    name: 'variant',
    description: t('example.doc.buttonGroup.prop.variant'),
    type: 'ButtonVariant',
    defaultValue: '-'
  },
  {
    name: 'block',
    description: t('example.doc.buttonGroup.prop.block'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'direction',
    description: t('example.doc.buttonGroup.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'disabled',
    description: t('example.doc.buttonGroup.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'loading',
    description: t('example.doc.buttonGroup.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.buttonGroup.prop.ariaLabel'),
    type: 'string',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.buttonGroup.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])

const eventRows = computed<ApiRow[]>(() => [])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.basic')"
      :description="t('example.doc.buttonGroup.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <ButtonGroup>
        <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
      </ButtonGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.size')"
      :description="t('example.doc.buttonGroup.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__stack">
        <ButtonGroup v-for="sz in sizes" :key="sz" :size="sz">
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
        </ButtonGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.variant')"
      :description="t('example.doc.buttonGroup.demo.variantDesc')"
      :code="codeVariant"
    >
      <div class="vp-curated__stack">
        <ButtonGroup variant="outlined" severity="primary">
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button>{{ t(LocaleKeys.button.save) }}</Button>
          <Button>{{ t(LocaleKeys.button.delete) }}</Button>
        </ButtonGroup>
        <ButtonGroup variant="dashed">
          <Button>{{ t(LocaleKeys.button.edit) }}</Button>
          <Button>{{ t(LocaleKeys.button.create) }}</Button>
        </ButtonGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.neon')"
      :description="t('example.doc.buttonGroup.demo.neonDesc')"
      :code="codeNeon"
    >
      <div class="vp-curated__stack">
        <ButtonGroup variant="neon" severity="primary">
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button>{{ t(LocaleKeys.button.save) }}</Button>
          <Button>{{ t(LocaleKeys.button.delete) }}</Button>
        </ButtonGroup>
        <ButtonGroup variant="neon" severity="success">
          <Button>{{ t(LocaleKeys.button.edit) }}</Button>
          <Button>{{ t(LocaleKeys.button.create) }}</Button>
        </ButtonGroup>
        <ButtonGroup variant="neon" severity="warning">
          <Button>{{ t(LocaleKeys.button.edit) }}</Button>
          <Button>{{ t(LocaleKeys.button.create) }}</Button>
        </ButtonGroup>
        <ButtonGroup variant="neon" severity="danger">
          <Button>{{ t(LocaleKeys.button.edit) }}</Button>
          <Button>{{ t(LocaleKeys.button.delete) }}</Button>
        </ButtonGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.block')"
      :description="t('example.doc.buttonGroup.demo.blockDesc')"
      :code="codeBlock"
    >
      <div class="vp-curated__block-host">
        <ButtonGroup block>
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button severity="primary">{{ t(LocaleKeys.button.submit) }}</Button>
        </ButtonGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.mix')"
      :description="t('example.doc.buttonGroup.demo.mixDesc')"
      :code="codeMix"
    >
      <ButtonGroup>
        <Button icon="ChevronLeft" :aria-label="t(LocaleKeys.common.previous)" />
        <Button>{{ t(LocaleKeys.common.play) }}</Button>
        <Button icon="ChevronRight" :aria-label="t(LocaleKeys.common.next)" />
      </ButtonGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.direction')"
      :description="t('example.doc.buttonGroup.demo.directionDesc')"
      :code="codeDirection"
    >
      <ButtonGroup
        direction="vertical"
        :aria-label="t('example.doc.buttonGroup.sample.toolbar')"
      >
        <Button>{{ t(LocaleKeys.button.edit) }}</Button>
        <Button>{{ t(LocaleKeys.button.save) }}</Button>
        <Button>{{ t(LocaleKeys.button.delete) }}</Button>
      </ButtonGroup>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.state')"
      :description="t('example.doc.buttonGroup.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-curated__stack">
        <ButtonGroup
          disabled
          :aria-label="t('example.doc.buttonGroup.sample.disabled')"
        >
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
        </ButtonGroup>
        <ButtonGroup
          loading
          :aria-label="t('example.doc.buttonGroup.sample.loading')"
        >
          <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
          <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
        </ButtonGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.slots')"
      :description="t('example.doc.buttonGroup.demo.slotsDesc')"
      :code="codeSlots"
    >
      <ButtonGroup>
        <Button>{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
      </ButtonGroup>
    </DemoBlock>

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
  width: 100%;
}

.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  align-items: flex-start;
}

.vp-curated__block-host {
  width: 100%;
  max-width: 28rem;
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  line-height: var(--line-height-body);
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
</style>
