<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { computed, ref } from 'vue'
import { Button, FloatButton, Icon } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'

const { t } = useLocale()

const clickCount = ref(0)
const menuOpen = ref(false)
const lastEvent = ref('')

function noteClick() {
  clickCount.value += 1
  lastEvent.value = 'click'
}

function noteOpenChange(open: boolean) {
  menuOpen.value = open
  lastEvent.value = `openChange:${open}`
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { FloatButton } from '@amg-webui/components/base'`],
  template: [
    `  <FloatButton`,
    `    icon="Plus"`,
    `    bottom="var(--spacing-xl)"`,
    `    right="var(--spacing-xl)"`,
    `  />`
  ]
})

const codeShape = demoCode(
  `<FloatButton icon="Star" shape="circle" />`,
  `<FloatButton icon="Star" shape="square" severity="success" />`
)

const codeSeverity = demoCode(
  `<FloatButton icon="Plus" severity="primary" />`,
  `<FloatButton icon="Plus" severity="secondary" />`,
  `<FloatButton icon="Plus" severity="danger" />`
)

const codeSlots = demoCode(
  `<FloatButton icon="Plus" severity="secondary">`,
  `  <template #menu>`,
  `    <Button`,
  `      shape="circle"`,
  `      icon="Edit"`,
  `      size="sm"`,
  `      :aria-label="t('button.edit')"`,
  `    />`,
  `    <Button`,
  `      shape="circle"`,
  `      icon="Search"`,
  `      size="sm"`,
  `      :aria-label="t('common.search')"`,
  `    />`,
  `  </template>`,
  `  <template #icon>`,
  `    <Icon name="Plus" size="md" />`,
  `  </template>`,
  `  <template #description>`,
  `    {{ t('example.doc.floatButton.sample.description') }}`,
  `  </template>`,
  `</FloatButton>`
)

const codeEvents = demoCode(
  `<FloatButton`,
  `  icon="Plus"`,
  `  v-model:open="menuOpen"`,
  `  @click="onClick"`,
  `  @open-change="onOpenChange"`,
  `>`,
  `  <template #menu>`,
  `    <Button`,
  `      shape="circle"`,
  `      icon="Edit"`,
  `      size="sm"`,
  `      :aria-label="t(LocaleKeys.button.edit)"`,
  `    />`,
  `  </template>`,
  `</FloatButton>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'icon',
    description: t('example.doc.floatButton.prop.icon'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'severity / type',
    description: t('example.doc.floatButton.prop.severity'),
    type: 'Severity',
    defaultValue: "'primary'"
  },
  {
    name: 'shape',
    description: t('example.doc.floatButton.prop.shape'),
    type: 'Shape',
    defaultValue: "'circle'"
  },
  {
    name: 'href',
    description: t('example.doc.floatButton.prop.href'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'top / right / bottom / left',
    description: t('example.doc.floatButton.prop.position'),
    type: 'string | number',
    defaultValue: 'token spacing'
  },
  {
    name: 'open / v-model:open',
    description: t('example.doc.floatButton.prop.open'),
    type: 'boolean',
    defaultValue: '-'
  },
  {
    name: 'trackId / telemetry',
    description: t('example.doc.floatButton.prop.telemetry'),
    type: 'string / boolean',
    defaultValue: '- / undefined'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'click',
    description: t('example.doc.floatButton.emit.click'),
    type: '(event: MouseEvent) => void',
    defaultValue: '-'
  },
  {
    name: 'openChange / update:open',
    description: t('example.doc.floatButton.emit.openChange'),
    type: '(open: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.floatButton.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'icon',
    description: t('example.doc.floatButton.slot.icon'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'menu',
    description: t('example.doc.floatButton.slot.menu'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'description',
    description: t('example.doc.floatButton.slot.description'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic — pasteable SFC, default-open -->
    <DemoBlock
      :title="t('example.doc.floatButton.demo.basic')"
      :description="t('example.doc.floatButton.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-float-stage">
        <FloatButton
          icon="Plus"
          bottom="var(--spacing-xl)"
          right="var(--spacing-xl)"
          class="vp-float-stage__btn"
        />
        <p class="vp-float-stage__hint">{{ t('example.doc.floatButton.demo.stageHint') }}</p>
      </div>
    </DemoBlock>

    <!-- 2. Feature blocks -->
    <DemoBlock
      :title="t('example.doc.floatButton.demo.shape')"
      :description="t('example.doc.floatButton.demo.shapeDesc')"
      :code="codeShape"
    >
      <div class="vp-float-stage vp-float-stage--row">
        <FloatButton icon="Star" shape="circle" class="vp-float-stage__btn--inline" />
        <FloatButton
          icon="Star"
          shape="square"
          severity="success"
          class="vp-float-stage__btn--inline"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.floatButton.demo.severity')"
      :description="t('example.doc.floatButton.demo.severityDesc')"
      :code="codeSeverity"
    >
      <div class="vp-float-stage vp-float-stage--row">
        <FloatButton icon="Plus" severity="primary" class="vp-float-stage__btn--inline" />
        <FloatButton icon="Plus" severity="secondary" class="vp-float-stage__btn--inline" />
        <FloatButton icon="Plus" severity="danger" class="vp-float-stage__btn--inline" />
      </div>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.floatButton.demo.slots')"
      :description="t('example.doc.floatButton.demo.slotsDesc')"
      :code="codeSlots"
    >
      <div class="vp-float-stage">
        <FloatButton icon="Plus" severity="secondary" class="vp-float-stage__btn--inline">
          <template #menu>
            <Button
              shape="circle"
              icon="Edit"
              size="sm"
              :aria-label="t('button.edit')"
            />
            <Button
              shape="circle"
              icon="Search"
              size="sm"
              :aria-label="t('common.search')"
            />
          </template>
          <template #icon>
            <Icon name="Plus" size="md" />
          </template>
          <template #description>
            {{ t('example.doc.floatButton.sample.description') }}
          </template>
        </FloatButton>
      </div>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.floatButton.demo.events')"
      :description="t('example.doc.floatButton.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-float-events">
        <div class="vp-float-stage">
          <FloatButton
            icon="Plus"
            v-model:open="menuOpen"
            class="vp-float-stage__btn--inline"
            @click="noteClick"
            @open-change="noteOpenChange"
          >
            <template #menu>
              <Button
                shape="circle"
                icon="Edit"
                size="sm"
                :aria-label="t(LocaleKeys.button.edit)"
              />
            </template>
          </FloatButton>
        </div>
        <p class="vp-float-events__log">
          {{
            t('example.doc.floatButton.sample.eventLog', {
              event: lastEvent || t('example.doc.floatButton.sample.eventIdle'),
              count: clickCount
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 5. API: Props → Events → Slots -->
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

.vp-float-stage {
  position: relative;
  width: 100%;
  min-height: 8rem;
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-2, var(--surface-1));
}

.vp-float-stage--row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  min-height: 6rem;
}

.vp-float-stage__hint {
  margin: 0;
  padding: var(--theme-card-pad);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.vp-float-stage__btn {
  position: absolute !important;
}

.vp-float-stage__btn--inline {
  position: relative !important;
  --vp-float-top: auto;
  --vp-float-right: auto;
  --vp-float-bottom: auto;
  --vp-float-left: auto;
}

.vp-float-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-float-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
