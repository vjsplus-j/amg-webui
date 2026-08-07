<script setup lang="ts">
import { ref } from 'vue'
import { Drawer } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const open = ref(false)
</script>

<template>
  <div class="amg-demo-block">
    <Button
      severity="primary"
      :label="t('example.doc.drawer.sample.open')"
      @click="open = true"
    />
    <Drawer v-model:visible="open" :title="t('example.doc.drawer.sample.title')">
      {{ t('example.doc.drawer.sample.body') }}
    </Drawer>
  </div>
</template>

<style scoped>
.amg-demo-block {
  width: 100%;
  min-width: 0;
}
</style>
