<script setup lang="ts">
/**
 * Curated demo — aligned with Avatar gold standard (demoCode / demoSfc / API thirds).
 */
import { computed, ref } from 'vue'
import { Icon, Tag } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys, type LocaleKey } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import {
  createMotionLiveState,
  formatMotionLiveCode,
  useMotionLiveBind
} from '../../components/demo/motionLive'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const severities = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const

const lastEvent = ref('')
const motion = createMotionLiveState()
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Tag', motion.value, [
    'severity="danger"',
    'icon="Bell"',
    `:label="t('example.doc.motion.prop.heartbeat')"`
  ])
)

type ClosableItem = { id: number; labelKey: LocaleKey; severity: (typeof severities)[number] }

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

function noteEvent(kind: string) {
  lastEvent.value = kind
}

const codeBasic = demoSfc({
  imports: [`import { Tag } from '@amg-webui/core'`],
  template: [
    `  <Tag effect="light" severity="success">{{ t('example.doc.tag.sample.status') }}</Tag>`,
    `  <Tag effect="solid" severity="primary">{{ t('example.doc.tag.sample.solid') }}</Tag>`,
    `  <Tag effect="outlined" severity="warning">{{ t('example.doc.tag.sample.outlined') }}</Tag>`
  ]
})

const codeNeon = demoCode(
  `<Tag effect="neon" severity="primary">{{ t('button.confirm') }}</Tag>`,
  `<Tag effect="neon" severity="success">{{ t('common.success') }}</Tag>`,
  `<Tag effect="neon" severity="warning">{{ t('button.edit') }}</Tag>`,
  `<Tag effect="neon" severity="danger">{{ t('button.delete') }}</Tag>`
)

const codeSeverity = demoCode(
  `<Tag severity="default">{{ t('example.doc.tag.sample.severity', { severity: 'default' }) }}</Tag>`,
  `<Tag severity="primary">{{ t('example.doc.tag.sample.severity', { severity: 'primary' }) }}</Tag>`,
  `<Tag severity="success">{{ t('example.doc.tag.sample.severity', { severity: 'success' }) }}</Tag>`,
  `<Tag severity="warning">{{ t('example.doc.tag.sample.severity', { severity: 'warning' }) }}</Tag>`,
  `<Tag severity="danger">{{ t('example.doc.tag.sample.severity', { severity: 'danger' }) }}</Tag>`,
  `<Tag severity="info">{{ t('example.doc.tag.sample.severity', { severity: 'info' }) }}</Tag>`
)

const codeSize = demoCode(
  `<Tag size="xs" severity="primary">xs</Tag>`,
  `<Tag size="sm" severity="primary">sm</Tag>`,
  `<Tag size="md" severity="primary">md</Tag>`,
  `<Tag size="lg" severity="primary">lg</Tag>`,
  `<Tag size="xl" severity="primary">xl</Tag>`
)

const codeIcon = demoCode(
  `<Tag icon="Check" severity="success">{{ t('example.doc.tag.sample.roleAdmin') }}</Tag>`,
  `<Tag icon="User" effect="outlined" severity="primary">`,
  `  {{ t('example.doc.tag.sample.roleUser') }}`,
  `</Tag>`,
  `<Tag icon="Lock" effect="solid" severity="warning">`,
  `  {{ t('example.doc.tag.sample.roleGuest') }}`,
  `</Tag>`
)

const codeClosable = demoCode(
  `<Tag closable severity="warning" @close="removeTag">`,
  `  {{ t('example.doc.tag.sample.pending') }}`,
  `</Tag>`,
  `<Tag closable severity="success" @close="removeTag">`,
  `  {{ t('example.doc.tag.sample.done') }}`,
  `</Tag>`,
  `<Tag closable severity="danger" @close="removeTag">`,
  `  {{ t('example.doc.tag.sample.rejected') }}`,
  `</Tag>`,
  `<Tag`,
  `  closable`,
  `  severity="danger"`,
  `  effect="outlined"`,
  `  :before-close="confirmBeforeClose"`,
  `  :wait="400"`,
  `>`,
  `  {{ t('example.doc.tag.sample.beforeClose') }}`,
  `</Tag>`
)

const codeRadius = demoCode(
  `<Tag>{{ t('example.doc.tag.sample.radiusDefault') }}</Tag>`,
  `<Tag round severity="primary">{{ t('example.doc.tag.sample.radiusPill') }}</Tag>`,
  `<Tag`,
  `  severity="success"`,
  `  effect="outlined"`,
  `  border-radius="var(--border-radius-lg)"`,
  `>`,
  `  {{ t('example.doc.tag.sample.radiusCustom') }}`,
  `</Tag>`
)

