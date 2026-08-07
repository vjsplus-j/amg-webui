<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import { Button, Card, Icon, Empty } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Tree, Pagination } from '@amg-webui/data'
import { Dialog, Message } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizContentProps, BizContentEmits, BizContentItem, BizContentCreate } from './types'
import { useContentList } from './composables/useContentList'
import { DEFAULT_BIZ_ACCESS, useBizAsync } from '../_shared'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizContentProps>(), {
  items: () => [],
  categories: () => [],
  loading: false,
  error: null,
  title: undefined,
  access: undefined,
  page: 1,
  pageSize: 10,
  total: undefined
})

const emit = defineEmits<BizContentEmits>()
const attrs = useAttrs()
const { t, locale } = useLocale()
const access = computed(() => ({
  ...DEFAULT_BIZ_ACCESS,
  publish: true,
  archive: true,
  ...props.access
}))

const usingAdapter = computed(() => Boolean(props.adapter))
const fallbackAdapter = {
  async list() {
    return { list: props.items ?? [], total: (props.items ?? []).length }
  }
}
const asyncApi = useBizAsync<BizContentItem, BizContentCreate, BizContentItem>({
  adapter: () => props.adapter ?? fallbackAdapter,
  initialQuery: { page: props.page, pageSize: props.pageSize },
  immediate: Boolean(props.adapter),
  keywordDebounceMs: 300,
  cache: { max: 32, ttlMs: 30_000 },
  getItemId: (item) => item.id
})

const { keyword, status, filtered } = useContentList(() =>
  usingAdapter.value ? asyncApi.list.value : (props.items ?? [])
)

const categoryFilter = ref<string | null>(null)
const hostOwnsPaging = computed(() => !usingAdapter.value && props.total != null)
const localPage = ref(props.page ?? 1)
const localPageSize = ref(props.pageSize ?? 10)
watch(
  () => props.page,
  (v) => {
    if (v != null) localPage.value = v
  }
)
watch(
  () => props.pageSize,
  (v) => {
    if (v != null) localPageSize.value = v
  }
)

const filteredByCategory = computed(() => {
  const base = usingAdapter.value ? asyncApi.list.value : filtered.value
  if (!categoryFilter.value) return base
  return base.filter((i) => i.category === categoryFilter.value)
})

const tableRows = computed(() => {
  if (usingAdapter.value || hostOwnsPaging.value) return filteredByCategory.value
  const start = (localPage.value - 1) * localPageSize.value
  return filteredByCategory.value.slice(start, start + localPageSize.value)
})
const tableLoading = computed(() => (usingAdapter.value ? asyncApi.loading.value : props.loading))
const tableError = computed(() => (usingAdapter.value ? asyncApi.error.value : props.error))
const mutationError = computed(() =>
  usingAdapter.value ? asyncApi.mutation.value.error : null
)
const tableTotal = computed(() =>
  usingAdapter.value
    ? asyncApi.total.value
    : (props.total ?? filteredByCategory.value.length)
)

const currentPage = computed({
  get: () => (usingAdapter.value ? asyncApi.page.value : localPage.value),
  set: (v: number) => {
    localPage.value = v
    if (usingAdapter.value) asyncApi.setPage(v)
    else {
      emit('update:page', v)
      emit('page-change', {
        page: v,
        pageSize: localPageSize.value,
        keyword: keyword.value,
        filters: { status: status.value, category: categoryFilter.value }
      })
    }
  }
})
const currentPageSize = computed({
  get: () => (usingAdapter.value ? asyncApi.pageSize.value : localPageSize.value),
  set: (v: number) => {
    localPageSize.value = v
    localPage.value = 1
    if (usingAdapter.value) asyncApi.setPageSize(v)
    else {
      emit('update:pageSize', v)
      emit('page-change', {
        page: 1,
        pageSize: v,
        keyword: keyword.value,
        filters: { status: status.value, category: categoryFilter.value }
      })
    }
  }
})

watch(keyword, (v) => {
  if (usingAdapter.value) asyncApi.setKeyword(v)
})
watch(status, (v) => {
  if (usingAdapter.value) asyncApi.setFilter('status', v)
})

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.contentTitle))
const treeSelection = ref<string | number | null>(null)
const showEditor = ref(false)
const editing = ref<BizContentItem | null>(null)
const formError = ref('')
const form = ref({
  title: '',
  category: '',
  summary: '',
  body: '',
  status: 'draft' as BizContentItem['status']
})

const statusOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allStatus') },
    { value: 'draft', label: t('biz.content.draft') },
    { value: 'published', label: t('biz.content.published') },
    { value: 'archived', label: t('biz.content.archived') }
  ]
})

const categoryOptions = computed(() => {
  const walk = (nodes: typeof props.categories, acc: { value: string; label: string }[] = []) => {
    for (const n of nodes ?? []) {
      const value = String(n.value ?? n.label)
      acc.push({ value, label: n.label })
      if (n.children?.length) walk(n.children, acc)
    }
    return acc
  }
  return walk(props.categories ?? [])
})

function statusLabel(value: string) {
  return statusOptions.value.find((o) => o.value === value)?.label ?? value
}

function onTreeSelect(val: unknown) {
  const next = val == null || val === '' ? null : String(val)
  categoryFilter.value = next
  treeSelection.value = next
  if (usingAdapter.value) asyncApi.setFilter('category', next)
  emit('category-change', next)
}

function openCreate() {
  if (!access.value.create) return
  editing.value = null
  formError.value = ''
  form.value = {
    title: '',
    category: categoryFilter.value ?? categoryOptions.value[0]?.value ?? '',
    summary: '',
    body: '',
    status: 'draft'
  }
  showEditor.value = true
}

function openEdit(item: BizContentItem) {
  if (!access.value.update) return
  editing.value = item
  formError.value = ''
  form.value = {
    title: item.title,
    category: item.category,
    summary: item.summary ?? '',
    body: item.body ?? '',
    status: item.status
  }
  showEditor.value = true
  emit('edit', item)
}

function validate(): boolean {
  formError.value = ''
  if (!form.value.title.trim() || !form.value.category) {
    formError.value = t('biz.content.formRequired')
    return false
  }
  return true
}

async function save(as: BizContentItem['status']) {
  if (!validate()) return
  const payload: BizContentCreate = {
    title: form.value.title.trim(),
    category: form.value.category,
    summary: form.value.summary.trim() || undefined,
    body: form.value.body,
    status: as
  }
  if (editing.value) {
    const next: BizContentItem = {
      ...editing.value,
      ...payload,
      updatedAt: new Date().toISOString().slice(0, 10)
    }
    if (usingAdapter.value && props.adapter?.update) {
      await asyncApi.update(next, { optimistic: next })
      if (asyncApi.mutation.value.error) return
    }
    emit('save', next)
  } else {
    if (usingAdapter.value && props.adapter?.create) {
      await asyncApi.create(payload)
      if (asyncApi.mutation.value.error) return
    }
    emit('create', payload)
  }
  showEditor.value = false
}

function onPublish(id: string) {
  if (!access.value.publish) return
  emit('publish', id)
}
function onArchive(id: string) {
  if (!access.value.archive) return
  emit('archive', id)
}
function onRefresh() {
  if (usingAdapter.value) {
    asyncApi.invalidateCache()
    void asyncApi.load({ force: true })
  }
  emit('refresh')
}
function onPageChange(payload: { page: number; pageSize: number }) {
  if (usingAdapter.value) {
    asyncApi.setPagination(payload)
    return
  }
  const pageChanged = payload.page !== localPage.value
  const sizeChanged = payload.pageSize !== localPageSize.value
  if (!pageChanged && !sizeChanged) return
  localPage.value = payload.page
  localPageSize.value = payload.pageSize
  if (pageChanged) emit('update:page', payload.page)
  if (sizeChanged) emit('update:pageSize', payload.pageSize)
  emit('page-change', {
    page: payload.page,
    pageSize: payload.pageSize,
    keyword: keyword.value,
    filters: { status: status.value, category: categoryFilter.value }
  })
}
</script>

