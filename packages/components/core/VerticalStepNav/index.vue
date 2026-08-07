<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import Icon from '@amg-webui/core/Icon/index.vue'
import type {
  VerticalStepNavProps,
  VerticalStepNavEmits,
  VerticalStepNavItem,
  VerticalStepStatus
} from './types'
import './style.scss'

const props = withDefaults(defineProps<VerticalStepNavProps>(), {
  items: () => [],
  disabled: false,
  clickable: true,
  showIndex: true,
  completedIcon: 'Check',
  errorIcon: 'X',
  telemetry: undefined
})

const emit = defineEmits<VerticalStepNavEmits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-vertical-step-nav',
  {
    'vp-vertical-step-nav--disabled': props.disabled,
    'vp-vertical-step-nav--static': !props.clickable
  },
  props.class
])

function stepValue(item: VerticalStepNavItem, index: number) {
  return item.value ?? index
}

const activeIndex = computed(() =>
  props.items.findIndex((item, index) => stepValue(item, index) === props.modelValue)
)

function statusOf(item: VerticalStepNavItem, index: number): VerticalStepStatus {
  if (item.status) return item.status
  if (index === activeIndex.value) return 'process'
  if (activeIndex.value >= 0 && index < activeIndex.value) return 'finish'
  return 'wait'
}

function isActive(item: VerticalStepNavItem, index: number) {
  return stepValue(item, index) === props.modelValue
}

function selectStep(item: VerticalStepNavItem, index: number, event: MouseEvent) {
  if (props.disabled || item.disabled || !props.clickable) return
  const value = stepValue(item, index)
  trackEmit({
    component: 'VerticalStepNav',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: item.label,
    payload: { value, index, status: statusOf(item, index) }
  })
  emit('update:modelValue', value)
  emit('change', value)
  emit('select', { ...item, value }, event)
}
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    :aria-label="ariaLabel || t('component.vertical-step-nav.title')"
    data-component="VerticalStepNav"
  >
    <ol class="vp-vertical-step-nav__list">
      <li
        v-for="(item, index) in items"
        :key="String(item.value ?? index)"
        class="vp-vertical-step-nav__step"
        :class="[
          `vp-vertical-step-nav__step--${statusOf(item, index)}`,
          { 'vp-vertical-step-nav__step--active': isActive(item, index) }
        ]"
        :data-status="statusOf(item, index)"
      >
        <button
          type="button"
          class="vp-vertical-step-nav__marker"
          :disabled="disabled || item.disabled || !clickable"
          :aria-current="isActive(item, index) ? 'step' : undefined"
          :aria-label="item.label"
          @click="selectStep(item, index, $event)"
        >
          <Icon
            v-if="statusOf(item, index) === 'finish'"
            :name="completedIcon"
            size="sm"
            aria-hidden="true"
          />
          <Icon
            v-else-if="statusOf(item, index) === 'error'"
            :name="errorIcon"
            size="sm"
            aria-hidden="true"
          />
          <span v-else-if="showIndex" aria-hidden="true">{{ index + 1 }}</span>
        </button>

        <div class="vp-vertical-step-nav__content">
          <slot
            name="item"
            :item="item"
            :index="index"
            :status="statusOf(item, index)"
            :active="isActive(item, index)"
          >
            <div class="vp-vertical-step-nav__title-row">
              <span class="vp-vertical-step-nav__title">{{ item.label }}</span>
              <span v-if="item.badge != null" class="vp-vertical-step-nav__badge">
                {{ item.badge }}
              </span>
            </div>
            <p v-if="item.description" class="vp-vertical-step-nav__description">
              {{ item.description }}
            </p>
          </slot>
        </div>
      </li>
    </ol>
  </nav>
</template>
