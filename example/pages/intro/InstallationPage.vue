<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroCodeTabs from '../../components/intro/IntroCodeTabs.vue'
import IntroCodeBlock from '../../components/intro/IntroCodeBlock.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import IntroApiBadge from '../../components/intro/IntroApiBadge.vue'
import IntroFeatureGrid from '../../components/intro/IntroFeatureGrid.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import type { IntroCodeTab } from '../../components/intro/IntroCodeTabs.vue'
import type { IntroFeatureItem } from '../../components/intro/IntroFeatureGrid.vue'
import installNpm from './snippets/install-npm.sh?raw'
import installPnpm from './snippets/install-pnpm.sh?raw'
import installYarn from './snippets/install-yarn.sh?raw'
import onDemandImports from './snippets/on-demand-imports.ts?raw'
import ssrBootstrap from './snippets/ssr-bootstrap.ts?raw'

const { t } = useLocale()

const toc: IntroTocItem[] = [
  { id: 'prerequisites', labelKey: 'page.intro.installation.tocPrerequisites' },
  { id: 'install', labelKey: 'page.intro.installation.tocInstall' },
  { id: 'styles', labelKey: 'page.intro.installation.tocStyles' },
  { id: 'on-demand', labelKey: 'page.intro.installation.tocOnDemand' },
  { id: 'ssr', labelKey: 'page.intro.installation.tocSsr' },
  { id: 'next', labelKey: 'page.intro.installation.tocNext' }
]

const installTabs: IntroCodeTab[] = [
  { id: 'npm', labelKey: 'page.intro.installation.tabNpm', code: installNpm, language: 'bash', filename: 'install.sh' },
  { id: 'pnpm', labelKey: 'page.intro.installation.tabPnpm', code: installPnpm, language: 'bash', filename: 'install.sh' },
  { id: 'yarn', labelKey: 'page.intro.installation.tabYarn', code: installYarn, language: 'bash', filename: 'install.sh' }
]

const packageFeatures: IntroFeatureItem[] = [
  { titleKey: 'page.intro.installation.pkgCoreTitle', descriptionKey: 'page.intro.installation.pkgCoreDesc' },
  { titleKey: 'page.intro.installation.pkgFormTitle', descriptionKey: 'page.intro.installation.pkgFormDesc' },
  { titleKey: 'page.intro.installation.pkgDataTitle', descriptionKey: 'page.intro.installation.pkgDataDesc' },
  { titleKey: 'page.intro.installation.pkgOverlayTitle', descriptionKey: 'page.intro.installation.pkgOverlayDesc' },
  { titleKey: 'page.intro.installation.pkgThemeTitle', descriptionKey: 'page.intro.installation.pkgThemeDesc' },
  { titleKey: 'page.intro.installation.pkgDomainTitle', descriptionKey: 'page.intro.installation.pkgDomainDesc' }
]

const nextLinks: IntroNextLink[] = [
  {
    titleKey: 'page.intro.appConfig.title',
    descriptionKey: 'page.intro.installation.nextAppConfig',
    to: { name: 'intro-app-config' }
  },
  {
    titleKey: 'page.intro.quickStart.title',
    descriptionKey: 'page.intro.installation.nextQuickStart',
    to: { name: 'intro-quick-start' }
  }
]
</script>

<template>
  <IntroPageShell
    title-key="page.intro.installation.title"
    lead-key="page.intro.installation.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <template #badges>
      <IntroApiBadge>amg-webui</IntroApiBadge>
      <IntroApiBadge>vue ^3.4</IntroApiBadge>
      <IntroApiBadge>@lucide/vue ^1.0</IntroApiBadge>
    </template>

    <IntroSection id="prerequisites" title-key="page.intro.installation.prerequisitesTitle" lead-key="page.intro.installation.prerequisitesLead">
      <ul>
        <li>{{ t('page.intro.installation.prereqNode') }}</li>
        <li>{{ t('page.intro.installation.prereqVue') }}</li>
        <li>{{ t('page.intro.installation.prereqLucide') }}</li>
      </ul>
    </IntroSection>

    <IntroSection id="install" title-key="page.intro.installation.installTitle" lead-key="page.intro.installation.installLead">
      <IntroCodeTabs :tabs="installTabs" />
    </IntroSection>

    <IntroSection id="styles" title-key="page.intro.installation.stylesTitle" lead-key="page.intro.installation.stylesLead">
      <IntroCallout tone="warning" title-key="page.intro.installation.stylesCalloutTitle">
        <p>{{ t('page.intro.installation.stylesCalloutBody') }}</p>
      </IntroCallout>
      <ul>
        <li><code>amg-webui/style.css</code> — {{ t('page.intro.installation.stylesGlobal') }}</li>
        <li><code>amg-webui/button/style.css</code> — {{ t('page.intro.installation.stylesPerComponent') }}</li>
      </ul>
    </IntroSection>

    <IntroSection id="on-demand" title-key="page.intro.installation.onDemandTitle" lead-key="page.intro.installation.onDemandLead">
      <IntroCodeBlock :code="onDemandImports" language="typescript" filename="imports.ts" />
      <p>{{ t('page.intro.installation.formBarrelNote') }}</p>
      <IntroFeatureGrid :items="packageFeatures" />
    </IntroSection>

    <IntroSection id="ssr" title-key="page.intro.installation.ssrTitle" lead-key="page.intro.installation.ssrLead">
      <IntroCodeBlock :code="ssrBootstrap" language="typescript" filename="ssr-entry.ts" />
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.installation.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>
