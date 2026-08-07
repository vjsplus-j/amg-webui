import { computed, onUnmounted, ref, watch, type Ref } from "vue";
import {
  moveRovingIndex,
  type KeyboardNavAction,
} from "../engines/keyboardNav";
import {
  type FlatTreeRow,
  type TreeCheckState,
  type TreeNode,
  nodeKey,
  nodeValue,
} from "./tree-types";

export function flattenVisibleTree(
  nodes: TreeNode[],
  expanded: Set<string>,
  parentId = "root",
  depth = 0,
): FlatTreeRow[] {
  const rows: FlatTreeRow[] = [];
  for (const node of nodes) {
    const id = nodeKey(node, parentId);
    const hasChildren = Boolean(node.children?.length) && !node.isLeaf;
    const expandedState = expanded.has(id);
    rows.push({
      id,
      node,
      depth,
      hasChildren,
      expanded: expandedState,
      parentId,
    });
    if (hasChildren && expandedState) {
      rows.push(...flattenVisibleTree(node.children!, expanded, id, depth + 1));
    }
  }
  return rows;
}

export function collectDescendantValues(node: TreeNode): (string | number)[] {
  const vals: (string | number)[] = [];
  const walk = (n: TreeNode) => {
    vals.push(nodeValue(n));
    n.children?.forEach(walk);
  };
  walk(node);
  return vals;
}

export function filterTreeNodes(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const walk = (list: TreeNode[]): TreeNode[] =>
    list
      .map((n) => {
        const kids = n.children ? walk(n.children) : [];
        const selfMatch = n.label.toLowerCase().includes(q);
        if (selfMatch || kids.length)
          return { ...n, children: kids.length ? kids : n.children };
        return null;
      })
      .filter(Boolean) as TreeNode[];
  return walk(nodes);
}

export function getNodeCheckState(
  node: TreeNode,
  checkedSet: Set<string | number>,
  checkStrictly: boolean,
): TreeCheckState {
  const val = nodeValue(node);
  if (checkStrictly) {
    return checkedSet.has(val) ? "checked" : "unchecked";
  }
  const desc = collectDescendantValues(node);
  const checkedCount = desc.filter((v) => checkedSet.has(v)).length;
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === desc.length) return "checked";
  return "indeterminate";
}

export type TreeStateEmit = {
  (e: "update:modelValue", value: unknown): void;
  (e: "change", value: unknown): void;
  (e: "node-click", node: TreeNode): void;
  (
    e: "check-change",
    node: TreeNode,
    checked: boolean,
    indeterminate: boolean,
  ): void;
  (e: "node-expand", node: TreeNode): void;
  (e: "node-collapse", node: TreeNode): void;
};

export interface UseTreeStateOptions {
  checkable?: boolean;
  defaultExpandAll?: boolean;
  checkStrictly?: boolean;
  filterDebounce?: number;
}

