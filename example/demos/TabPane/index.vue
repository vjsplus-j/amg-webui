<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabPane, Tabs } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref('a')

const codeBasic = demoSfc({
  imports: [`import { ref } from 'vue'`, `import { Tabs, TabPane } from '@amg-webui/core'`],
  script: [`const active = ref('a')`],
  template: [
    `  <Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">`,
    `    <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
    `      {{ t('example.doc.tabs.sample.panelA') }}`,
    `    </TabPane>`,
    `    <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">`,
    `      {{ t('example.doc.tabs.sample.panelB') }}`,
    `    </TabPane>`,
    `  </Tabs>`
  ]
})

const demoTitle = computed(() => t(LocaleKeys.exampleDoc.basicMount))
const demoDesc = computed(() => t(LocaleKeys.exampleDoc.basicMountDesc))
</script>

<template>
  <div class="vp-curated">
    <DemoBlock :title="demoTitle" :description="demoDesc" :code="codeBasic" default-open>
      <Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">
        <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
          {{ t('example.doc.tabs.sample.panelA') }}
        </TabPane>
        <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">
          {{ t('example.doc.tabs.sample.panelB') }}
        </TabPane>
      </Tabs>
    </DemoBlock>
  </div>
</template>
