<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from 'amg-webui/core'
import { useLocale } from 'amg-webui/hooks'
import { LocaleKeys } from 'amg-webui/locale'

const props = defineProps<{
  code: string
  language?: string
  filename?: string
}>()

const { t } = useLocale()
const copied = ref(false)

const display = computed(() => props.code.replace(/\r\n/g, '\n').trimEnd() + '\n')

async function copy() {
  try {
    await navigator.clipboard.writeText(display.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="intro-code">
    <div class="intro-code__bar">
      <span class="intro-code__meta">
        <span v-if="filename" class="intro-code__file">{{ filename }}</span>
        <span v-if="language" class="intro-code__lang">{{ language }}</span>
      </span>
      <Button size="sm" variant="text" @click="copy">
        {{ copied ? t(LocaleKeys.common.copied) : t(LocaleKeys.common.copy) }}
      </Button>
    </div>
    <pre class="intro-code__pre"><code>{{ display }}</code></pre>
  </div>
</template>

<style scoped lang="scss">
.intro-code {
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
  background: var(--surface-2, var(--surface-elevated, var(--surface-1)));
  overflow: hidden;
}

.intro-code__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 1px solid var(--ds-border);
  background: var(--surface-1);
}

.intro-code__meta {
  display: flex;
  gap: var(--spacing-sm);
  min-width: 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary, var(--text-secondary));
}

.intro-code__file {
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  color: var(--text-secondary);
}

.intro-code__pre {
  margin: 0;
  padding: var(--spacing-md);
  overflow-x: auto;
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: var(--font-size-xs);
  line-height: 1.55;
  color: var(--text-primary);
  white-space: pre;
}
</style>
