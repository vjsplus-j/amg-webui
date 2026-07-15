<script setup lang="ts">
import { computed } from 'vue'
import { Typography } from '@amg-webui/components/base'
import type { Severity } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'
import {
  createMotionLiveState,
  formatMotionLiveCode,
  useMotionLiveBind
} from '../../components/demo/motionLive'

const { t } = useLocale()

const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

const colors: Severity[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']

const motion = createMotionLiveState({ glow: true })
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Typography', motion.value, [
    '  type="h3"',
    '  type-color="primary"',
    `  content="${t('example.doc.typography.sample.motion')}"`
  ])
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'type',
    description: t('example.doc.typography.prop.type'),
    type: "'h1'…'h6' | 'body' | 'body-lg' | 'body-sm' | 'caption' | 'secondary'",
    defaultValue: "'body'"
  },
  {
    name: 'typeColor / color',
    description: t('example.doc.typography.prop.typeColor'),
    type: 'Severity',
    defaultValue: '-'
  },
  {
    name: 'strong / italic / underline / delete / mark / code',
    description: t('example.doc.typography.prop.style'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'ellipsis',
    description: t('example.doc.typography.prop.ellipsis'),
    type: 'boolean | { rows?: number; tooltip?: boolean }',
    defaultValue: 'false'
  },
  {
    name: 'copyable',
    description: t('example.doc.typography.prop.copyable'),
    type: 'boolean | { text?: string; icon?: boolean }',
    defaultValue: 'false'
  },
  {
    name: 'disabled / loading / shimmer / clickable',
    description: t('example.doc.typography.prop.state'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'fontFamily',
    description: t('example.doc.typography.prop.fontFamily'),
    type: "'sans' | 'display' | 'mono'",
    defaultValue: '-'
  },
  {
    name: 'lineHeight',
    description: t('example.doc.typography.prop.lineHeight'),
    type: 'string | number',
    defaultValue: '-'
  },
  {
    name: 'content',
    description: t('example.doc.typography.prop.content'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'blink',
    description: t('example.doc.motion.prop.blink'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'breathe',
    description: t('example.doc.motion.prop.breathe'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'glow',
    description: t('example.doc.motion.prop.glow'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'marqueeLeft / marqueeRight',
    description: t('example.doc.motion.prop.marquee'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'scrollUp / scrollDown',
    description: t('example.doc.motion.prop.scroll'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'dampOut',
    description: t('example.doc.motion.prop.dampOut'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'pulse / heartbeat / bounce / spin',
    description: t('example.doc.typography.prop.motion'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'animationDuration',
    description: t('example.doc.motion.prop.animationDuration'),
    type: 'number | string',
    defaultValue: '-'
  }
])

const codeHeading = `<Typography type="h1">…</Typography>
<Typography type="h2">…</Typography>
<!-- h3–h6 -->`

const codeParagraph = `<Typography type="body-lg">…</Typography>
<Typography type="body">…</Typography>
<Typography type="body-sm">…</Typography>
<Typography type="caption">…</Typography>`

const codeColor = `<Typography type-color="success">…</Typography>
<Typography color="danger">…</Typography>`

const codeStyle = `<Typography strong>…</Typography>
<Typography italic>…</Typography>
<Typography strong italic>…</Typography>
<Typography underline mark>…</Typography>
<Typography delete>…</Typography>
<Typography code>API_KEY</Typography>`

const codeEllipsis = `<Typography ellipsis style="max-width: …">…</Typography>
<Typography :ellipsis="{ rows: 2, tooltip: true }">…</Typography>
<Typography :ellipsis="{ rows: 3 }">…</Typography>`

const codeCopy = `<Typography copyable>…</Typography>
<Typography :copyable="{ text: 'secret-id' }">…</Typography>
<Typography :copyable="{ icon: false }" clickable>…</Typography>`

const codeState = `<Typography disabled>…</Typography>
<Typography loading>{{ t('…') }}</Typography>
<Typography shimmer>{{ t('…') }}</Typography>
<Typography clickable @click="…">…</Typography>`

const codeLoading = `<Typography loading type="h3">
  Planning next moves
</Typography>
<Typography loading>
  {{ t('example.doc.typography.sample.loadingLong') }}
</Typography>`

const codeFont = `<Typography font-family="display" type="h3">…</Typography>
<Typography font-family="mono" code>…</Typography>
<Typography :line-height="1.8">…</Typography>`

const codeMotionFx = `<Typography blink type-color="warning">…</Typography>
<Typography breathe type-color="success">…</Typography>
<Typography glow type-color="primary" type="h3">…</Typography>
<Typography marquee-left type-color="info">…</Typography>
<Typography marquee-right type-color="info">…</Typography>
<Typography scroll-up type-color="secondary">…</Typography>
<Typography scroll-down type-color="secondary">…</Typography>
<Typography damp-out type-color="danger" strong>…</Typography>`
</script>

<template>
  <div class="vp-curated">
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
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
</style>
