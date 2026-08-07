<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@amg-webui/core'
import { Textarea } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import type { ThemeStudioDraft } from '../types'
import { importThemeContent, importThemeFile } from '../import'

const emit = defineEmits<{
  import: [ThemeStudioDraft]
}>()

const { t } = useLocale()
const paste = ref('')

function fromPaste() {
  const draft = importThemeContent(paste.value)
  if (!draft) {
    Message.error(t('theme.studio.import.fail'))
    return
  }
  emit('import', draft)
  Message.success(t('theme.studio.import.ok'))
  paste.value = ''
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const text = String(reader.result ?? '')
    const draft = importThemeFile(text, file.name)
    if (!draft) {
      Message.error(t('theme.studio.import.fail'))
      return
    }
    emit('import', draft)
    Message.success(t('theme.studio.import.ok'))
  }
  reader.readAsText(file)
  input.value = ''
}
</script>

<template>
  <section class="vp-theme-import">
    <Textarea
      v-model="paste"
      :rows="4"
      :placeholder="t('theme.studio.import.placeholder')"
    />
    <div class="vp-theme-import__actions">
      <Button size="sm" variant="solid" @click="fromPaste">
        {{ t('theme.studio.import.paste') }}
      </Button>
      <label class="vp-theme-import__file">
        <input type="file" accept=".json,.css,.scss,.ts" hidden @change="onFileChange" />
        <Button size="sm" tag="span">{{ t('theme.studio.import.file') }}</Button>
      </label>
    </div>
  </section>
</template>

<style scoped>
.vp-theme-import {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.vp-theme-import__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.vp-theme-import__file {
  cursor: pointer;
}
</style>
