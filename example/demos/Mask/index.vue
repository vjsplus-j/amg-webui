<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mask, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const open = ref(false)

const codeBasic = demoSfc({
  imports: [`import { Mask, Button } from '@amg-webui/components/base'`],
  template: [
    '  <Button @click="open = true">{{ t(\'example.doc.mask.sample.open\') }}</Button>',
    '  <Mask v-model:visible="open">',
    `    <h3>{{ t('example.doc.mask.sample.title') }}</h3>`,
    `    <p>{{ t('example.doc.mask.sample.body') }}</p>`,
    `    <Button size="sm" @click="open = false">{{ t('common.close') }}</Button>`,
    '  </Mask>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.mask.prop.visible')
  },
  {
    name: 'dismissible',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.mask.prop.dismissible')
  },
  {
    name: 'lockScroll',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.mask.prop.lockScroll')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.mask.when') }}</p>

    <DemoBlock
      :title="t('example.doc.mask.demo.basic')"
      :description="t('example.doc.mask.demo.basicDesc')"
      :code="codeBasic"
    >
      <Button variant="solid" severity="primary" size="sm" @click="open = true">
        {{ t('example.doc.mask.sample.open') }}
      </Button>
      <Mask v-model:visible="open">
        <div class="vp-demo-mask-panel">
          <h3 class="vp-demo-mask-panel__title">{{ t('example.doc.mask.sample.title') }}</h3>
          <p class="vp-demo-mask-panel__body">{{ t('example.doc.mask.sample.body') }}</p>
          <div class="vp-demo-mask-panel__actions">
            <Button size="sm" variant="outlined" @click="open = false">
              {{ t(LocaleKeys.common.close) }}
            </Button>
            <Button size="sm" variant="solid" severity="primary" @click="open = false">
              {{ t(LocaleKeys.button.confirm) }}
            </Button>
          </div>
        </div>
      </Mask>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-demo-mask-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-demo-mask-panel__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--text-primary);
}

.vp-demo-mask-panel__body {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}

.vp-demo-mask-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
}
</style>
