<script setup lang="ts">
/**
 * Curated demo — aligned with Avatar gold standard (demoCode / demoSfc / API thirds).
 */
import { computed, ref } from 'vue'
import { Link } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const loading = ref(false)
const clickCount = ref(0)
const gateToggle = ref(false)
const lastEvent = ref('')

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const types = ['default', 'primary', 'success', 'warning', 'danger', 'link'] as const

function flashLoad() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 1000)
}

function noteEvent(kind: string) {
  lastEvent.value = kind
}

const beforeClickLabel = computed(() =>
  t('example.doc.link.sample.beforeClick', { count: clickCount.value })
)

async function beforeClickGuard(): Promise<boolean> {
  const allow = !gateToggle.value
  gateToggle.value = !gateToggle.value
  if (allow) clickCount.value += 1
  return allow
}

const codeBasic = demoSfc({
  imports: [`import { Link } from '@amg-webui/components/base'`],
  template: [
    `  <Link href="https://example.com" target="_blank">`,
    `    {{ t('example.doc.link.sample.external') }}`,
    `  </Link>`,
    `  <Link to="/base/Button" type="primary">`,
    `    {{ t('example.doc.link.sample.route') }}`,
    `  </Link>`,
    `  <Link underline="never" @click="onAction">`,
    `    {{ t('example.doc.link.sample.action') }}`,
    `  </Link>`
  ]
})

const codeType = demoCode(
  `<Link type="default" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'default' }) }}</Link>`,
  `<Link type="primary" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'primary' }) }}</Link>`,
  `<Link type="success" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'success' }) }}</Link>`,
  `<Link type="warning" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'warning' }) }}</Link>`,
  `<Link type="danger" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'danger' }) }}</Link>`,
  `<Link type="link" href="https://example.com">{{ t('example.doc.link.sample.type', { type: 'link' }) }}</Link>`
)

const codeSize = demoCode(
  `<Link size="xs" type="primary" href="https://example.com">xs</Link>`,
  `<Link size="sm" type="primary" href="https://example.com">sm</Link>`,
  `<Link size="md" type="primary" href="https://example.com">md</Link>`,
  `<Link size="lg" type="primary" href="https://example.com">lg</Link>`,
  `<Link size="xl" type="primary" href="https://example.com">xl</Link>`
)

const codeUnderline = demoCode(
  `<Link underline="hover" href="https://example.com">{{ t('example.doc.link.sample.underlineHover') }}</Link>`,
  `<Link underline="always" href="https://example.com">{{ t('example.doc.link.sample.underlineAlways') }}</Link>`,
  `<Link underline="never" type="primary" @click="onAction">`,
  `  {{ t('example.doc.link.sample.underlineNever') }}`,
  `</Link>`
)

const codeIcon = demoCode(
  `<Link icon="ExternalLink" type="primary" href="https://example.com" target="_blank">`,
  `  {{ t('example.doc.link.sample.iconLeft') }}`,
  `</Link>`,
  `<Link icon="ChevronRight" icon-pos="right" type="link" href="https://example.com">`,
  `  {{ t('example.doc.link.sample.iconRight') }}`,
  `</Link>`,
  `<Link icon="Copy" type="secondary" underline="never" @click="onAction">`,
  `  {{ t('example.doc.link.sample.iconAction') }}`,
  `</Link>`
)

const codeState = demoCode(
  `<Link href="https://example.com">{{ t('example.doc.link.sample.normal') }}</Link>`,
  `<Link disabled href="https://example.com">{{ t('example.doc.link.sample.disabled') }}</Link>`,
  `<Link readonly href="https://example.com">{{ t('example.doc.link.sample.readonly') }}</Link>`,
  `<Link :loading="loading" type="primary" @click="onAction">`,
  `  {{ t('example.doc.link.sample.loading') }}`,
  `</Link>`
)

const codeBiz = demoCode(
  `<Link type="primary" underline="never" :before-click="beforeClickGuard">`,
  `  {{ t('example.doc.link.sample.beforeClick', { count }) }}`,
  `</Link>`,
  `<Link`,
  `  type="secondary"`,
  `  underline="never"`,
  `  click-guard="debounce"`,
  `  :wait="400"`,
  `  @click="onAction"`,
  `>`,
  `  {{ t('example.doc.link.sample.debounce') }}`,
  `</Link>`,
  `<Link`,
  `  :permission="false"`,
  `  permission-mode="disable"`,
  `  :permission-tip="t('example.doc.link.tip.noPermission')"`,
  `  type="danger"`,
  `>`,
  `  {{ t('example.doc.link.sample.permissionDisable') }}`,
  `</Link>`,
  `<Link :permission="false" permission-mode="hide" type="danger">`,
  `  {{ t('example.doc.link.sample.permissionHide') }}`,
  `</Link>`
)

const codeSlots = demoCode(
  `<Link type="primary" href="https://example.com">`,
  `  {{ t('example.doc.link.sample.external') }}`,
  `</Link>`
)

