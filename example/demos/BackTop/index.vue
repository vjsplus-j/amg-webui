<script setup lang="ts">
import { computed } from 'vue'
import { BackTop } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeBasic = demoSfc({
  imports: [`import { BackTop } from '@amg-webui/components/base'`],
  template: [
    '  <div class="scroll-box" data-backtop-demo>',
    '    <!-- long content -->',
    '  </div>',
    '  <BackTop',
    '    container="[data-backtop-demo]"',
    '    :visibility-height="80"',
    '    :teleport="false"',
    '  />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visibilityHeight',
    type: 'number',
    defaultValue: '200',
    description: t('example.doc.backTop.prop.visibilityHeight')
  },
  {
    name: 'container',
    type: 'string | HTMLElement',
    defaultValue: 'window',
    description: t('example.doc.backTop.prop.container')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.backTop.when') }}</p>

    <DemoBlock
      :title="t('example.doc.backTop.demo.basic')"
      :description="t('example.doc.backTop.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-backtop-stage">
        <div class="vp-backtop-stage__scroll" data-backtop-demo>
          <p v-for="n in 24" :key="n" class="vp-backtop-stage__line">
            {{ t('example.doc.backTop.sample.hint') }} · {{ n }}
          </p>
        </div>
        <BackTop
          class="vp-backtop-stage__btn"
          container="[data-backtop-demo]"
          :visibility-height="80"
          :teleport="false"
        />
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-backtop-stage {
  position: relative;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-backtop-stage__scroll {
  max-height: calc(var(--spacing-2xl) * 8);
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  padding: var(--theme-card-pad);
}

.vp-backtop-stage__line {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-backtop-stage__btn {
  position: absolute !important;
  inset-inline-end: var(--spacing-md);
  inset-block-end: var(--spacing-md);
}
</style>
