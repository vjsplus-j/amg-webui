<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Tabs from '../Tabs/index.vue'
import TabPane from '../TabPane/index.vue'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import type { FormTabsProps, FormTabsEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FormTabsProps>(), {
  tabs: () => [],
  tabData: () => ({})
})

const emit = defineEmits<FormTabsEmits>()

const activeTab = ref<string | number | undefined>(props.modelValue ?? props.tabs[0]?.name)

watch(
  () => props.modelValue,
  (val) => {
    if (val != null) activeTab.value = val
  }
)

const dataMap = computed(() => props.tabData ?? {})

const setActive = (name: string | number) => {
  activeTab.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

const updateTabField = (tabName: string | number, key: string, value: unknown) => {
  const next = {
    ...dataMap.value,
    [String(tabName)]: { ...(dataMap.value[String(tabName)] ?? {}), [key]: value }
  }
  emit('update:tabData', next)
}
</script>

<template>
  <div :class="['vp-form-tabs', props.class, { 'vp-form-tabs--disabled': disabled }]" :style="style" data-component="FormTabs">
    <Tabs :model-value="activeTab" @update:model-value="setActive">
      <TabPane v-for="tab in tabs" :key="String(tab.name)" :name="tab.name" :label="tab.label" :disabled="tab.disabled || disabled">
        <Form :model="dataMap[String(tab.name)] ?? {}">
          <FormItem v-for="(val, key) in dataMap[String(tab.name)] ?? { note: '' }" :key="String(key)" :label="String(key)" :prop="String(key)">
            <InputText
              :model-value="String(val ?? '')"
              :disabled="disabled || tab.disabled"
              @update:model-value="(v) => updateTabField(tab.name, key, v)"
            />
          </FormItem>
          <slot :name="String(tab.name)" :data="dataMap[String(tab.name)]" />
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
