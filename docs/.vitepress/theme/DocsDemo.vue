<script setup lang="ts">
import { computed, ref } from 'vue'
import { sharedDemoRegistry, type SharedDemoId } from '@amg-webui/demos/registry'

const props = defineProps<{
  name: SharedDemoId
  title?: string
}>()

const entry = computed(() => sharedDemoRegistry[props.name])
const showSource = ref(false)

const heading = computed(() => props.title ?? entry.value?.title ?? 'Demo')

const displaySource = computed(() => entry.value?.source ?? '')

async function copySource() {
  if (typeof navigator === 'undefined' || !entry.value) return
  await navigator.clipboard.writeText(displaySource.value)
}
</script>

<template>
  <div v-if="entry" class="amg-docs-demo">
    <div class="amg-docs-demo__header">
      <span class="amg-docs-demo__title">{{ heading }}</span>
      <button type="button" class="amg-docs-demo__toggle" @click="showSource = !showSource">
        {{ showSource ? '隐藏源码' : '查看源码' }}
      </button>
    </div>
    <div class="amg-docs-demo__preview">
      <component :is="entry.component" />
    </div>
    <div v-show="showSource" class="amg-docs-demo__source">
      <div class="amg-docs-demo__source-bar">
        <span>Basic.vue</span>
        <button type="button" class="amg-docs-demo__copy" @click="copySource">复制</button>
      </div>
      <pre><code>{{ displaySource }}</code></pre>
    </div>
  </div>
  <p v-else class="amg-docs-demo__missing">Demo <code>{{ name }}</code> 未注册。</p>
</template>

<style scoped>
.amg-docs-demo {
  margin: 1.25rem 0;
  border: 1px solid var(--vp-c-divider, var(--border-1, #e2e8f0));
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  background: var(--vp-c-bg-soft, var(--surface-0, #fff));
}

.amg-docs-demo__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider, var(--border-1, #e2e8f0));
  background: var(--vp-c-bg, var(--surface-1, #f8fafc));
}

.amg-docs-demo__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1, var(--text-1, #0f172a));
}

.amg-docs-demo__toggle,
.amg-docs-demo__copy {
  border: 1px solid var(--vp-c-divider, var(--border-1, #e2e8f0));
  border-radius: var(--radius-md, 8px);
  background: var(--vp-c-bg, var(--surface-0, #fff));
  color: var(--vp-c-text-2, var(--text-2, #475569));
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
}

.amg-docs-demo__toggle:hover,
.amg-docs-demo__copy:hover {
  color: var(--vp-c-brand-1, var(--primary-600, #4f46e5));
  border-color: var(--vp-c-brand-1, var(--primary-500, #6366f1));
}

.amg-docs-demo__preview {
  padding: 1rem 1.25rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.amg-docs-demo__source {
  border-top: 1px solid var(--vp-c-divider, var(--border-1, #e2e8f0));
}

.amg-docs-demo__source-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2, var(--text-2, #64748b));
  background: var(--vp-c-bg, var(--surface-1, #f1f5f9));
}

.amg-docs-demo__source pre {
  margin: 0;
  padding: 0.875rem 1rem;
  overflow: auto;
  font-size: 0.8125rem;
  line-height: 1.55;
  background: var(--vp-code-block-bg, #0f172a);
  color: var(--vp-code-block-color, #e2e8f0);
}

.amg-docs-demo__missing {
  color: var(--vp-c-danger-1, #dc2626);
  font-size: 0.875rem;
}
</style>
