<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Message } from '@amg-webui/components/base'
import { FontService, fonts, type FontName } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'

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

const usageCode = computed(() => {
  void locale.value
  return t('page.intro.font.usageCode')
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

const sampleText = computed(() => {
  void locale.value
  return t('page.intro.font.sample')
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.font.title"
    lead-key="page.intro.font.lead"
    eyebrow-key="page.intro.eyebrow"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="FontService.toggleFont()">
        {{ t('page.intro.font.toggle') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.font.openLab') }}
      </Button>
    </template>

    <Message severity="info" :closable="false">
      {{ t('page.intro.font.msg') }}
    </Message>

    <IntroSection title-key="page.intro.font.tryTitle">
      <p>{{ t('page.intro.font.tryLead') }}</p>
      <div class="intro-font__grid">
        <button
          v-for="font in fonts"
          :key="font.name"
          type="button"
          class="intro-font__card"
          :class="{ 'is-active': currentFont === font.name }"
          @click="FontService.setFont(font.name)"
        >
          <div
            class="intro-font__preview"
            :style="{ fontFamily: fontStacks[font.name] }"
          >
            {{ sampleText }}
          </div>
          <strong>{{ font.label }}</strong>
          <span>{{ t(`page.intro.font.item.${font.name}`) }}</span>
        </button>
      </div>
    </IntroSection>

    <IntroSection title-key="page.intro.font.usageTitle">
      <p>{{ t('page.intro.font.usageLead') }}</p>
      <pre>{{ usageCode }}</pre>
      <p>{{ t('page.intro.font.usageNote') }}</p>
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
.intro-font__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--spacing-md);
}

.intro-font__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  text-align: left;
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

.intro-font__preview {
  padding: var(--spacing-sm) 0;
  color: var(--text-primary);
  font-size: var(--font-size-lg, var(--font-size-md));
  line-height: var(--line-height-body);
}
</style>
