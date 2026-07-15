<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tag } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import {
  createMotionLiveState,
  useMotionLiveBind
} from '../../components/demo/motionLive'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

const severities = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const

const motion = createMotionLiveState()
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() => {
  const s = motion.value
  return [
    '<Tag',
    '  severity="danger"',
    '  icon="Bell"',
    ...(s.spin ? ['  spin'] : []),
    ...(s.pulse ? ['  pulse'] : []),
    ...(s.heartbeat ? ['  heartbeat'] : []),
    ...(s.bounce ? ['  bounce'] : []),
    '>',
    '  …',
    '</Tag>'
  ].join('\n')
})

type ClosableItem = { id: number; labelKey: string; severity: (typeof severities)[number] }

let nextId = 4
const closableTags = ref<ClosableItem[]>([
  { id: 1, labelKey: 'example.doc.tag.sample.pending', severity: 'warning' },
  { id: 2, labelKey: 'example.doc.tag.sample.done', severity: 'success' },
  { id: 3, labelKey: 'example.doc.tag.sample.rejected', severity: 'danger' }
])

function removeTag(id: number) {
  closableTags.value = closableTags.value.filter((item) => item.id !== id)
}

function resetClosable() {
  closableTags.value = [
    { id: nextId++, labelKey: 'example.doc.tag.sample.pending', severity: 'warning' },
    { id: nextId++, labelKey: 'example.doc.tag.sample.done', severity: 'success' },
    { id: nextId++, labelKey: 'example.doc.tag.sample.rejected', severity: 'danger' }
  ]
}

