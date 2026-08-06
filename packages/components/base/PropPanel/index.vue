<script setup lang="ts">
import { computed } from "vue";
import { useLocale, useCanvasEditor } from "@amg-webui/hooks";
import type { PropPanelEmits, PropPanelProps } from "./types";
import { trackEmit } from "@amg-webui/telemetry";
import "./style.scss";

const props = withDefaults(defineProps<PropPanelProps>(), {
  fields: () => [
    { key: "label", type: "text" },
    { key: "w", type: "number" },
    { key: "h", type: "number" },
  ],
  readonly: false,
  modelValue: () => ({}),
  telemetry: undefined,
});

const emit = defineEmits<PropPanelEmits>();
const { t } = useLocale();
const editor = useCanvasEditor();

const node = computed(() => editor?.selectedNodes.value[0]);

function valueOf(key: string): unknown {
  if (!node.value) return props.modelValue[key] ?? "";
  const record = node.value as unknown as Record<string, unknown>;
  if (key in record) return record[key];
  return node.value.props?.[key] ?? "";
}

function onChange(key: string, e: Event) {
  if (props.readonly) return;
  const el = e.target as HTMLInputElement;
  let val: unknown =
    el.type === "checkbox"
      ? el.checked
      : el.type === "number"
        ? Number(el.value)
        : el.value;
  if (editor && node.value) {
    if (["label", "w", "h", "x", "y"].includes(key)) {
      editor.updateNode(node.value.id, { [key]: val } as Partial<
        typeof node.value
      >);
    } else {
      editor.updateNode(node.value.id, {
        props: { ...node.value.props, [key]: val },
      });
    }
  }
  const payload = { key, value: val };
  trackEmit({
    component: "PropPanel",
    type: "change",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload,
  });
  emit("update:modelValue", { ...props.modelValue, [key]: val });
  emit("update:prop", payload);
  emit("change", payload);
}

const hasSource = computed(
  () => Boolean(node.value) || props.fields.length > 0,
);
const titleText = computed(
  () => props.title ?? t("component.prop-panel.title"),
);
const emptyText = computed(
  () => props.emptyText ?? t("component.prop-panel.empty"),
);
</script>

<template>
  <aside
    :class="[
      'vp-prop-panel',
      { 'vp-prop-panel--readonly': readonly },
      props.class,
    ]"
    :style="style"
    data-component="PropPanel"
    role="complementary"
    :aria-label="titleText"
  >
    <h3 class="vp-prop-panel__title">{{ titleText }}</h3>
    <template v-if="hasSource">
      <label
        v-for="field in fields"
        :key="field.key"
        class="vp-prop-panel__field"
      >
        <span>{{ field.label ?? field.key }}</span>
        <small v-if="field.description" class="vp-prop-panel__description">{{
          field.description
        }}</small>
        <select
          v-if="field.type === 'select'"
          :value="valueOf(field.key) as string | number"
          :disabled="readonly || field.disabled"
          @change="onChange(field.key, $event)"
        >
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <textarea
          v-else-if="field.type === 'textarea'"
          :value="valueOf(field.key) as string"
          :placeholder="field.placeholder"
          :disabled="readonly || field.disabled"
          @input="onChange(field.key, $event)"
        />
        <input
          v-else-if="field.type !== 'boolean'"
          :type="
            field.type === 'number'
              ? 'number'
              : field.type === 'color'
                ? 'color'
                : 'text'
          "
          :value="valueOf(field.key) as string | number"
          :placeholder="field.placeholder"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :disabled="readonly || field.disabled"
          :aria-label="field.label ?? field.key"
          @input="onChange(field.key, $event)"
        />
        <input
          v-else
          type="checkbox"
          :checked="Boolean(valueOf(field.key))"
          :disabled="readonly || field.disabled"
          :aria-label="field.label ?? field.key"
          @change="onChange(field.key, $event)"
        />
      </label>
    </template>
    <p v-else class="vp-prop-panel__muted" role="status">{{ emptyText }}</p>
    <slot :node="node" :values="modelValue" />
  </aside>
</template>
