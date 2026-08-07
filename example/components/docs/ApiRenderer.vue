<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import PropsTable from '../demo/PropsTable.vue'
import type { PropRow } from '../demo/types'

const props = defineProps<{
  componentName: string
}>()

interface ApiPropRow {
  name: string
  type: string
  optional?: boolean
  description?: string
}

interface ApiEventRow {
  name: string
  payload?: string
  description?: string
}

interface ApiSlotRow {
  name: string
  props?: string
  description?: string
}

interface ApiExposeRow {
  name: string
  type: string
  description?: string
}

interface ApiModelRow {
  name: string
  description?: string
}

interface ComponentApi {
  props: ApiPropRow[]
  events: ApiEventRow[]
  slots: ApiSlotRow[]
  expose: ApiExposeRow[]
  models: ApiModelRow[]
}

const EMPTY_API: ComponentApi = {
  props: [],
  events: [],
  slots: [],
  expose: [],
  models: []
}

const api = ref<ComponentApi>(EMPTY_API)
const { t } = useLocale()

async function loadComponentApi(name: string) {
  if (!name) {
    api.value = EMPTY_API
    return
  }
  try {
    const mod = await import(`../../../generated/component-api/${name}.json`)
    const payload = (mod.default ?? mod) as ComponentApi
    api.value = {
      props: payload.props ?? [],
      events: payload.events ?? [],
      slots: payload.slots ?? [],
      expose: payload.expose ?? [],
      models: payload.models ?? []
    }
  } catch {
    api.value = EMPTY_API
  }
}

watch(
  () => props.componentName,
  (name) => {
    void loadComponentApi(name)
  },
  { immediate: true }
)

const propRows = computed<PropRow[]>(() =>
  api.value.props.map((row) => ({
    name: row.name,
    description: row.description?.trim() || '—',
    type: row.type,
    defaultValue: row.optional ? '—' : '—'
  }))
)

const eventRows = computed<PropRow[]>(() =>
  api.value.events.map((row) => ({
    name: row.name,
    description: row.description?.trim() || '—',
    type: row.payload?.trim() || 'void',
    defaultValue: '—'
  }))
)

const slotRows = computed<PropRow[]>(() =>
  api.value.slots.map((row) => ({
    name: row.name,
    description: row.description?.trim() || '—',
    type: row.props?.trim() || '—',
    defaultValue: '—'
  }))
)

const exposeRows = computed<PropRow[]>(() =>
  api.value.expose.map((row) => ({
    name: row.name,
    description: row.description?.trim() || '—',
    type: row.type,
    defaultValue: '—'
  }))
)

const modelRows = computed<PropRow[]>(() =>
  api.value.models.map((row) => ({
    name: row.name,
    description: row.description?.trim() || '—',
    type: 'v-model',
    defaultValue: '—'
  }))
)

const hasAnySection = computed(
  () =>
    propRows.value.length > 0 ||
    eventRows.value.length > 0 ||
    slotRows.value.length > 0 ||
    exposeRows.value.length > 0 ||
    modelRows.value.length > 0
)
</script>

<template>
  <section class="vp-api-renderer">
    <h2 class="vp-api-renderer__title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

    <p v-if="!hasAnySection" class="vp-api-renderer__draft">
      {{ t(LocaleKeys.exampleDoc.apiDraft) }}
    </p>

    <template v-if="propRows.length">
      <h3 class="vp-api-renderer__sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </template>

    <template v-if="eventRows.length">
      <h3 class="vp-api-renderer__sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </template>

    <template v-if="slotRows.length">
      <h3 class="vp-api-renderer__sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </template>

    <template v-if="exposeRows.length">
      <h3 class="vp-api-renderer__sub">{{ t(LocaleKeys.exampleDoc.expose) }}</h3>
      <PropsTable :rows="exposeRows" />
    </template>

    <template v-if="modelRows.length">
      <h3 class="vp-api-renderer__sub">{{ t(LocaleKeys.exampleDoc.models) }}</h3>
      <PropsTable :rows="modelRows" />
    </template>
  </section>
</template>

<style scoped>
.vp-api-renderer {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-api-renderer__title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-api-renderer__sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-api-renderer__sub:first-of-type {
  margin-top: 0;
}

.vp-api-renderer__draft {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
