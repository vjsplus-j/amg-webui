<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import IntroDoDont from '../../components/intro/IntroDoDont.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import LocaleRtlDemo from './demos/LocaleRtl.vue'
import localeRtlDemoSrc from './demos/LocaleRtl.vue?raw'
import localeSetupSrc from './snippets/locale-setup.ts?raw'

const { t } = useLocale()

const toc: IntroTocItem[] = [
  { id: 'overview', labelKey: 'page.intro.i18n.tocOverview' },
  { id: 'demo', labelKey: 'page.intro.i18n.tocDemo' },
  { id: 'setup', labelKey: 'page.intro.i18n.tocSetup' },
  { id: 'guidelines', labelKey: 'page.intro.i18n.tocGuidelines' },
  { id: 'next', labelKey: 'page.intro.i18n.tocNext' }
]

const doKeys: LocaleKey[] = [
  'page.intro.i18n.do1',
  'page.intro.i18n.do2',
  'page.intro.i18n.do3'
]

const dontKeys: LocaleKey[] = [
  'page.intro.i18n.dont1',
  'page.intro.i18n.dont2',
  'page.intro.i18n.dont3'
]

const nextLinks: IntroNextLink[] = [
  {
    titleKey: 'page.intro.icon.title',
    descriptionKey: 'page.intro.i18n.nextIcon',
    to: { name: 'intro-icon' }
  },
  {
    titleKey: 'page.i18n.title',
    descriptionKey: 'page.intro.i18n.nextLab',
    to: { name: 'i18n' }
  }
]
</script>

<template>
  <IntroPageShell
    title-key="page.intro.i18n.title"
    lead-key="page.intro.i18n.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <IntroSection id="overview" title-key="page.intro.i18n.overviewTitle" lead-key="page.intro.i18n.overviewLead">
      <IntroCallout tone="info" title-key="page.intro.i18n.calloutTitle">
        <p>{{ t('page.intro.i18n.calloutBody') }}</p>
      </IntroCallout>
      <ul>
        <li>{{ t('page.intro.i18n.localeZh') }}</li>
        <li>{{ t('page.intro.i18n.localeEn') }}</li>
        <li>{{ t('page.intro.i18n.localeAr') }}</li>
      </ul>
    </IntroSection>

    <IntroSection id="demo" title-key="page.intro.i18n.demoTitle" lead-key="page.intro.i18n.demoLead">
      <IntroPreview :code="localeRtlDemoSrc" language="vue" filename="LocaleRtl.vue">
        <LocaleRtlDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="setup" title-key="page.intro.i18n.setupTitle" lead-key="page.intro.i18n.setupLead">
      <IntroPreview :code="localeSetupSrc" language="typescript" filename="locale.ts" />
    </IntroSection>

    <IntroSection id="guidelines" title-key="page.intro.i18n.guidelinesTitle">
      <IntroDoDont :do-keys="doKeys" :dont-keys="dontKeys" />
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.i18n.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>
