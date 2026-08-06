<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import SelectableTree from "../../internal/SelectableTree.vue";
import type {
  GbsDeviceNode,
  GbsDeviceTreeEmits,
  GbsDeviceTreeProps,
} from "./types";
import "./style.scss";
const props = withDefaults(defineProps<GbsDeviceTreeProps>(), {
  data: () => [],
  options: () => [],
  modelValue: () => [],
  expandedKeys: () => [],
  filter: "",
  loading: false,
  disabled: false,
  checkStrategy: "leaf",
  telemetry: undefined,
});
const emit = defineEmits<GbsDeviceTreeEmits>();
const { t } = useLocale();
const selected = ref([...props.modelValue]);
const expanded = ref([...props.expandedKeys]);
watch(
  () => props.modelValue,
  (value) => {
    selected.value = [...value];
  },
);
watch(
  () => props.expandedKeys,
  (value) => {
    expanded.value = [...value];
  },
);
const roots = computed(() =>
  props.options.length ? props.options : props.data,
);
function filterNodes(nodes: GbsDeviceNode[]): GbsDeviceNode[] {
  const query = props.filter.trim().toLocaleLowerCase();
  if (!query) return nodes;
  return nodes.flatMap((node) => {
    const children = node.children ? filterNodes(node.children) : [];
    return node.label.toLocaleLowerCase().includes(query) || children.length
      ? [{ ...node, children }]
      : [];
  });
}
const visibleNodes = computed(() => filterNodes(roots.value));
function descendants(node: GbsDeviceNode): GbsDeviceNode[] {
  return [node, ...(node.children?.flatMap(descendants) ?? [])];
}
function check(node: GbsDeviceNode, checked: boolean) {
  if (props.disabled || node.disabled) return;
  const targets =
    props.checkStrategy === "all"
      ? descendants(node)
      : node.children?.length
        ? descendants(node).filter((item) => !item.children?.length)
        : [node];
  const next = new Set(selected.value);
  targets
    .filter((item) => !item.disabled)
    .forEach((item) =>
      checked ? next.add(item.value) : next.delete(item.value),
    );
  selected.value = [...next];
  emit("update:modelValue", selected.value);
  emit("change", selected.value);
  emit("check", node, checked);
  trackEmit({
    component: "GbsDeviceTree",
    type: "check",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: node.value, checked },
  });
}
function toggle(node: GbsDeviceNode) {
  const next = new Set(expanded.value);
  const open = !next.has(node.value);
  open ? next.add(node.value) : next.delete(node.value);
  expanded.value = [...next];
  emit("update:expandedKeys", expanded.value);
  emit("expand", node, open);
}
</script>
<template>
  <section
    :class="[
      'vp-gbs-device-tree',
      { 'vp-gbs-device-tree--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-busy="loading"
    data-component="GbsDeviceTree"
  >
    <header class="vp-gbs-device-tree__header">
      <div>
        <h3 class="vp-gbs-device-tree__title">
          {{ title ?? t("industry.gbs.deviceId") }}
        </h3>
        <p v-if="description" class="vp-gbs-device-tree__description">
          {{ description }}
        </p>
      </div>
      <slot name="action" />
    </header>
    <div v-if="loading" class="vp-gbs-device-tree__muted" role="status">
      {{ t("common.loading") }}
    </div>
    <SelectableTree
      v-else-if="visibleNodes.length"
      :nodes="visibleNodes"
      :selected="selected"
      :expanded="expanded"
      :disabled="disabled"
      role="tree"
      @check="check"
      @toggle="toggle"
    />
    <p v-else class="vp-gbs-device-tree__muted" role="status">
      {{ t("common.noData") }}
    </p>
    <slot name="footer" />
  </section>
</template>