<template>
  <div class="biz-content" v-bind="attrs">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <div class="biz-content__layout">
      <aside class="biz-content__tree">
        <h3 class="theme-kit-heading">{{ t('biz.content.categories') }}</h3>
        <Tree
          v-if="(categories ?? []).length"
          :data="categories"
          :model-value="treeSelection"
          @update:model-value="onTreeSelect"
        />
        <Empty v-else :description="t('biz.content.allCategories')" />
      </aside>

      <div class="biz-content__main">
        <slot name="toolbar">
          <Card class="biz-content__toolbar">
            <slot name="filters">
              <InputText v-model="keyword" :placeholder="t('biz.content.search')" class="biz-content__search" />
              <Select v-model="status" :options="statusOptions" :placeholder="t('biz.status')" />
            </slot>
            <Button v-if="access.refresh !== false" severity="secondary" variant="outlined" @click="onRefresh">
              <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
            </Button>
            <Button v-if="access.create" severity="primary" variant="solid" @click="openCreate">
              <Icon name="Plus" size="sm" /> {{ t('biz.content.new') }}
            </Button>
            <slot name="actions" />
          </Card>
        </slot>

        <Message v-if="tableError" severity="danger" :closable="false">
          <slot name="error" :error="tableError">{{ tableError }}</slot>
        </Message>
        <Message v-if="mutationError" severity="danger" :closable="false">
          <slot name="mutation-error" :error="mutationError">{{ mutationError }}</slot>
        </Message>

        <slot v-if="tableLoading" name="loading">
          <Empty :description="t(LocaleKeys.common.loading)" />
        </slot>
        <slot name="empty" v-else-if="tableRows.length === 0">
          <Empty :description="t('biz.content.empty')" />
        </slot>
        <slot v-else name="list" :rows="tableRows">
          <div class="biz-content__grid">
            <article v-for="item in tableRows" :key="item.id" class="theme-kit-card biz-content__card">
              <div class="biz-content__meta">
                <span class="theme-kit-badge">{{ item.category }}</span>
                <span class="theme-kit-badge theme-kit-badge-outline">{{ statusLabel(item.status) }}</span>
              </div>
              <h3 class="theme-kit-heading">{{ item.title }}</h3>
              <p class="theme-kit-body-lg">{{ item.summary || t('biz.content.noSummary') }}</p>
              <div class="biz-content__foot">
                <span>{{ item.updatedAt }}</span>
                <div class="biz-content__actions">
                  <Button v-if="access.update" size="sm" variant="text" @click="openEdit(item)">
                    {{ t(LocaleKeys.button.edit) }}
                  </Button>
                  <Button
                    v-if="access.publish && item.status === 'draft'"
                    size="sm"
                    variant="text"
                    severity="primary"
                    @click="onPublish(item.id)"
                  >
                    {{ t('biz.content.publish') }}
                  </Button>
                  <Button
                    v-if="access.archive && item.status !== 'archived'"
                    size="sm"
                    variant="text"
                    @click="onArchive(item.id)"
                  >
                    {{ t('biz.content.archive') }}
                  </Button>
                </div>
              </div>
            </article>
          </div>
          <Pagination
            class="biz-content__pager"
            :page="currentPage"
            :page-size="currentPageSize"
            :total="tableTotal"
            @change="onPageChange"
          />
        </slot>
      </div>
    </div>

    <Dialog
      v-model:visible="showEditor"
      :header="editing ? t('biz.content.editTitle') : t('biz.content.createTitle')"
      modal
    >
      <Message v-if="formError" severity="danger" :closable="false">{{ formError }}</Message>
      <div class="biz-content__form">
        <InputText v-model="form.title" :placeholder="t('biz.content.titleField')" fluid />
        <Select v-model="form.category" :options="categoryOptions" :placeholder="t('biz.content.categories')" fluid />
        <InputText v-model="form.summary" :placeholder="t('biz.content.summary')" fluid />
        <slot name="editor" :form="form">
          <label class="biz-content__editor">
            <span>{{ t('biz.content.editor') }}</span>
            <textarea v-model="form.body" class="biz-content__textarea" rows="8" />
          </label>
        </slot>
      </div>
      <template #footer>
        <Button variant="outlined" @click="showEditor = false">{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button variant="outlined" @click="save('draft')">{{ t('biz.content.saveDraft') }}</Button>
        <Button severity="primary" variant="solid" @click="save('published')">{{ t('biz.content.publish') }}</Button>
      </template>
    </Dialog>
  </div>
</template>
