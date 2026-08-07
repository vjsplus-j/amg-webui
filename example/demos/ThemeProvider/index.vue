<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card, ThemeProvider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeBasic = demoSfc({
  imports: [`import { ThemeProvider, Button, Card } from '@amg-webui/core'`],
  template: [
    `  <ThemeProvider design="mercedes" storage-namespace="example-theme-a">`,
    `    <Card :title="t('page.lab.microFe.c1')">`,
    `      <Button :label="t('example.doc.configProvider.sample.btn')" />`,
    `    </Card>`,
    `  </ThemeProvider>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t('page.lab.microFe.lead'))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <div class="vp-theme-grid">
        <ThemeProvider design="mercedes" storage-namespace="example-theme-mercedes">
          <Card :title="t('page.lab.microFe.c1')">
            <Button :label="t('example.doc.configProvider.sample.btn')" />
          </Card>
        </ThemeProvider>
        <ThemeProvider design="porsche" storage-namespace="example-theme-porsche">
          <Card :title="t('page.lab.microFe.c2')">
            <Button variant="outlined" :label="t('example.doc.configProvider.sample.btn')" />
          </Card>
        </ThemeProvider>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.vp-theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}
</style>
