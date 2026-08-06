<script setup lang="ts">
import { computed, ref } from "vue";
import { useLocale } from "@amg-webui/hooks";
import { trackEmit } from "@amg-webui/telemetry";
import { LocaleKeys } from "@amg-webui/locale";
import type {
  VideoSnapshotEmits,
  VideoSnapshotError,
  VideoSnapshotErrorCode,
  VideoSnapshotProps,
  VideoSnapshotResult,
} from "./types";
import "./style.scss";

const props = withDefaults(defineProps<VideoSnapshotProps>(), {
  crossOrigin: "anonymous",
  stream: null,
  controls: true,
  autoplay: true,
  muted: true,
  format: "image/png",
  quality: 0.92,
  preview: true,
  downloadable: true,
  disabled: false,
  loading: false,
  telemetry: undefined,
});
const emit = defineEmits<VideoSnapshotEmits>();
const { t } = useLocale();
const internalVideoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const result = ref<VideoSnapshotResult | null>(null);
const errorCode = ref<VideoSnapshotErrorCode | null>(null);
const titleText = computed(
  () => props.title ?? t(LocaleKeys.industry.video.snapshot),
);
const hasPreview = computed(() => Boolean(result.value));
const sourceVideo = computed(() => props.videoRef ?? internalVideoRef.value);

function createError(
  code: VideoSnapshotErrorCode,
  cause?: unknown,
): VideoSnapshotError {
  const error = new Error(code) as VideoSnapshotError;
  error.name = "VideoSnapshotError";
  error.code = code;
  error.cause = cause;
  return error;
}
function report(code: VideoSnapshotErrorCode, cause?: unknown) {
  errorCode.value = code;
  const error = createError(code, cause);
  emit("error", error);
  trackEmit({
    component: "VideoSnapshot",
    type: "error",
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { code },
  });
  return null;
}
function dataUrlToBlob(dataUrl: string) {
  const [header, payload = ""] = dataUrl.split(",");
  const mime = header.match(/data:([^;]+)/)?.[1] ?? props.format;
  const bytes = atob(payload);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1)
    buffer[index] = bytes.charCodeAt(index);
  return new Blob([buffer], { type: mime });
}
function targetSize(video: HTMLVideoElement) {
  const widthLimit =
    props.maxWidth && props.maxWidth > 0 ? props.maxWidth : video.videoWidth;
  const heightLimit =
    props.maxHeight && props.maxHeight > 0
      ? props.maxHeight
      : video.videoHeight;
  const scale = Math.min(
    1,
    widthLimit / video.videoWidth,
    heightLimit / video.videoHeight,
  );
  return {
    width: Math.max(1, Math.round(video.videoWidth * scale)),
    height: Math.max(1, Math.round(video.videoHeight * scale)),
  };
}
function capture(): VideoSnapshotResult | null {
  if (props.disabled || props.loading) return null;
  const video = sourceVideo.value;
  const canvas = canvasRef.value;
  if (
    !video ||
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    !video.videoWidth ||
    !video.videoHeight
  )
    return report("VIDEO_NOT_READY");
  if (!canvas) return report("CANVAS_UNAVAILABLE");
  try {
    const size = targetSize(video);
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) return report("CANVAS_UNAVAILABLE");
    context.drawImage(video, 0, 0, size.width, size.height);
    const dataUrl = canvas.toDataURL(
      props.format,
      Math.min(1, Math.max(0, props.quality)),
    );
    const next: VideoSnapshotResult = {
      dataUrl,
      blob: dataUrlToBlob(dataUrl),
      ...size,
      type: props.format,
      timestamp: Date.now(),
    };
    result.value = next;
    errorCode.value = null;
    emit("capture", dataUrl, next);
    trackEmit({
      component: "VideoSnapshot",
      type: "capture",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { width: size.width, height: size.height, type: props.format },
    });
    return next;
  } catch (cause) {
    return report("CAPTURE_FAILED", cause);
  }
}
function clear() {
  if (!result.value && !errorCode.value) return;
  result.value = null;
  errorCode.value = null;
  emit("clear");
  trackEmit({
    component: "VideoSnapshot",
    type: "clear",
    trackId: props.trackId,
    telemetry: props.telemetry,
  });
}
function download() {
  if (!result.value || props.disabled) return;
  try {
    const anchor = document.createElement("a");
    const extension = result.value.type.split("/")[1];
    const url = URL.createObjectURL(result.value.blob);
    anchor.href = url;
    anchor.download = props.fileName ?? `snapshot.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    emit("download", result.value);
    trackEmit({
      component: "VideoSnapshot",
      type: "download",
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { type: result.value.type },
    });
  } catch (cause) {
    report("DOWNLOAD_FAILED", cause);
  }
}

defineExpose({ capture, clear, download, result });
</script>

<template>
  <section
    :class="[
      'vp-video-snapshot',
      { 'vp-video-snapshot--disabled': disabled },
      props.class,
    ]"
    :style="style"
    :aria-label="ariaLabel ?? titleText"
    :aria-busy="loading"
    data-component="VideoSnapshot"
  >
    <header v-if="titleText || $slots.header" class="vp-video-snapshot__header">
      <slot name="header"
        ><h3>{{ titleText }}</h3></slot
      >
    </header>
    <div v-if="loading" class="vp-video-snapshot__state" role="status">
      {{ t(LocaleKeys.common.loading) }}
    </div>
    <div v-else class="vp-video-snapshot__body">
      <video
        v-if="src || stream"
        ref="internalVideoRef"
        class="vp-video-snapshot__source"
        :src="src"
        :srcObject="stream"
        :crossorigin="crossOrigin || undefined"
        :controls="controls"
        :autoplay="autoplay"
        :muted="muted"
        playsinline
      />
      <div class="vp-video-snapshot__toolbar">
        <button
          type="button"
          class="vp-video-snapshot__button"
          :disabled="disabled"
          @click="capture"
        >
          {{ t(LocaleKeys.industry.video.capture) }}
        </button>
        <button
          v-if="downloadable"
          type="button"
          class="vp-video-snapshot__button vp-video-snapshot__button--ghost"
          :disabled="disabled || !hasPreview"
          @click="download"
        >
          {{ t(LocaleKeys.industry.vcr.download) }}
        </button>
        <button
          type="button"
          class="vp-video-snapshot__button vp-video-snapshot__button--ghost"
          :disabled="disabled || (!hasPreview && !errorCode)"
          @click="clear"
        >
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <canvas
        ref="canvasRef"
        class="vp-video-snapshot__canvas"
        aria-hidden="true"
      />
      <div v-if="preview && result" class="vp-video-snapshot__preview">
        <slot name="preview" :result="result"
          ><img :src="result.dataUrl" :alt="titleText"
        /></slot>
      </div>
      <div
        v-else-if="!result"
        class="vp-video-snapshot__state"
        :class="{ 'vp-video-snapshot__state--error': errorCode }"
        role="status"
        aria-live="polite"
      >
        <slot v-if="errorCode" name="error" :code="errorCode">{{
          emptyText ?? t(LocaleKeys.industry.common.noData)
        }}</slot>
        <slot v-else name="empty">{{
          emptyText ?? t(LocaleKeys.industry.common.noData)
        }}</slot>
      </div>
      <slot :capture="capture" :result="result" />
    </div>
  </section>
</template>
