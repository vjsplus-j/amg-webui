<script setup lang="ts">
/**
 * Curated demo — aligned with Avatar gold standard (demoCode / demoSfc / API thirds).
 */
import { computed, ref } from 'vue'
import { Avatar, Badge, Button, Icon } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import { createMotionLiveState } from '../../components/demo/motionLive'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const severities = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const

const lastEvent = ref('')
const motion = createMotionLiveState()
/** Badge ring pulse — separate from shared opacity pulse */
const badgePulse = ref(false)

const codeMotionLive = computed(() => {
  const s = motion.value
  return demoCode(
    '<Badge',
    '  :value="3"',
    s.spin && '  spin',
    badgePulse.value && '  pulse',
    s.heartbeat && '  heartbeat',
    s.bounce && '  bounce',
    '>',
    '  <Icon name="Bell" size="lg" />',
    '</Badge>'
  )
})

/** Host motion props without shared `pulse` (Badge.pulse is ring). */
const badgeMotionBind = computed(() => ({
  spin: motion.value.spin,
  heartbeat: motion.value.heartbeat,
  bounce: motion.value.bounce
}))

function noteEvent(kind: string) {
  lastEvent.value = kind
}

const codeBasic = demoSfc({
  imports: [
    `import { Badge, Icon } from '@amg-webui/components/base'`
  ],
  template: [
    `  <Badge :value="5">`,
    `    <Icon name="Bell" />`,
    `  </Badge>`,
    `  <Badge :value="0">`,
    `    <Icon name="MessageCircle" />`,
    `  </Badge>`,
    `  <Badge :value="3" severity="primary">`,
    `    <Icon name="Archive" />`,
    `  </Badge>`
  ]
})

const codeDot = demoCode(
  `<Badge dot>`,
  `  <Icon name="MessageCircle" />`,
  `</Badge>`,
  `<Badge dot severity="success">`,
  `  <Icon name="User" />`,
  `</Badge>`,
  `<Badge dot severity="warning">`,
  `  <Icon name="Settings" />`,
  `</Badge>`
)

const codeText = demoCode(
  `<Badge :value="t('example.doc.badge.sample.new')">`,
  `  <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>`,
  `</Badge>`,
  `<Badge :value="t('example.doc.badge.sample.hot')" severity="warning">`,
  `  <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>`,
  `</Badge>`,
  `<Badge :value="t('example.doc.badge.sample.urgent')" severity="danger">`,
  `  <Icon name="TriangleAlert" />`,
  `</Badge>`
)

const codeMax = demoCode(
  `<Badge :value="100" :max="99">`,
  `  <Icon name="Archive" />`,
  `</Badge>`,
  `<Badge :value="1000" :max="999">`,
  `  <Icon name="Bell" />`,
  `</Badge>`,
  `<Badge :value="42" :max="99" severity="info">`,
  `  <Icon name="MessageCircle" />`,
  `</Badge>`
)

const codeSize = demoCode(
  `<Badge :value="8" size="xs"><Icon name="Bell" size="xs" /></Badge>`,
  `<Badge :value="8" size="sm"><Icon name="Bell" size="sm" /></Badge>`,
  `<Badge :value="8" size="md"><Icon name="Bell" size="md" /></Badge>`,
  `<Badge :value="8" size="lg"><Icon name="Bell" size="lg" /></Badge>`,
  `<Badge :value="8" size="xl"><Icon name="Bell" size="xl" /></Badge>`
)

const codeSeverity = demoCode(
  `<Badge :value="3" severity="primary"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" severity="secondary"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" severity="success"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" severity="warning"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" severity="danger"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" severity="info"><Icon name="Bell" /></Badge>`
)

const codeCustom = demoCode(
  `<Badge`,
  `  :value="9"`,
  `  color="var(--primary-500)"`,
  `  color-text="var(--text-on-primary, var(--surface-0))"`,
  `>`,
  `  <Icon name="Star" />`,
  `</Badge>`,
  `<Badge`,
  `  :value="7"`,
  `  color-bg="var(--success-500)"`,
  `  color-text="var(--text-on-primary, var(--surface-0))"`,
  `>`,
  `  <Icon name="Pin" />`,
  `</Badge>`,
  `<Badge dot color="var(--warning-500)">`,
  `  <Icon name="Zap" />`,
  `</Badge>`
)

