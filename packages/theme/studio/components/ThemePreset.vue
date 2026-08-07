<script setup lang="ts">
import { designStyles, type DesignStyleName } from '../../core/registry'
import { useLocale } from '@amg-webui/hooks'

defineProps<{
  active: DesignStyleName
}>()

const emit = defineEmits<{
  select: [DesignStyleName]
}>()

const { t } = useLocale()
</script>

<template>
  <div class="vp-theme-preset">
    <button
      v-for="theme in designStyles"
      :key="theme.name"
      type="button"
      class="vp-theme-preset__item"
      :class="{ 'vp-theme-preset__item--active': active === theme.name }"
      @click="emit('select', theme.name)"
    >
      <span
        class="vp-theme-preset__swatch"
        :style="{
          background: `linear-gradient(135deg, ${theme.preview.primary} 0%, ${theme.preview.background} 100%)`
        }"
      />
      <span class="vp-theme-preset__meta">
        <span class="vp-theme-preset__label">{{ theme.label }}</span>
        <span class="vp-theme-preset__cat">{{ theme.category }}</span>
      </span>
      <span v-if="theme.supportsScheme" class="vp-theme-preset__badge">
        {{ t('theme.studio.preset.scheme') }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.vp-theme-preset {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--spacing-sm);
}

.vp-theme-preset__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--ds-surface);
  cursor: pointer;
  text-align: left;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.vp-theme-preset__item:hover,
.vp-theme-preset__item--active {
  border-color: var(--ds-accent);
  box-shadow: var(--shadow-sm);
}

.vp-theme-preset__swatch {
  display: block;
  height: 2.5rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--ds-border);
}

.vp-theme-preset__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vp-theme-preset__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--ds-text);
}

.vp-theme-preset__cat {
  font-size: var(--font-size-xs);
  color: var(--ds-text-muted);
}

.vp-theme-preset__badge {
  align-self: flex-start;
  font-size: var(--font-size-xs);
  color: var(--ds-accent);
}
</style>
