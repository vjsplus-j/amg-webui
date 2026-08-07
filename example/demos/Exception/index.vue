<script setup lang="ts">
/**
 * Curated demo — Feedback wave2 Exception
 */
import { ref } from 'vue'
import { Exception } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const status = ref<'403' | '404' | '500' | 'offline'>('404')
const last = ref('')

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Exception } from '@amg-webui/core'`],
  script: [`const status = ref('404')`],
  template: [`  <Exception :status="status" @action="last = status" />`]
})

const codeCustom = demoCode(
  `<Exception`,
  `  status="404"`,
  `  :title="t('example.doc.exception.sample.customTitle')"`,
  `  :description="t('example.doc.exception.sample.customDesc')"`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.exception.demo.basic')"
      :description="t('example.doc.exception.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-exception-demo__stack">
        <div class="vp-curated__row">
          <button
            v-for="s in (['403', '404', '500', 'offline'] as const)"
            :key="s"
            type="button"
            class="vp-demo-chip"
            :class="{ 'vp-demo-chip--on': status === s }"
            @click="status = s"
          >
            {{ s }}
          </button>
        </div>
        <Exception :status="status" @action="last = status" />
        <p v-if="last" class="vp-exception-demo__hint">
          {{ t('example.doc.exception.sample.action', { status: last }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.exception.demo.custom')"
      :description="t('example.doc.exception.demo.customDesc')"
      :code="codeCustom"
    >
      <Exception
        status="404"
        :title="t('example.doc.exception.sample.customTitle')"
        :description="t('example.doc.exception.sample.customDesc')"
      />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-exception-demo__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-demo-chip {
  appearance: none;
  height: var(--height-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.vp-demo-chip--on {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

.vp-exception-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
