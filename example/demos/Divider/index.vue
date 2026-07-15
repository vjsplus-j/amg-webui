<script setup lang="ts">
import { computed } from 'vue'
import { Button, Divider, Link, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const propRows = computed<PropRow[]>(() => [
  {
    name: 'direction / type',
    description: t('example.doc.divider.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'contentPosition',
    description: t('example.doc.divider.prop.contentPosition'),
    type: "'left' | 'center' | 'right'",
    defaultValue: "'center'"
  },
  {
    name: 'dashed',
    description: t('example.doc.divider.prop.dashed'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'borderStyle',
    description: t('example.doc.divider.prop.borderStyle'),
    type: 'string',
    defaultValue: '-'
  }
])

const codeHorizontal = `<Divider />
<Divider dashed />
<Divider>{{ t('…') }}</Divider>`

const codeVertical = `<Space align="center">
  <Link>{{ t('…') }}</Link>
  <Divider direction="vertical" />
  <Link>{{ t('…') }}</Link>
  <Divider type="vertical" dashed />
  <Button size="sm">…</Button>
</Space>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.divider.demo.horizontal')"
      :description="t('example.doc.divider.demo.horizontalDesc')"
      :code="codeHorizontal"
    >
      <div class="vp-divider-demo__block">
        <p>{{ t('example.doc.divider.sample.above') }}</p>
        <Divider />
        <p>{{ t('example.doc.divider.sample.below') }}</p>
        <Divider dashed />
        <Divider>{{ t('example.doc.divider.sample.withText') }}</Divider>
        <Divider content-position="left">{{ t('example.doc.divider.sample.left') }}</Divider>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.divider.demo.vertical')"
      :description="t('example.doc.divider.demo.verticalDesc')"
      :code="codeVertical"
    >
      <Space align="center" wrap>
        <Link>{{ t('example.doc.divider.sample.edit') }}</Link>
        <Divider direction="vertical" />
        <Link>{{ t('example.doc.divider.sample.copy') }}</Link>
        <Divider type="vertical" dashed />
        <Link>{{ t('example.doc.divider.sample.delete') }}</Link>
        <Divider direction="vertical" />
        <Button size="sm" variant="outlined">{{ t('example.doc.divider.sample.more') }}</Button>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
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

.vp-divider-demo__block {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);

  p {
    margin: 0;
  }
}
</style>
