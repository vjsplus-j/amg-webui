<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'amg-webui/core'
import { ThemeService, type ColorScheme, type DesignStyleName } from 'amg-webui/theme'
import { useLocale } from 'amg-webui/hooks'
import { LocaleKeys } from 'amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroTokenTable from '../../components/intro/IntroTokenTable.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import ThemeSchemeDemo from './demos/ThemeScheme.vue'
import themeSchemeDemoSrc from './demos/ThemeScheme.vue?raw'
import ThemeScopedDemo from './demos/ThemeScoped.vue'
import themeScopedDemoSrc from './demos/ThemeScoped.vue?raw'
import ThemeTokensDemo from './demos/ThemeTokens.vue'
import themeTokensDemoSrc from './demos/ThemeTokens.vue?raw'
import themeSchemeSrc from './snippets/theme-scheme.ts?raw'

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

const toc: IntroTocItem[] = [
  { id: 'scheme', labelKey: 'page.intro.theme.tocScheme' },
  { id: 'scoped', labelKey: 'page.intro.theme.tocScoped' },
  { id: 'tokens', labelKey: 'page.intro.theme.tocTokens' },
  { id: 'reference', labelKey: 'page.intro.theme.tocReference' },
  { id: 'usage', labelKey: 'page.intro.theme.tocUsage' },
  { id: 'next', labelKey: 'page.intro.theme.tocNext' }
]

const tokenRows = computed(() => {
  void locale.value
  return [
    { token: '--ds-* / --surface-* / --text-*', description: t('page.intro.theme.token1') },
    { token: '--theme-card-radius · --theme-btn-radius', description: t('page.intro.theme.token2') },
    { token: '--spacing-* · --font-size-* · --shadow-*', description: t('page.intro.theme.token3') },
    { token: 'data-design / data-scheme', description: t('page.intro.theme.token4') }
  ]
})

const statusText = computed(() => {
  void locale.value
  return t('page.intro.theme.status', {
    design: currentDesign.value,
    scheme: currentScheme.value
  })
})

const nextLinks = computed((): IntroNextLink[] => {
  void locale.value
  return [
    {
      titleKey: 'page.intro.i18n.title',
      descriptionKey: 'page.intro.theme.nextI18n',
      to: { name: 'intro-i18n' }
    },
    {
      titleKey: 'page.themeCustom.title',
      descriptionKey: 'page.intro.theme.nextCustom',
      to: { name: 'theme-custom' }
    }
  ]
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.theme.title"
    lead-key="page.intro.theme.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
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
    </template>

    <IntroCallout tone="info" title-key="page.intro.theme.calloutTitle">
      <p>{{ t('page.intro.theme.calloutBody') }}</p>
      <p v-if="!supportsScheme" class="intro-theme__hint">{{ t('page.intro.theme.schemeHint') }}</p>
      <p class="intro-theme__status">{{ statusText }}</p>
    </IntroCallout>

    <IntroSection id="scheme" title-key="page.intro.theme.schemeTitle" lead-key="page.intro.theme.schemeLead">
      <IntroPreview :code="themeSchemeDemoSrc" language="vue" filename="ThemeScheme.vue">
        <ThemeSchemeDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="scoped" title-key="page.intro.theme.scopedTitle" lead-key="page.intro.theme.scopedLead">
      <IntroPreview :code="themeScopedDemoSrc" language="vue" filename="ThemeScoped.vue">
        <ThemeScopedDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="tokens" title-key="page.intro.theme.overrideTitle" lead-key="page.intro.theme.overrideLead">
      <IntroPreview :code="themeTokensDemoSrc" language="vue" filename="ThemeTokens.vue">
        <ThemeTokensDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="reference" title-key="page.intro.theme.tokensTitle" lead-key="page.intro.theme.tokensLead">
      <IntroTokenTable :rows="tokenRows" />
    </IntroSection>

    <IntroSection id="usage" title-key="page.intro.theme.usageTitle" lead-key="page.intro.theme.usageLead">
      <IntroPreview :code="themeSchemeSrc" language="typescript" filename="theme.ts" />
      <p>{{ t('page.intro.theme.usageNote') }}</p>
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.theme.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-theme__status {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.intro-theme__hint {
  margin: var(--spacing-xs) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}
</style>
