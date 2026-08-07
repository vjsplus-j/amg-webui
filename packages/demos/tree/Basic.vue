<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tree } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()

const checked = ref<string[]>(['a1'])

const treeOptions = computed(() => [
  {
    label: t('example.doc.tree.sample.a'),
    value: 'a',
    children: [
      { label: t('example.doc.tree.sample.a1'), value: 'a1' },
      { label: t('example.doc.tree.sample.a2'), value: 'a2' }
    ]
  },
  {
    label: t('example.doc.tree.sample.b'),
    value: 'b',
    children: [{ label: t('example.doc.tree.sample.b1'), value: 'b1' }]
  }
])
</script>

<template>
  <Tree v-model="checked" :options="treeOptions" checkable />
</template>
