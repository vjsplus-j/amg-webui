<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { normalizeTreeNodes, type TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useTreeState } from '@amg-webui/utils/data-display/useTreeState'
import type { TreeFormProps, TreeFormEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TreeFormProps & { options?: TreeNode[] }>(), {
  options: () => [],
  disabled: false
})
const emit = defineEmits<TreeFormEmits>()
const { t } = useLocale()

const roots = computed(() => normalizeTreeNodes(props.data, props.options))
const modelRef = toRef(props, 'modelValue')
const { flatRows, activeId, toggleExpand, selectNode } = useTreeState(roots, modelRef, emit as never, { checkable: false })

const formValues = ref<Record<string, string>>({})
const activeNode = computed(() => flatRows.value.find((r) => r.id === activeId.value)?.node ?? null)

function saveField(key: string, value: string) {
  formValues.value = { ...formValues.value, [key]: value }
  emit('change', formValues.value)
}

const titleText = computed(() => props.title ?? t('component.tree-form.title'))
</script>

<template>
  <div :class="['vp-tree-form', 'vp-tree-form__panel', { 'vp-tree-form--disabled': disabled }, props.class]" :style="style">
    <strong class="vp-tree-form__heading">{{ titleText }}</strong>
    <div class="vp-tree-form__layout">
      <ul class="vp-tree-form__tree">
        <li
          v-for="row in flatRows"
          :key="row.id"
          class="vp-tree-form__row"
          :class="{ 'vp-tree-form__row--active': activeId === row.id }"
          :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
        >
          <button v-if="row.hasChildren" type="button" @click="toggleExpand(row.id)">{{ row.expanded ? '-' : '+' }}</button>
          <button type="button" class="vp-tree-form__label" @click="selectNode(row.id, row.node)">{{ row.node.label }}</button>
        </li>
      </ul>
      <form v-if="activeNode" class="vp-tree-form__form" @submit.prevent>
        <label class="vp-tree-form__field">
          <span>{{ t('common.value') }}</span>
          <input
            class="vp-tree-form__input"
            type="text"
            :value="formValues[activeNode.label] ?? ''"
            :placeholder="t('common.optional')"
            @input="saveField(activeNode.label, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <button type="button" class="vp-tree-form__control" @click="emit('change', formValues)">{{ t('button.save') }}</button>
      </form>
      <p v-else class="vp-tree-form__muted">{{ t('common.noData') }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-tree-form__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
.vp-tree-form__tree {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 20rem;
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}
.vp-tree-form__row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  min-height: var(--height-md);
  padding: 0 var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
}
.vp-tree-form__row--active {
  background: var(--surface-2);
}
.vp-tree-form__label {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
}
.vp-tree-form__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}
.vp-tree-form__input {
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  width: 100%;
}
.vp-tree-form__control {
  appearance: none;
  border: 1px solid transparent;
  background: var(--primary-500);
  color: var(--surface-0);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-lg);
  cursor: pointer;
  align-self: flex-start;
}
</style>
