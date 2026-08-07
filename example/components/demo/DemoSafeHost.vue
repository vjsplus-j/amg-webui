<script setup lang="ts">
import { computed, defineAsyncComponent, onErrorCaptured, ref, shallowRef, watch, type Component } from 'vue'
import { Alert } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { getSampleMountProps } from '../../demos/_shared/sampleMountProps'

const props = withDefaults(
  defineProps<{
    /** Component catalog name — used for dynamic load and error copy */
    name: string
    /** Extra props merged after sample defaults */
    extra?: Record<string, unknown>
  }>(),
  {
    extra: () => ({})
  }
)

const { t, locale } = useLocale()
const errorMessage = shallowRef('')
const hasError = ref(false)

const modules = import.meta.glob([
  '../../../packages/components/{core,form,data,overlay,charts,editor,media,gb28181,onvif}/*/index.vue',
  '../../../packages/lowcode/ui/*/index.vue'
]) as Record<string, () => Promise<{ default: Component }>>

function loadMount(name: string) {
  const key = Object.keys(modules).find(
    (p) => p.includes(`/${name}/index.vue`) || p.endsWith(`/${name}/index.vue`)
  )
  if (!key) return null
  return defineAsyncComponent(modules[key])
}

const DynamicComp = computed(() => loadMount(props.name))

/** Overlay hosts need a writable visible so cancel/close can dismiss */
const overlayVisible = ref(true)
const isOverlayHost = computed(() =>
  /Dialog|Drawer|Confirm|Mask|Modal|Toast|Notification|Loading/i.test(props.name)
)

watch(
  () => props.name,
  () => {
    overlayVisible.value = true
    hasError.value = false
    errorMessage.value = ''
  }
)

const mountProps = computed(() => {
  void locale.value
  const base = {
    ...getSampleMountProps(props.name),
    ...props.extra
  }
  if (isOverlayHost.value) {
    return {
      ...base,
      visible: overlayVisible.value,
      open: overlayVisible.value,
      'onUpdate:visible': (v: boolean) => {
        overlayVisible.value = v
      },
      'onUpdate:open': (v: boolean) => {
        overlayVisible.value = v
      }
    }
  }
  return base
})

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : String(err)
  return false
})
</script>

<template>
  <div class="vp-safe-host">
    <Alert
      v-if="hasError"
      class="vp-safe-host__error"
      severity="warning"
      :title="t(LocaleKeys.exampleDoc.safeMountErrorTitle, { name })"
      closable
      @close="hasError = false"
    >
      <p class="vp-safe-host__body">
        {{ t(LocaleKeys.exampleDoc.safeMountErrorBody, { name }) }}
      </p>
      <p v-if="errorMessage" class="vp-safe-host__detail">{{ errorMessage }}</p>
    </Alert>

    <div v-show="!hasError" class="vp-safe-host__preview">
      <slot>
        <component
          :is="DynamicComp"
          v-if="DynamicComp"
          v-bind="mountProps"
        />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.vp-safe-host {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-safe-host__preview {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-safe-host__error {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-safe-host__body,
.vp-safe-host__detail {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}

.vp-safe-host__detail {
  margin-top: var(--spacing-sm);
  font-family: var(--font-family-mono, monospace);
  word-break: break-word;
}
</style>
