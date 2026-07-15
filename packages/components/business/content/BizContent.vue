<script setup lang="ts">
import { computed } from 'vue'
import { Button, InputText, Select, Card, Icon } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizContentProps, BizContentEmits } from './types'
import { useContentList } from './composables/useContentList'
import './style.scss'

const props = withDefaults(defineProps<BizContentProps>(), {
  loading: false,
  title: undefined
})

const emit = defineEmits<BizContentEmits>()
const { t, locale } = useLocale()
const { keyword, status, filtered } = useContentList(() => props.items)

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.contentTitle))

const statusOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allStatus') },
    { value: 'draft', label: t('biz.content.draft') },
    { value: 'published', label: t('biz.content.published') },
    { value: 'archived', label: t('biz.content.archived') }
  ]
})

function statusLabel(value: string) {
  const hit = statusOptions.value.find((o) => o.value === value)
  return hit?.label ?? value
}
</script>

<template>
  <div class="biz-content">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">Business · Content</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <Card class="biz-content__toolbar">
      <InputText v-model="keyword" :placeholder="t('biz.content.search')" class="biz-content__search" />
      <Select v-model="status" :options="statusOptions" :placeholder="t('biz.status')" />
      <Button severity="secondary" variant="outlined" @click="emit('refresh')">
        <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
      </Button>
      <Button severity="primary" variant="solid" @click="emit('create')">
        <Icon name="Plus" size="sm" /> {{ t('biz.content.new') }}
      </Button>
    </Card>

    <div class="biz-content__grid">
      <article v-for="item in filtered" :key="item.id" class="theme-kit-card biz-content__card">
        <div class="biz-content__meta">
          <span class="theme-kit-badge">{{ item.category }}</span>
          <span class="theme-kit-badge theme-kit-badge-outline">{{ statusLabel(item.status) }}</span>
        </div>
        <h3 class="theme-kit-heading">{{ item.title }}</h3>
        <p class="theme-kit-body-lg">{{ item.summary || t('biz.content.noSummary') }}</p>
        <div class="biz-content__foot">
          <span>{{ item.updatedAt }}</span>
          <div class="biz-content__actions">
            <Button size="sm" variant="text" @click="emit('edit', item)">
              {{ t(LocaleKeys.button.edit) }}
            </Button>
            <Button
              v-if="item.status === 'draft'"
              size="sm"
              variant="text"
              severity="primary"
              @click="emit('publish', item.id)"
            >
              {{ t('biz.content.publish') }}
            </Button>
            <Button
              v-if="item.status !== 'archived'"
              size="sm"
              variant="text"
              @click="emit('archive', item.id)"
            >
              {{ t('biz.content.archive') }}
            </Button>
          </div>
        </div>
      </article>
      <p v-if="!filtered.length" class="biz-content__empty">{{ t('biz.content.empty') }}</p>
    </div>
  </div>
</template>
