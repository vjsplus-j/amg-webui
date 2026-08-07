<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const open = ref(false)
</script>

<template>
  <div class="vp-dialog-basic">
    <Button
      severity="primary"
      :label="t('example.doc.dialog.sample.open')"
      @click="open = true"
    />
    <Dialog v-model:visible="open" :title="t('example.doc.dialog.sample.title')">
      {{ t('example.doc.dialog.sample.body') }}
    </Dialog>
  </div>
</template>

<style scoped>
.vp-dialog-basic {
  width: 100%;
  min-width: 0;
}
</style>
