<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { isNavItemActive, navItemValue, type NavItem } from '@amg-webui/utils/nav'
import './style.scss'

type RouterLike = {
  push: (to: string) => unknown
  replace?: (to: string) => unknown
}

type RouteLike = {
  path: string
}

const props = withDefaults(
  defineProps<{
    items?: NavItem[]
    modelValue?: string | number
    disabled?: boolean
    direction?: 'horizontal' | 'vertical'
    /** Match mode for route active state */
    activeMatch?: 'exact' | 'prefix'
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    direction: 'horizontal',
    disabled: false,
    activeMatch: 'prefix',
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
}>()

const globals = getCurrentInstance()?.appContext.config.globalProperties as {
  $router?: RouterLike
  $route?: RouteLike
}

const rootClass = computed(() => [
  'vp-router-nav',
  `vp-router-nav--${props.direction}`,
  { 'vp-router-nav--disabled': props.disabled },
  props.class
])

function itemTo(item: NavItem): string | undefined {
  if (item.to) return item.to
  if (typeof item.href === 'string' && item.href.startsWith('/')) return item.href
  if (typeof item.value === 'string' && item.value.startsWith('/')) return item.value
  return undefined
}

function isRouteActive(item: NavItem): boolean {
  const to = itemTo(item)
  const pathNow = globals?.$route?.path
  if (!to || !pathNow) return false
  const path = to.split('?')[0] || to
  if (props.activeMatch === 'exact') return pathNow === path
  return pathNow === path || pathNow.startsWith(path.endsWith('/') ? path : `${path}/`)
}

function isActive(item: NavItem) {
  if (props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '') {
    return isNavItemActive(item, props.modelValue) || isRouteActive(item)
  }
  return isRouteActive(item)
}

function onSelect(item: NavItem, e: MouseEvent) {
  if (item.disabled || props.disabled) {
    e.preventDefault()
    return
  }
  const v = navItemValue(item)
  const to = itemTo(item)
  trackEmit({
    component: 'RouterNav',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: v, to }
  })
  emit('update:modelValue', v)
  emit('change', v)
  emit('select', item, e)

  if (to && globals?.$router) {
    e.preventDefault()
    void globals.$router.push(to)
  }
}
</script>

<template>
  <nav :class="rootClass" :style="style" role="navigation" data-component="RouterNav">
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="itemTo(item) ?? '#'"
      :class="['vp-router-nav__item', { 'vp-router-nav__item--active': isActive(item) }]"
      :aria-disabled="disabled || item.disabled ? 'true' : undefined"
      :tabindex="disabled || item.disabled ? -1 : 0"
      @click="onSelect(item, $event)"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
