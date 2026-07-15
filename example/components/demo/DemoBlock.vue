<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { Icon } from '@amg-webui/components/base'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    code?: string
  }>(),
  {
    description: '',
    code: ''
  }
)

const { t } = useLocale()
const open = ref(false)
</script>

<template>
  <section class="vp-demo-block">
    <header class="vp-demo-block__head">
      <h3 class="vp-demo-block__title">{{ props.title }}</h3>
      <p v-if="props.description" class="vp-demo-block__desc">{{ props.description }}</p>
    </header>

    <div class="vp-demo-block__preview">
      <slot />
    </div>

    <div v-if="props.code || $slots.code" class="vp-demo-block__actions">
      <button
        type="button"
        class="vp-demo-block__toggle"
        :aria-expanded="open"
        @click="open = !open"
      >
        <Icon :name="open ? 'ChevronUp' : 'Code'" size="sm" />
        <span>{{ open ? t(LocaleKeys.exampleDoc.hideCode) : t(LocaleKeys.exampleDoc.showCode) }}</span>
      </button>
    </div>

    <pre v-if="open" class="vp-demo-block__code"><slot name="code"><code>{{ props.code }}</code></slot></pre>
  </section>
</template>

<style scoped>
.vp-demo-block {
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  /* Keep visible so overlays (dropdown / popover) are not clipped */
  overflow: visible;
}

.vp-demo-block__head {
  padding: var(--theme-card-pad);
  border-bottom: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius) var(--theme-card-radius) 0 0;
}

.vp-demo-block__title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-demo-block__desc {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-demo-block__preview {
  padding: var(--theme-card-pad);
  min-height: var(--height-xl);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-demo-block__actions {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-sm) var(--theme-card-pad);
  border-top: 1px solid var(--ds-border);
  background: var(--surface-2, var(--surface-1));
}

.vp-demo-block__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.vp-demo-block__toggle:hover {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.vp-demo-block__code {
  margin: 0;
  padding: var(--theme-card-pad);
  border-top: 1px solid var(--ds-border);
  background: var(--surface-2, var(--ds-bg));
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
  overflow: auto;
  max-height: 24rem;
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 0 0 var(--theme-card-radius) var(--theme-card-radius);
}
</style>
