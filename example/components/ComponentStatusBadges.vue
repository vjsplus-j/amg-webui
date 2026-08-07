<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { Icon } from '@amg-webui/core'
import { resolveComponentBadges } from '../nav-component-badges'

const props = defineProps<{
  name: string
}>()

const { t, locale } = useLocale()

const badges = computed(() => {
  void locale.value
  return resolveComponentBadges(props.name, t)
})
</script>

<template>
  <span v-if="badges.length" class="vp-comp-badges" aria-hidden="false">
    <span
      v-for="b in badges"
      :key="`${name}-${b.tone}`"
      class="vp-comp-badges__pill"
      :class="[
        `vp-comp-badges__pill--${b.tone}`,
        { 'vp-comp-badges__pill--icon': Boolean(b.icon) }
      ]"
      :role="b.icon ? 'img' : undefined"
      :aria-label="b.icon ? b.label : undefined"
      :title="b.icon ? b.label : undefined"
    >
      <Icon
        v-if="b.icon"
        :name="b.icon"
        size="var(--font-size-xs)"
        aria-hidden="true"
      />
      <template v-else>{{ b.label }}</template>
    </span>
  </span>
</template>

<style scoped>
.vp-comp-badges {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.vp-comp-badges__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding-inline: var(--spacing-xs);
  padding-block: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold, 600);
  line-height: var(--line-height-body);
  border-radius: var(--border-radius-sm);
  border: 1px solid transparent;
}

.vp-comp-badges__pill--gold {
  background: var(--warning-100);
  color: var(--warning-800);
  border-color: var(--warning-400);
}

.vp-comp-badges__pill--ep {
  background: var(--info-100);
  color: var(--info-800);
  border-color: var(--info-400);
}

.vp-comp-badges__pill--hot {
  background: var(--danger-100);
  color: var(--danger-800);
  border-color: var(--danger-400);
}

.vp-comp-badges__pill--hot :deep(.vp-icon.vp-icon--lucide svg) {
  fill: var(--warning-400);
  stroke: var(--danger-600);
}

.vp-comp-badges__pill--icon {
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  padding: 0;
  border-radius: var(--border-radius-full);
  line-height: 0;
}
</style>
