<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tabs from '../Tabs/index.vue'
import TabPane from '../TabPane/index.vue'
import type { DetailPanelProps, DetailPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DetailPanelProps>(), {
  sections: () => [],
  activeTab: ''
})

const emit = defineEmits<DetailPanelEmits>()
const { t } = useLocale()

const collapsedMap = ref<Record<string, boolean>>({})

const active = computed({
  get: () => props.activeTab || props.sections[0]?.id || 'default',
  set: (val: string) => emit('update:activeTab', val)
})

const toggleSection = (id: string) => {
  collapsedMap.value[id] = !collapsedMap.value[id]
  emit('toggle-section', id, !!collapsedMap.value[id])
}

const isCollapsed = (id: string, defaultCollapsed?: boolean) =>
  collapsedMap.value[id] ?? defaultCollapsed ?? false

const displayValue = (value: unknown) => {
  if (value == null || value === '') return t(LocaleKeys.common.noData)
  return String(value)
}
</script>

<template>
  <div :class="['vp-detail-panel', props.class]" :style="style" data-component="DetailPanel">
    <Tabs v-model="active">
      <TabPane v-for="section in sections" :key="section.id" :name="section.id" :label="section.title">
        <section class="vp-detail-panel__section">
          <button
            type="button"
            class="vp-detail-panel__section-toggle"
            :aria-expanded="!isCollapsed(section.id, section.collapsed)"
            @click="toggleSection(section.id)"
          >
            {{ section.title }}
          </button>
          <dl v-show="!isCollapsed(section.id, section.collapsed)" class="vp-detail-panel__fields">
            <div v-for="field in section.fields" :key="field.key" class="vp-detail-panel__row">
              <dt>{{ field.label }}</dt>
              <dd>{{ displayValue(field.value) }}</dd>
            </div>
          </dl>
        </section>
      </TabPane>
    </Tabs>
    <slot />
  </div>
</template>