const codeCustom = demoCode(
  `<Tag color="var(--primary-500)" effect="solid">`,
  `  {{ t('example.doc.tag.sample.customSolid') }}`,
  `</Tag>`,
  `<Tag color="var(--success-500)" effect="outlined">`,
  `  {{ t('example.doc.tag.sample.customOutlined') }}`,
  `</Tag>`,
  `<Tag`,
  `  effect="light"`,
  `  color-bg="var(--surface-2)"`,
  `  color-text="var(--warning-500)"`,
  `  color-border="var(--warning-500)"`,
  `>`,
  `  {{ t('example.doc.tag.sample.customMix') }}`,
  `</Tag>`
)

const codeState = demoCode(
  `<Tag severity="primary">{{ t('example.doc.tag.sample.normal') }}</Tag>`,
  `<Tag disabled severity="primary">{{ t('example.doc.tag.sample.disabled') }}</Tag>`,
  `<Tag clickable severity="success" @click="onClick">`,
  `  {{ t('example.doc.tag.sample.clickable') }}`,
  `</Tag>`
)

const codeSlots = demoCode(
  `<Tag severity="success">`,
  `  <template #icon>`,
  `    <Icon name="Star" />`,
  `  </template>`,
  `  {{ t('example.doc.tag.sample.slotIcon') }}`,
  `</Tag>`,
  `<Tag closable severity="warning">`,
  `  {{ t('example.doc.tag.sample.slotClose') }}`,
  `  <template #closeIcon>`,
  `    <Icon name="X" size="xs" />`,
  `  </template>`,
  `</Tag>`
)

const codeEvents = demoCode(
  `<Tag closable severity="danger" @close="onClose">`,
  `  {{ t('example.doc.tag.sample.rejected') }}`,
  `</Tag>`,
  `<Tag clickable severity="success" @click="onClick">`,
  `  {{ t('example.doc.tag.sample.clickable') }}`,
  `</Tag>`
)

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
    name: 'spin / pulse / heartbeat / bounce / …',
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

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'close',
    description: t('example.doc.tag.emit.close'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'click',
    description: t('example.doc.tag.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.tag.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'icon',
    description: t('example.doc.tag.slot.icon'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'closeIcon',
    description: t('example.doc.tag.slot.closeIcon'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tag.demo.basic')"
      :description="t('example.doc.tag.demo.basicDesc')"
      :code="codeBasic"
      default-open
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
      :title="t('example.doc.tag.demo.slots')"
      :description="t('example.doc.tag.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-tag-row">
        <Tag severity="success">
          <template #icon>
            <Icon name="Star" />
          </template>
          {{ t('example.doc.tag.sample.slotIcon') }}
        </Tag>
        <Tag closable severity="warning">
          {{ t('example.doc.tag.sample.slotClose') }}
          <template #closeIcon>
            <Icon name="X" size="xs" />
          </template>
        </Tag>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tag.demo.events')"
      :description="t('example.doc.tag.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-tag-events">
        <div class="vp-tag-row">
          <Tag closable severity="danger" @close="noteEvent('close')">
            {{ t('example.doc.tag.sample.rejected') }}
          </Tag>
          <Tag clickable severity="success" @click="noteEvent('click')">
            {{ t('example.doc.tag.sample.clickable') }}
          </Tag>
        </div>
        <p class="vp-tag-events__log">
          {{
            t('example.doc.tag.sample.eventLog', {
              event: lastEvent || t('example.doc.tag.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.motion')"
      :description="t('example.doc.motion.demo.desc')"
      :code="codeMotionLive"
    >
      <MotionLivePanel v-model="motion">
        <template #preview>
          <Tag
            severity="danger"
            icon="Bell"
            :label="t('example.doc.motion.prop.heartbeat')"
            v-bind="motionBind"
          />
          <Tag
            severity="primary"
            icon="Star"
            :label="t('example.doc.motion.prop.bounce')"
            v-bind="motionBind"
          />
          <Tag
            severity="success"
            round
            :label="t('example.doc.tag.sample.status')"
            v-bind="motionBind"
          />
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
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

.vp-curated__api-sub {
  margin: var(--spacing-xl) 0 var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub:first-of-type {
  margin-top: 0;
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

.vp-tag-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-tag-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