const codeTooltip = demoCode(
  `<Badge`,
  `  :value="12"`,
  `  :tooltip="t('example.doc.badge.sample.tooltipUnread')"`,
  `  :tooltip-delay="200"`,
  `>`,
  `  <Icon name="Bell" />`,
  `</Badge>`,
  `<Badge`,
  `  dot`,
  `  pulse`,
  `  :tooltip="t('example.doc.badge.sample.tooltipUrgent')"`,
  `>`,
  `  <Icon name="CircleAlert" />`,
  `</Badge>`
)

const codeState = demoCode(
  `<Badge :value="3"><Icon name="Bell" /></Badge>`,
  `<Badge :value="3" disabled><Icon name="Bell" /></Badge>`,
  `<Badge dot pulse><Icon name="CircleAlert" /></Badge>`,
  `<Badge :value="5" hidden><Icon name="MessageCircle" /></Badge>`
)

const codeSlots = demoCode(
  `<Badge :value="2">`,
  `  <Avatar text="VP" size="sm" />`,
  `</Badge>`,
  `<Badge :value="1" severity="success">`,
  `  <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>`,
  `</Badge>`,
  `<Badge value="HOT" severity="warning" position="top-left">`,
  `  <Icon name="Funnel" size="lg" />`,
  `</Badge>`
)

const codeEvents = demoCode(
  `<Badge :value="5" @click="onClick">`,
  `  <Icon name="Bell" />`,
  `</Badge>`,
  `<Badge :value="3" disabled @click="onClick">`,
  `  <Icon name="Bell" />`,
  `</Badge>`
)

