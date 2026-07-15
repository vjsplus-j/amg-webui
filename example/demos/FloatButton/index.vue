<script setup lang="ts">
import { FloatButton, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'
import { computed } from 'vue'

const { t } = useLocale()

const propRows = computed<PropRow[]>(() => [
  {
    name: 'icon',
    description: t('example.doc.floatButton.prop.icon'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'severity',
    description: t('example.doc.floatButton.prop.severity'),
    type: 'Severity',
    defaultValue: "'primary'"
  },
  {
    name: 'shape',
    description: t('example.doc.floatButton.prop.shape'),
    type: 'Shape',
    defaultValue: "'circle'"
  },
  {
    name: 'href',
    description: t('example.doc.floatButton.prop.href'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'bottom / right',
    description: t('example.doc.floatButton.prop.position'),
    type: 'string | number',
    defaultValue: 'token spacing'
  },
  {
    name: 'v-model:open / open',
    description: t('example.doc.floatButton.prop.open'),
    type: 'boolean',
    defaultValue: '-'
  },
  {
    name: '@click',
    description: t('example.doc.floatButton.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  },
  {
    name: '@open-change',
    description: t('example.doc.floatButton.emit.openChange'),
    type: '(open: boolean) => void',
    defaultValue: '-'
  }
])

const codeBasic = `<FloatButton icon="Plus" />`

const codeMenu = `<FloatButton icon="Plus">
  <template #menu>
    <Button icon="Edit" shape="circle" />
    <Button icon="Search" shape="circle" />
  </template>
</FloatButton>`

const codeShape = `<FloatButton icon="Star" shape="circle" />
<FloatButton icon="Star" shape="square" />`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.floatButton.demo.basic')"
      :description="t('example.doc.floatButton.demo.basicDesc')"
      :code="codeBasic"
    >
      <div class="vp-float-stage">
        <FloatButton icon="Plus" :bottom="'var(--spacing-xl)'" :right="'var(--spacing-xl)'" class="vp-float-stage__btn" />
        <p class="vp-float-stage__hint">{{ t('example.doc.floatButton.demo.stageHint') }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.floatButton.demo.menu')"
      :description="t('example.doc.floatButton.demo.menuDesc')"
      :code="codeMenu"
    >
      <div class="vp-float-stage">
        <FloatButton icon="Plus" severity="secondary" class="vp-float-stage__btn vp-float-stage__btn--inline">
          <template #menu>
            <Button
              shape="circle"
              icon="Edit"
              size="sm"
              :aria-label="t(LocaleKeys.button.edit)"
            />
            <Button
              shape="circle"
              icon="Search"
              size="sm"
              :aria-label="t(LocaleKeys.common.search)"
            />
          </template>
        </FloatButton>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.floatButton.demo.shape')"
      :description="t('example.doc.floatButton.demo.shapeDesc')"
      :code="codeShape"
    >
      <div class="vp-float-stage vp-float-stage--row">
        <FloatButton icon="Star" shape="circle" class="vp-float-stage__btn--inline" />
        <FloatButton icon="Star" shape="square" severity="success" class="vp-float-stage__btn--inline" />
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

.vp-float-stage {
  position: relative;
  width: 100%;
  min-height: 8rem;
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-2, var(--surface-1));
}

.vp-float-stage--row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  min-height: 6rem;
}

.vp-float-stage__hint {
  margin: 0;
  padding: var(--theme-card-pad);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.vp-float-stage__btn {
  position: absolute !important;
}

.vp-float-stage__btn--inline {
  position: relative !important;
  --vp-float-top: auto;
  --vp-float-right: auto;
  --vp-float-bottom: auto;
  --vp-float-left: auto;
}
</style>
