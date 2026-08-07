<script setup lang="ts">
/**
 * One simulated MFE shell: scoped theme + OverlayRuntime + Dialog teleport root.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button, Card, ConfigProvider, Space, Tag } from '@amg-webui/core'
import { Dialog } from '@amg-webui/overlay'
import { createOverlayRuntime, type OverlayRuntimeApi } from '@amg-webui/runtime'
import { useLocale } from '@amg-webui/hooks'
import type { DesignStyleName } from '@amg-webui/theme'

const props = defineProps<{
  name: string
  title: string
  namespace: string
  zIndexBase: number
  initialDesign: DesignStyleName
  designs: DesignStyleName[]
}>()

const emit = defineEmits<{
  designChange: [design: DesignStyleName]
}>()

const { tDyn } = useLocale()

const shellRef = ref<HTMLElement | null>(null)
const dialogVisible = ref(false)
const design = ref<DesignStyleName>(props.initialDesign)
const runtime = ref<OverlayRuntimeApi | null>(null)
const ready = ref(false)

const meta = computed(() =>
  tDyn('page.lab.microFe.shellMeta', { ns: props.namespace, z: props.zIndexBase })
)

onMounted(() => {
  const el = shellRef.value
  if (!el) return
  runtime.value = createOverlayRuntime({
    namespace: props.namespace,
    zIndexBase: props.zIndexBase,
    teleportTo: el
  })
  ready.value = true
})

onBeforeUnmount(() => {
  dialogVisible.value = false
  runtime.value?.dispose()
  runtime.value = null
})

function toggleDesign() {
  const list = props.designs
  const idx = list.indexOf(design.value)
  design.value = list[(idx + 1) % list.length]!
  emit('designChange', design.value)
}

watch(
  () => props.initialDesign,
  (d) => {
    design.value = d
  }
)

defineExpose({
  shellEl: shellRef,
  setDesign: (d: DesignStyleName) => {
    design.value = d
  },
  getDesign: () => design.value
})
</script>

<template>
  <div ref="shellRef" class="vp-mfe-shell" :data-mfe="namespace">
    <ConfigProvider
      v-if="ready && runtime"
      :design="design"
      scheme="light"
      :namespace="namespace"
      :z-index="zIndexBase"
      :overlay-runtime="runtime"
      :overlay-teleport-to="shellRef ?? undefined"
      :theme-persist="false"
      :theme-storage-namespace="`lab-mfe-${namespace}`"
    >
      <Card :header="title">
        <p class="vp-mfe-shell__meta">{{ meta }}</p>
        <div class="vp-mfe-shell__tags">
          <Tag size="sm" :label="`${tDyn('page.lab.microFe.localDesign')}: ${design}`" />
        </div>
        <Space wrap>
          <Button
            size="sm"
            severity="primary"
            :label="tDyn('page.lab.microFe.openDialog')"
            @click="dialogVisible = true"
          />
          <Button
            size="sm"
            variant="outlined"
            :label="tDyn('page.lab.microFe.toggleLocalTheme')"
            @click="toggleDesign"
          />
        </Space>

        <Dialog
          :visible="dialogVisible"
          :title="tDyn('page.lab.microFe.dialogTitle', { name })"
          :teleport-to="shellRef ?? 'body'"
          @update:visible="(v) => (dialogVisible = v)"
        >
          <p>{{ tDyn('page.lab.microFe.dialogBody') }}</p>
          <Button size="sm" :label="name" @click="dialogVisible = false" />
        </Dialog>
      </Card>
    </ConfigProvider>
  </div>
</template>

<style scoped lang="scss">
.vp-mfe-shell {
  width: 100%;
  min-width: 0;
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-sm);
  background: var(--surface-0);
  box-sizing: border-box;
}

.vp-mfe-shell__meta {
  margin: 0 0 var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-mfe-shell__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}
</style>
