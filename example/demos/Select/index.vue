<script setup lang="ts">
/**
 * Curated demo — Form wave1 Select
 */
import { ref, computed } from 'vue'
import { Select } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from './parts/Basic.vue'
import basicSource from '@amg-webui/demos/select/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const cleared = ref<string | undefined>()
const multiValue = ref<(string | number)[]>(['a', 'b'])
const remoteValue = ref<string | undefined>()
const largeValue = ref<string | number | undefined>()

const options = computed(() => [
  { label: t('example.doc.select.sample.optA'), value: 'a' },
  { label: t('example.doc.select.sample.optB'), value: 'b' },
  { label: t('example.doc.select.sample.optC'), value: 'c' }
])

const multiOptions = computed(() => [
  ...options.value,
  { label: t('example.doc.select.sample.optD'), value: 'd' },
  { label: t('example.doc.select.sample.optE'), value: 'e' }
])

const remoteOptions = ref<{ label: string; value: string }[]>([])
const remoteLoading = ref(false)

const allRemote = computed(() => [
  { label: t('example.doc.select.sample.remoteA'), value: 'ra' },
  { label: t('example.doc.select.sample.remoteB'), value: 'rb' },
  { label: t('example.doc.select.sample.remoteC'), value: 'rc' },
  { label: t('example.doc.select.sample.remoteD'), value: 'rd' }
])

function onRemoteMethod(query: string) {
  remoteLoading.value = true
  window.setTimeout(() => {
    const lower = query.trim().toLowerCase()
    remoteOptions.value = lower
      ? allRemote.value.filter((item) => item.label.toLowerCase().includes(lower))
      : allRemote.value
    remoteLoading.value = false
  }, 400)
}

const largeOptions = computed(() =>
  Array.from({ length: 120 }, (_, i) => ({
    label: t('example.doc.select.sample.largeOpt', { n: i + 1 }),
    value: `opt-${i + 1}`
  }))
)

const codeClearable = demoCode(
  `<Select`,
  `  v-model="cleared"`,
  `  :options="options"`,
  `  clearable`,
  `  filterable`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `/>`,
  `<Select`,
  `  v-model="cleared"`,
  `  :options="options"`,
  `  disabled`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `/>`
)

const codeMultiple = demoCode(
  `<Select`,
  `  v-model="multiValue"`,
  `  :options="multiOptions"`,
  `  multiple`,
  `  collapse-tags`,
  `  clearable`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const codeRemote = demoCode(
  `<Select`,
  `  v-model="remoteValue"`,
  `  :options="remoteOptions"`,
  `  remote`,
  `  filterable`,
  `  :loading="remoteLoading"`,
  `  :remote-method="onRemoteMethod"`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const codeVirtual = demoCode(
  `<Select`,
  `  v-model="largeValue"`,
  `  :options="largeOptions"`,
  `  filterable`,
  `  virtual`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.select.demo.basic')"
      :description="t('example.doc.select.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.clearable')"
      :description="t('example.doc.select.demo.clearableDesc')"
      :code="codeClearable"
    >
      <div class="vp-curated__row">
        <Space>
          <Select
            v-model="cleared"
            :options="options"
            clearable
            filterable
            :placeholder="t('example.doc.select.sample.placeholder')"
          />
          <Select
            v-model="cleared"
            :options="options"
            disabled
            :placeholder="t('example.doc.select.sample.placeholder')"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.multiple')"
      :description="t('example.doc.select.demo.multipleDesc')"
      :code="codeMultiple"
    >
      <div class="vp-curated__row">
        <Select
          v-model="multiValue"
          :options="multiOptions"
          multiple
          collapse-tags
          clearable
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.remote')"
      :description="t('example.doc.select.demo.remoteDesc')"
      :code="codeRemote"
    >
      <div class="vp-curated__row">
        <Select
          v-model="remoteValue"
          :options="remoteOptions"
          remote
          filterable
          :loading="remoteLoading"
          :remote-method="onRemoteMethod"
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.virtual')"
      :description="t('example.doc.select.demo.virtualDesc')"
      :code="codeVirtual"
    >
      <div class="vp-curated__row">
        <Select
          v-model="largeValue"
          :options="largeOptions"
          filterable
          virtual
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
