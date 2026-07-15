<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys, LOCALE_META } from '@amg-webui/locale'

const { t, locale } = useLocale()

const samples = computed(() => {
  void locale.value
  return [
    { key: LocaleKeys.auth.username, value: t(LocaleKeys.auth.username) },
    { key: LocaleKeys.auth.signOut, value: t(LocaleKeys.auth.signOut) },
    { key: LocaleKeys.button.signIn, value: t(LocaleKeys.button.signIn) },
    { key: LocaleKeys.nav.biz, value: t(LocaleKeys.nav.biz) },
    { key: LocaleKeys.page.i18nTitle, value: t(LocaleKeys.page.i18nTitle) },
    { key: LocaleKeys.common.search, value: t(LocaleKeys.common.search) }
  ]
})

const meta = computed(() => LOCALE_META[locale.value])
</script>

<template>
  <div class="i18n-lab">
    <header class="i18n-lab__head">
      <h2 class="i18n-lab__title">{{ t(LocaleKeys.page.i18nTitle) }}</h2>
      <p class="i18n-lab__sub">
        {{ locale }} · {{ meta.label }} · {{ meta.lang }} / {{ meta.dir }}
      </p>
    </header>

    <Card class="i18n-lab__card">
      <p class="i18n-lab__hint">
        {{ t('page.i18n.hint') }}
      </p>
      <ul class="i18n-lab__list">
        <li v-for="item in samples" :key="item.key">
          <code>{{ item.key }}</code>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </Card>
  </div>
</template>

<style scoped>
.i18n-lab {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 0.75rem);
  padding: var(--spacing-md, 0.75rem);
}

.i18n-lab__title {
  margin: 0;
  font-size: var(--font-size-xl, 1.25rem);
  color: var(--text-primary);
}

.i18n-lab__sub {
  margin: var(--spacing-sm, 0.5rem) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.i18n-lab__hint {
  margin: 0 0 var(--spacing-md, 0.75rem);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.i18n-lab__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 0.5rem);
}

.i18n-lab__list li {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md, 0.75rem);
  padding: var(--spacing-sm, 0.5rem) 0;
  border-bottom: 1px solid var(--border-color);
  font-size: var(--font-size-sm);
}

.i18n-lab__list code {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.i18n-lab__list span {
  color: var(--text-primary);
  font-weight: 500;
}
</style>
