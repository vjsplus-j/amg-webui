<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, CopyText } from '@amg-webui/core'
import { Select } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import type { ThemeExportFormat, ThemeStudioDraft } from '../types'
import { downloadThemeExport, exportTheme } from '../export'

const props = defineProps<{
  draft: ThemeStudioDraft
}>()

const { t } = useLocale()
const format = ref<ThemeExportFormat>('css')

const formatOptions = computed(() => [
  { label: 'CSS Variables', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'theme.ts', value: 'theme-ts' },
  { label: 'SCSS', value: 'scss' }
])

const exported = computed(() => exportTheme(format.value, props.draft))

function download() {
  const { filename, content, mime } = downloadThemeExport(format.value, props.draft)
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="vp-theme-export">
    <div class="vp-theme-export__bar">
      <Select
        v-model="format"
        :options="formatOptions"
        size="sm"
        style="min-width: 10rem"
      />
      <Button size="sm" @click="download">{{ t('theme.studio.export.download') }}</Button>
      <CopyText :text="exported" :label="t('theme.studio.export.copy')" />
    </div>
    <pre class="vp-theme-export__code">{{ exported }}</pre>
  </section>
</template>

<style scoped>
.vp-theme-export {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.vp-theme-export__bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.vp-theme-export__code {
  margin: 0;
  padding: var(--spacing-md);
  max-height: 16rem;
  overflow: auto;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
  color: var(--ds-text);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
