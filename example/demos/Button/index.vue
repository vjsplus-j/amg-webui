<script setup lang="ts">
/**
 * Curated demo — aligned with Avatar gold standard (demoCode / demoSfc / API thirds).
 */
import { computed, ref } from 'vue'
import { Button, ButtonGroup, Icon } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
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

const { t, tDyn } = useLocale()
const loading = ref(false)
const clickCount = ref(0)
const lastEvent = ref('')
const motion = createMotionLiveState()
const motionBind = useMotionLiveBind(motion)
const codeMotionLive = computed(() =>
  formatMotionLiveCode('Button', motion.value, [
    '  icon="Heart"',
    `  :label="t('button.save')"`,
    '  severity="primary"'
  ])
)

const demoImg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="%235e6ad2"/>
      <circle cx="32" cy="26" r="12" fill="%23f7f8f8"/>
      <ellipse cx="32" cy="54" rx="20" ry="14" fill="%23f7f8f8"/>
    </svg>`
  )

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

const sizeLabelKey: Record<Size, string> = {
  xs: LocaleKeys.page.baseAtomsButton.sizeXs,
  sm: LocaleKeys.page.baseAtomsButton.sizeSm,
  md: LocaleKeys.page.baseAtomsButton.sizeMd,
  lg: LocaleKeys.page.baseAtomsButton.sizeLg,
  xl: LocaleKeys.page.baseAtomsButton.sizeXl
}

function flash() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 800)
}

function onGuardedClick() {
  clickCount.value += 1
}

function noteEvent(kind: string) {
  lastEvent.value = kind
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Button } from '@amg-webui/components/base'`],
  template: [
    `  <Button severity="primary">{{ t('button.confirm') }}</Button>`,
    `  <Button severity="success">{{ t('common.success') }}</Button>`,
    `  <Button severity="warning">{{ t('button.edit') }}</Button>`,
    `  <Button severity="danger">{{ t('button.delete') }}</Button>`,
    `  <Button variant="outlined">{{ t('button.cancel') }}</Button>`,
    `  <Button variant="text">{{ t('button.edit') }}</Button>`,
    `  <Button link>{{ t('button.learnMore') }}</Button>`
  ]
})

const codeDashed = demoCode(
  `<Button variant="dashed" severity="primary">{{ t('button.confirm') }}</Button>`,
  `<Button variant="dashed" severity="success">{{ t('common.success') }}</Button>`,
  `<Button variant="dashed" severity="warning">{{ t('button.edit') }}</Button>`,
  `<Button variant="dashed" severity="danger">{{ t('button.delete') }}</Button>`,
  `<Button variant="dashed">{{ t('button.create') }}</Button>`
)

const codeNeon = demoCode(
  `<Button variant="neon" severity="primary">{{ t('button.confirm') }}</Button>`,
  `<Button variant="neon" severity="success">{{ t('common.success') }}</Button>`,
  `<Button variant="neon" severity="warning">{{ t('button.edit') }}</Button>`,
  `<Button variant="neon" severity="danger">{{ t('button.delete') }}</Button>`
)

const codeSize = demoCode(
  `<Button size="xs" severity="primary">{{ t('page.base.atoms.button.size.xs') }}</Button>`,
  `<Button size="sm" severity="primary">{{ t('page.base.atoms.button.size.sm') }}</Button>`,
  `<Button size="md" severity="primary">{{ t('page.base.atoms.button.size.md') }}</Button>`,
  `<Button size="lg" severity="primary">{{ t('page.base.atoms.button.size.lg') }}</Button>`,
  `<Button size="xl" severity="primary">{{ t('page.base.atoms.button.size.xl') }}</Button>`
)

