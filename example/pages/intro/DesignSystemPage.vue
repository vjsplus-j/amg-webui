<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon } from 'amg-webui/core'
import { ThemeService, designStyles, type DesignStyleName } from 'amg-webui/theme'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroFeatureGrid from '../../components/intro/IntroFeatureGrid.vue'
import IntroDoDont from '../../components/intro/IntroDoDont.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import designStyleSrc from './snippets/design-style.ts?raw'

const router = useRouter()
const { t, locale } = useLocale()

const currentDesign = ref<DesignStyleName>(ThemeService.getCurrentStyle())
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = ThemeService.subscribe((s) => {
    currentDesign.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

const toc: IntroTocItem[] = [
  { id: 'principles', labelKey: 'page.intro.design.tocPrinciples' },
  { id: 'styles', labelKey: 'page.intro.design.tocStyles' },
  { id: 'usage', labelKey: 'page.intro.design.tocUsage' },
  { id: 'next', labelKey: 'page.intro.design.tocNext' }
]

const features: Array<{ titleKey: LocaleKey; descriptionKey: LocaleKey }> = [
  { titleKey: 'page.intro.design.feature1Title', descriptionKey: 'page.intro.design.feature1Desc' },
  { titleKey: 'page.intro.design.feature2Title', descriptionKey: 'page.intro.design.feature2Desc' },
  { titleKey: 'page.intro.design.feature3Title', descriptionKey: 'page.intro.design.feature3Desc' }
]

const doKeys: LocaleKey[] = [
  'page.intro.design.do1',
  'page.intro.design.do2',
  'page.intro.design.do3'
]

const dontKeys: LocaleKey[] = [
  'page.intro.design.dont1',
  'page.intro.design.dont2',
  'page.intro.design.dont3'
]

const nextLinks = computed((): IntroNextLink[] => {
  void locale.value
  return [
    {
      titleKey: 'page.intro.theme.title',
      descriptionKey: 'page.intro.design.nextTheme',
      to: { name: 'intro-theme' }
    },
    {
      titleKey: 'page.theme.title',
      descriptionKey: 'page.intro.design.nextLab',
      to: { name: 'theme' }
    }
  ]
})

function styleBlurb(name: DesignStyleName) {
  void locale.value
  return t(`page.intro.design.style.${name}`)
}
</script>

<template>
  <IntroPageShell
    title-key="page.intro.design.title"
    lead-key="page.intro.design.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.design.openLab') }}
      </Button>
    </template>

    <IntroSection id="principles" title-key="page.intro.design.principlesTitle" lead-key="page.intro.design.principlesLead">
      <IntroFeatureGrid :items="features" />
      <IntroDoDont :do-keys="doKeys" :dont-keys="dontKeys" />
    </IntroSection>

    <IntroSection id="styles" title-key="page.intro.design.tryTitle" lead-key="page.intro.design.tryLead">
      <div class="intro-design__grid">
        <button
          v-for="style in designStyles"
          :key="style.name"
          type="button"
          class="intro-design__card"
          :class="{ 'is-active': currentDesign === style.name }"
          @click="ThemeService.setStyle(style.name)"
        >
          <div class="intro-design__preview" :style="{ background: style.preview.background }">
            <span class="intro-design__swatch" :style="{ background: style.preview.primary }" />
          </div>
          <div class="intro-design__meta">
            <strong>{{ style.label }}</strong>
            <span>{{ styleBlurb(style.name) }}</span>
          </div>
          <Icon v-if="currentDesign === style.name" name="Check" size="sm" class="intro-design__check" />
        </button>
      </div>
    </IntroSection>

    <IntroSection id="usage" title-key="page.intro.design.usageTitle" lead-key="page.intro.design.usageLead">
      <IntroPreview :code="designStyleSrc" language="typescript" filename="theme.ts" />
      <p>{{ t('page.intro.design.usageNote') }}</p>
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.design.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-design__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--spacing-md);
}

.intro-design__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  text-align: start;
  cursor: pointer;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);
  color: inherit;
  transition: border-color var(--transition-normal, 0.15s ease);

  &.is-active {
    border-color: var(--ds-accent, var(--primary-500, currentColor));
  }
}

.intro-design__preview {
  height: var(--spacing-2xl);
  border-radius: var(--border-radius-sm, var(--theme-btn-radius));
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-sm);
}

.intro-design__swatch {
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  border-radius: var(--border-radius-sm, 2px);
}

.intro-design__meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;

  strong {
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }

  span {
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-body);
  }
}

.intro-design__check {
  position: absolute;
  top: var(--spacing-sm);
  inset-inline-end: var(--spacing-sm);
  color: var(--ds-accent, var(--text-primary));
}
</style>
