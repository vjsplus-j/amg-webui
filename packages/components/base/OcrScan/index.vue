<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  OcrScanContext,
  OcrScanEmits,
  OcrScanProps,
  OcrScanResult,
} from "./types";
import "./style.scss";
const props = withDefaults(defineProps<OcrScanProps>(), {
  modelValue: "",
  disabled: false,
  accept: "image/*",
  maxFileSize: 10 * 1024 * 1024,
  maxPreviewWidth: 640,
  showPreview: true,
  autoScan: true,
  telemetry: undefined,
});
const emit = defineEmits<OcrScanEmits>();
const { t } = useLocale();
const inputRef = ref<HTMLInputElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const previewUrl = ref("");
const result = ref(props.modelValue);
const file = ref<File | null>(null);
const busy = ref(false);
let controller: AbortController | null = null;
watch(
  () => props.modelValue,
  (value) => {
    result.value = value;
  },
);
function revoke() {
  if (previewUrl.value.startsWith("blob:"))
    URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
}
function reset() {
  controller?.abort();
  controller = null;
  revoke();
  file.value = null;
  result.value = "";
  busy.value = false;
  emit("change", null);
  emit("update:modelValue", "");
  emit("reset");
}
onBeforeUnmount(() => {
  controller?.abort();
  revoke();
});
function fail(error: unknown) {
  busy.value = false;
  const normalized = error instanceof Error ? error : new Error(String(error));
  emit("error", normalized);
  trackEmit({
    component: "OcrScan",
    type: "error",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { message: normalized.message },
  });
}
async function recognize() {
  if (!file.value || !canvasRef.value || !props.recognizer || props.disabled)
    return;
  controller?.abort();
  controller = new AbortController();
  busy.value = true;
  try {
    const context: OcrScanContext = {
      file: file.value,
      canvas: canvasRef.value,
      signal: controller.signal,
    };
    const output = await props.recognizer(context);
    if (controller.signal.aborted) return;
    const normalized: OcrScanResult =
      typeof output === "string" ? { text: output } : output;
    result.value = normalized.text;
    emit("update:modelValue", normalized.text);
    emit("scan", normalized.text, normalized);
    trackEmit({
      component: "OcrScan",
      type: "scan",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { confidence: normalized.confidence },
    });
  } catch (error) {
    if (!controller.signal.aborted) fail(error);
  } finally {
    if (!controller.signal.aborted) busy.value = false;
  }
}
function loadImage(selected: File) {
  const image = new Image();
  image.onload = async () => {
    try {
      const canvas = canvasRef.value;
      if (!canvas) throw new Error("canvas unavailable");
      const scale = Math.min(
        1,
        props.maxPreviewWidth / Math.max(1, image.naturalWidth),
      );
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context2d = canvas.getContext("2d");
      if (!context2d) throw new Error("canvas context unavailable");
      context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
      controller = new AbortController();
      const context: OcrScanContext = {
        file: selected,
        canvas,
        signal: controller.signal,
      };
      emit("ready", context);
      busy.value = false;
      if (props.autoScan && props.recognizer) await recognize();
    } catch (error) {
      fail(error);
    }
  };
  image.onerror = () => fail(new Error("image load failed"));
  image.src = previewUrl.value;
}
function choose(event: Event) {
  const selected = (event.target as HTMLInputElement).files?.[0];
  (event.target as HTMLInputElement).value = "";
  if (!selected || props.disabled) return;
  if (!selected.type.startsWith("image/")) {
    fail(new Error("unsupported file type"));
    return;
  }
  if (selected.size > props.maxFileSize) {
    fail(new Error("file exceeds maxFileSize"));
    return;
  }
  revoke();
  file.value = selected;
  result.value = "";
  previewUrl.value = URL.createObjectURL(selected);
  busy.value = true;
  emit("change", selected);
  loadImage(selected);
}
const labelText = computed(() => props.label ?? t("component.ocr-scan.lead"));
defineExpose({
  reset,
  scan: recognize,
  select: () => inputRef.value?.click(),
  busy,
  file,
});
</script>
<template>
  <section
    :class="[
      'vp-ocr-scan',
      { 'vp-ocr-scan--disabled': disabled, 'vp-ocr-scan--busy': busy },
      props.class,
    ]"
    :style="style"
    data-component="OcrScan"
    :aria-busy="busy"
    :aria-label="labelText"
  >
    <label class="vp-ocr-scan__drop"
      ><span class="vp-ocr-scan__label">{{ labelText }}</span
      ><input
        ref="inputRef"
        type="file"
        :accept="accept"
        class="vp-ocr-scan__file"
        :disabled="disabled || busy"
        @change="choose"
    /></label>
    <canvas ref="canvasRef" class="vp-ocr-scan__canvas" aria-hidden="true" />
    <img
      v-if="showPreview && previewUrl"
      :src="previewUrl"
      alt=""
      class="vp-ocr-scan__preview"
    />
    <div v-if="busy" class="vp-ocr-scan__busy" role="status">
      {{ t("common.loading") }}
    </div>
    <output v-else-if="result" class="vp-ocr-scan__result"
      ><slot name="result" :text="result">{{ result }}</slot></output
    >
    <p v-else class="vp-ocr-scan__empty">
      <slot name="empty">{{ emptyText ?? labelText }}</slot>
    </p>
    <div v-if="file" class="vp-ocr-scan__actions">
      <button
        v-if="recognizer && !autoScan"
        type="button"
        :disabled="busy || disabled"
        @click="recognize"
      >
        {{ scanText ?? labelText }}</button
      ><button type="button" :disabled="busy" @click="reset">
        {{ t("button.reset") }}
      </button>
    </div>
  </section>
</template>
