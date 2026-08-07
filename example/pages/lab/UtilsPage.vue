<script setup lang="ts">
/**
 * Lab: EventService + AnimationService smoke (local debug only).
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Button, Icon, Space } from '@amg-webui/core'
import { useEventBus, useLocale } from '@amg-webui/hooks'
import { EventService } from '@amg-webui/utils'
import { AnimationService } from '@amg-webui/animations'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const EVENT = 'amg.lab.ping'
const log = ref<string[]>([])
const motionAllowed = ref(true)
const motionEnabled = ref(true)

let unsubMotion: (() => void) | undefined

function pushLog(line: string) {
  log.value = [line, ...log.value].slice(0, 8)
}

useEventBus(EVENT, (payload) => {
  pushLog(`${t('page.lab.utils.eventReceived')}: ${String(payload ?? '')}`)
})

function emitPing() {
  EventService.emit(EVENT, Date.now())
}

function toggleMotion() {
  if (AnimationService.isEnabled()) {
    AnimationService.disable()
  } else {
    AnimationService.enable()
  }
  motionEnabled.value = AnimationService.isEnabled()
  motionAllowed.value = AnimationService.isMotionAllowed()
}

onMounted(() => {
  AnimationService.syncDom()
  motionEnabled.value = AnimationService.isEnabled()
  motionAllowed.value = AnimationService.isMotionAllowed()
  unsubMotion = AnimationService.subscribe((allowed) => {
    motionAllowed.value = allowed
    motionEnabled.value = AnimationService.isEnabled()
  })
})

onUnmounted(() => {
  unsubMotion?.()
  EventService.off(EVENT)
})

const motionStatus = computed(() =>
  motionAllowed.value
    ? t('page.lab.utils.motionOn')
    : t('page.lab.utils.motionOff')
)
</script>

<template>
  <div class="page vp-lab-utils">
    <ExamplePageHero
      title-key="page.lab.utils.title"
      lead-key="page.lab.utils.lead"
    />

    <section class="vp-lab-utils__card">
      <h2 class="vp-lab-utils__h">{{ t('page.lab.utils.eventTitle') }}</h2>
      <p class="vp-lab-utils__p">{{ t('page.lab.utils.eventLead') }}</p>
      <Space>
        <Button severity="primary" @click="emitPing">
          {{ t('page.lab.utils.eventEmit') }}
        </Button>
      </Space>
      <ul v-if="log.length" class="vp-lab-utils__log">
        <li v-for="(line, i) in log" :key="i">{{ line }}</li>
      </ul>
    </section>

    <section class="vp-lab-utils__card">
      <h2 class="vp-lab-utils__h">{{ t('page.lab.utils.motionTitle') }}</h2>
      <p class="vp-lab-utils__p">{{ t('page.lab.utils.motionLead') }}</p>
      <Space align="center">
        <Button variant="outlined" @click="toggleMotion">
          {{
            motionEnabled
              ? t('page.lab.utils.motionDisable')
              : t('page.lab.utils.motionEnable')
          }}
        </Button>
        <span class="vp-lab-utils__status">{{ motionStatus }}</span>
        <Icon name="Loader" size="md" spin class="vp-lab-utils__spin" />
      </Space>
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-lab-utils {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-lab-utils__card {
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  box-sizing: border-box;
}

.vp-lab-utils__h {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-lab-utils__p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-lab-utils__log {
  margin: 0;
  padding-left: var(--spacing-xl);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: var(--line-height-body);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.vp-lab-utils__status {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-lab-utils__spin {
  color: var(--primary-500);
}
</style>
