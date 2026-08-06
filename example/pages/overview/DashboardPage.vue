<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Message, Skeleton } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'
import { NAV_GROUP_TITLE_KEYS, type NavGroupId } from '../../router/routes'

const router = useRouter()
const { t, tDyn, locale } = useLocale()

/** Simulate slow home-data fetch after login — content pane skeleton until ready */
const homeLoading = ref(true)
let loadTimer = 0

onMounted(() => {
  loadTimer = window.setTimeout(() => {
    homeLoading.value = false
  }, 1400)
})

onUnmounted(() => {
  window.clearTimeout(loadTimer)
})

const zones = computed(() => {
  void locale.value
  const list: { group: NavGroupId; route: string; blurbKey: string }[] = [
    { group: 'intro', route: 'intro-quick-start', blurbKey: 'page.dashboard.blurb.intro' },
    { group: 'base', route: 'base-overview', blurbKey: 'page.dashboard.blurb.base' },
    { group: 'biz', route: 'biz-login', blurbKey: 'page.dashboard.blurb.biz' },
    { group: 'theme', route: 'theme', blurbKey: 'page.dashboard.blurb.theme' },
    { group: 'i18n', route: 'i18n', blurbKey: 'page.dashboard.blurb.i18n' },
    { group: 'perf', route: 'perf-massive', blurbKey: 'page.dashboard.blurb.perf' },
    { group: 'lab', route: 'lab-hooks', blurbKey: 'page.dashboard.blurb.lab' },
    { group: 'dev', route: 'dev-config', blurbKey: 'page.dashboard.blurb.dev' }
  ]
  return list.map((z) => ({
    ...z,
    title: t(NAV_GROUP_TITLE_KEYS[z.group]),
    blurb: tDyn(z.blurbKey)
  }))
})

const shellNotes = computed(() => {
  void locale.value
  return [
    t('page.dashboard.note.purpose'),
    t('page.dashboard.note.contextMenu'),
    t('page.dashboard.note.tabsNav'),
    t('page.dashboard.note.structure')
  ]
})
</script>

<template>
  <Skeleton
    variant="page"
    :rows="5"
    :loading="homeLoading"
    :aria-label="t('example.doc.skeleton.sample.page')"
  >
    <div class="dashboard">
      <ExamplePageHero
        title-key="page.dashboard.title"
        lead-key="page.dashboard.lead"
        eyebrow-key="page.dashboard.eyebrow"
      />

      <Message severity="info" :closable="false">
        {{ t('page.dashboard.msg') }}
      </Message>

      <Card :title="t('page.dashboard.notesTitle')">
        <ul class="dashboard__notes-list">
          <li v-for="(note, i) in shellNotes" :key="i">{{ note }}</li>
        </ul>
      </Card>

      <div class="ln-page-grid dashboard__zones">
        <Card v-for="z in zones" :key="z.group" :title="z.title">
          <p class="dashboard__blurb">{{ z.blurb }}</p>
          <Button size="sm" variant="outlined" @click="router.push({ name: z.route })">
            {{ t(LocaleKeys.button.enter) }}
          </Button>
        </Card>
      </div>
    </div>
  </Skeleton>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.dashboard__notes-list {
  margin: 0;
  padding-left: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.dashboard__zones {
  margin-top: var(--spacing-md);
}

.dashboard__blurb {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
