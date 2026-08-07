<script setup lang="ts">
import { computed, ref } from 'vue'
import { Menu } from '@amg-webui/core'
import type { MenuItem } from '@amg-webui/core/Menu'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const active = ref('home')
const openKeys = ref(['more'])

const items = computed<MenuItem[]>(() => [
  { key: 'home', label: t('example.doc.menu.sample.home'), icon: 'House' },
  { key: 'docs', label: t('example.doc.menu.sample.docs'), icon: 'BookOpen' },
  {
    key: 'more',
    label: t('example.doc.menu.sample.more'),
    icon: 'Folder',
    children: [
      { key: 'a', label: t('example.doc.menu.sample.itemA') },
      { key: 'b', label: t('example.doc.menu.sample.itemB') }
    ]
  },
  { key: 'settings', label: t('example.doc.menu.sample.settings'), icon: 'Settings' }
])
</script>

<template>
  <Menu
    v-model="active"
    v-model:open-keys="openKeys"
    :items="items"
    class="amg-demo-menu"
  />
</template>

<style scoped>
.amg-demo-menu {
  width: 100%;
  min-width: 0;
  max-width: 16rem;
}
</style>