const codeHost = demoCode(
  `<Badge :value="2">`,
  `  <Avatar text="VP" size="sm" />`,
  `</Badge>`,
  `<Badge :value="1" severity="success">`,
  `  <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>`,
  `</Badge>`,
  `<Badge value="HOT" severity="warning" position="top-left">`,
  `  <Icon name="Funnel" size="lg" />`,
  `</Badge>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'value',
    description: t('example.doc.badge.prop.value'),
    type: 'string | number',
    defaultValue: '-'
  },
  {
    name: 'max',
    description: t('example.doc.badge.prop.max'),
    type: 'number',
    defaultValue: '99'
  },
  {
    name: 'dot',
    description: t('example.doc.badge.prop.dot'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'severity / type',
    description: t('example.doc.badge.prop.severity'),
    type: 'Severity',
    defaultValue: "'danger'"
  },
  {
    name: 'size',
    description: t('example.doc.badge.prop.size'),
    type: 'Size',
    defaultValue: "'sm'"
  },
  {
    name: 'position',
    description: t('example.doc.badge.prop.position'),
    type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'",
    defaultValue: "'top-right'"
  },
  {
    name: 'offset',
    description: t('example.doc.badge.prop.offset'),
    type: '[number, number]',
    defaultValue: '[0, 0]'
  },
  {
    name: 'color / colorBg / colorText',
    description: t('example.doc.badge.prop.color'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'tooltip / tooltipDelay',
    description: t('example.doc.badge.prop.tooltip'),
    type: 'string / number',
    defaultValue: '- / 200'
  },
  {
    name: 'hidden / disabled / pulse / decorative',
    description: t('example.doc.badge.prop.state'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'spin / heartbeat / bounce',
    description: t('example.doc.motion.demo.badge'),
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
    name: 'click',
    description: t('example.doc.badge.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.badge.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.badge.demo.basic')"
      :description="t('example.doc.badge.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-badge-row">
        <Badge :value="5">
          <Icon name="Bell" />
        </Badge>
        <Badge :value="0">
          <Icon name="MessageCircle" />
        </Badge>
        <Badge :value="3" severity="primary">
          <Icon name="Archive" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.dot')"
      :description="t('example.doc.badge.demo.dotDesc')"
      :code="codeDot"
    >
      <div class="vp-badge-row">
        <Badge dot>
          <Icon name="MessageCircle" />
        </Badge>
        <Badge dot severity="success">
          <Icon name="User" />
        </Badge>
        <Badge dot severity="warning">
          <Icon name="Settings" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.text')"
      :description="t('example.doc.badge.demo.textDesc')"
      :code="codeText"
    >
      <div class="vp-badge-row">
        <Badge :value="t('example.doc.badge.sample.new')">
          <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>
        </Badge>
        <Badge :value="t('example.doc.badge.sample.hot')" severity="warning">
          <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>
        </Badge>
        <Badge :value="t('example.doc.badge.sample.urgent')" severity="danger">
          <Icon name="TriangleAlert" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.max')"
      :description="t('example.doc.badge.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-badge-row">
        <Badge :value="100" :max="99">
          <Icon name="Archive" />
        </Badge>
        <Badge :value="1000" :max="999">
          <Icon name="Bell" />
        </Badge>
        <Badge :value="42" :max="99" severity="info">
          <Icon name="MessageCircle" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.size')"
      :description="t('example.doc.badge.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-badge-row">
        <Badge v-for="sz in sizes" :key="sz" :value="8" :size="sz">
          <Icon name="Bell" :size="sz" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.severity')"
      :description="t('example.doc.badge.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-badge-row">
        <Badge v-for="s in severities" :key="s" :value="3" :severity="s">
          <Icon name="Bell" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.custom')"
      :description="t('example.doc.badge.demo.customDesc')"
      :code="codeCustom"
    >
      <div class="vp-badge-row">
        <Badge
          :value="9"
          color="var(--primary-500)"
          color-text="var(--text-on-primary, var(--surface-0))"
        >
          <Icon name="Star" />
        </Badge>
        <Badge
          :value="7"
          color-bg="var(--success-500)"
          color-text="var(--text-on-primary, var(--surface-0))"
        >
          <Icon name="Pin" />
        </Badge>
        <Badge
          dot
          color="var(--warning-500)"
        >
          <Icon name="Zap" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.tooltip')"
      :description="t('example.doc.badge.demo.tooltipDesc')"
      :code="codeTooltip"
    >
      <div class="vp-badge-row">
        <Badge
          :value="12"
          :tooltip="t('example.doc.badge.sample.tooltipUnread')"
          :tooltip-delay="200"
        >
          <Icon name="Bell" />
        </Badge>
        <Badge
          dot
          pulse
          :tooltip="t('example.doc.badge.sample.tooltipUrgent')"
        >
          <Icon name="CircleAlert" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.state')"
      :description="t('example.doc.badge.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-badge-row">
        <Badge :value="3">
          <Icon name="Bell" />
        </Badge>
        <Badge :value="3" disabled>
          <Icon name="Bell" />
        </Badge>
        <Badge dot pulse>
          <Icon name="CircleAlert" />
        </Badge>
        <Badge :value="5" hidden>
          <Icon name="MessageCircle" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.slots')"
      :description="t('example.doc.badge.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-badge-row">
        <Badge :value="2">
          <Avatar text="VP" size="sm" />
        </Badge>
        <Badge :value="1" severity="success">
          <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>
        </Badge>
        <Badge value="HOT" severity="warning" position="top-left">
          <Icon name="Funnel" size="lg" />
        </Badge>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.events')"
      :description="t('example.doc.badge.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-badge-events">
        <div class="vp-badge-row">
          <Badge :value="5" @click="noteEvent('click')">
            <Icon name="Bell" />
          </Badge>
          <Badge :value="3" disabled @click="noteEvent('click')">
            <Icon name="Bell" />
          </Badge>
        </div>
        <p class="vp-badge-events__log">
          {{
            t('example.doc.badge.sample.eventLog', {
              event: lastEvent || t('example.doc.badge.sample.eventIdle')
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
      <MotionLivePanel
        v-model="motion"
        :show-pulse="false"
        show-badge-pulse
        v-model:badge-pulse="badgePulse"
      >
        <template #preview>
          <Badge :value="3" :pulse="badgePulse" v-bind="badgeMotionBind">
            <Icon name="Bell" size="lg" />
          </Badge>
          <Badge :value="9" severity="warning" :pulse="badgePulse" v-bind="badgeMotionBind">
            <Avatar text="VP" size="md" />
          </Badge>
          <Badge dot :pulse="badgePulse" v-bind="badgeMotionBind">
            <Icon name="Star" size="lg" />
          </Badge>
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.badge.demo.host')"
      :description="t('example.doc.badge.demo.hostDesc')"
      :code="codeHost"
    >
      <div class="vp-badge-row">
        <Badge :value="2">
          <Avatar text="VP" size="sm" />
        </Badge>
        <Badge :value="1" severity="success">
          <Button size="sm" variant="outlined">{{ t('example.doc.badge.sample.hostBtn') }}</Button>
        </Badge>
        <Badge value="HOT" severity="warning" position="top-left">
          <Icon name="Funnel" size="lg" />
        </Badge>
      </div>
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

.vp-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-sm) 0;
}

.vp-badge-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-badge-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