const codeEvents = demoCode(
  `<Link`,
  `  type="primary"`,
  `  underline="never"`,
  `  @click="onClick"`,
  `  @focus="onFocus"`,
  `  @blur="onBlur"`,
  `>`,
  `  {{ t('example.doc.link.sample.action') }}`,
  `</Link>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'type',
    description: t('example.doc.link.prop.type'),
    type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'link'",
    defaultValue: "'default'"
  },
  {
    name: 'size',
    description: t('example.doc.link.prop.size'),
    type: 'Size',
    defaultValue: "'md'"
  },
  {
    name: 'underline',
    description: t('example.doc.link.prop.underline'),
    type: "'hover' | 'always' | 'never' | boolean",
    defaultValue: "'hover'"
  },
  {
    name: 'href / to / target / replace',
    description: t('example.doc.link.prop.href'),
    type: 'string / Route path',
    defaultValue: '-'
  },
  {
    name: 'icon / iconPos / iconSize / iconGap',
    description: t('example.doc.link.prop.icon'),
    type: "string / 'left'|'right' / Size",
    defaultValue: "- / 'left'"
  },
  {
    name: 'disabled / readonly / loading',
    description: t('example.doc.link.prop.state'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'beforeClick',
    description: t('example.doc.link.prop.beforeClick'),
    type: '(e) => boolean | Promise<boolean>',
    defaultValue: '-'
  },
  {
    name: 'clickGuard / wait',
    description: t('example.doc.link.prop.clickGuard'),
    type: "'none' | 'debounce' | 'throttle' / number",
    defaultValue: "'none' / 300"
  },
  {
    name: 'permission / permissionMode / permissionTip',
    description: t('example.doc.link.prop.permission'),
    type: 'boolean | () => boolean / hide | disable',
    defaultValue: '-'
  },
  {
    name: 'stopPropagation / tooltip / ariaLabel',
    description: t('example.doc.link.prop.misc'),
    type: 'boolean / string',
    defaultValue: 'false / -'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'click',
    description: t('example.doc.link.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'focus',
    description: t('example.doc.link.emit.focus'),
    type: '(event: FocusEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'blur',
    description: t('example.doc.link.emit.blur'),
    type: '(event: FocusEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.link.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.link.demo.basic')"
      :description="t('example.doc.link.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-link-row">
        <Link href="https://example.com" target="_blank">{{ t('example.doc.link.sample.external') }}</Link>
        <Link to="/base/Button" type="primary">{{ t('example.doc.link.sample.route') }}</Link>
        <Link underline="never" @click="flashLoad">{{ t('example.doc.link.sample.action') }}</Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.type')"
      :description="t('example.doc.link.demo.typeDesc')"
      :code="codeType"
    >
      <div class="vp-link-row">
        <Link v-for="tp in types" :key="tp" :type="tp" href="https://example.com">
          {{ t('example.doc.link.sample.type', { type: tp }) }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.size')"
      :description="t('example.doc.link.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-link-row">
        <Link v-for="sz in sizes" :key="sz" :size="sz" type="primary" href="https://example.com">
          {{ sz }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.underline')"
      :description="t('example.doc.link.demo.underlineDesc')"
      :code="codeUnderline"
    >
      <div class="vp-link-row">
        <Link underline="hover" href="https://example.com">{{ t('example.doc.link.sample.underlineHover') }}</Link>
        <Link underline="always" href="https://example.com">{{ t('example.doc.link.sample.underlineAlways') }}</Link>
        <Link underline="never" type="primary" @click="flashLoad">
          {{ t('example.doc.link.sample.underlineNever') }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.icon')"
      :description="t('example.doc.link.demo.iconDesc')"
      :code="codeIcon"
    >
      <div class="vp-link-row">
        <Link icon="ExternalLink" type="primary" href="https://example.com" target="_blank">
          {{ t('example.doc.link.sample.iconLeft') }}
        </Link>
        <Link icon="ChevronRight" icon-pos="right" type="link" href="https://example.com">
          {{ t('example.doc.link.sample.iconRight') }}
        </Link>
        <Link icon="Copy" type="secondary" underline="never" @click="flashLoad">
          {{ t('example.doc.link.sample.iconAction') }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.state')"
      :description="t('example.doc.link.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-link-row">
        <Link href="https://example.com">{{ t('example.doc.link.sample.normal') }}</Link>
        <Link disabled href="https://example.com">{{ t('example.doc.link.sample.disabled') }}</Link>
        <Link readonly href="https://example.com">{{ t('example.doc.link.sample.readonly') }}</Link>
        <Link :loading="loading" type="primary" @click="flashLoad">
          {{ t('example.doc.link.sample.loading') }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.biz')"
      :description="t('example.doc.link.demo.bizDesc')"
      :code="codeBiz"
    >
      <div class="vp-link-stack">
        <div class="vp-link-row">
          <Link type="primary" underline="never" :before-click="beforeClickGuard">
            {{ beforeClickLabel }}
          </Link>
          <Link
            type="secondary"
            underline="never"
            click-guard="debounce"
            :wait="400"
            @click="flashLoad"
          >
            {{ t('example.doc.link.sample.debounce') }}
          </Link>
        </div>
        <div class="vp-link-row">
          <Link
            :permission="false"
            permission-mode="disable"
            :permission-tip="t('example.doc.link.tip.noPermission')"
            type="danger"
          >
            {{ t('example.doc.link.sample.permissionDisable') }}
          </Link>
          <Link :permission="false" permission-mode="hide" type="danger">
            {{ t('example.doc.link.sample.permissionHide') }}
          </Link>
          <span class="vp-link-hint">{{ t('example.doc.link.sample.permissionHint') }}</span>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.slots')"
      :description="t('example.doc.link.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-link-row">
        <Link type="primary" href="https://example.com">
          {{ t('example.doc.link.sample.external') }}
        </Link>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.link.demo.events')"
      :description="t('example.doc.link.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-link-events">
        <div class="vp-link-row">
          <Link
            type="primary"
            underline="never"
            @click="noteEvent('click')"
            @focus="noteEvent('focus')"
            @blur="noteEvent('blur')"
          >
            {{ t('example.doc.link.sample.action') }}
          </Link>
        </div>
        <p class="vp-link-events__log">
          {{
            t('example.doc.link.sample.eventLog', {
              event: lastEvent || t('example.doc.link.sample.eventIdle')
            })
          }}
        </p>
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

.vp-link-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-link-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-link-hint {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.vp-link-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-link-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
