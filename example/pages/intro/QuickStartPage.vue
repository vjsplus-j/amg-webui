<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'amg-webui/core'
import { useLocale } from 'amg-webui/hooks'
import { LocaleKeys, type LocaleKey } from 'amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroCodeTabs from '../../components/intro/IntroCodeTabs.vue'
import IntroCodeBlock from '../../components/intro/IntroCodeBlock.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroSteps from '../../components/intro/IntroSteps.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import IntroApiBadge from '../../components/intro/IntroApiBadge.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import type { IntroCodeTab } from '../../components/intro/IntroCodeTabs.vue'
import FirstButtonDemo from './demos/FirstButton.vue'
import firstButtonSrc from './demos/FirstButton.vue?raw'
import CreateMemberFormDemo from './demos/CreateMemberForm.vue'
import createMemberFormSrc from './demos/CreateMemberForm.vue?raw'
import mainBootstrapSrc from './snippets/main-bootstrap.ts?raw'
import installNpm from './snippets/install-npm.sh?raw'
import installPnpm from './snippets/install-pnpm.sh?raw'
import installYarn from './snippets/install-yarn.sh?raw'

const router = useRouter()
const { t, locale } = useLocale()

const toc: IntroTocItem[] = [
  { id: 'prerequisites', labelKey: 'page.intro.quickStart.tocPrerequisites' },
  { id: 'install', labelKey: 'page.intro.quickStart.tocInstall' },
  { id: 'overview', labelKey: 'page.intro.quickStart.tocOverview' },
  { id: 'first-component', labelKey: 'page.intro.quickStart.tocFirstComponent' },
  { id: 'form-example', labelKey: 'page.intro.quickStart.tocFormExample' },
  { id: 'bootstrap', labelKey: 'page.intro.quickStart.tocBootstrap' },
  { id: 'next', labelKey: 'page.intro.quickStart.tocNext' }
]

const installTabs: IntroCodeTab[] = [
  { id: 'npm', labelKey: 'page.intro.installation.tabNpm', code: installNpm, language: 'bash', filename: 'install.sh' },
  { id: 'pnpm', labelKey: 'page.intro.installation.tabPnpm', code: installPnpm, language: 'bash', filename: 'install.sh' },
  { id: 'yarn', labelKey: 'page.intro.installation.tabYarn', code: installYarn, language: 'bash', filename: 'install.sh' }
]

const steps: LocaleKey[] = [
  'page.intro.quickStart.step1',
  'page.intro.quickStart.step2',
  'page.intro.quickStart.step3',
  'page.intro.quickStart.step4',
  'page.intro.quickStart.step5'
]

const nextLinks = computed((): IntroNextLink[] => {
  void locale.value
  return [
    {
      titleKey: 'page.intro.installation.title',
      descriptionKey: 'page.intro.quickStart.nextInstallation',
      to: { name: 'intro-installation' }
    },
    {
      titleKey: 'page.intro.appConfig.title',
      descriptionKey: 'page.intro.quickStart.nextAppConfig',
      to: { name: 'intro-app-config' }
    },
    {
      titleKey: 'page.intro.design.title',
      descriptionKey: 'page.intro.quickStart.nextDesign',
      to: { name: 'intro-design' }
    },
    {
      titleKey: 'page.base.catalog.title',
      descriptionKey: 'page.intro.quickStart.nextCatalog',
      to: { name: 'base-overview' }
    }
  ]
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.quickStart.title"
    lead-key="page.intro.quickStart.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <template #badges>
      <IntroApiBadge>Vue 3</IntroApiBadge>
      <IntroApiBadge>TypeScript</IntroApiBadge>
      <IntroApiBadge>Vite</IntroApiBadge>
      <IntroApiBadge>SSR Ready</IntroApiBadge>
      <IntroApiBadge>Tree-shakable</IntroApiBadge>
    </template>
    <template #actions>
      <Button size="sm" @click="router.push({ name: 'intro-installation' })">
        {{ t('page.intro.installation.title') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'base-overview' })">
        {{ t(LocaleKeys.button.enter) }} · {{ t('nav.base') }}
      </Button>
    </template>

    <IntroCallout tone="info" title-key="page.intro.quickStart.calloutTitle">
      <p>{{ t('page.intro.quickStart.calloutBody') }}</p>
    </IntroCallout>

    <IntroSection id="prerequisites" title-key="page.intro.installation.prerequisitesTitle" lead-key="page.intro.installation.prerequisitesLead">
      <ul>
        <li>{{ t('page.intro.installation.prereqNode') }}</li>
        <li>{{ t('page.intro.installation.prereqVue') }}</li>
        <li>{{ t('page.intro.installation.prereqLucide') }}</li>
        <li>{{ t('page.intro.quickStart.prereqTs') }}</li>
      </ul>
    </IntroSection>

    <IntroSection id="install" title-key="page.intro.installation.installTitle" lead-key="page.intro.quickStart.installLead">
      <IntroCodeTabs :tabs="installTabs" />
    </IntroSection>

    <IntroSection id="overview" title-key="page.intro.quickStart.overviewTitle" lead-key="page.intro.quickStart.overviewLead">
      <IntroSteps :steps="steps" />
    </IntroSection>

    <IntroSection id="first-component" title-key="page.intro.quickStart.firstComponentTitle" lead-key="page.intro.quickStart.firstComponentLead">
      <IntroPreview :code="firstButtonSrc" language="vue" filename="FirstButton.vue">
        <FirstButtonDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="form-example" title-key="page.intro.quickStart.formTitle" lead-key="page.intro.quickStart.formLead">
      <IntroPreview :code="createMemberFormSrc" language="vue" filename="CreateMemberForm.vue">
        <CreateMemberFormDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="bootstrap" title-key="page.intro.quickStart.bootstrapTitle" lead-key="page.intro.quickStart.bootstrapLead">
      <IntroCodeBlock :code="mainBootstrapSrc" language="typescript" filename="main.ts" />
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.quickStart.nextTitle" lead-key="page.intro.quickStart.nextLead">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>
