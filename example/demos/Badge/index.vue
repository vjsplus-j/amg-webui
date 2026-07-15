<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Badge, Button, Icon } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import MotionLivePanel from '../../components/demo/MotionLivePanel.vue'
import { createMotionLiveState } from '../../components/demo/motionLive'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const severities = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const

const motion = createMotionLiveState()
/** Badge ring pulse — separate from shared opacity pulse */
const badgePulse = ref(false)

const codeMotionLive = computed(() => {
  const s = motion.value
  return [
    '<Badge',
    '  :value="3"',
    ...(s.spin ? ['  spin'] : []),
    ...(badgePulse.value ? ['  pulse'] : []),
    ...(s.heartbeat ? ['  heartbeat'] : []),
    ...(s.bounce ? ['  bounce'] : []),
    '>',
    '  <Icon name="Bell" />',
    '</Badge>'
  ].join('\n')
})

/** Host motion props without shared `pulse` (Badge.pulse is ring). */
const badgeMotionBind = computed(() => ({
  spin: motion.value.spin,
  heartbeat: motion.value.heartbeat,
  bounce: motion.value.bounce
}))

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
  },
  {
    name: '@click',
    description: t('example.doc.badge.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  }
])

const codeCount = `<Badge :value="5">
  <Icon name="Bell" />
</Badge>
<Badge :value="0"><Icon name="MessageCircle" /></Badge>`

const codeDot = `<Badge dot>
  <Icon name="MessageCircle" />
</Badge>`

const codeText = `<Badge value="NEW">
  <Button size="sm">…</Button>
</Badge>`

const codeMax = `<Badge :value="100" :max="99">
  <Icon name="Archive" />
</Badge>
<Badge :value="1000" :max="999">
  <Icon name="Bell" />
</Badge>`

const codeSize = `<Badge :value="8" size="xs"><Icon name="Bell" /></Badge>
<!-- sm md lg xl -->`

const codeSeverity = `<Badge :value="3" severity="primary"><Icon name="Bell" /></Badge>
<!-- success / warning / danger / info -->`

const codeCustom = `<Badge
  :value="9"
  color="var(--primary-500)"
  color-text="var(--text-on-primary, var(--surface-0))"
>
  <Icon name="Star" />
</Badge>`

const codeTooltip = `<Badge
  :value="12"
  :tooltip="…"
  :tooltip-delay="200"
>
  <Icon name="Bell" />
</Badge>`

const codeState = `<Badge :value="3" disabled><Icon name="Bell" /></Badge>
<Badge dot pulse><Icon name="CircleAlert" /></Badge>
<Badge :value="5" hidden><Icon name="MessageCircle" /></Badge>`

const codeHost = `<Badge :value="2"><Avatar text="VP" size="sm" /></Badge>
<Badge :value="1"><Button size="sm">…</Button></Badge>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.badge.demo.count')"
      :description="t('example.doc.badge.demo.countDesc')"
      :code="codeCount"
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

.vp-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-sm) 0;
}
</style>
