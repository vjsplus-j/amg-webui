<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, PageHeader, Textarea } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { mockCmsEditorContent } from '@showcase/shared/mock-api/cms'

const { t } = useLocale()
const content = ref(mockCmsEditorContent)
const saved = ref(false)

function saveDraft() {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Editor">
      <template #extra>
        <Button severity="primary" :label="t(LocaleKeys.button.save)" @click="saveDraft" />
        <span v-if="saved" class="showcase-status showcase-status--online">Saved</span>
      </template>
    </PageHeader>

    <Card title="Markdown draft">
      <Textarea v-model="content" :rows="18" fluid placeholder="Write content…" />
    </Card>
  </div>
</template>
