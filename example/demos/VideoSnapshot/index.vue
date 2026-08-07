<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from "vue";
import { VideoSnapshot } from '@amg-webui/media';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const mountProps = computed(() => getSampleMountProps("VideoSnapshot"));
const stream = shallowRef<MediaStream | null>(null);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  const captureStream = (
    canvas as HTMLCanvasElement & {
      captureStream?: (frameRate?: number) => MediaStream;
    }
  ).captureStream;
  if (!context || !captureStream) return;
  const startedAt = performance.now();
  const draw = () => {
    const styles = getComputedStyle(document.documentElement);
    const surface = styles.getPropertyValue("--surface-2").trim();
    const primary = styles.getPropertyValue("--primary-500").trim();
    const text = styles.getPropertyValue("--text-primary").trim();
    const progress = ((performance.now() - startedAt) / 40) % canvas.width;
    context.fillStyle = surface;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = primary;
    context.fillRect(0, canvas.height * 0.72, progress, canvas.height * 0.08);
    context.fillStyle = text;
    context.font = `${canvas.height * 0.08}px sans-serif`;
    context.textAlign = "center";
    context.fillText(
      t("component.video-snapshot.title"),
      canvas.width / 2,
      canvas.height / 2,
    );
  };
  draw();
  timer = setInterval(draw, 100);
  stream.value = captureStream.call(canvas, 12);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  stream.value?.getTracks().forEach((track) => track.stop());
});

const codeBasic = demoSfc({
  imports: [`import { VideoSnapshot } from '@amg-webui/media'`],
  template: [`  <VideoSnapshot src="/sample.mp4" downloadable />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "videoRef / src / stream",
    type: "HTMLVideoElement | string | MediaStream",
    description: t("example.doc.videoSnapshot.prop.base"),
  },
  {
    name: "format / quality",
    type: "image/png | image/jpeg | image/webp / number",
    description: t("example.doc.videoSnapshot.prop.base"),
  },
  {
    name: "maxWidth / maxHeight",
    type: "number",
    description: t("example.doc.videoSnapshot.prop.base"),
  },
  {
    name: "preview / downloadable",
    type: "boolean",
    description: t("example.doc.videoSnapshot.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.videoSnapshot.when") }}</p>
    <DemoBlock
      :title="t('example.doc.videoSnapshot.demo.basic')"
      :description="t('example.doc.videoSnapshot.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VideoSnapshot v-bind="mountProps" :stream="stream" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
