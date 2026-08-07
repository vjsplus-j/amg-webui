<script setup lang="ts">
import Icon from '@amg-webui/core/Icon/index.vue'
import type { MenuBadge } from './types'

defineProps<{
  badge: MenuBadge
}>()
</script>

<template>
  <span
    class="vp-menu__badge"
    :class="[
      badge.tone ? `vp-menu__badge--${badge.tone}` : undefined,
      { 'vp-menu__badge--icon': Boolean(badge.icon) }
    ]"
    :role="badge.icon ? 'img' : undefined"
    :aria-label="badge.icon ? badge.label : undefined"
    :title="badge.icon ? badge.label : undefined"
  >
    <Icon
      v-if="badge.icon"
      :name="badge.icon"
      size="var(--font-size-xs)"
      aria-hidden="true"
    />
    <template v-else>{{ badge.label }}</template>
  </span>
</template>
