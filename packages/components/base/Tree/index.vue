<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { normalizeTreeNodes } from "@amg-webui/utils/data-display/tree-types";
import { useTreeState } from "@amg-webui/utils/data-display/useTreeState";
import { useVirtualList } from "@amg-webui/utils/data-display/useVirtualList";
import Spin from "../Spin/index.vue";
import TreeCheckbox from "./TreeCheckbox.vue";
import type { TreeProps, TreeEmits } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<TreeProps>(), {
  options: () => [],
  checkable: true,
  checkStrictly: false,
  defaultExpandAll: false,
  disabled: false,
  loading: false,
  virtual: undefined,
  virtualThreshold: 100,
  filterDebounce: 200,
});

const emit = defineEmits<TreeEmits>();
const { t } = useLocale();

const roots = computed(() => normalizeTreeNodes(props.data, props.options));
const modelRef = toRef(props, "modelValue");
const viewportRef = ref<HTMLElement | null>(null);

const {
  searchQuery,
  flatRows,
  activeId,
  toggleExpand,
  toggleCheck,
  getCheckState,
  selectNode,
  expandAll,
  collapseAll,
} = useTreeState(roots, modelRef, emit, {
  checkable: props.checkable,
  defaultExpandAll: props.defaultExpandAll,
  checkStrictly: props.checkStrictly,
  filterDebounce: props.filterDebounce,
});

const flatRef = computed(() => flatRows.value);
const virtualEnabled = computed(
  () =>
    props.virtual === true ||
    (props.virtual !== false && flatRows.value.length > props.virtualThreshold),
);
const {
  visibleItems,
  totalHeight,
  offsetY,
  itemHeight,
  onScroll,
  reset: resetVirtual,
} = useVirtualList(flatRef, {
  containerHeight: 320,
  containerRef: viewportRef,
});
watch(searchQuery, resetVirtual);

const titleText = computed(() => props.title ?? t("component.tree.title"));
const displayRows = computed(() =>
  virtualEnabled.value ? visibleItems.value.map((v) => v.item) : flatRows.value,
);
</script>

<template>
  <div
    :class="[
      'vp-tree',
      'vp-tree__panel',
      {
        'vp-tree--disabled': disabled,
        'vp-tree--loading': loading,
        'vp-tree--virtual': virtualEnabled,
      },
      props.class,
    ]"
    :style="style"
  >
    <div class="vp-tree__toolbar">
      <strong class="vp-tree__title">{{ titleText }}</strong>
      <input
        v-model="searchQuery"
        class="vp-tree__search"
        type="search"
        :placeholder="t('common.search')"
        :disabled="disabled"
      />
      <button
        type="button"
        class="vp-tree__action"
        :disabled="disabled"
        @click="expandAll"
      >
        {{ t("common.expand") }}
      </button>
      <button
        type="button"
        class="vp-tree__action"
        :disabled="disabled"
        @click="collapseAll"
      >
        {{ t("common.collapse") }}
      </button>
    </div>

    <div class="vp-tree__body">
      <div
        ref="viewportRef"
        class="vp-tree__viewport"
        role="tree"
        :aria-label="titleText"
        :aria-busy="loading || undefined"
        @scroll="virtualEnabled ? onScroll : undefined"
      >
        <template v-if="flatRows.length">
          <div
            v-if="virtualEnabled"
            class="vp-tree__spacer"
            :style="{ height: `${totalHeight}px` }"
          >
            <ul
              class="vp-tree__list vp-tree__list--virtual"
              :style="{ transform: `translateY(${offsetY}px)` }"
            >
              <li
                v-for="row in displayRows"
                :key="row.id"
                role="treeitem"
                class="vp-tree__row"
                :class="{ 'vp-tree__row--active': activeId === row.id }"
                :style="{
                  height: `${itemHeight}px`,
                  paddingLeft: `calc(${row.depth} * var(--spacing-lg))`,
                }"
                :aria-expanded="row.hasChildren ? row.expanded : undefined"
              >
                <button
                  v-if="row.hasChildren"
                  type="button"
                  class="vp-tree__toggle"
                  :aria-label="
                    row.expanded ? t('common.collapse') : t('common.expand')
                  "
                  :disabled="disabled"
                  @click="toggleExpand(row.id, row.node)"
                >
                  {{ row.expanded ? "−" : "+" }}
                </button>
                <span v-else class="vp-tree__indent" aria-hidden="true" />
                <TreeCheckbox
                  v-if="checkable"
                  :checked="getCheckState(row.node) === 'checked'"
                  :indeterminate="getCheckState(row.node) === 'indeterminate'"
                  :disabled="disabled || row.node.disabled"
                  @change="toggleCheck(row.node)"
                />
                <button
                  type="button"
                  class="vp-tree__label"
                  :disabled="disabled || row.node.disabled"
                  @click="selectNode(row.id, row.node)"
                >
                  {{ row.node.label }}
                </button>
              </li>
            </ul>
          </div>
          <ul v-else class="vp-tree__list">
            <li
              v-for="row in displayRows"
              :key="row.id"
              role="treeitem"
              class="vp-tree__row"
              :class="{ 'vp-tree__row--active': activeId === row.id }"
              :style="{ paddingLeft: `calc(${row.depth} * var(--spacing-lg))` }"
              :aria-expanded="row.hasChildren ? row.expanded : undefined"
            >
              <button
                v-if="row.hasChildren"
                type="button"
                class="vp-tree__toggle"
                :aria-label="
                  row.expanded ? t('common.collapse') : t('common.expand')
                "
                :disabled="disabled"
                @click="toggleExpand(row.id, row.node)"
              >
                {{ row.expanded ? "−" : "+" }}
              </button>
              <span v-else class="vp-tree__indent" aria-hidden="true" />
              <TreeCheckbox
                v-if="checkable"
                :checked="getCheckState(row.node) === 'checked'"
                :indeterminate="getCheckState(row.node) === 'indeterminate'"
                :disabled="disabled || row.node.disabled"
                @change="toggleCheck(row.node)"
              />
              <button
                type="button"
                class="vp-tree__label"
                :disabled="disabled || row.node.disabled"
                @click="selectNode(row.id, row.node)"
              >
                {{ row.node.label }}
              </button>
            </li>
          </ul>
        </template>
        <slot v-else name="empty">
          <p class="vp-tree__muted">{{ t("common.noData") }}</p>
        </slot>
      </div>

      <Spin
        v-if="loading"
        class="vp-tree__spin"
        :spinning="loading"
        size="sm"
      />
    </div>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.vp-tree__body {
  position: relative;
  margin-top: var(--spacing-md);
}

.vp-tree__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  padding: 0 var(--spacing-md);
  background: var(--surface-0);
  color: var(--text-primary);
}

.vp-tree__action {
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--theme-btn-radius);
  height: var(--height-md);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}

.vp-tree__viewport {
  overflow: auto;
  max-height: 20rem;
}

.vp-tree__spacer {
  position: relative;
}

.vp-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;

  &--virtual {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
}

.vp-tree__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-md);
  border-bottom: 1px solid var(--ds-border);
}

.vp-tree__row--active .vp-tree__label {
  color: var(--primary-500);
  font-weight: 600;
}

.vp-tree__toggle,
.vp-tree__label {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.vp-tree__indent {
  display: inline-block;
  width: var(--spacing-lg);
}

.vp-tree__checkbox {
  flex-shrink: 0;
}

.vp-tree__spin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface-1) 72%, transparent);
  border-radius: var(--theme-card-radius);
}
</style>
