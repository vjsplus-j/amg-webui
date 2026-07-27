<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Message } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'

const router = useRouter()
const { t, locale } = useLocale()

const steps = computed(() => {
  void locale.value
  return [
    t('page.intro.quickStart.step1'),
    t('page.intro.quickStart.step2'),
    t('page.intro.quickStart.step3'),
    t('page.intro.quickStart.step4'),
    t('page.intro.quickStart.step5')
  ]
})

const bootOrder = computed(() => {
  void locale.value
  return t('page.intro.quickStart.bootCode')
})

const urlParams = computed(() => {
  void locale.value
  return t('page.intro.quickStart.urlCode')
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.quickStart.title"
    lead-key="page.intro.quickStart.lead"
    eyebrow-key="page.intro.eyebrow"
  >
    <template #actions>
      <Button size="sm" @click="router.push({ name: 'intro-design' })">
        {{ t('page.intro.quickStart.ctaDesign') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'base-overview' })">
        {{ t(LocaleKeys.button.enter) }} · {{ t('nav.base') }}
      </Button>
    </template>

    <Message severity="info" :closable="false">
      {{ t('page.intro.quickStart.msg') }}
    </Message>

    <IntroSection title-key="page.intro.quickStart.stepsTitle">
      <ol>
        <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
      </ol>
    </IntroSection>

    <IntroSection title-key="page.intro.quickStart.bootTitle">
      <p>{{ t('page.intro.quickStart.bootLead') }}</p>
      <pre>{{ bootOrder }}</pre>
    </IntroSection>

    <IntroSection title-key="page.intro.quickStart.urlTitle">
      <p>{{ t('page.intro.quickStart.urlLead') }}</p>
      <pre>{{ urlParams }}</pre>
    </IntroSection>

    <IntroSection title-key="page.intro.quickStart.nextTitle">
      <p>{{ t('page.intro.quickStart.nextLead') }}</p>
      <div class="intro-quick__links">
        <Button size="sm" variant="outlined" @click="router.push({ name: 'intro-design' })">
          {{ t('page.intro.design.title') }}
        </Button>
        <Button size="sm" variant="outlined" @click="router.push({ name: 'intro-theme' })">
          {{ t('page.intro.theme.title') }}
        </Button>
        <Button size="sm" variant="outlined" @click="router.push({ name: 'intro-font' })">
          {{ t('page.intro.font.title') }}
        </Button>
        <Button size="sm" variant="outlined" @click="router.push({ name: 'intro-icon' })">
          {{ t('page.intro.icon.title') }}
        </Button>
        <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
          {{ t('page.theme.title') }}
        </Button>
      </div>
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-quick__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
</style>