export function useTreeState(
  roots: Ref<TreeNode[]>,
  modelValue: Ref<unknown>,
  emit: TreeStateEmit,
  opts?: UseTreeStateOptions,
) {
  const checkStrictly = opts?.checkStrictly ?? false;
  const expandedSet = ref<Set<string>>(new Set());
  const searchQuery = ref("");
  const appliedSearchQuery = ref("");
  const activeId = ref<string | null>(null);
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  watch(searchQuery, (query) => {
    if (searchTimer) clearTimeout(searchTimer);
    const delay = Math.max(0, opts?.filterDebounce ?? 200);
    if (!delay) {
      appliedSearchQuery.value = query;
      return;
    }
    searchTimer = setTimeout(() => {
      appliedSearchQuery.value = query;
    }, delay);
  });

  onUnmounted(() => {
    if (searchTimer) clearTimeout(searchTimer);
  });

  function collectAllExpandableIds(
    nodes: TreeNode[],
    parentId = "root",
  ): Set<string> {
    const all = new Set<string>();
    const walk = (list: TreeNode[], pid = "root") => {
      for (const n of list) {
        const id = nodeKey(n, pid);
        if (n.children?.length && !n.isLeaf) {
          all.add(id);
          walk(n.children, id);
        }
      }
    };
    walk(nodes, parentId);
    return all;
  }

  if (opts?.defaultExpandAll) {
    watch(
      roots,
      (r) => {
        expandedSet.value = collectAllExpandableIds(r);
      },
      { immediate: true },
    );
  }

  const checkedSet = ref<Set<string | number>>(
    new Set(
      Array.isArray(modelValue.value)
        ? (modelValue.value as (string | number)[])
        : [],
    ),
  );

  watch(
    () => modelValue.value,
    (v) => {
      checkedSet.value = new Set(
        Array.isArray(v) ? (v as (string | number)[]) : [],
      );
    },
  );

  const filteredRoots = computed(() =>
    filterTreeNodes(roots.value, appliedSearchQuery.value),
  );
  const flatRows = computed(() =>
    flattenVisibleTree(filteredRoots.value, expandedSet.value),
  );

  function emitChecked(next: Set<string | number>) {
    const arr = [...next];
    emit("update:modelValue", arr);
    emit("change", arr);
  }

  function toggleExpand(id: string, node?: TreeNode) {
    const wasExpanded = expandedSet.value.has(id);
    const next = new Set(expandedSet.value);
    if (wasExpanded) next.delete(id);
    else next.add(id);
    expandedSet.value = next;
    if (node) {
      if (wasExpanded) emit("node-collapse", node);
      else emit("node-expand", node);
    }
  }

  function setChecked(val: string | number, on: boolean) {
    const next = new Set(checkedSet.value);
    if (on) next.add(val);
    else next.delete(val);
    checkedSet.value = next;
    emitChecked(next);
  }

  function toggleCheck(node: TreeNode) {
    const state = getNodeCheckState(node, checkedSet.value, checkStrictly);
    const nextChecked = state !== "checked";
    const next = new Set(checkedSet.value);

    if (checkStrictly) {
      const val = nodeValue(node);
      if (nextChecked) next.add(val);
      else next.delete(val);
    } else {
      const vals = collectDescendantValues(node);
      vals.forEach((v) => (nextChecked ? next.add(v) : next.delete(v)));
    }

    checkedSet.value = next;
    emitChecked(next);

    const afterState = getNodeCheckState(node, next, checkStrictly);
    emit(
      "check-change",
      node,
      afterState === "checked",
      afterState === "indeterminate",
    );
  }

  function getCheckState(node: TreeNode): TreeCheckState {
    return getNodeCheckState(node, checkedSet.value, checkStrictly);
  }

  function selectNode(id: string, node: TreeNode) {
    activeId.value = id;
    if (!opts?.checkable) {
      const val = nodeValue(node);
      emit("update:modelValue", val);
      emit("change", val);
    }
    emit("node-click", node);
  }

  function expandAll() {
    expandedSet.value = collectAllExpandableIds(roots.value);
  }

  function collapseAll() {
    expandedSet.value = new Set();
  }

  function activeRowIndex(): number {
    const rows = flatRows.value;
    if (!rows.length) return -1;
    if (!activeId.value) return 0;
    const idx = rows.findIndex((r) => r.id === activeId.value);
    return idx >= 0 ? idx : 0;
  }

  function ensureActiveRow() {
    const rows = flatRows.value;
    if (!rows.length) {
      activeId.value = null;
      return null;
    }
    if (!activeId.value || !rows.some((r) => r.id === activeId.value)) {
      activeId.value = rows[0]!.id;
    }
    return rows.find((r) => r.id === activeId.value) ?? null;
  }

  function moveActive(action: KeyboardNavAction) {
    const rows = flatRows.value;
    if (!rows.length) return;
    const idx = activeRowIndex();
    const nextIdx = moveRovingIndex(idx, action, rows.length, true);
    activeId.value = rows[nextIdx]?.id ?? null;
  }

  function expandActive() {
    const row = ensureActiveRow();
    if (row?.hasChildren && !row.expanded) toggleExpand(row.id, row.node);
  }

  function collapseActive() {
    const row = ensureActiveRow();
    if (row?.hasChildren && row.expanded) toggleExpand(row.id, row.node);
  }

  return {
    expandedSet,
    searchQuery,
    activeId,
    filteredRoots,
    flatRows,
    checkedSet,
    toggleExpand,
    setChecked,
    toggleCheck,
    getCheckState,
    selectNode,
    expandAll,
    collapseAll,
    ensureActiveRow,
    moveActive,
    expandActive,
    collapseActive,
  };
}
