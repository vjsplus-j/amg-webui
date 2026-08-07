<script setup lang="ts">
/**
 * Lab · Micro-frontend (UI isolation contracts)
 *
 * NOT a Module Federation / qiankun demo.
 * Verifies: scoped ThemeRuntime · OverlayRuntime · teleport roots · singleton anti-patterns · dispose.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Button, Card, Space, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { ThemeService } from '@amg-webui/theme'
import {
  createThemeRuntime,
  createShadowHost,
  createMemoryStorage
} from '@amg-webui/theme/core'
import type { DesignStyleName } from '@amg-webui/theme'
import ExamplePageHero from '../../components/ExamplePageHero.vue'
import MfeShell from './MfeShell.vue'

const { t, tDyn, locale } = useLocale()

const hostDesign = ref('—')
const hostScheme = ref('—')
const logs = ref<string[]>([])
const shellA = ref<InstanceType<typeof MfeShell> | null>(null)

const cMounted = ref(false)
const hostDialogCount = ref(0)
const shellDialogCount = ref(0)

const shadowHostRef = ref<HTMLElement | null>(null)
let shadowRuntime: ReturnType<typeof createThemeRuntime> | null = null

const checklist = computed(() => {
  void locale.value
  return [
    t('page.lab.microFe.c1'),
    t('page.lab.microFe.c2'),
    t('page.lab.microFe.c3'),
    t('page.lab.microFe.c4')
  ]
})

function readHostAttrs() {
  const el = document.documentElement
  hostDesign.value = el.getAttribute('data-design') || '—'
  hostScheme.value = el.getAttribute('data-scheme') || '—'
}

function pushLog(line: string) {
  logs.value = [line, ...logs.value].slice(0, 10)
  readHostAttrs()
  refreshMetrics()
}

function badSingletonHit() {
  const before = document.documentElement.getAttribute('data-design')
  ThemeService.setStyle('porsche')
  readHostAttrs()
  pushLog(
    `${tDyn('page.lab.microFe.logBad')} (${before} → ${hostDesign.value})`
  )
}

function goodScopedHit() {
  const beforeHost = document.documentElement.getAttribute('data-design')
  shellA.value?.setDesign('linear')
  readHostAttrs()
  const afterHost = document.documentElement.getAttribute('data-design')
  pushLog(
    `${tDyn('page.lab.microFe.logGood')} (host ${beforeHost} → ${afterHost}; A=${shellA.value?.getDesign()})`
  )
}

function countDialogs(root: ParentNode | null | undefined) {
  if (!root) return 0
  return root.querySelectorAll('[role="dialog"], .vp-dialog, .vp-dialog-overlay').length
}

function refreshMetrics() {
  hostDialogCount.value = countDialogs(document.body)
  const shells = document.querySelectorAll('[data-mfe]')
  let n = 0
  shells.forEach((el) => {
    n += countDialogs(el)
  })
  // Dialogs teleported into shells are inside [data-mfe]; body count includes them if not careful.
  // Prefer: body dialogs that are NOT inside [data-mfe]
  let hostOnly = 0
  document.body.querySelectorAll('[role="dialog"], .vp-dialog-overlay').forEach((node) => {
    if (!(node instanceof Element)) return
    if (!node.closest('[data-mfe]')) hostOnly += 1
  })
  hostDialogCount.value = hostOnly
  shellDialogCount.value = n
}

function mountC() {
  cMounted.value = true
  void nextTick(() => refreshMetrics())
}

function unmountC() {
  cMounted.value = false
  void nextTick(() => {
    refreshMetrics()
    pushLog(tDyn('page.lab.microFe.unmountC'))
  })
}

onMounted(() => {
  readHostAttrs()
  refreshMetrics()

  const el = shadowHostRef.value
  if (el && typeof el.attachShadow === 'function') {
    const shadow = el.attachShadow({ mode: 'open' })
    const panel = document.createElement('div')
    panel.style.cssText = [
      'padding: var(--theme-card-pad, 1rem)',
      'color: var(--text-primary, CanvasText)',
      'background: var(--surface-1, Canvas)',
      'border-radius: var(--theme-card-radius, 0)',
      'font: inherit',
      'min-height: 3rem'
    ].join(';')
    panel.textContent = t('page.lab.microFe.shadowHint')
    shadow.appendChild(panel)
    shadowRuntime = createThemeRuntime({
      host: createShadowHost(shadow),
      storage: createMemoryStorage(),
      persist: false
    })
    shadowRuntime.init({ overrides: { design: 'linear', scheme: 'dark' } })
  }
})

onBeforeUnmount(() => {
  cMounted.value = false
  shadowRuntime?.dispose()
  shadowRuntime = null
})
</script>

<template>
  <div class="page vp-mfe-lab">
    <ExamplePageHero title-key="page.lab.microFe.title" lead-key="page.lab.microFe.lead" />

    <Card class="vp-mfe-lab__card" :header="tDyn('page.lab.microFe.whatTitle')">
      <p class="vp-mfe-lab__body">{{ tDyn('page.lab.microFe.whatBody') }}</p>
      <p class="vp-mfe-lab__note">{{ t('page.lab.microFe.note') }}</p>
      <ul class="vp-mfe-lab__checklist">
        <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
      </ul>
    </Card>

    <Card class="vp-mfe-lab__card" :header="tDyn('page.lab.microFe.hostTitle')">
      <p class="vp-mfe-lab__desc">{{ tDyn('page.lab.microFe.hostDesc') }}</p>
      <div class="vp-mfe-lab__tags">
        <Tag size="sm" severity="warning" :label="`${tDyn('page.lab.microFe.hostDesign')}: ${hostDesign}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.microFe.hostScheme')}: ${hostScheme}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.microFe.metricHostDialogs')}: ${hostDialogCount}`" />
        <Tag size="sm" :label="`${tDyn('page.lab.microFe.metricShellDialogs')}: ${shellDialogCount}`" />
      </div>
      <Button size="sm" variant="text" :label="tDyn('page.lab.microFe.refreshMetrics')" @click="refreshMetrics" />
    </Card>

    <div class="vp-mfe-lab__grid">
      <MfeShell
        ref="shellA"
        name="A"
        :title="tDyn('page.lab.microFe.shellATitle')"
        namespace="mfe-a"
        :z-index-base="4000"
        initial-design="mercedes"
        :designs="(['mercedes', 'linear', 'apple'] as DesignStyleName[])"
        @design-change="readHostAttrs"
      />
      <MfeShell
        name="B"
        :title="tDyn('page.lab.microFe.shellBTitle')"
        namespace="mfe-b"
        :z-index-base="5000"
        initial-design="porsche"
        :designs="(['porsche', 'tesla', 'bmw'] as DesignStyleName[])"
        @design-change="readHostAttrs"
      />
    </div>

    <Card class="vp-mfe-lab__card" :header="tDyn('page.lab.microFe.conflictTitle')">
      <p class="vp-mfe-lab__desc">{{ tDyn('page.lab.microFe.conflictDesc') }}</p>
      <Space wrap>
        <Button size="sm" severity="danger" :label="tDyn('page.lab.microFe.badSingleton')" @click="badSingletonHit" />
        <Button size="sm" severity="success" :label="tDyn('page.lab.microFe.goodScoped')" @click="goodScopedHit" />
      </Space>
      <div class="vp-mfe-lab__log">
        <strong>{{ tDyn('page.lab.microFe.conflictLog') }}</strong>
        <ul>
          <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
        </ul>
      </div>
    </Card>

    <Card class="vp-mfe-lab__card" :header="tDyn('page.lab.microFe.lifecycleTitle')">
      <p class="vp-mfe-lab__desc">{{ tDyn('page.lab.microFe.lifecycleDesc') }}</p>
      <div class="vp-mfe-lab__tags">
        <Tag
          size="sm"
          :severity="cMounted ? 'success' : 'info'"
          :label="`${tDyn('page.lab.microFe.metricMounted')}: ${cMounted ? tDyn('page.lab.microFe.yes') : tDyn('page.lab.microFe.no')}`"
        />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :disabled="cMounted"
          :label="tDyn('page.lab.microFe.mountC')"
          @click="mountC"
        />
        <Button
          size="sm"
          severity="warning"
          :disabled="!cMounted"
          :label="tDyn('page.lab.microFe.unmountC')"
          @click="unmountC"
        />
      </Space>
      <div v-if="cMounted" class="vp-mfe-lab__c">
        <MfeShell
          name="C"
          :title="tDyn('page.lab.microFe.cTitle')"
          namespace="mfe-c"
          :z-index-base="6000"
          initial-design="apple"
          :designs="(['apple', 'wechat'] as DesignStyleName[])"
        />
      </div>
    </Card>

    <Card class="vp-mfe-lab__card" :header="tDyn('page.lab.microFe.shadowTitle')">
      <p class="vp-mfe-lab__desc">{{ tDyn('page.lab.microFe.shadowDesc') }}</p>
      <div ref="shadowHostRef" class="vp-mfe-lab__shadow-host" />
    </Card>
  </div>
</template>

<style scoped lang="scss">
.vp-mfe-lab {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-mfe-lab__card {
  width: 100%;
}

.vp-mfe-lab__body,
.vp-mfe-lab__desc,
.vp-mfe-lab__note {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-mfe-lab__note {
  padding: var(--spacing-md);
  border-inline-start: 3px solid var(--primary-500);
  background: var(--surface-1);
}

.vp-mfe-lab__checklist {
  margin: 0;
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-mfe-lab__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-mfe-lab__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-mfe-lab__log {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: var(--font-size-sm);

  ul {
    margin: var(--spacing-sm) 0 0;
    padding-inline-start: var(--spacing-lg);
    color: var(--text-secondary);
  }
}

.vp-mfe-lab__c {
  margin-top: var(--spacing-md);
}

.vp-mfe-lab__shadow-host {
  min-height: calc(var(--spacing-2xl) * 3);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-0);
}
</style>