const codeIcon = demoCode(
  `<Button icon="Star" :label="t('button.save')" severity="primary" />`,
  `<Button`,
  `  icon="ChevronRight"`,
  `  icon-pos="right"`,
  `  :label="t('button.continue')"`,
  `  variant="outlined"`,
  `/>`,
  `<Button`,
  `  icon="Upload"`,
  `  icon-pos="top"`,
  `  :label="t('button.submit')"`,
  `  variant="dashed"`,
  `/>`,
  `<Button shape="circle" icon="Settings" :aria-label="t('page.base.atoms.button.ariaIcon')" />`,
  `<Button`,
  `  shape="square"`,
  `  variant="outlined"`,
  `  icon="Search"`,
  `  :aria-label="t('page.base.atoms.button.ariaIcon')"`,
  `/>`,
  `<Button`,
  `  shape="circle"`,
  `  :img="demoImg"`,
  `  :aria-label="t('page.base.atoms.button.ariaImg')"`,
  `  badge="1"`,
  `/>`
)

const codeStates = demoCode(
  `<Button`,
  `  :loading="loading"`,
  `  :loading-text="t('common.loading')"`,
  `  severity="primary"`,
  `>`,
  `  {{ t('common.loading') }}`,
  `</Button>`,
  `<Button disabled :disabled-title="t('example.doc.button.tip.disabled')">`,
  `  {{ t('button.confirm') }}`,
  `</Button>`,
  `<Button readonly>{{ t('example.doc.button.demo.readonlyLabel') }}</Button>`,
  `<Button`,
  `  click-guard="debounce"`,
  `  :wait="500"`,
  `  severity="primary"`,
  `  @click="onGuardedClick"`,
  `>`,
  `  {{ t('example.doc.button.demo.debounceLabel') }} ({{ clickCount }})`,
  `</Button>`,
  `<Button :badge="3">{{ t('button.refresh') }}</Button>`,
  `<Button star variant="outlined">{{ t('button.save') }}</Button>`,
  `<Button ripple severity="primary">{{ t('example.doc.button.demo.rippleLabel') }}</Button>`
)

const codeBiz = demoCode(
  `<Button`,
  `  :permission="false"`,
  `  permission-mode="disable"`,
  `  :permission-tip="t('example.doc.button.tip.noPermission')"`,
  `>`,
  `  {{ t('example.doc.button.demo.permissionLabel') }}`,
  `</Button>`,
  `<Button :permission="false" permission-mode="hide">`,
  `  {{ t('example.doc.button.demo.permissionHidden') }}`,
  `</Button>`,
  `<Button severity="danger" :confirm="t('example.doc.button.tip.confirmDelete')">`,
  `  {{ t('button.delete') }}`,
  `</Button>`,
  `<Button href="https://example.com" target="_blank" link>`,
  `  {{ t('example.doc.button.demo.hrefLabel') }}`,
  `</Button>`,
  `<Button block severity="primary" type="submit">`,
  `  {{ t('button.submit') }}`,
  `</Button>`
)

const codeSlots = demoCode(
  `<Button severity="primary">`,
  `  <template #prefix>`,
  `    <Icon name="Star" size="sm" />`,
  `  </template>`,
  `  {{ t('button.save') }}`,
  `  <template #suffix>`,
  `    <Icon name="ChevronRight" size="sm" />`,
  `  </template>`,
  `</Button>`,
  `<Button severity="primary">`,
  `  <template #icon>`,
  `    <Icon name="Heart" />`,
  `  </template>`,
  `  {{ t('button.save') }}`,
  `</Button>`,
  `<Button loading severity="primary">`,
  `  <template #loading>`,
  `    <Icon name="Loader2" spin />`,
  `  </template>`,
  `  {{ t('common.loading') }}`,
  `</Button>`,
  `<Button severity="primary">`,
  `  {{ t('common.more') }}`,
  `  <template #dropdown>`,
  `    <Button variant="text" block>{{ t('button.edit') }}</Button>`,
  `    <Button variant="text" block>{{ t('button.delete') }}</Button>`,
  `  </template>`,
  `</Button>`
)

