<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'amg-webui/core'
import { FontService, fonts, type FontName } from 'amg-webui/theme'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroDoDont from '../../components/intro/IntroDoDont.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import TypographyScaleDemo from './demos/TypographyScale.vue'
import typographyScaleSrc from './demos/TypographyScale.vue?raw'
import fontServiceSrc from './snippets/font-service.ts?raw'

const router = useRouter()
const { t, locale } = useLocale()

const currentFont = ref<FontName>(FontService.getCurrentFont())
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = FontService.subscribe((f) => {
    currentFont.value = f
  })
})

onUnmounted(() => {
  unsub?.()
})

const fontStacks: Record<FontName, string> = {
  inter: "'Inter', 'Inter Variable', system-ui, sans-serif",
  barlow: "'Barlow', system-ui, sans-serif",
  anton: "'Anton', Impact, sans-serif",
  archivo: "'Archivo', system-ui, sans-serif",
  'albert-sans': "'Albert Sans', -apple-system, sans-serif",
  yahei: "'Microsoft YaHei', '微软雅黑', sans-serif",
  song: "'SimSun', '宋体', 'Songti SC', serif",
  heiti: "'SimHei', '黑体', 'Heiti SC', sans-serif",
  apple: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif"
}

const toc: IntroTocItem[] = [
  { id: 'scale', labelKey: 'page.intro.typography.tocScale' },
  { id: 'fonts', labelKey: 'page.intro.typography.tocFonts' },
  { id: 'usage', labelKey: 'page.intro.typography.tocUsage' },
  { id: 'guidelines', labelKey: 'page.intro.typography.tocGuidelines' },
  { id: 'next', labelKey: 'page.intro.typography.tocNext' }
]

const sampleText = computed(() => {
  void locale.value
  return t('page.intro.typography.sample')
})

const doKeys: LocaleKey[] = [
  'page.intro.typography.do1',
  'page.intro.typography.do2',
  'page.intro.typography.do3'
]

const dontKeys: LocaleKey[] = [
  'page.intro.typography.dont1',
  'page.intro.typography.dont2',
  'page.intro.typography.dont3'
]

const nextLinks = computed((): IntroNextLink[] => {
  void locale.value
  return [
    {
      titleKey: 'page.intro.design.title',
      descriptionKey: 'page.intro.typography.nextDesign',
      to: { name: 'intro-design' }
    },
    {
      titleKey: 'page.theme.title',
      descriptionKey: 'page.intro.typography.nextLab',
      to: { name: 'theme' }
    }
  ]
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.typography.title"
    lead-key="page.intro.typography.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="FontService.toggleFont()">
        {{ t('page.intro.typography.toggle') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.typography.openLab') }}
      </Button>
    </template>

    <IntroSection id="scale" title-key="page.intro.typography.scaleTitle" lead-key="page.intro.typography.scaleLead">
      <IntroPreview :code="typographyScaleSrc" language="vue" filename="TypographyScale.vue">
        <TypographyScaleDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="fonts" title-key="page.intro.typography.tryTitle" lead-key="page.intro.typography.tryLead">
      <div class="intro-typography__grid">
        <button
          v-for="font in fonts"
          :key="font.name"
          type="button"
          class="intro-typography__card"
          :class="{ 'is-active': currentFont === font.name }"
          @click="FontService.setFont(font.name)"
        >
          <div class="intro-typography__preview" :style="{ fontFamily: fontStacks[font.name] }">
            {{ sampleText }}
          </div>
          <strong>{{ font.label }}</strong>
          <span>{{ t(`page.intro.typography.item.${font.name}`) }}</span>
        </button>
      </div>
    </IntroSection>

    <IntroSection id="usage" title-key="page.intro.typography.usageTitle" lead-key="page.intro.typography.usageLead">
      <IntroPreview :code="fontServiceSrc" language="typescript" filename="font.ts" />
      <p>{{ t('page.intro.typography.usageNote') }}</p>
    </IntroSection>

    <IntroSection id="guidelines" title-key="page.intro.typography.guidelinesTitle">
      <IntroDoDont :do-keys="doKeys" :dont-keys="dontKeys" />
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.typography.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-typography__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--spacing-md);
}

.intro-typography__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  text-align: start;
  cursor: pointer;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);
  color: inherit;

  &.is-active {
    border-color: var(--ds-accent, var(--primary-500, currentColor));
  }

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

.intro-typography__preview {
  padding: var(--spacing-sm) 0;
  color: var(--text-primary);
  font-size: var(--font-size-lg, var(--font-size-md));
  line-height: var(--line-height-body);
}
</style>
