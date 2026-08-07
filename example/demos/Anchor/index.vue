<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Anchor
 */
import { computed, ref } from 'vue'
import { Anchor } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('intro')
const inlineActive = ref<string | number>('guide')

const items = computed<NavItem[]>(() => [
  { label: t('example.doc.anchor.sample.intro'), value: 'intro', href: '#anchor-intro' },
  { label: t('example.doc.anchor.sample.api'), value: 'api', href: '#anchor-api' },
  { label: t('example.doc.anchor.sample.a11y'), value: 'a11y', href: '#anchor-a11y' }
])

const inlineItems = computed<NavItem[]>(() => [
  { label: t('example.doc.anchor.sample.guide'), value: 'guide', href: '#anchor-guide' },
  { label: t('example.doc.anchor.sample.faq'), value: 'faq', href: '#anchor-faq' },
  { label: t('example.doc.anchor.sample.changelog'), value: 'changelog', href: '#anchor-changelog' }
])

const codeAffix = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Anchor } from '@amg-webui/core'`
  ],
  script: [`const active = ref('intro')`],
  template: [
    `  <Anchor`,
    `    v-model="active"`,
    `    :items="items"`,
    `    affix`,
    `    :affix-offset="8"`,
    `    :offset="8"`,
    `    container=".vp-anchor-demo__scroll"`,
    `  />`
  ]
})

const codeInline = demoCode(
  `<Anchor`,
  `  v-model="inlineActive"`,
  `  :items="inlineItems"`,
  `  direction="horizontal"`,
  `  container=".vp-anchor-inline__scroll"`,
  `/>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.anchor.demo.affix')"
      :description="t('example.doc.anchor.demo.affixDesc')"
      :code="codeAffix"
      default-open
    >
      <div class="vp-anchor-demo">
        <Anchor
          v-model="active"
          class="vp-anchor-demo__nav"
          :items="items"
          affix
          :affix-offset="8"
          :offset="8"
          container=".vp-anchor-demo__scroll"
        />
        <div class="vp-anchor-demo__scroll">
          <section id="anchor-intro" class="vp-anchor-demo__section">
            <h3>{{ t('example.doc.anchor.sample.intro') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
          <section id="anchor-api" class="vp-anchor-demo__section">
            <h3>{{ t('example.doc.anchor.sample.api') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
          <section id="anchor-a11y" class="vp-anchor-demo__section">
            <h3>{{ t('example.doc.anchor.sample.a11y') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
        </div>
      </div>
      <p class="vp-curated__hint">
        {{ t('example.doc.anchor.sample.active', { key: String(active) }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.anchor.demo.horizontal')"
      :description="t('example.doc.anchor.demo.horizontalDesc')"
      :code="codeInline"
    >
      <div class="vp-anchor-inline">
        <Anchor
          v-model="inlineActive"
          direction="horizontal"
          :items="inlineItems"
          container=".vp-anchor-inline__scroll"
        />
        <div class="vp-anchor-inline__scroll">
          <section id="anchor-guide" class="vp-anchor-inline__section">
            <h3>{{ t('example.doc.anchor.sample.guide') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
          <section id="anchor-faq" class="vp-anchor-inline__section">
            <h3>{{ t('example.doc.anchor.sample.faq') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
          <section id="anchor-changelog" class="vp-anchor-inline__section">
            <h3>{{ t('example.doc.anchor.sample.changelog') }}</h3>
            <p>{{ t('example.doc.anchor.sample.body') }}</p>
          </section>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-anchor-demo {
  display: grid;
  grid-template-columns: minmax(8rem, 10rem) minmax(0, 1fr);
  gap: var(--spacing-lg);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  padding: var(--spacing-md);
  box-sizing: border-box;
}

.vp-anchor-demo__scroll {
  max-height: 14rem;
  overflow: auto;
  min-width: 0;
  padding-inline-end: var(--spacing-sm);
}

.vp-anchor-demo__section {
  min-height: 10rem;
  padding-block: var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);

  h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-body);
  }
}

.vp-anchor-inline {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  padding: var(--spacing-md);
  box-sizing: border-box;
}

.vp-anchor-inline__scroll {
  max-height: 12rem;
  overflow: auto;
  margin-top: var(--spacing-md);
}

.vp-anchor-inline__section {
  min-height: 8rem;
  padding-block: var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);

  h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-body);
  }
}

.vp-curated__hint {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
