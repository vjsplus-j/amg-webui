<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { Button, Card, Spin } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const nested = ref(true)
const delaySpinning = ref(false)
const lastVisible = ref('')

function flashDelay() {
  delaySpinning.value = true
  window.setTimeout(() => {
    delaySpinning.value = false
  }, 2000)
}

function onVisibleChange(v: boolean) {
  lastVisible.value = v ? 'on' : 'off'
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Spin } from '@amg-webui/core'`],
  template: [
    `  <Spin size="sm" />`,
    `  <Spin size="md" />`,
    `  <Spin size="lg" />`
  ]
})

const codeTip = demoCode(
  `<Spin`,
  `  size="md"`,
  `  :tip="t('example.doc.spin.sample.tip')"`,
  `/>`,
  `<Spin`,
  `  size="lg"`,
  `  :tip="t('common.loading')"`,
  `/>`
)

const codeDelay = demoCode(
  `<Button size="sm" variant="outlined" @click="flashDelay">`,
  `  {{ t('example.doc.spin.sample.triggerDelay') }}`,
  `</Button>`,
  `<Spin :spinning="delaySpinning" :delay="400" @visibleChange="onVisibleChange">`,
  `  <Card>`,
  `    <p>{{ t('example.doc.spin.sample.content') }}</p>`,
  `  </Card>`,
  `</Spin>`
)

const codeSlots = demoCode(
  `<Button size="sm" variant="outlined" @click="nested = !nested">`,
  `  {{ t('example.doc.spin.sample.toggle') }}`,
  `</Button>`,
  `<Spin :spinning="nested" :tip="t('example.doc.spin.sample.tip')">`,
  `  <Card>`,
  `    <p>{{ t('example.doc.spin.sample.content') }}</p>`,
  `  </Card>`,
  `</Spin>`
)

const codeIndicator = demoCode(
  `<Spin :tip="t('example.doc.spin.sample.tip')">`,
  `  <template #indicator>`,
  `    <span class="vp-spin-demo-dot" aria-hidden="true" />`,
  `  </template>`,
  `</Spin>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.spin.demo.basic')"
      :description="t('example.doc.spin.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-spin-row">
        <Spin size="sm" />
        <Spin size="md" />
        <Spin size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spin.demo.tip')"
      :description="t('example.doc.spin.demo.tipDesc')"
      :code="codeTip"
    >
      <div class="vp-spin-row">
        <Spin size="md" :tip="t('example.doc.spin.sample.tip')" />
        <Spin size="lg" :tip="t('common.loading')" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spin.demo.delay')"
      :description="t('example.doc.spin.demo.delayDesc')"
      :code="codeDelay"
    >
      <!-- Intentional narrow band: shows nested Card under mask -->
      <div class="vp-spin-stack">
        <Button size="sm" variant="outlined" @click="flashDelay">
          {{ t('example.doc.spin.sample.triggerDelay') }}
        </Button>
        <Spin :spinning="delaySpinning" :delay="400" @visibleChange="onVisibleChange">
          <Card>
            <p>{{ t('example.doc.spin.sample.content') }}</p>
          </Card>
        </Spin>
        <p v-if="lastVisible" class="vp-spin-hint">
          {{ t('example.doc.spin.sample.visible', { state: lastVisible }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spin.demo.slots')"
      :description="t('example.doc.spin.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-spin-stack">
        <Button size="sm" variant="outlined" @click="nested = !nested">
          {{ t('example.doc.spin.sample.toggle') }}
        </Button>
        <Spin :spinning="nested" :tip="t('example.doc.spin.sample.tip')">
          <Card>
            <p>{{ t('example.doc.spin.sample.content') }}</p>
          </Card>
        </Spin>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.spin.demo.indicator')"
      :description="t('example.doc.spin.demo.indicatorDesc')"
      :code="codeIndicator"
    >
      <div class="vp-spin-row">
        <Spin :tip="t('example.doc.spin.sample.tip')">
          <template #indicator>
            <span class="vp-spin-demo-dot" aria-hidden="true" />
          </template>
        </Spin>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.vp-spin-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xl);
  width: 100%;
}

.vp-spin-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  /* Intentional narrow control: nested Card preview */
  max-width: 28rem;
}

.vp-spin-hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-spin-demo-dot {
  display: inline-block;
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  border-radius: var(--border-radius-full);
  background: var(--primary-500);
  animation: vp-spin-demo-pulse 0.9s ease-in-out infinite;
}

@keyframes vp-spin-demo-pulse {
  50% {
    opacity: 0.35;
    transform: scale(0.85);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vp-spin-demo-dot {
    animation: none;
  }
}
</style>
