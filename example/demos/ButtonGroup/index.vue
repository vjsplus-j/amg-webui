<script setup lang="ts">
import { computed } from 'vue'
import { Button, ButtonGroup } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

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
  }
])

const codeBasic = `<ButtonGroup>
  <Button>{{ t('button.cancel') }}</Button>
  <Button>{{ t('button.confirm') }}</Button>
</ButtonGroup>`

const codeSize = `<ButtonGroup size="sm">
  <Button>{{ t('button.cancel') }}</Button>
  <Button>{{ t('button.confirm') }}</Button>
</ButtonGroup>`

const codeVariant = `<ButtonGroup variant="outlined" severity="primary">
  <Button>{{ t('button.cancel') }}</Button>
  <Button>{{ t('button.save') }}</Button>
  <Button>{{ t('button.delete') }}</Button>
</ButtonGroup>`

const codeNeon = `<ButtonGroup variant="neon" severity="primary">
  <Button>{{ t('button.cancel') }}</Button>
  <Button>{{ t('button.save') }}</Button>
  <Button>{{ t('button.delete') }}</Button>
</ButtonGroup>`

const codeBlock = `<ButtonGroup block>
  <Button>{{ t('button.cancel') }}</Button>
  <Button severity="primary">{{ t('button.submit') }}</Button>
</ButtonGroup>`

const codeMix = `<ButtonGroup>
  <Button icon="ChevronLeft" :aria-label="t('common.previous')" />
  <Button>{{ t('common.play') }}</Button>
  <Button icon="ChevronRight" :aria-label="t('common.next')" />
</ButtonGroup>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.buttonGroup.demo.basic')"
      :description="t('example.doc.buttonGroup.demo.basicDesc')"
      :code="codeBasic"
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
</style>
