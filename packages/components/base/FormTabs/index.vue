<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Tabs from '../Tabs/index.vue'
import TabPane from '../TabPane/index.vue'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import Empty from '../Empty/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import type { FormRules } from '../Form/types'
import './style.scss'

export interface FormTabItem {
  name: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    tabs?: FormTabItem[]
    tabData?: Record<string, Record<string, unknown>>
    /** Optional per-tab field labels: { [tabName]: { [field]: label } } */
    fieldLabels?: Record<string, Record<string, string>>
    rules?: FormRules
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    tabs: () => [],
    tabData: () => ({}),
    fieldLabels: () => ({}),
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'update:tabData': [value: Record<string, Record<string, unknown>>]
  change: [name: string | number]
}>()

const activeTab = ref<string | number | undefined>(props.modelValue ?? props.tabs[0]?.name)

watch(
  () => props.modelValue,
  (val) => {
    if (val != null) activeTab.value = val
  }
)

const dataMap = computed(() => props.tabData ?? {})

function setActive(name: string | number) {
  activeTab.value = name
  trackEmit({
    component: 'FormTabs',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { name }
  })
  emit('update:modelValue', name)
  emit('change', name)
}

function updateTabField(tabName: string | number, key: string, value: unknown) {
  const next = {
    ...dataMap.value,
    [String(tabName)]: { ...(dataMap.value[String(tabName)] ?? {}), [key]: value }
  }
  emit('update:tabData', next)
}

function fieldsOf(tabName: string | number) {
  return Object.keys(dataMap.value[String(tabName)] ?? {})
}

function labelOf(tabName: string | number, key: string) {
  return props.fieldLabels?.[String(tabName)]?.[key] ?? key
}
</script>

<template>
  <div
    :class="['vp-form-tabs', { 'vp-form-tabs--disabled': disabled }, props.class]"
    :style="style"
    role="region"
    data-component="FormTabs"
  >
    <Tabs :model-value="activeTab" @update:model-value="setActive">
      <TabPane
        v-for="tab in tabs"
        :key="String(tab.name)"
        :name="tab.name"
        :label="tab.label"
        :disabled="tab.disabled || disabled"
      >
        <Form
          :model="dataMap[String(tab.name)] ?? {}"
          :rules="rules"
          :disabled="disabled || tab.disabled"
        >
          <template v-if="fieldsOf(tab.name).length">
            <FormItem
              v-for="key in fieldsOf(tab.name)"
              :key="key"
              :label="labelOf(tab.name, key)"
              :prop="key"
            >
              <InputText
                :model-value="String(dataMap[String(tab.name)]?.[key] ?? '')"
                :disabled="disabled || tab.disabled"
                @update:model-value="(v) => updateTabField(tab.name, key, v)"
              />
            </FormItem>
          </template>
          <Empty v-else-if="!$slots[String(tab.name)]" />
          <slot
            :name="String(tab.name)"
            :data="dataMap[String(tab.name)]"
            :update="(key: string, value: unknown) => updateTabField(tab.name, key, value)"
          />
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