const codeEvents = demoCode(
  `<Button`,
  `  severity="primary"`,
  `  @click="onClick"`,
  `  @focus="onFocus"`,
  `  @blur="onBlur"`,
  `>`,
  `  {{ t('button.confirm') }}`,
  `</Button>`,
  `<Button`,
  `  severity="danger"`,
  `  :confirm="t('example.doc.button.tip.confirmDelete')"`,
  `  @confirm="onConfirm"`,
  `  @cancel-confirm="onCancelConfirm"`,
  `>`,
  `  {{ t('button.delete') }}`,
  `</Button>`
)

const codeGroup = demoCode(
  `<ButtonGroup>`,
  `  <Button severity="primary">{{ t('button.create') }}</Button>`,
  `  <Button variant="outlined">{{ t('button.edit') }}</Button>`,
  `  <Button variant="outlined">{{ t('button.delete') }}</Button>`,
  `</ButtonGroup>`,
  `<Button severity="primary">`,
  `  {{ t('common.more') }}`,
  `  <template #dropdown>`,
  `    <Button variant="text" block>{{ t('button.edit') }}</Button>`,
  `    <Button variant="text" block>{{ t('button.delete') }}</Button>`,
  `  </template>`,
  `</Button>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'label',
    description: t('example.doc.button.prop.label'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'icon',
    description: t('example.doc.button.prop.icon'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'iconPos',
    description: t('example.doc.button.prop.iconPos'),
    type: "'left' | 'right' | 'top'",
    defaultValue: "'left'"
  },
  {
    name: 'severity',
    description: t('example.doc.button.prop.severity'),
    type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'link'",
    defaultValue: "'default'"
  },
  {
    name: 'variant',
    description: t('example.doc.button.prop.variant'),
    type: "'solid' | 'outlined' | 'dashed' | 'neon' | 'text'",
    defaultValue: "'solid'"
  },
  {
    name: 'size',
    description: t('example.doc.button.prop.size'),
    type: 'Size',
    defaultValue: "'md'"
  },
  {
    name: 'shape',
    description: t('example.doc.button.prop.shape'),
    type: "'rect' | 'square' | 'circle'",
    defaultValue: "'rect'"
  },
  {
    name: 'block',
    description: t('example.doc.button.prop.block'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'loading',
    description: t('example.doc.button.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'loadingText',
    description: t('example.doc.button.prop.loadingText'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'disabled',
    description: t('example.doc.button.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'readonly',
    description: t('example.doc.button.prop.readonly'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'clickGuard',
    description: t('example.doc.button.prop.clickGuard'),
    type: "'none' | 'debounce' | 'throttle'",
    defaultValue: "'none'"
  },
  {
    name: 'wait',
    description: t('example.doc.button.prop.wait'),
    type: 'number',
    defaultValue: '300'
  },
  {
    name: 'permission / permissionMode',
    description: t('example.doc.button.prop.permission'),
    type: 'boolean | () => boolean / hide | disable',
    defaultValue: '-'
  },
  {
    name: 'confirm',
    description: t('example.doc.button.prop.confirm'),
    type: 'boolean | string',
    defaultValue: 'false'
  },
  {
    name: 'beforeClick',
    description: t('example.doc.button.prop.beforeClick'),
    type: '(e) => boolean | Promise<boolean>',
    defaultValue: '-'
  },
  {
    name: 'href / to / target',
    description: t('example.doc.button.prop.href'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'ripple',
    description: t('example.doc.button.prop.ripple'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'badge / star',
    description: t('example.doc.button.prop.badge'),
    type: 'string | number / boolean',
    defaultValue: '-'
  },
  {
    name: 'type',
    description: t('example.doc.button.prop.type'),
    type: "'button' | 'submit' | 'reset'",
    defaultValue: "'button'"
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
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.button.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'click',
    description: t('example.doc.button.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'focus',
    description: t('example.doc.button.emit.focus'),
    type: '(event: FocusEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'blur',
    description: t('example.doc.button.emit.blur'),
    type: '(event: FocusEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'confirm',
    description: t('example.doc.button.emit.confirm'),
    type: '(event: Event) => void',
    defaultValue: '-'
  },
  {
    name: 'cancelConfirm',
    description: t('example.doc.button.emit.cancelConfirm'),
    type: '(event: Event) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.button.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'icon',
    description: t('example.doc.button.slot.icon'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'prefix',
    description: t('example.doc.button.slot.prefix'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'suffix',
    description: t('example.doc.button.slot.suffix'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'loading',
    description: t('example.doc.button.slot.loading'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'dropdown',
    description: t('example.doc.button.slot.dropdown'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.button.demo.basic')"
      :description="t('example.doc.button.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-button-row">
        <Button severity="primary" @click="flash">{{ t(LocaleKeys.button.confirm) }}</Button>
        <Button severity="success" @click="flash">{{ t(LocaleKeys.common.success) }}</Button>
        <Button severity="warning" @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
        <Button severity="danger" @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
        <Button variant="outlined" @click="flash">{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button variant="text" @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
        <Button link @click="flash">{{ t(LocaleKeys.button.learnMore) }}</Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.dashed')"
      :description="t('example.doc.button.demo.dashedDesc')"
      :code="codeDashed"
    >
      <div class="vp-button-row">
        <Button variant="dashed" severity="primary" @click="flash">
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button variant="dashed" severity="success" @click="flash">
          {{ t(LocaleKeys.common.success) }}
        </Button>
        <Button variant="dashed" severity="warning" @click="flash">
          {{ t(LocaleKeys.button.edit) }}
        </Button>
        <Button variant="dashed" severity="danger" @click="flash">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
        <Button variant="dashed" @click="flash">
          {{ t(LocaleKeys.button.create) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.neon')"
      :description="t('example.doc.button.demo.neonDesc')"
      :code="codeNeon"
    >
      <div class="vp-button-row">
        <Button variant="neon" severity="primary" @click="flash">
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button variant="neon" severity="success" @click="flash">
          {{ t(LocaleKeys.common.success) }}
        </Button>
        <Button variant="neon" severity="warning" @click="flash">
          {{ t(LocaleKeys.button.edit) }}
        </Button>
        <Button variant="neon" severity="danger" @click="flash">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.size')"
      :description="t('example.doc.button.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-button-row">
        <Button
          v-for="sz in sizes"
          :key="sz"
          :size="sz"
          severity="primary"
          @click="flash"
        >
          {{ tDyn(sizeLabelKey[sz]) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.icon')"
      :description="t('example.doc.button.demo.iconDesc')"
      :code="codeIcon"
    >
      <div class="vp-button-row">
        <Button icon="Star" :label="t(LocaleKeys.button.save)" severity="primary" @click="flash" />
        <Button
          icon="ChevronRight"
          icon-pos="right"
          :label="t(LocaleKeys.button.continue)"
          variant="outlined"
          @click="flash"
        />
        <Button
          icon="Upload"
          icon-pos="top"
          :label="t(LocaleKeys.button.submit)"
          variant="dashed"
          @click="flash"
        />
        <Button
          shape="circle"
          icon="Settings"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
          @click="flash"
        />
        <Button
          shape="square"
          variant="outlined"
          icon="Search"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
          @click="flash"
        />
        <Button
          shape="circle"
          :img="demoImg"
          :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaImg)"
          badge="1"
          @click="flash"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.states')"
      :description="t('example.doc.button.demo.statesDesc')"
      :code="codeStates"
    >
      <div class="vp-button-row">
        <Button
          :loading="loading"
          :loading-text="t(LocaleKeys.common.loading)"
          severity="primary"
          @click="flash"
        >
          {{ t(LocaleKeys.common.loading) }}
        </Button>
        <Button
          disabled
          :disabled-title="t('example.doc.button.tip.disabled')"
        >
          {{ t(LocaleKeys.button.confirm) }}
        </Button>
        <Button readonly>{{ t('example.doc.button.demo.readonlyLabel') }}</Button>
        <Button
          click-guard="debounce"
          :wait="500"
          severity="primary"
          @click="onGuardedClick"
        >
          {{ t('example.doc.button.demo.debounceLabel') }} ({{ clickCount }})
        </Button>
        <Button :badge="3" @click="flash">{{ t(LocaleKeys.button.refresh) }}</Button>
        <Button star variant="outlined" @click="flash">{{ t(LocaleKeys.button.save) }}</Button>
        <Button ripple severity="primary" @click="flash">
          {{ t('example.doc.button.demo.rippleLabel') }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.biz')"
      :description="t('example.doc.button.demo.bizDesc')"
      :code="codeBiz"
    >
      <div class="vp-button-row">
        <Button
          :permission="false"
          permission-mode="disable"
          :permission-tip="t('example.doc.button.tip.noPermission')"
        >
          {{ t('example.doc.button.demo.permissionLabel') }}
        </Button>
        <Button :permission="false" permission-mode="hide">
          {{ t('example.doc.button.demo.permissionHidden') }}
        </Button>
        <Button severity="danger" :confirm="t('example.doc.button.tip.confirmDelete')">
          {{ t(LocaleKeys.button.delete) }}
        </Button>
        <Button href="https://example.com" target="_blank" link>
          {{ t('example.doc.button.demo.hrefLabel') }}
        </Button>
        <Button block severity="primary" type="submit" @click="flash">
          {{ t(LocaleKeys.button.submit) }}
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.slots')"
      :description="t('example.doc.button.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-button-row">
        <Button severity="primary" @click="flash">
          <template #prefix>
            <Icon name="Star" size="sm" />
          </template>
          {{ t(LocaleKeys.button.save) }}
          <template #suffix>
            <Icon name="ChevronRight" size="sm" />
          </template>
        </Button>
        <Button severity="primary" @click="flash">
          <template #icon>
            <Icon name="Heart" />
          </template>
          {{ t(LocaleKeys.button.save) }}
        </Button>
        <Button loading severity="primary">
          <template #loading>
            <Icon name="Loader2" spin />
          </template>
          {{ t(LocaleKeys.common.loading) }}
        </Button>
        <Button severity="primary" @click="flash">
          {{ t(LocaleKeys.common.more) }}
          <template #dropdown>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
          </template>
        </Button>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.events')"
      :description="t('example.doc.button.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-button-events">
        <div class="vp-button-row">
          <Button
            severity="primary"
            @click="noteEvent('click')"
            @focus="noteEvent('focus')"
            @blur="noteEvent('blur')"
          >
            {{ t(LocaleKeys.button.confirm) }}
          </Button>
          <Button
            severity="danger"
            :confirm="t('example.doc.button.tip.confirmDelete')"
            @confirm="noteEvent('confirm')"
            @cancel-confirm="noteEvent('cancelConfirm')"
          >
            {{ t(LocaleKeys.button.delete) }}
          </Button>
        </div>
        <p class="vp-button-events__log">
          {{
            t('example.doc.button.sample.eventLog', {
              event: lastEvent || t('example.doc.button.sample.eventIdle')
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
          <Button
            icon="Heart"
            severity="primary"
            :label="t(LocaleKeys.button.save)"
            v-bind="motionBind"
          />
          <Button
            icon="RefreshCw"
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            v-bind="motionBind"
          />
          <Button
            shape="circle"
            icon="Star"
            :aria-label="t(LocaleKeys.page.baseAtomsButton.ariaIcon)"
            v-bind="motionBind"
          />
        </template>
      </MotionLivePanel>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.button.demo.group')"
      :description="t('example.doc.button.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-button-row">
        <ButtonGroup>
          <Button severity="primary" @click="flash">{{ t(LocaleKeys.button.create) }}</Button>
          <Button variant="outlined" @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
          <Button variant="outlined" @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
        </ButtonGroup>
        <Button severity="primary" @click="flash">
          {{ t(LocaleKeys.common.more) }}
          <template #dropdown>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.edit) }}</Button>
            <Button variant="text" block @click="flash">{{ t(LocaleKeys.button.delete) }}</Button>
          </template>
        </Button>
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
  line-height: var(--line-height-body);
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

.vp-button-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-button-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-button-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
