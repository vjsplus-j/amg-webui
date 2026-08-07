<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon } from 'amg-webui/core'
import { InputText } from 'amg-webui/form'
import { IconStyleService, iconStyles, type IconStyleName } from 'amg-webui/theme'
import { listIcons, ICON_NAMES } from 'amg-webui/icons'
import { useLocale } from 'amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'
import IntroPreview from '../../components/intro/IntroPreview.vue'
import IntroNextLinks from '../../components/intro/IntroNextLinks.vue'
import type { IntroTocItem, IntroNextLink } from '../../components/intro/introNav'
import IconUsageDemo from './demos/IconUsage.vue'
import iconUsageDemoSrc from './demos/IconUsage.vue?raw'
import iconStyleSrc from './snippets/icon-style.ts?raw'

const router = useRouter()
const { t, locale } = useLocale()

const currentStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
const query = ref('')
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = IconStyleService.subscribe((s) => {
    currentStyle.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

const previewIcons = ['Search', 'User', 'Check', 'Plus', 'Trash', 'Edit', 'Download', 'Star']

const toc: IntroTocItem[] = [
  { id: 'usage', labelKey: 'page.intro.icon.tocUsage' },
  { id: 'stroke', labelKey: 'page.intro.icon.tocStroke' },
  { id: 'gallery', labelKey: 'page.intro.icon.tocGallery' },
  { id: 'api', labelKey: 'page.intro.icon.tocApi' },
  { id: 'next', labelKey: 'page.intro.icon.tocNext' }
]

const galleryIcons = computed(() => {
  void locale.value
  const q = query.value.trim()
  const items = q ? listIcons({ query: q }) : listIcons()
  return items.slice(0, 120)
})

const totalCount = ICON_NAMES.length

const nextLinks = computed((): IntroNextLink[] => {
  void locale.value
  return [
    {
      titleKey: 'page.intro.typography.title',
      descriptionKey: 'page.intro.icon.nextTypography',
      to: { name: 'intro-typography' }
    },
    {
      titleKey: 'page.base.component.title',
      descriptionKey: 'page.intro.icon.nextComponent',
      to: { name: 'base-component', params: { name: 'Icon' } }
    }
  ]
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.icon.title"
    lead-key="page.intro.icon.lead"
    eyebrow-key="page.intro.eyebrow"
    :toc="toc"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="IconStyleService.toggleStyle()">
        {{ t('page.intro.icon.toggle') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'base-component', params: { name: 'Icon' } })">
        {{ t('page.intro.icon.openDemo') }}
      </Button>
    </template>

    <IntroSection id="usage" title-key="page.intro.icon.usagePreviewTitle" lead-key="page.intro.icon.usagePreviewLead">
      <IntroPreview :code="iconUsageDemoSrc" language="vue" filename="IconUsage.vue">
        <IconUsageDemo />
      </IntroPreview>
    </IntroSection>

    <IntroSection id="stroke" title-key="page.intro.icon.tryTitle" lead-key="page.intro.icon.tryLead">
      <div class="intro-icon__grid">
        <button
          v-for="style in iconStyles"
          :key="style.name"
          type="button"
          class="intro-icon__card"
          :class="{ 'is-active': currentStyle === style.name }"
          @click="IconStyleService.setStyle(style.name)"
        >
          <div class="intro-icon__row">
            <Icon v-for="n in previewIcons" :key="n" :name="n" size="md" />
          </div>
          <strong>{{ t(`page.intro.icon.style.${style.name}.label`) }}</strong>
          <span>{{ t(`page.intro.icon.style.${style.name}.desc`) }}</span>
        </button>
      </div>
    </IntroSection>

    <IntroSection id="gallery" class="intro-section--wide" title-key="page.intro.icon.galleryTitle" lead-key="page.intro.icon.galleryLead">
      <div class="intro-icon__search">
        <InputText
          v-model="query"
          type="search"
          :placeholder="t('page.intro.icon.searchPlaceholder')"
        />
        <span class="intro-icon__count">{{ t('page.intro.icon.galleryCount', { count: totalCount }) }}</span>
      </div>
      <div class="intro-icon__gallery">
        <div v-for="entry in galleryIcons" :key="entry.name" class="intro-icon__glyph" :title="entry.name">
          <Icon :name="entry.name" size="md" />
          <span>{{ entry.name }}</span>
        </div>
      </div>
    </IntroSection>

    <IntroSection id="api" title-key="page.intro.icon.usageTitle" lead-key="page.intro.icon.usageLead">
      <IntroPreview :code="iconStyleSrc" language="typescript" filename="icon.ts" />
      <p>{{ t('page.intro.icon.usageNote') }}</p>
    </IntroSection>

    <IntroSection id="next" title-key="page.intro.icon.nextTitle">
      <IntroNextLinks :links="nextLinks" />
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
:deep(.intro-section--wide) {
  max-width: none;
}

.intro-icon__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--spacing-md);
}

.intro-icon__card {
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

.intro-icon__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: var(--text-primary);
}

.intro-icon__search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.intro-icon__count {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.intro-icon__gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  gap: var(--spacing-sm);
  max-height: 24rem;
  overflow: auto;
  padding: var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
  background: var(--surface-1);
}

.intro-icon__glyph {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  text-align: center;

  span {
    font-size: 0.625rem;
    color: var(--text-tertiary, var(--text-secondary));
    word-break: break-all;
    line-height: 1.2;
  }
}
</style>
