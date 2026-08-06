<script setup lang="ts">
import { ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { normalizeCanvasSchema, downloadTextFile } from "@amg-webui/utils";
import type { CanvasSchema } from "@amg-webui/utils";
import type { CanvasIoProps } from "./types";
import "./style.scss";

const props = withDefaults(defineProps<CanvasIoProps>(), {
  schema: () => ({ version: 1, mode: "free", nodes: [] }),
  filename: "canvas.json",
  disabled: false,
});

const emit = defineEmits<{
  (e: "import", schema: CanvasSchema): void;
  (e: "export", schema: CanvasSchema): void;
  (e: "error", error: Error): void;
}>();
const { t } = useLocale();
const fileRef = ref<HTMLInputElement | null>(null);

function exportJson() {
  if (props.disabled) return;
  const json = JSON.stringify(props.schema, null, 2);
  downloadTextFile(props.filename, json, "application/json;charset=utf-8");
  emit("export", props.schema);
}

function openPicker() {
  if (props.disabled) return;
  fileRef.value?.click();
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || props.disabled) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = normalizeCanvasSchema(
        JSON.parse(String(reader.result ?? "{}")),
      );
      emit("import", parsed as CanvasSchema);
    } catch {
      emit("error", new Error("invalid json"));
    }
  };
  reader.readAsText(file);
  (e.target as HTMLInputElement).value = "";
}
</script>

<template>
  <div
    :class="[
      'vp-canvas-io',
      { 'vp-canvas-io--disabled': disabled },
      props.class,
    ]"
    :style="style"
    data-component="CanvasIo"
    role="group"
    :aria-label="t('component.canvas-io.import')"
  >
    <button
      type="button"
      class="vp-canvas-io__btn"
      :disabled="disabled"
      :aria-label="t('common.export')"
      @click="exportJson"
    >
      {{ t("common.export") }}
    </button>
    <button
      type="button"
      class="vp-canvas-io__btn vp-canvas-io__btn--ghost"
      :disabled="disabled"
      :aria-label="t('component.canvas-io.import')"
      @click="openPicker"
    >
      {{ t("component.canvas-io.import") }}
    </button>
    <input
      ref="fileRef"
      type="file"
      accept="application/json,.json"
      class="vp-canvas-io__file"
      :aria-hidden="true"
      tabindex="-1"
      @change="onFile"
    />
    <slot />
  </div>
</template>
