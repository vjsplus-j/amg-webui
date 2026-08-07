<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button, Card, ThemeProvider, ConfigProvider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import {
  createThemeRuntime,
  createShadowHost,
  createMemoryStorage
} from '@amg-webui/theme/core'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const shadowHostRef = ref<HTMLElement | null>(null)
const shadowAccent = ref('')
let shadowRuntime: ReturnType<typeof createThemeRuntime> | null = null

onMounted(() => {
  const el = shadowHostRef.value
  if (!el || typeof el.attachShadow !== 'function') return
  const shadow = el.attachShadow({ mode: 'open' })
  const panel = document.createElement('div')
  panel.className = 'vp-shadow-demo-inner'
  panel.style.cssText = [
    'padding: var(--theme-card-pad, 1rem)',
    'color: var(--text-primary, inherit)',
    'background: var(--surface-1, transparent)',
    'border-radius: var(--theme-card-radius, 0)',
    'font: inherit'
  ].join(';')
  panel.textContent = t('page.lab.microFe.shadowHint')
  shadow.appendChild(panel)

  shadowRuntime = createThemeRuntime({
    host: createShadowHost(shadow),
    storage: createMemoryStorage(),
    persist: false
  })
  shadowRuntime.init({ overrides: { design: 'linear', scheme: 'dark' } })
  shadowAccent.value = el.style.getPropertyValue('--ds-accent') || el.getAttribute('data-design') || ''
})

onBeforeUnmount(() => {
  shadowRuntime?.dispose()
  shadowRuntime = null
})
</script>

<template>
  <div class="vp-micro-fe-lab">
    <ExamplePageHero title-key="page.lab.microFe.title" lead-key="page.lab.microFe.lead" />

    <p class="vp-micro-fe-lab__note">{{ t('page.lab.microFe.note') }}</p>

    <div class="vp-micro-fe-lab__grid">
      <ThemeProvider design="mercedes" storage-namespace="lab-mfe-mercedes">
        <Card :header="t('page.lab.microFe.panelMercedes')">
          <p class="vp-micro-fe-lab__meta">data-design=mercedes</p>
          <div class="vp-toolbar">
            <Button severity="primary" :label="t('page.lab.microFe.ctaPrimary')" />
            <Button variant="outlined" :label="t('page.lab.microFe.ctaSecondary')" />
          </div>
        </Card>
      </ThemeProvider>

      <ThemeProvider design="porsche" storage-namespace="lab-mfe-porsche">
        <Card :header="t('page.lab.microFe.panelPorsche')">
          <p class="vp-micro-fe-lab__meta">{{ t('page.lab.microFe.panelPorscheMeta') }}</p>
          <div class="vp-toolbar">
            <Button severity="primary" :label="t('page.lab.microFe.ctaPrimary')" />
            <Button variant="outlined" :label="t('page.lab.microFe.ctaSecondary')" />
          </div>
        </Card>
      </ThemeProvider>
    </div>

    <ConfigProvider design="apple" scheme="light" class="vp-micro-fe-lab__config">
      <Card :header="t('page.lab.microFe.panelConfig')">
        <p class="vp-micro-fe-lab__meta">{{ t('page.lab.microFe.panelConfigMeta') }}</p>
        <div class="vp-toolbar">
          <Button severity="primary" :label="t('page.lab.microFe.ctaPrimary')" />
        </div>
      </Card>
    </ConfigProvider>

    <Card :header="t('page.lab.microFe.panelShadow')">
      <p class="vp-micro-fe-lab__meta">{{ t('page.lab.microFe.panelShadowMeta') }}</p>
      <div ref="shadowHostRef" class="vp-micro-fe-lab__shadow-host" />
      <p v-if="shadowAccent" class="vp-micro-fe-lab__meta">
        {{ t('page.lab.microFe.shadowAccent', { value: shadowAccent }) }}
      </p>
    </Card>

    <ul class="vp-micro-fe-lab__checklist">
      <li>{{ t('page.lab.microFe.c1') }}</li>
      <li>{{ t('page.lab.microFe.c2') }}</li>
      <li>{{ t('page.lab.microFe.c3') }}</li>
      <li>{{ t('page.lab.microFe.c4') }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.vp-micro-fe-lab {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  box-sizing: border-box;
}

.vp-micro-fe-lab__note,
.vp-micro-fe-lab__meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-micro-fe-lab__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-micro-fe-lab__config {
  width: 100%;
}

.vp-micro-fe-lab__shadow-host {
  min-height: var(--height-lg);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-0);
}

.vp-micro-fe-lab__checklist {
  margin: 0;
  padding-inline-start: var(--spacing-xl);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
