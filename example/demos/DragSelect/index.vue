<script setup lang="ts">
/**
 * Curated demo — Form wave2 DragSelect
 */
import { ref, computed } from 'vue'
import { DragSelect } from '@amg-webui/lowcode'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const selected = ref<(string | number)[]>(['b'])
const compact = ref<(string | number)[]>(['x'])

const options = computed(() => [
  { id: 'a', label: t('example.doc.dragSelect.sample.optionA') },
  { id: 'b', label: t('example.doc.dragSelect.sample.optionB') },
  { id: 'c', label: t('example.doc.dragSelect.sample.optionC'), disabled: true },
  { id: 'd', label: t('example.doc.dragSelect.sample.optionD') }
])

const compactOptions = computed(() => [
  { id: 'x', label: t('example.doc.dragSelect.sample.optionA') },
  { id: 'y', label: t('example.doc.dragSelect.sample.optionB') },
  { id: 'z', label: t('example.doc.dragSelect.sample.optionD') }
])

const orderLabel = computed(() =>
  selected.value.length
    ? selected.value.join(' → ')
    : t('example.doc.dragSelect.sample.empty')
)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { DragSelect } from '@amg-webui/lowcode'`
  ],
  script: [
    `const selected = ref(['b'])`,
    `const options = [/* … */]`
  ],
  template: [`  <DragSelect v-model="selected" :options="options" clearable />`]
})

const codeReorder = demoCode(
  `<DragSelect v-model="compact" :options="compactOptions" :clearable="false" />`,
  `<p>{{ t('example.doc.dragSelect.sample.order', { order: compact.join(' → ') }) }}</p>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.dragSelect.demo.basic')"
      :description="t('example.doc.dragSelect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <DragSelect v-model="selected" :options="options" clearable />
        <p class="vp-curated__hint">
          {{ t('example.doc.dragSelect.sample.order', { order: orderLabel }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dragSelect.demo.reorder')"
      :description="t('example.doc.dragSelect.demo.reorderDesc')"
      :code="codeReorder"
    >
      <div class="vp-curated__stack">
        <DragSelect v-model="compact" :options="compactOptions" :clearable="false" />
        <p class="vp-curated__hint">{{ t('example.doc.dragSelect.sample.reorderHint') }}</p>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  gap: var(--spacing-md);
}

.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
