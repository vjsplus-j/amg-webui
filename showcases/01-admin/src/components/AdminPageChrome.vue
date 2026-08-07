<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb, PageHeader } from 'amg-webui'

type BreadcrumbCrumb = {
  label: string
  to?: string
  href?: string
  disabled?: boolean
  icon?: string
}

const props = defineProps<{
  title: string
  crumbs?: BreadcrumbCrumb[]
}>()

const route = useRoute()
const router = useRouter()

const breadcrumbItems = computed<BreadcrumbCrumb[]>(() => {
  if (props.crumbs?.length) return props.crumbs
  const matched = route.matched
    .filter((record) => typeof record.meta?.title === 'string')
    .map((record) => ({
      label: String(record.meta.title),
      to: record.path.includes(':') ? undefined : record.path
    }))
  if (!matched.length) {
    return [{ label: props.title }]
  }
  const last = matched[matched.length - 1]
  if (last.label !== props.title) {
    return [...matched, { label: props.title }]
  }
  return matched
})

function onBreadcrumbClick(payload: { to?: string; href?: string; index: number }) {
  if (payload.to && payload.to !== route.path) {
    router.push(payload.to)
  }
}
</script>

<template>
  <Breadcrumb class="admin-page-chrome__crumbs" :items="breadcrumbItems" @click="onBreadcrumbClick" />
  <PageHeader :title="title">
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
  </PageHeader>
</template>

<style scoped lang="scss">
.admin-page-chrome__crumbs {
  margin-bottom: 12px;
}
</style>
