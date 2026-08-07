<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'

const props = defineProps<{
  doKeys: LocaleKey[]
  dontKeys: LocaleKey[]
}>()

const { t, locale } = useLocale()

const dos = computed(() => {
  void locale.value
  return props.doKeys.map((k) => t(k))
})

const donts = computed(() => {
  void locale.value
  return props.dontKeys.map((k) => t(k))
})
</script>

<template>
  <div class="intro-dodont">
    <div class="intro-dodont__col intro-dodont__col--do">
      <h3 class="intro-dodont__heading">{{ t('page.intro.do') }}</h3>
      <ul>
        <li v-for="(item, i) in dos" :key="i">{{ item }}</li>
      </ul>
    </div>
    <div class="intro-dodont__col intro-dodont__col--dont">
      <h3 class="intro-dodont__heading">{{ t('page.intro.dont') }}</h3>
      <ul>
        <li v-for="(item, i) in donts" :key="i">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.intro-dodont {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--spacing-lg);
}

.intro-dodont__heading {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--text-primary);
}

.intro-dodont__col ul {
  margin: 0;
  padding-inline-start: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.intro-dodont__col--do .intro-dodont__heading {
  color: var(--success-600, var(--success, #1f8a4c));
}

.intro-dodont__col--dont .intro-dodont__heading {
  color: var(--danger-600, var(--danger, #c0392b));
}
</style>
