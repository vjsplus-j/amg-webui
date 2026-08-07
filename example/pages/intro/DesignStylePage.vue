<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { ThemeService, designStyles, type DesignStyleName } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'

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

const usageCode = computed(() => {
  void locale.value
  return t('page.intro.design.usageCode')
})

const styleBlurb = (name: DesignStyleName) => {
  void locale.value
  return t(`page.intro.design.style.${name}`)
}
</script>

<template>
  <IntroPageShell
    title-key="page.intro.design.title"
    lead-key="page.intro.design.lead"
    eyebrow-key="page.intro.eyebrow"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.design.openLab') }}
      </Button>
    </template>

    <Message severity="info" :closable="false">
      {{ t('page.intro.design.msg') }}
    </Message>

    <IntroSection title-key="page.intro.design.tryTitle">
      <p>{{ t('page.intro.design.tryLead') }}</p>
      <div class="intro-design__grid">
        <button
          v-for="style in designStyles"
          :key="style.name"
          type="button"
          class="intro-design__card"
          :class="{ 'is-active': currentDesign === style.name }"
          @click="ThemeService.setStyle(style.name)"
        >
          <div
            class="intro-design__preview"
            :style="{ background: style.preview.background }"
          >
            <span
              class="intro-design__swatch"
              :style="{ background: style.preview.primary }"
            />
          </div>
          <div class="intro-design__meta">
            <strong>{{ style.label }}</strong>
            <span>{{ styleBlurb(style.name) }}</span>
          </div>
          <Icon
            v-if="currentDesign === style.name"
            name="Check"
            size="sm"
            class="intro-design__check"
          />
        </button>
      </div>
    </IntroSection>

    <IntroSection title-key="page.intro.design.usageTitle">
      <p>{{ t('page.intro.design.usageLead') }}</p>
      <pre>{{ usageCode }}</pre>
      <p>{{ t('page.intro.design.usageNote') }}</p>
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
  text-align: left;
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
  right: var(--spacing-sm);
  color: var(--ds-accent, var(--text-primary));
}
</style>
