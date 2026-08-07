<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Tag, TelemetryProvider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const enabled = ref(false)
const last = ref('')

function onSampleClick() {
  last.value = t('page.lab.telemetry.sampleClick')
}

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { TelemetryProvider, Button } from '@amg-webui/core'`],
  script: [`const enabled = ref(false)`],
  template: [
    `  <TelemetryProvider :enabled="enabled" :config="{ appId: 'example-debug' }">`,
    `    <Button :label="t('page.lab.telemetry.sampleClick')" track-id="example.sample-click" />`,
    `  </TelemetryProvider>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t('page.lab.telemetry.lead'))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <TelemetryProvider :enabled="enabled" :config="{ appId: 'example-debug' }">
        <div class="vp-telemetry-row">
          <Button
            size="sm"
            :variant="enabled ? 'solid' : 'outlined'"
            :label="enabled ? t('page.lab.telemetry.enabled') : t('page.lab.telemetry.disabled')"
            @click="enabled = !enabled"
          />
          <Button
            :label="t('page.lab.telemetry.sampleClick')"
            track-id="example.sample-click"
            @click="onSampleClick"
          />
          <Tag v-if="last" size="sm" severity="info" :label="last" />
        </div>
      </TelemetryProvider>
      <p class="vp-telemetry-hint">{{ t('page.lab.telemetry.hint') }}</p>
    </DemoBlock>
  </div>
</template>

<style scoped>
.vp-telemetry-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-telemetry-hint {
  margin: var(--spacing-md) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
