<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import IntroDoDont from '../../components/intro/IntroDoDont.vue'
import type { LocaleKey } from '@amg-webui/locale'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import ConfigMinimalDemo from './demos/ConfigMinimal.vue'
import configMinimalSrc from './demos/ConfigMinimal.vue?raw'
import ConfigScopedDemo from './demos/ConfigScoped.vue'
import configScopedSrc from './demos/ConfigScoped.vue?raw'
import mainBootstrapSrc from './snippets/main-bootstrap.ts?raw'

const { t } = useLocale()

const toc: IntroTocItem[] = [
  { id: 'config-provider', labelKey: 'page.intro.appConfig.tocConfigProvider' },
  { id: 'scoped', labelKey: 'page.intro.appConfig.tocScoped' },
  { id: 'bootstrap', labelKey: 'page.intro.appConfig.tocBootstrap' },
  { id: 'guidelines', labelKey: 'page.intro.appConfig.tocGuidelines' },
  { id: 'next', labelKey: 'page.intro.appConfig.tocNext' }
]

const doKeys: LocaleKey[] = [
  'page.intro.appConfig.do1',
  'page.intro.appConfig.do2',
  'page.intro.appConfig.do3'
]

const dontKeys: LocaleKey[] = [
  'page.intro.appConfig.dont1',
  'page.intro.appConfig.dont2',
  'page.intro.appConfig.dont3'
]

const nextLinks: IntroNextLink[] = [
  {
    titleKey: 'page.intro.design.title',
    descriptionKey: 'page.intro.appConfig.nextDesign',
    to: { name: 'intro-design' }
  },
  {
    titleKey: 'page.intro.theme.title',
    descriptionKey: 'page.intro.appConfig.nextTheme',
    to: { name: 'intro-theme' }
  }
]
</script>

<template>
  <IntroPageShell
    title-key="page.intro.appConfig.title"
    lead-key="page.intro.appConfig.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <IntroCallout tone="info" title-key="page.intro.appConfig.calloutTitle">
      <p>{{ t('page.intro.appConfig.calloutBody') }}</p>
    </IntroCallout>

    <IntroSection id="config-provider" title-key="page.intro.appConfig.configProviderTitle" lead-key="page.intro.appConfig.configProviderLead">
      <IntroPreview :code="configMinimalSrc" language="vue" filename="ConfigMinimal.vue">
        <ConfigMinimalDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="scoped" title-key="page.intro.appConfig.scopedTitle" lead-key="page.intro.appConfig.scopedLead">
      <IntroPreview :code="configScopedSrc" language="vue" filename="ConfigScoped.vue">
        <ConfigScopedDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="bootstrap" title-key="page.intro.appConfig.bootstrapTitle" lead-key="page.intro.appConfig.bootstrapLead">
      <IntroPreview :code="mainBootstrapSrc" language="typescript" filename="main.ts" />
    </IntroSection>

    <IntroSection id="guidelines" title-key="page.intro.appConfig.guidelinesTitle">
      <IntroDoDont :do-keys="doKeys" :dont-keys="dontKeys" />
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.appConfig.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>
