<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys, getLocaleMeta } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, locale, dir, setDirection } = useLocale()

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

const meta = computed(() => getLocaleMeta(locale.value))

const localeLead = computed(() => {
  void locale.value
  void dir.value
  const m = meta.value
  return `${locale.value} · ${m?.label ?? '—'} · ${m?.lang ?? '—'} / ${dir.value}`
})

const rtlActionLabel = computed(() => {
  void locale.value
  void dir.value
  return dir.value === 'rtl' ? t('page.i18n.rtlAuto') : t('page.i18n.rtlForce')
})

function toggleRtlPreview() {
  setDirection(dir.value === 'rtl' ? null : 'rtl')
}
</script>

<template>
  <div class="i18n-lab">
    <ExamplePageHero title-key="page.i18n.title" :lead="localeLead">
      <template #actions>
        <button type="button" class="i18n-lab__rtl-btn" @click="toggleRtlPreview">
          {{ rtlActionLabel }}
        </button>
      </template>
    </ExamplePageHero>

    <Card class="i18n-lab__card">
      <p class="i18n-lab__hint">
        {{ t('page.i18n.hint') }}
      </p>
      <ul class="i18n-lab__list">
        <li v-for="item in samples" :key="item.key">
          <code class="vp-ltr">{{ item.key }}</code>
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
  gap: var(--theme-section-gap);
}

.i18n-lab__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.i18n-lab__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.i18n-lab__list li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: baseline;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.i18n-lab__list code {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.i18n-lab__rtl-btn {
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
}
</style>
