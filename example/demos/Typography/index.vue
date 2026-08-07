<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref, computed } from 'vue'
import { Typography } from '@amg-webui/core'
import type { Severity } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import {
  createMotionLiveState,
  formatMotionLiveCode,
  useMotionLiveBind
} from '../../components/demo/motionLive'

const { t } = useLocale()

const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
const colors: Severity[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']

const lastEvent = ref('')

function noteEvent(kind: string) {
  lastEvent.value = kind
}

const motion = createMotionLiveState({ glow: true })
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Typography', motion.value, [
    '  type="h3"',
    '  type-color="primary"',
    `  :content="t('example.doc.typography.sample.motion')"`
  ])
)

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Typography } from '@amg-webui/core'`],
  template: [
    `  <Typography type="h2">{{ t('example.doc.typography.sample.heading', { level: 'h2' }) }}</Typography>`,
    `  <Typography type="body">{{ t('example.doc.typography.sample.body') }}</Typography>`,
    `  <Typography type-color="primary" strong>{{ t('example.doc.typography.sample.strong') }}</Typography>`,
    `  <Typography code>{{ t('example.doc.typography.sample.code') }}</Typography>`
  ]
})

const codeHeading = demoCode(
  ...headingTypes.map(
    (lv) =>
      `<Typography type="${lv}">{{ t('example.doc.typography.sample.heading', { level: '${lv}' }) }}</Typography>`
  )
)

const codeParagraph = demoCode(
  `<Typography type="body-lg">{{ t('example.doc.typography.sample.bodyLg') }}</Typography>`,
  `<Typography type="body">{{ t('example.doc.typography.sample.body') }}</Typography>`,
  `<Typography type="body-sm">{{ t('example.doc.typography.sample.bodySm') }}</Typography>`,
  `<Typography type="caption">{{ t('example.doc.typography.sample.caption') }}</Typography>`,
  `<Typography type="secondary">{{ t('example.doc.typography.sample.secondary') }}</Typography>`
)

const codeColor = demoCode(
  ...colors.map(
    (c) =>
      `<Typography type-color="${c}">{{ t('example.doc.typography.sample.color', { color: '${c}' }) }}</Typography>`
  )
)

const codeStyle = demoCode(
  `<Typography strong>{{ t('example.doc.typography.sample.strong') }}</Typography>`,
  `<Typography italic>{{ t('example.doc.typography.sample.italic') }}</Typography>`,
  `<Typography strong italic>{{ t('example.doc.typography.sample.strongItalic') }}</Typography>`,
  `<Typography underline>{{ t('example.doc.typography.sample.underline') }}</Typography>`,
  `<Typography mark>{{ t('example.doc.typography.sample.mark') }}</Typography>`,
  `<Typography delete>{{ t('example.doc.typography.sample.delete') }}</Typography>`,
  `<Typography code>{{ t('example.doc.typography.sample.code') }}</Typography>`
)

const codeEllipsis = demoCode(
  `<Typography ellipsis class="vp-typo-clamp">`,
  `  {{ t('example.doc.typography.sample.ellipsisLong') }}`,
  `</Typography>`,
  `<Typography :ellipsis="{ rows: 2, tooltip: true }" class="vp-typo-clamp">`,
  `  {{ t('example.doc.typography.sample.ellipsisLong') }}`,
  `</Typography>`,
  `<Typography :ellipsis="{ rows: 3 }" class="vp-typo-clamp">`,
  `  {{ t('example.doc.typography.sample.ellipsisLong') }}`,
  `</Typography>`
)

const codeCopy = demoCode(
  `<Typography copyable>{{ t('example.doc.typography.sample.copyId') }}</Typography>`,
  `<Typography :copyable="{ text: 'sk-live-xxxxxx' }">`,
  `  {{ t('example.doc.typography.sample.copySecret') }}`,
  `</Typography>`,
  `<Typography :copyable="{ icon: false }" clickable>`,
  `  {{ t('example.doc.typography.sample.copyHidden') }}`,
  `</Typography>`
)

const codeState = demoCode(
  `<Typography>{{ t('example.doc.typography.sample.normal') }}</Typography>`,
  `<Typography disabled>{{ t('example.doc.typography.sample.disabled') }}</Typography>`,
  `<Typography loading>{{ t('example.doc.typography.sample.loading') }}</Typography>`,
  `<Typography clickable type-color="primary">`,
  `  {{ t('example.doc.typography.sample.clickable') }}`,
  `</Typography>`
)

const codeLoading = demoCode(
  `<Typography loading type="h3">`,
  `  {{ t('example.doc.typography.sample.loadingLong') }}`,
  `</Typography>`,
  `<Typography loading type="body">`,
  `  {{ t('example.doc.typography.sample.loadingHint') }}`,
  `</Typography>`,
  `<Typography shimmer type-color="primary" strong>`,
  `  {{ t('example.doc.typography.sample.shimmer') }}`,
  `</Typography>`
)

const codeFont = demoCode(
  `<Typography font-family="sans">{{ t('example.doc.typography.sample.fontSans') }}</Typography>`,
  `<Typography font-family="display" type="h3">`,
  `  {{ t('example.doc.typography.sample.fontDisplay') }}`,
  `</Typography>`,
  `<Typography font-family="mono">{{ t('example.doc.typography.sample.fontMono') }}</Typography>`,
  `<Typography :line-height="'var(--line-height-body)'" type="body">`,
  `  {{ t('example.doc.typography.sample.lineHeight') }}`,
  `</Typography>`
)

const codeMotionFx = demoCode(
  `<Typography blink type-color="warning" strong>`,
  `  {{ t('example.doc.typography.sample.blink') }}`,
  `</Typography>`,
  `<Typography breathe type-color="success" strong>`,
  `  {{ t('example.doc.typography.sample.breathe') }}`,
  `</Typography>`,
  `<Typography glow type-color="primary" type="h3">`,
  `  {{ t('example.doc.typography.sample.glow') }}`,
  `</Typography>`,
  `<Typography marquee-left type-color="info" strong>`,
  `  {{ t('example.doc.typography.sample.marqueeLeft') }}`,
  `</Typography>`,
  `<Typography marquee-right type-color="info" strong>`,
  `  {{ t('example.doc.typography.sample.marqueeRight') }}`,
  `</Typography>`,
  `<Typography scroll-up type-color="secondary" strong>`,
  `  {{ t('example.doc.typography.sample.scrollUp') }}`,
  `</Typography>`,
  `<Typography scroll-down type-color="secondary" strong>`,
  `  {{ t('example.doc.typography.sample.scrollDown') }}`,
  `</Typography>`,
  `<Typography damp-out type-color="danger" strong>`,
  `  {{ t('example.doc.typography.sample.dampOut') }}`,
  `</Typography>`
)

const codeSlots = demoCode(
  `<Typography type="h3">`,
  `  {{ t('example.doc.typography.sample.slotDefault') }}`,
  `</Typography>`,
  `<Typography type="body" type-color="secondary">`,
  `  <span>{{ t('example.doc.typography.sample.body') }}</span>`,
  `</Typography>`
)

const codeEvents = demoCode(
  `<Typography`,
  `  copyable`,
  `  @copy="onCopy"`,
  `  @copy-error="onCopyError"`,
  `>`,
  `  {{ t('example.doc.typography.sample.copyId') }}`,
  `</Typography>`,
  `<Typography`,
  `  clickable`,
  `  type-color="primary"`,
  `  @click="onClick"`,
  `>`,
  `  {{ t('example.doc.typography.sample.clickable') }}`,
  `</Typography>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.typography.demo.basic')"
      :description="t('example.doc.typography.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-typo-stack">
        <Typography type="h2">
          {{ t('example.doc.typography.sample.heading', { level: 'h2' }) }}
        </Typography>
        <Typography type="body">{{ t('example.doc.typography.sample.body') }}</Typography>
        <Typography type-color="primary" strong>
          {{ t('example.doc.typography.sample.strong') }}
        </Typography>
        <Typography code>{{ t('example.doc.typography.sample.code') }}</Typography>
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.typography.demo.heading')"
      :description="t('example.doc.typography.demo.headingDesc')"
      :code="codeHeading"
    >
      <div class="vp-typo-stack">
        <Typography v-for="lv in headingTypes" :key="lv" :type="lv">
          {{ t('example.doc.typography.sample.heading', { level: lv }) }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.paragraph')"
      :description="t('example.doc.typography.demo.paragraphDesc')"
      :code="codeParagraph"
    >
      <div class="vp-typo-stack">
        <Typography type="body-lg">{{ t('example.doc.typography.sample.bodyLg') }}</Typography>
        <Typography type="body">{{ t('example.doc.typography.sample.body') }}</Typography>
        <Typography type="body-sm">{{ t('example.doc.typography.sample.bodySm') }}</Typography>
        <Typography type="caption">{{ t('example.doc.typography.sample.caption') }}</Typography>
        <Typography type="secondary">{{ t('example.doc.typography.sample.secondary') }}</Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.color')"
      :description="t('example.doc.typography.demo.colorDesc')"
      :code="codeColor"
    >
      <div class="vp-typo-row">
        <Typography v-for="c in colors" :key="c" :type-color="c">
          {{ t('example.doc.typography.sample.color', { color: c }) }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.style')"
      :description="t('example.doc.typography.demo.styleDesc')"
      :code="codeStyle"
    >
      <div class="vp-typo-row">
        <Typography strong>{{ t('example.doc.typography.sample.strong') }}</Typography>
        <Typography italic>{{ t('example.doc.typography.sample.italic') }}</Typography>
        <Typography strong italic>{{ t('example.doc.typography.sample.strongItalic') }}</Typography>
        <Typography underline>{{ t('example.doc.typography.sample.underline') }}</Typography>
        <Typography mark>{{ t('example.doc.typography.sample.mark') }}</Typography>
        <Typography delete>{{ t('example.doc.typography.sample.delete') }}</Typography>
        <Typography code>{{ t('example.doc.typography.sample.code') }}</Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.ellipsis')"
      :description="t('example.doc.typography.demo.ellipsisDesc')"
      :code="codeEllipsis"
    >
      <div class="vp-typo-stack">
        <Typography ellipsis class="vp-typo-clamp">
          {{ t('example.doc.typography.sample.ellipsisLong') }}
        </Typography>
        <Typography :ellipsis="{ rows: 2, tooltip: true }" class="vp-typo-clamp">
          {{ t('example.doc.typography.sample.ellipsisLong') }}
        </Typography>
        <Typography :ellipsis="{ rows: 3 }" class="vp-typo-clamp">
          {{ t('example.doc.typography.sample.ellipsisLong') }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.copy')"
      :description="t('example.doc.typography.demo.copyDesc')"
      :code="codeCopy"
    >
      <div class="vp-typo-stack">
        <Typography copyable>{{ t('example.doc.typography.sample.copyId') }}</Typography>
        <Typography :copyable="{ text: 'sk-live-xxxxxx' }">
          {{ t('example.doc.typography.sample.copySecret') }}
        </Typography>
        <Typography :copyable="{ icon: false }" clickable>
          {{ t('example.doc.typography.sample.copyHidden') }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.state')"
      :description="t('example.doc.typography.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-typo-row">
        <Typography>{{ t('example.doc.typography.sample.normal') }}</Typography>
        <Typography disabled>{{ t('example.doc.typography.sample.disabled') }}</Typography>
        <Typography loading>{{ t('example.doc.typography.sample.loading') }}</Typography>
        <Typography clickable type-color="primary">
          {{ t('example.doc.typography.sample.clickable') }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.loading')"
      :description="t('example.doc.typography.demo.loadingDesc')"
      :code="codeLoading"
    >
      <div class="vp-typo-stack">
        <Typography loading type="h3">
          {{ t('example.doc.typography.sample.loadingLong') }}
        </Typography>
        <Typography loading type="body">
          {{ t('example.doc.typography.sample.loadingHint') }}
        </Typography>
        <Typography shimmer type-color="primary" strong>
          {{ t('example.doc.typography.sample.shimmer') }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.font')"
      :description="t('example.doc.typography.demo.fontDesc')"
      :code="codeFont"
    >
      <div class="vp-typo-stack">
        <Typography font-family="sans">{{ t('example.doc.typography.sample.fontSans') }}</Typography>
        <Typography font-family="display" type="h3">
          {{ t('example.doc.typography.sample.fontDisplay') }}
        </Typography>
        <Typography font-family="mono">{{ t('example.doc.typography.sample.fontMono') }}</Typography>
        <Typography :line-height="'var(--line-height-body)'" type="body">
          {{ t('example.doc.typography.sample.lineHeight') }}
        </Typography>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.typography.demo.fx')"
      :description="t('example.doc.typography.demo.fxDesc')"
      :code="codeMotionFx"
    >
      <div class="vp-typo-stack">
        <div class="vp-typo-row">
          <Typography blink type-color="warning" strong>
            {{ t('example.doc.typography.sample.blink') }}
          </Typography>
          <Typography breathe type-color="success" strong>
            {{ t('example.doc.typography.sample.breathe') }}
          </Typography>
          <Typography glow type-color="primary" type="h3">
            {{ t('example.doc.typography.sample.glow') }}
          </Typography>
        </div>
        <div class="vp-typo-ticker">
          <Typography marquee-left type-color="info" strong>
            {{ t('example.doc.typography.sample.marqueeLeft') }}
          </Typography>
        </div>
        <div class="vp-typo-ticker">
          <Typography marquee-right type-color="info" strong>
            {{ t('example.doc.typography.sample.marqueeRight') }}
          </Typography>
        </div>
        <div class="vp-typo-row">
          <div class="vp-typo-scroll">
            <Typography scroll-up type-color="secondary" strong>
              {{ t('example.doc.typography.sample.scrollUp') }}
            </Typography>
          </div>
          <div class="vp-typo-scroll">
            <Typography scroll-down type-color="secondary" strong>
              {{ t('example.doc.typography.sample.scrollDown') }}
            </Typography>
          </div>
          <Typography damp-out type-color="danger" strong>
            {{ t('example.doc.typography.sample.dampOut') }}
          </Typography>
        </div>
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.typography.demo.slots')"
      :description="t('example.doc.typography.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-typo-stack">
        <Typography type="h3">
          {{ t('example.doc.typography.sample.slotDefault') }}
        </Typography>
        <Typography type="body" type-color="secondary">
          <span>{{ t('example.doc.typography.sample.body') }}</span>
        </Typography>
      </div>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.typography.demo.events')"
      :description="t('example.doc.typography.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-typo-events">
        <div class="vp-typo-stack">
          <Typography
            copyable
            @copy="noteEvent('copy')"
            @copy-error="noteEvent('copyError')"
          >
            {{ t('example.doc.typography.sample.copyId') }}
          </Typography>
          <Typography
            clickable
            type-color="primary"
            @click="noteEvent('click')"
          >
            {{ t('example.doc.typography.sample.clickable') }}
          </Typography>
        </div>
        <p class="vp-typo-events__log">
          {{
            t('example.doc.typography.sample.eventLog', {
              event: lastEvent || t('example.doc.typography.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. Motion -->
    <DemoBlock
      :title="t('example.doc.motion.demo.title')"
      :description="t('example.doc.motion.demo.desc')"
      :code="codeMotionLive"
    >
      <MotionLivePanel v-model="motion">
        <template #preview>
          <Typography v-bind="motionBind" type="h3" type-color="primary">
            {{ t('example.doc.typography.sample.motion') }}
          </Typography>
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <!-- 7. API: Props → Events → Slots -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-typo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-typo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-typo-ticker {
  display: block;
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  padding-block: var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-2);
}

.vp-typo-scroll {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 4rem;
  overflow: hidden;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-2);
}

.vp-typo-clamp {
  display: block;
  max-width: 100%;
  width: 70%;
}

.vp-typo-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-typo-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
