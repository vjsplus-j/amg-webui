<script setup lang="ts">
import { computed } from 'vue'
import { Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import type { ThemeValidationResult } from '../types'

const props = defineProps<{
  result: ThemeValidationResult
}>()

const { t } = useLocale()

const status = computed(() =>
  props.result.valid ? t('theme.studio.validation.pass') : t('theme.studio.validation.fail')
)
</script>

<template>
  <section class="vp-theme-validation">
    <div class="vp-theme-validation__head">
      <Tag :type="result.valid ? 'success' : 'danger'">{{ status }}</Tag>
      <span class="vp-theme-validation__count">
        {{ result.issues.length }} {{ t('theme.studio.validation.issues') }}
      </span>
    </div>
    <ul v-if="result.issues.length" class="vp-theme-validation__list">
      <li
        v-for="(issue, idx) in result.issues"
        :key="`${issue.code}-${idx}`"
        class="vp-theme-validation__item"
        :data-severity="issue.severity"
      >
        <Tag :type="issue.severity === 'error' ? 'danger' : 'warning'" size="sm">
          {{ issue.severity }}
        </Tag>
        <span>{{ issue.message }}</span>
        <code v-if="issue.token">{{ issue.token }}</code>
      </li>
    </ul>
    <p v-else class="vp-theme-validation__ok">{{ t('theme.studio.validation.clean') }}</p>
  </section>
</template>

<style scoped>
.vp-theme-validation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.vp-theme-validation__head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.vp-theme-validation__count {
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
}

.vp-theme-validation__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.vp-theme-validation__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--ds-text);
}

.vp-theme-validation__item code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--ds-text-muted);
}

.vp-theme-validation__ok {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
}
</style>
