<script setup lang="ts">
import { ref } from 'vue'
import { TabPane, Tabs } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const active = ref('a')
</script>

<template>
  <Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">
    <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
      {{ t('example.doc.tabs.sample.panelA') }}
    </TabPane>
    <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">
      {{ t('example.doc.tabs.sample.panelB') }}
    </TabPane>
    <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')">
      {{ t('example.doc.tabs.sample.panelC') }}
    </TabPane>
  </Tabs>
</template>
