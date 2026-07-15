<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, Icon, InputText, Tag } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  CATALOG_CATEGORY_ICONS,
  CATALOG_CATEGORY_ORDER,
  CATALOG_CATEGORY_TITLE_KEYS,
  catalogNamesByCategory,
  type CatalogCategoryId
} from '../../component-catalog'
import { componentMaturity, type MaturityLevel } from '../../component-zones'

const router = useRouter()
const { t, locale } = useLocale()
const keyword = ref('')

const sections = computed(() => {
  void locale.value
  const kw = keyword.value.trim().toLowerCase()
  return CATALOG_CATEGORY_ORDER.map((id) => {
    const names = catalogNamesByCategory(id as CatalogCategoryId).filter((n) =>
      kw ? n.toLowerCase().includes(kw) : true
    )
    return {
      id,
      title: t(CATALOG_CATEGORY_TITLE_KEYS[id]),
      icon: CATALOG_CATEGORY_ICONS[id],
      names
    }
  }).filter((s) => s.names.length > 0)
})

const totalVisible = computed(() => sections.value.reduce((n, s) => n + s.names.length, 0))

function levelLabel(level: MaturityLevel) {
  return t(LocaleKeys.page.gallery.maturity[level])
}

function levelSeverity(level: MaturityLevel): 'success' | 'warning' | 'info' | 'danger' {
  switch (level) {
    case 'ready':
      return 'success'
    case 'beta':
      return 'warning'
    case 'shell':
      return 'info'
    default:
      return 'danger'
  }
}

function openDoc(name: string) {
  router.push({ name: 'base-component', params: { name } })
}
</script>

<template>
  <div class="vp-catalog">
    <header class="ln-page-hero">
      <h1 class="ln-page-title">{{ t('page.base.catalog.title') }}</h1>
      <p class="ln-page-lead">{{ t('page.base.catalog.lead') }}</p>
      <p class="vp-catalog__count">
        {{ t('example.doc.catalog.visibleCount', { count: totalVisible }) }}
      </p>
    </header>

    <Card class="vp-toolbar vp-catalog__toolbar">
      <InputText
        v-model="keyword"
        :placeholder="t(LocaleKeys.common.search)"
        class="vp-catalog__search"
        :aria-label="t(LocaleKeys.common.search)"
      />
    </Card>

    <section v-for="sec in sections" :key="sec.id" class="vp-catalog__section">
      <h2 class="vp-catalog__h2">
        <Icon :name="sec.icon" size="sm" />
        <span>{{ sec.title }}</span>
        <span class="vp-catalog__sec-count">{{ sec.names.length }}</span>
      </h2>
      <div class="vp-catalog__grid">
        <button
          v-for="name in sec.names"
          :key="name"
          type="button"
          class="vp-catalog__tile"
          @click="openDoc(name)"
        >
          <span class="vp-catalog__name">{{ name }}</span>
          <Tag
            size="sm"
            :severity="levelSeverity(componentMaturity(name).level)"
            :label="levelLabel(componentMaturity(name).level)"
          />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.vp-catalog {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-catalog__count {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-catalog__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}

.vp-catalog__search {
  min-width: 16rem;
  flex: 1;
}

.vp-catalog__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-catalog__h2 {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-catalog__sec-count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.vp-catalog__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--spacing-md);
}

.vp-catalog__tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  min-height: var(--height-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: border-color var(--transition-normal), background var(--transition-normal);
}

.vp-catalog__tile:hover {
  border-color: var(--border-color-hover);
  background: var(--surface-2, var(--surface-1));
}

.vp-catalog__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
