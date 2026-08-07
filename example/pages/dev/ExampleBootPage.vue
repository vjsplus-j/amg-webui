<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroCallout from '../../components/intro/IntroCallout.vue'
import type { IntroTocItem } from '../../components/intro/introNav'
import exampleBootSrc from './snippets/example-boot.ts?raw'

const { t } = useLocale()

const toc: IntroTocItem[] = [
  { id: 'boot', labelKey: 'page.dev.exampleBoot.tocBoot' },
  { id: 'url', labelKey: 'page.dev.exampleBoot.tocUrl' }
]

const urlExample = '?design=linear&icon=outline&font=inter&lang=zh-CN'
</script>

<template>
  <IntroPageShell
    title-key="page.dev.exampleBoot.title"
    lead-key="page.dev.exampleBoot.lead"
    eyebrow-key="nav.dev"
    :toc="toc"
  >
    <IntroCallout tone="warning" title-key="page.dev.exampleBoot.calloutTitle">
      <p>{{ t('page.dev.exampleBoot.calloutBody') }}</p>
    </IntroCallout>

    <IntroSection id="boot" title-key="page.dev.exampleBoot.bootTitle" lead-key="page.dev.exampleBoot.bootLead">
      <IntroPreview :code="exampleBootSrc" language="typescript" filename="example/main.ts" />
    </IntroSection>

    <IntroSection id="url" title-key="page.dev.exampleBoot.urlTitle" lead-key="page.dev.exampleBoot.urlLead">
      <IntroPreview :code="urlExample" language="text" filename="query-string" />
      <ul>
        <li><code>design</code> — {{ t('page.dev.exampleBoot.paramDesign') }}</li>
        <li><code>icon</code> — {{ t('page.dev.exampleBoot.paramIcon') }}</li>
        <li><code>font</code> — {{ t('page.dev.exampleBoot.paramFont') }}</li>
        <li><code>lang</code> — {{ t('page.dev.exampleBoot.paramLang') }}</li>
      </ul>
    </IntroSection>
  </IntroPageShell>
</template>
