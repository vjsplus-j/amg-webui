<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Tabs from '../Tabs/index.vue'
import TabPane from '../TabPane/index.vue'
import Descriptions from '../Descriptions/index.vue'
import DescriptionsItem from '../DescriptionsItem/index.vue'
import LoadingTip from '../LoadingTip/index.vue'
import Empty from '../Empty/index.vue'
import Icon from '../Icon/index.vue'
import type { DetailPanelProps, DetailPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DetailPanelProps>(), {
  sections: () => [],
  activeTab: '',
  layout: 'tabs',
  collapsible: true,
  empty: false,
  loading: false,
  column: 2
})

const emit = defineEmits<DetailPanelEmits>()
const { t } = useLocale()

const collapsedMap = ref<Record<string, boolean>>({})

const active = computed({
  get: () => props.activeTab || props.sections[0]?.id || 'default',
  set: (val: string) => emit('update:activeTab', val)
})

const showEmpty = computed(() => props.empty || (!props.loading && props.sections.length === 0))

const toggleSection = (id: string, defaultCollapsed?: boolean) => {
  if (!props.collapsible) return
  const current = collapsedMap.value[id] ?? defaultCollapsed ?? false
  collapsedMap.value[id] = !current
  emit('toggle-section', id, !current)
}

const isCollapsed = (id: string, defaultCollapsed?: boolean) =>
  props.collapsible ? (collapsedMap.value[id] ?? defaultCollapsed ?? false) : false

const displayValue = (value: unknown) => {
  if (value == null || value === '') return t(LocaleKeys.common.noData)
  return String(value)
}
</script>

<template>
  <div :class="['vp-detail-panel', props.class]" :style="style" data-component="DetailPanel">
    <header v-if="title || $slots.title || $slots.extra" class="vp-detail-panel__header">
      <div class="vp-detail-panel__title-wrap">
        <slot name="title">
          <h3 v-if="title" class="vp-detail-panel__title">{{ title }}</h3>
        </slot>
      </div>
      <div v-if="$slots.extra" class="vp-detail-panel__extra">
        <slot name="extra" />
      </div>
    </header>

    <LoadingTip v-if="loading" block :message="t(LocaleKeys.common.loading)" />

    <Empty v-else-if="showEmpty" :description="t('component.detail-panel.empty')" />

    <Tabs v-else-if="layout === 'tabs'" v-model="active" class="vp-detail-panel__tabs">
      <TabPane v-for="section in sections" :key="section.id" :name="section.id" :label="section.title">
        <Descriptions :column="column" bordered size="sm">
          <DescriptionsItem
            v-for="field in section.fields"
            :key="field.key"
            :label="field.label"
            :span="field.span"
          >
            <slot :name="`field-${field.key}`" :field="field">
              {{ displayValue(field.value) }}
            </slot>
          </DescriptionsItem>
        </Descriptions>
        <slot :name="`section-${section.id}`" :section="section" />
      </TabPane>
    </Tabs>

    <div v-else class="vp-detail-panel__stack">
      <section v-for="section in sections" :key="section.id" class="vp-detail-panel__section">
        <button
          v-if="collapsible"
          type="button"
          class="vp-detail-panel__section-toggle"
          :aria-expanded="!isCollapsed(section.id, section.collapsed)"
          @click="toggleSection(section.id, section.collapsed)"
        >
          <Icon
            :name="isCollapsed(section.id, section.collapsed) ? 'ChevronRight' : 'ChevronDown'"
            size="sm"
            class="vp-detail-panel__section-icon"
          />
          {{ section.title }}
        </button>
        <h4 v-else class="vp-detail-panel__section-title">{{ section.title }}</h4>

        <div v-show="!isCollapsed(section.id, section.collapsed)" class="vp-detail-panel__section-body">
          <Descriptions :column="column" bordered size="sm">
            <DescriptionsItem
              v-for="field in section.fields"
              :key="field.key"
              :label="field.label"
              :span="field.span"
            >
              <slot :name="`field-${field.key}`" :field="field">
                {{ displayValue(field.value) }}
              </slot>
            </DescriptionsItem>
          </Descriptions>
          <slot :name="`section-${section.id}`" :section="section" />
        </div>
      </section>
    </div>

    <footer v-if="$slots.footer" class="vp-detail-panel__footer">
      <slot name="footer" />
    </footer>

    <slot />
  </div>
</template>