async function confirmBeforeClose() {
  return window.confirm(t('example.doc.tag.sample.confirmClose'))
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'label',
    description: t('example.doc.tag.prop.label'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'severity / type',
    description: t('example.doc.tag.prop.severity'),
    type: "'default' | Severity",
    defaultValue: "'default'"
  },
  {
    name: 'effect',
    description: t('example.doc.tag.prop.effect'),
    type: "'solid' | 'outlined' | 'light' | 'neon'",
    defaultValue: "'light'"
  },
  {
    name: 'size',
    description: t('example.doc.tag.prop.size'),
    type: 'Size',
    defaultValue: "'md'"
  },
  {
    name: 'icon / iconSize',
    description: t('example.doc.tag.prop.icon'),
    type: 'string / Size',
    defaultValue: '-'
  },
  {
    name: 'closable',
    description: t('example.doc.tag.prop.closable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'beforeClose',
    description: t('example.doc.tag.prop.beforeClose'),
    type: '(e) => boolean | Promise<boolean>',
    defaultValue: '-'
  },
  {
    name: 'wait',
    description: t('example.doc.tag.prop.wait'),
    type: 'number',
    defaultValue: '300'
  },
  {
    name: 'round / rounded / borderRadius',
    description: t('example.doc.tag.prop.radius'),
    type: 'boolean / string',
    defaultValue: 'false'
  },
  {
    name: 'color / colorBg / colorText / colorBorder',
    description: t('example.doc.tag.prop.color'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'disabled / clickable',
    description: t('example.doc.tag.prop.state'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'spin / pulse / heartbeat / bounce',
    description: t('example.doc.motion.prop.heartbeat'),
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

const codeEffect = `<Tag effect="light" severity="success">…</Tag>
<Tag effect="solid" severity="primary">…</Tag>
<Tag effect="outlined" severity="warning">…</Tag>`

const codeNeon = `<Tag effect="neon" severity="primary">…</Tag>
<Tag effect="neon" severity="success">…</Tag>
<Tag effect="neon" severity="warning">…</Tag>
<Tag effect="neon" severity="danger">…</Tag>`

const codeSeverity = `<Tag severity="default">…</Tag>
<Tag severity="primary">…</Tag>
<Tag severity="success">…</Tag>
<!-- warning / danger / info -->`

const codeSize = `<Tag size="xs">xs</Tag>
<!-- sm md lg xl -->`

const codeIcon = `<Tag icon="Check" severity="success">…</Tag>
<Tag icon="User" effect="outlined">…</Tag>`

const codeClosable = `<Tag closable @close="…">…</Tag>
<Tag closable :before-close="confirm" :wait="400">…</Tag>`

const codeRadius = `<Tag round>…</Tag>
<Tag border-radius="var(--border-radius-lg)">…</Tag>`

const codeCustom = `<Tag color="var(--primary-500)" effect="solid">…</Tag>
<Tag
  effect="outlined"
  color-bg="var(--surface-2)"
  color-text="var(--primary-500)"
  color-border="var(--primary-500)"
>…</Tag>`

const codeState = `<Tag disabled>…</Tag>
<Tag clickable @click="…">…</Tag>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tag.demo.effect')"
      :description="t('example.doc.tag.demo.effectDesc')"
      :code="codeEffect"
    >
      <div class="vp-tag-row">
        <Tag effect="light" severity="success">{{ t('example.doc.tag.sample.status') }}</Tag>
        <Tag effect="solid" severity="primary">{{ t('example.doc.tag.sample.solid') }}</Tag>
        <Tag effect="outlined" severity="warning">{{ t('example.doc.tag.sample.outlined') }}</Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.neon')"
      :description="t('example.doc.tag.demo.neonDesc')"
      :code="codeNeon"
    >
      <div class="vp-tag-row">
        <Tag effect="neon" severity="primary">{{ t(LocaleKeys.button.confirm) }}</Tag>
        <Tag effect="neon" severity="success">{{ t(LocaleKeys.common.success) }}</Tag>
        <Tag effect="neon" severity="warning">{{ t(LocaleKeys.button.edit) }}</Tag>
        <Tag effect="neon" severity="danger">{{ t(LocaleKeys.button.delete) }}</Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.severity')"
      :description="t('example.doc.tag.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-tag-row">
        <Tag v-for="s in severities" :key="s" :severity="s">
          {{ t('example.doc.tag.sample.severity', { severity: s }) }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.size')"
      :description="t('example.doc.tag.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-tag-row">
        <Tag v-for="sz in sizes" :key="sz" :size="sz" severity="primary">
          {{ sz }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.icon')"
      :description="t('example.doc.tag.demo.iconDesc')"
      :code="codeIcon"
    >
      <div class="vp-tag-row">
        <Tag icon="Check" severity="success">{{ t('example.doc.tag.sample.roleAdmin') }}</Tag>
        <Tag icon="User" effect="outlined" severity="primary">
          {{ t('example.doc.tag.sample.roleUser') }}
        </Tag>
        <Tag icon="Lock" effect="solid" severity="warning">
          {{ t('example.doc.tag.sample.roleGuest') }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.closable')"
      :description="t('example.doc.tag.demo.closableDesc')"
      :code="codeClosable"
    >
      <div class="vp-tag-stack">
        <TransitionGroup name="vp-tag-fade" tag="div" class="vp-tag-row">
          <Tag
            v-for="item in closableTags"
            :key="item.id"
            closable
            :severity="item.severity"
            @close="removeTag(item.id)"
          >
            {{ t(item.labelKey) }}
          </Tag>
        </TransitionGroup>
        <Tag
          closable
          severity="danger"
          effect="outlined"
          :before-close="confirmBeforeClose"
          :wait="400"
        >
          {{ t('example.doc.tag.sample.beforeClose') }}
        </Tag>
        <button type="button" class="vp-tag-reset" @click="resetClosable">
          {{ t('example.doc.tag.sample.reset') }}
        </button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.radius')"
      :description="t('example.doc.tag.demo.radiusDesc')"
      :code="codeRadius"
    >
      <div class="vp-tag-row">
        <Tag>{{ t('example.doc.tag.sample.radiusDefault') }}</Tag>
        <Tag round severity="primary">{{ t('example.doc.tag.sample.radiusPill') }}</Tag>
        <Tag
          severity="success"
          effect="outlined"
          border-radius="var(--border-radius-lg)"
        >
          {{ t('example.doc.tag.sample.radiusCustom') }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.custom')"
      :description="t('example.doc.tag.demo.customDesc')"
      :code="codeCustom"
    >
      <div class="vp-tag-row">
        <Tag color="var(--primary-500)" effect="solid">
          {{ t('example.doc.tag.sample.customSolid') }}
        </Tag>
        <Tag color="var(--success-500)" effect="outlined">
          {{ t('example.doc.tag.sample.customOutlined') }}
        </Tag>
        <Tag
          effect="light"
          color-bg="var(--surface-2)"
          color-text="var(--warning-500)"
          color-border="var(--warning-500)"
        >
          {{ t('example.doc.tag.sample.customMix') }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.state')"
      :description="t('example.doc.tag.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-tag-row">
        <Tag severity="primary">{{ t('example.doc.tag.sample.normal') }}</Tag>
        <Tag disabled severity="primary">{{ t('example.doc.tag.sample.disabled') }}</Tag>
        <Tag clickable severity="success" @click="() => undefined">
          {{ t('example.doc.tag.sample.clickable') }}
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.motion')"
      :description="t('example.doc.motion.demo.desc')"
      :code="codeMotionLive"
    >
      <MotionLivePanel v-model="motion">
        <template #preview>
          <Tag severity="danger" icon="Bell" v-bind="motionBind">
            {{ t('example.doc.motion.prop.heartbeat') }}
          </Tag>
          <Tag severity="primary" icon="Star" v-bind="motionBind">
            {{ t('example.doc.motion.prop.bounce') }}
          </Tag>
          <Tag severity="success" round v-bind="motionBind">
            {{ t('example.doc.tag.sample.status') }}
          </Tag>
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

.vp-tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-tag-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.vp-tag-reset {
  font: inherit;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  padding: var(--spacing-xs) var(--spacing-md);
  cursor: pointer;
  min-height: var(--height-sm);
}

.vp-tag-reset:hover {
  color: var(--text-primary);
  border-color: var(--border-color-hover, var(--ds-border));
}
</style>
