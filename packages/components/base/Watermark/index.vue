<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { trackEmit } from "@amg-webui/telemetry";
import type {
  WatermarkEmits,
  WatermarkProps,
  WatermarkTamperType,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<WatermarkProps>(), {
  imageCrossOrigin: "anonymous",
  gap: () => [0, 0],
  offset: () => [0, 0],
  rotate: -22,
  fontSize: 14,
  opacity: 0.15,
  zIndex: 1,
  inherit: true,
  observe: true,
  enabled: true,
  telemetry: undefined,
});
const emit = defineEmits<WatermarkEmits>();
const rootRef = ref<HTMLDivElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);
const patternUrl = ref("");
const patternSize = ref<[number, number]>([0, 0]);
let mutationObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let renderGeneration = 0;

const rootStyle = computed(() => ({
  "--vp-watermark-z": String(props.zIndex),
  ...props.style,
}));
const overlayStyle = computed(() =>
  props.enabled && patternUrl.value
    ? {
        backgroundImage: `url("${patternUrl.value}")`,
        backgroundSize: `${patternSize.value[0]}px ${patternSize.value[1]}px`,
        backgroundPosition: `${props.offset[0]}px ${props.offset[1]}px`,
      }
    : { backgroundImage: "none" },
);

function reportError(cause: unknown) {
  const error = cause instanceof Error ? cause : new Error(String(cause));
  emit("error", error);
  trackEmit({
    component: "Watermark",
    type: "error",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = props.imageCrossOrigin;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("WATERMARK_IMAGE_LOAD_FAILED"));
    image.src = source;
  });
}
async function buildPattern() {
  const generation = ++renderGeneration;
  if (
    !props.enabled ||
    (!props.image &&
      !(Array.isArray(props.content)
        ? props.content.some(Boolean)
        : props.content))
  ) {
    patternUrl.value = "";
    return;
  }
  const root = rootRef.value;
  if (!root || typeof document === "undefined") return;
  try {
    const inherited = getComputedStyle(root);
    const fontSize = Math.max(1, props.font?.fontSize ?? props.fontSize);
    const fontFamily =
      props.font?.fontFamily ??
      (props.inherit ? inherited.fontFamily : "sans-serif");
    const fontWeight =
      props.font?.fontWeight ??
      (props.inherit ? inherited.fontWeight : "normal");
    const fontStyle =
      props.font?.fontStyle ?? (props.inherit ? inherited.fontStyle : "normal");
    const color =
      props.font?.color ?? (props.inherit ? inherited.color : "currentColor");
    const gapX = Math.max(0, props.gap[0] || fontSize * 6);
    const gapY = Math.max(0, props.gap[1] || fontSize * 4);
    const measurement = document.createElement("canvas").getContext("2d");
    if (!measurement) throw new Error("WATERMARK_CANVAS_UNAVAILABLE");
    measurement.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const lines = Array.isArray(props.content)
      ? props.content
      : props.content
        ? [props.content]
        : [];
    const image = props.image ? await loadImage(props.image) : null;
    const markWidth = image
      ? image.naturalWidth
      : Math.max(
          fontSize,
          ...lines.map((line) => measurement.measureText(line).width),
        );
    const markHeight = image
      ? image.naturalHeight
      : Math.max(fontSize, lines.length * fontSize * 1.4);
    const cellWidth = Math.max(1, Math.ceil(props.width ?? markWidth + gapX));
    const cellHeight = Math.max(
      1,
      Math.ceil(props.height ?? markHeight + gapY),
    );
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(cellWidth * ratio);
    canvas.height = Math.ceil(cellHeight * ratio);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("WATERMARK_CANVAS_UNAVAILABLE");
    context.scale(ratio, ratio);
    context.globalAlpha = Math.min(1, Math.max(0, props.opacity));
    context.translate(cellWidth / 2, cellHeight / 2);
    context.rotate((props.rotate * Math.PI) / 180);
    if (image) {
      const scale = Math.min(
        1,
        (cellWidth - gapX / 2) / image.naturalWidth,
        (cellHeight - gapY / 2) / image.naturalHeight,
      );
      const width = Math.max(1, image.naturalWidth * scale);
      const height = Math.max(1, image.naturalHeight * scale);
      context.drawImage(image, -width / 2, -height / 2, width, height);
    } else {
      context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      context.fillStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const lineHeight = fontSize * 1.4;
      lines.forEach((line, index) =>
        context.fillText(
          line,
          0,
          (index - (lines.length - 1) / 2) * lineHeight,
        ),
      );
    }
    const url = canvas.toDataURL();
    if (generation !== renderGeneration) return;
    patternSize.value = [cellWidth, cellHeight];
    patternUrl.value = url;
    emit("render", url);
    trackEmit({
      component: "Watermark",
      type: "render",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { image: Boolean(image), width: cellWidth, height: cellHeight },
    });
  } catch (error) {
    if (generation === renderGeneration) {
      patternUrl.value = "";
      reportError(error);
    }
  }
}
function reportTamper(type: WatermarkTamperType) {
  emit("tamper", type);
  trackEmit({
    component: "Watermark",
    type: "tamper",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { type },
  });
}
function protectOverlay() {
  const root = rootRef.value;
  const overlay = overlayRef.value;
  if (!root || !overlay) return;
  if (!root.contains(overlay)) {
    root.prepend(overlay);
    reportTamper("removed");
  }
  const expected = overlayStyle.value.backgroundImage;
  if (overlay.style.backgroundImage !== expected) {
    overlay.style.backgroundImage = expected;
    reportTamper("style");
  }
}
function setupObservers() {
  mutationObserver?.disconnect();
  resizeObserver?.disconnect();
  if (props.observe && rootRef.value) {
    mutationObserver = new MutationObserver(protectOverlay);
    mutationObserver.observe(rootRef.value, {
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
      subtree: true,
    });
  }
  if (typeof ResizeObserver !== "undefined" && rootRef.value) {
    resizeObserver = new ResizeObserver(() => void buildPattern());
    resizeObserver.observe(rootRef.value);
  }
}

watch(
  () => [
    props.content,
    props.image,
    props.imageCrossOrigin,
    props.gap,
    props.offset,
    props.width,
    props.height,
    props.rotate,
    props.fontSize,
    props.font,
    props.opacity,
    props.inherit,
    props.enabled,
  ],
  () => void buildPattern(),
  { deep: true },
);
watch(() => props.observe, setupObservers);
onMounted(() => {
  void buildPattern();
  setupObservers();
});
onUnmounted(() => {
  renderGeneration += 1;
  mutationObserver?.disconnect();
  resizeObserver?.disconnect();
});

defineExpose({ render: buildPattern });
</script>

<template>
  <div
    ref="rootRef"
    :class="['vp-watermark', props.class]"
    :style="rootStyle"
    :aria-label="ariaLabel"
    data-component="Watermark"
  >
    <div
      ref="overlayRef"
      class="vp-watermark__overlay"
      :style="overlayStyle"
      aria-hidden="true"
    />
    <div class="vp-watermark__content"><slot /></div>
  </div>
</template>
