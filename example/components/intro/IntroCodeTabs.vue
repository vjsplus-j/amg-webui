<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'
import IntroCodeBlock from './IntroCodeBlock.vue'

export interface IntroCodeTab {
  id: string
  labelKey: LocaleKey
  code: string
  language?: string
  filename?: string
}

const props = defineProps<{
  tabs: IntroCodeTab[]
}>()

const { t, locale } = useLocale()
const active = ref(props.tabs[0]?.id ?? '')

const current = computed(() => {
  void locale.value
  return props.tabs.find((tab) => tab.id === active.value) ?? props.tabs[0]
})
</script>

<template>
  <div class="intro-code-tabs">
    <div class="intro-code-tabs__list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="intro-code-tabs__tab"
        :class="{ 'intro-code-tabs__tab--active': active === tab.id }"
        :aria-selected="active === tab.id"
        @click="active = tab.id"
      >
        {{ t(tab.labelKey) }}
      </button>
    </div>
    <IntroCodeBlock
      v-if="current"
      :code="current.code"
      :language="current.language"
      :filename="current.filename"
    />
  </div>
</template>

<style scoped lang="scss">
.intro-code-tabs {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.intro-code-tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: calc(-1 * var(--spacing-xs));
  position: relative;
  z-index: 1;
  padding-inline: var(--spacing-sm);
}

.intro-code-tabs__tab {
  border: 1px solid var(--ds-border);
  border-bottom: 0;
  background: var(--surface-1);
  color: var(--text-secondary);
  font: inherit;
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  cursor: pointer;
}

.intro-code-tabs__tab--active {
  background: var(--surface-2, var(--surface-elevated));
  color: var(--text-primary);
}
</style>
