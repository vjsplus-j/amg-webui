<script setup lang="ts">
import type { PaginationProps, PaginationEmits } from './types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '../Icon/index.vue'
import { usePagination } from './usePagination'
import './style.scss'

const props = withDefaults(defineProps<PaginationProps>(), {
  total: 0,
  page: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100]
})

const emit = defineEmits<PaginationEmits>()
const { t } = useLocale()

const {
  total,
  pageSize,
  page,
  pageCount,
  rootClass,
  canPrev,
  canNext,
  pageItems
} = usePagination(props)

const go = (next: number) => {
  if (props.disabled) return
  const clamped = Math.min(pageCount.value, Math.max(1, next))
  emit('update:page', clamped)
  emit('change', { page: clamped, pageSize: pageSize.value })
}

const handleSizeChange = (event: Event) => {
  if (props.disabled) return
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  emit('update:page', 1)
  emit('change', { page: 1, pageSize: size })
}
</script>

<template>
  <nav :class="rootClass" :style="style" :aria-label="t(LocaleKeys.component.pagination.aria)">
    <span v-if="$slots.total" class="vp-pagination__total">
      <slot name="total" :total="total" :page="page" :page-size="pageSize" />
    </span>

    <button
      type="button"
      class="vp-pagination__btn"
      :disabled="!canPrev"
      :aria-label="t(LocaleKeys.common.previous)"
      @click="go(page - 1)"
    >
      <Icon name="ChevronLeft" size="sm" />
    </button>

    <template v-for="(item, idx) in pageItems" :key="`${item}-${idx}`">
      <span v-if="item === 'ellipsis'" class="vp-pagination__ellipsis" aria-hidden="true">...</span>
      <button
        v-else
        type="button"
        class="vp-pagination__page"
        :class="{ 'vp-pagination__page--active': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        @click="go(item as number)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="vp-pagination__btn"
      :disabled="!canNext"
      :aria-label="t(LocaleKeys.common.next)"
      @click="go(page + 1)"
    >
      <Icon name="ChevronRight" size="sm" />
    </button>

    <select
      v-if="pageSizes?.length"
      class="vp-pagination__sizes"
      :value="pageSize"
      :disabled="disabled"
      @change="handleSizeChange"
    >
      <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
    </select>
  </nav>
</template>
