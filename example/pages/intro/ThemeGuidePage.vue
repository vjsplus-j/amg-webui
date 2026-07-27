<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Message } from '@amg-webui/components/base'
import {
  ThemeService,
  type ColorScheme,
  type DesignStyleName
} from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'

const router = useRouter()
const { t, locale } = useLocale()

const currentDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
const currentScheme = ref<ColorScheme>(ThemeService.getScheme())
let unsubDesign: (() => void) | undefined
let unsubScheme: (() => void) | undefined

onMounted(() => {
  unsubDesign = ThemeService.subscribe((s) => {
    currentDesign.value = s
  })
  unsubScheme = ThemeService.subscribeScheme((s) => {
    currentScheme.value = s
  })
})

onUnmounted(() => {
  unsubDesign?.()
  unsubScheme?.()
})

const supportsScheme = computed(() => !!ThemeService.getConfig(currentDesign.value)?.supportsScheme)

const tokenList = computed(() => {
  void locale.value
  return [
    t('page.intro.theme.token1'),
    t('page.intro.theme.token2'),
    t('page.intro.theme.token3'),
    t('page.intro.theme.token4')
  ]
})

const usageCode = computed(() => {
  void locale.value
  return t('page.intro.theme.usageCode')
})

const statusText = computed(() => {
  void locale.value
  return t('page.intro.theme.status', {
    design: currentDesign.value,
    scheme: currentScheme.value
  })
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.theme.title"
    lead-key="page.intro.theme.lead"
    eyebrow-key="page.intro.eyebrow"
  >
    <template #actions>
      <Button
        v-if="supportsScheme"
        size="sm"
        @click="ThemeService.toggleScheme()"
      >
        {{
          currentScheme === 'dark'
            ? t(LocaleKeys.chrome.schemeLight)
            : t(LocaleKeys.chrome.schemeDark)
        }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.theme.openLab') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme-custom' })">
        {{ t('page.themeCustom.title') }}
      </Button>
    </template>

    <Message severity="info" :closable="false">
      {{ t('page.intro.theme.msg') }}
    </Message>

    <Card :title="t('page.intro.theme.statusTitle')">
      <p class="intro-theme__status">{{ statusText }}</p>
      <p v-if="!supportsScheme" class="intro-theme__hint">
        {{ t('page.intro.theme.schemeHint') }}
      </p>
    </Card>

    <IntroSection title-key="page.intro.theme.tokensTitle">
      <p>{{ t('page.intro.theme.tokensLead') }}</p>
      <ul>
        <li v-for="(item, i) in tokenList" :key="i">{{ item }}</li>
      </ul>
    </IntroSection>

    <IntroSection title-key="page.intro.theme.usageTitle">
      <p>{{ t('page.intro.theme.usageLead') }}</p>
      <pre>{{ usageCode }}</pre>
      <p>{{ t('page.intro.theme.usageNote') }}</p>
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-theme__status {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.intro-theme__hint {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
}
</style>
