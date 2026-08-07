<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { IconStyleService, iconStyles, type IconStyleName } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import IntroPageShell from '../../components/intro/IntroPageShell.vue'
import IntroSection from '../../components/intro/IntroSection.vue'

const router = useRouter()
const { t, locale } = useLocale()

const currentStyle = ref<IconStyleName>(IconStyleService.getCurrentStyle())
let unsub: (() => void) | undefined

onMounted(() => {
  unsub = IconStyleService.subscribe((s) => {
    currentStyle.value = s
  })
})

onUnmounted(() => {
  unsub?.()
})

const previewIcons = [
  'Search',
  'User',
  'Check',
  'Plus',
  'Trash',
  'Edit',
  'Download',
  'Star'
]

const usageCode = computed(() => {
  void locale.value
  return t('page.intro.icon.usageCode')
})
</script>

<template>
  <IntroPageShell
    title-key="page.intro.icon.title"
    lead-key="page.intro.icon.lead"
    eyebrow-key="page.intro.eyebrow"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="IconStyleService.toggleStyle()">
        {{ t('page.intro.icon.toggle') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'theme' })">
        {{ t('page.intro.icon.openLab') }}
      </Button>
      <Button size="sm" variant="outlined" @click="router.push({ name: 'base-component', params: { name: 'Icon' } })">
        {{ t('page.intro.icon.openDemo') }}
      </Button>
    </template>

    <Message severity="info" :closable="false">
      {{ t('page.intro.icon.msg') }}
    </Message>

    <IntroSection title-key="page.intro.icon.tryTitle">
      <p>{{ t('page.intro.icon.tryLead') }}</p>
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

    <IntroSection title-key="page.intro.icon.usageTitle">
      <p>{{ t('page.intro.icon.usageLead') }}</p>
      <pre>{{ usageCode }}</pre>
      <p>{{ t('page.intro.icon.usageNote') }}</p>
    </IntroSection>
  </IntroPageShell>
</template>

<style scoped lang="scss">
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

.intro-icon__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: var(--text-primary);
}
</style>
