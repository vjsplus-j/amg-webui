<script setup lang="ts">
import Icon from '@amg-webui/core/Icon/index.vue';
export interface SelectableTreeNode {
  label: string;
  value: string | number;
  children?: SelectableTreeNode[];
  disabled?: boolean;
  status?: string;
}
defineOptions({ name: "VpSelectableTree" });
defineProps<{
  nodes: SelectableTreeNode[];
  level?: number;
  selected: Array<string | number>;
  expanded: Array<string | number>;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  (e: "toggle", node: SelectableTreeNode): void;
  (e: "check", node: SelectableTreeNode, checked: boolean): void;
}>();
</script>
<template>
  <ul class="vp-selectable-tree" role="group">
    <li
      v-for="node in nodes"
      :key="node.value"
      class="vp-selectable-tree__item"
      role="treeitem"
      :aria-level="(level ?? 0) + 1"
      :aria-expanded="
        node.children?.length ? expanded.includes(node.value) : undefined
      "
      :aria-selected="selected.includes(node.value)"
    >
      <div
        class="vp-selectable-tree__row"
        :style="{
          paddingInlineStart: `calc(var(--spacing-md) * ${level ?? 0})`,
        }"
      >
        <button
          v-if="node.children?.length"
          type="button"
          class="vp-selectable-tree__toggle"
          :disabled="disabled || node.disabled"
          :aria-label="node.label"
          @click="emit('toggle', node)"
        >
          <Icon
            name="ChevronRight"
            size="sm"
            :class="
              expanded.includes(node.value)
                ? 'vp-selectable-tree__chevron--open'
                : ''
            "
          /></button
        ><span v-else class="vp-selectable-tree__spacer" />
        <label class="vp-selectable-tree__label"
          ><input
            type="checkbox"
            :disabled="disabled || node.disabled"
            :checked="selected.includes(node.value)"
            @change="
              emit('check', node, ($event.target as HTMLInputElement).checked)
            "
          /><span>{{ node.label }}</span
          ><small v-if="node.status" class="vp-selectable-tree__status">{{
            node.status
          }}</small></label
        >
      </div>
      <VpSelectableTree
        v-if="node.children?.length && expanded.includes(node.value)"
        :nodes="node.children"
        :level="(level ?? 0) + 1"
        :selected="selected"
        :expanded="expanded"
        :disabled="disabled"
        @toggle="emit('toggle', $event)"
        @check="(node, checked) => emit('check', node, checked)"
      />
    </li>
  </ul>
</template>
<style lang="scss">
.vp-selectable-tree {
  margin: 0;
  padding: 0;
  list-style: none;
  &__row {
    display: flex;
    align-items: center;
    min-height: var(--height-sm);
    border-radius: var(--theme-btn-radius);
    &:hover {
      background: var(--surface-2);
    }
  }
  &__toggle {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: var(--height-xs);
    height: var(--height-xs);
    padding: 0;
    color: var(--text-secondary);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  &__spacer {
    width: var(--height-xs);
  }
  &__chevron--open {
    transform: rotate(90deg);
  }
  &__label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
    min-width: 0;
    padding: var(--spacing-xs);
    cursor: pointer;
  }
  &__status {
    margin-inline-start: auto;
    color: var(--text-secondary);
  }
}
</style>
