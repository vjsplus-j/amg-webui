<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { Icon } from '@amg-webui/components/base'
import { ToastService } from '@amg-webui/theme'
import DemoCode from './DemoCode.vue'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    code?: string
    /** Language hint for DemoCode (vue / html / ts …). */
    lang?: string
    /** Open the code panel on mount (Basic / getting-started blocks). */
    defaultOpen?: boolean
    /** Show gutter line numbers in DemoCode. */
    lineNumbers?: boolean
  }>(),
  {
    description: '',
    code: '',
    lang: 'vue',
    defaultOpen: false,
    lineNumbers: true
  }
)

const { t } = useLocale()
const open = ref(props.defaultOpen)
const copying = ref(false)

watch(
  () => props.defaultOpen,
  (v) => {
    if (v) open.value = true
  }
)

const resolvedCode = computed(() => props.code?.trim() ?? '')

async function copyCode() {
  const text = resolvedCode.value
  if (!text || copying.value) return
  copying.value = true
  try {
    await navigator.clipboard.writeText(text)
    ToastService.success({ summary: t(LocaleKeys.exampleDoc.copied) })
  } catch {
    ToastService.info({ summary: t(LocaleKeys.exampleDoc.copyCode) })
  } finally {
    window.setTimeout(() => {
      copying.value = false
    }, 400)
  }
}
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
        v-if="resolvedCode"
        type="button"
        class="vp-demo-block__toggle"
        :disabled="copying"
        @click="copyCode"
      >
        <Icon name="Copy" size="sm" />
        <span>{{ t(LocaleKeys.exampleDoc.copyCode) }}</span>
      </button>
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

    <slot v-if="open" name="code">
      <DemoCode
        v-if="resolvedCode"
        :code="resolvedCode"
        :lang="props.lang"
        :line-numbers="props.lineNumbers"
      />
    </slot>
  </section>
</template>

<style scoped>
.vp-demo-block {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  /* Keep visible so overlays (dropdown / popover) are not clipped */
  overflow: visible;
}

.vp-demo-block__head {
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--theme-card-pad);
  min-height: var(--height-xl);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--spacing-md);
}

/* Single root wrappers (rows/stacks) stretch; multi-child chip rows stay wrap. */
.vp-demo-block__preview > :slotted(:only-child) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-demo-block__actions {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
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

.vp-demo-block__toggle:hover:not(:disabled) {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.vp-demo-block__toggle:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
