<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { computed, ref } from 'vue'
import { TabPane, Tabs } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const active = ref('a')
const lastEvent = ref('')

function noteEvent(kind: string, name?: string | number) {
  lastEvent.value = name != null ? `${kind}:${String(name)}` : kind
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Tabs, TabPane } from '@amg-webui/components/base'`],
  template: [
    `  <Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">`,
    `    <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
    `      {{ t('example.doc.tabs.sample.panelA') }}`,
    `    </TabPane>`,
    `    <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">`,
    `      {{ t('example.doc.tabs.sample.panelB') }}`,
    `    </TabPane>`,
    `    <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')">`,
    `      {{ t('example.doc.tabs.sample.panelC') }}`,
    `    </TabPane>`,
    `  </Tabs>`
  ]
})

const codeDisabled = demoCode(
  `<Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">`,
  `  <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
  `    {{ t('example.doc.tabs.sample.panelA') }}`,
  `  </TabPane>`,
  `  <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')" disabled>`,
  `    {{ t('example.doc.tabs.sample.panelB') }}`,
  `  </TabPane>`,
  `  <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')">`,
  `    {{ t('example.doc.tabs.sample.panelC') }}`,
  `  </TabPane>`,
  `</Tabs>`
)

const codeEvents = demoCode(
  `<Tabs`,
  `  v-model="active"`,
  `  :aria-label="t('example.doc.tabs.sample.group')"`,
  `  @change="noteEvent('change', $event)"`,
  `  @tab-click="(name) => noteEvent('tabClick', name)"`,
  `>`,
  `  <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
  `    {{ t('example.doc.tabs.sample.panelA') }}`,
  `  </TabPane>`,
  `  <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">`,
  `    {{ t('example.doc.tabs.sample.panelB') }}`,
  `  </TabPane>`,
  `</Tabs>`
)

const codeSlots = demoCode(
  `<Tabs v-model="active">`,
  `  <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
  `    {{ t('example.doc.tabs.sample.panelA') }}`,
  `  </TabPane>`,
  `  <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">`,
  `    {{ t('example.doc.tabs.sample.panelB') }}`,
  `  </TabPane>`,
  `</Tabs>`
)

const codeLazy = demoCode(
  `<Tabs v-model="active">`,
  `  <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">`,
  `    {{ t('example.doc.tabs.sample.panelA') }}`,
  `  </TabPane>`,
  `  <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')" lazy>`,
  `    {{ t('example.doc.tabs.sample.panelB') }}`,
  `  </TabPane>`,
  `  <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')" force-render>`,
  `    {{ t('example.doc.tabs.sample.panelC') }}`,
  `  </TabPane>`,
  `</Tabs>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.tabs.prop.modelValue'),
    type: 'string | number',
    defaultValue: '-'
  },
  {
    name: 'ariaLabel',
    description: t('example.doc.tabs.prop.ariaLabel'),
    type: 'string',
    defaultValue: '-'
  }
])

const panePropRows = computed<PropRow[]>(() => [
  {
    name: 'name',
    description: t('example.doc.tabs.prop.name'),
    type: 'string | number',
    defaultValue: '-'
  },
  {
    name: 'label',
    description: t('example.doc.tabs.prop.label'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'disabled',
    description: t('example.doc.tabs.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'lazy',
    description: t('example.doc.tabs.prop.lazy'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'forceRender',
    description: t('example.doc.tabs.prop.forceRender'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue',
    description: t('example.doc.tabs.emit.updateModelValue'),
    type: '(value: string | number) => void',
    defaultValue: '-'
  },
  {
    name: 'change',
    description: t('example.doc.tabs.emit.change'),
    type: '(value: string | number) => void',
    defaultValue: '-'
  },
  {
    name: 'tabClick',
    description: t('example.doc.tabs.emit.tabClick'),
    type: '(value: string | number, event: MouseEvent | KeyboardEvent) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.tabs.slot.default'),
    type: 'TabPane[]',
    defaultValue: '-'
  }
])

const paneSlotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.tabs.slot.paneDefault'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tabs.demo.basic')"
      :description="t('example.doc.tabs.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Tabs
        v-model="active"
        :aria-label="t('example.doc.tabs.sample.group')"
      >
        <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
          {{ t('example.doc.tabs.sample.panelA') }}
        </TabPane>
        <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">
          {{ t('example.doc.tabs.sample.panelB') }}
        </TabPane>
        <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')">
          {{ t('example.doc.tabs.sample.panelC') }}
        </TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabs.demo.disabled')"
      :description="t('example.doc.tabs.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <Tabs
        v-model="active"
        :aria-label="t('example.doc.tabs.sample.group')"
      >
        <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
          {{ t('example.doc.tabs.sample.panelA') }}
        </TabPane>
        <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')" disabled>
          {{ t('example.doc.tabs.sample.panelB') }}
        </TabPane>
        <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')">
          {{ t('example.doc.tabs.sample.panelC') }}
        </TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabs.demo.events')"
      :description="t('example.doc.tabs.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-tabs-demo__events">
        <Tabs
          v-model="active"
          :aria-label="t('example.doc.tabs.sample.group')"
          @change="noteEvent('change', $event)"
          @tab-click="(name) => noteEvent('tabClick', name)"
        >
          <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
            {{ t('example.doc.tabs.sample.panelA') }}
          </TabPane>
          <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">
            {{ t('example.doc.tabs.sample.panelB') }}
          </TabPane>
        </Tabs>
        <p v-if="lastEvent" class="vp-tabs-demo__hint">
          {{ t('example.doc.tabs.sample.lastEvent') }}: {{ lastEvent }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabs.demo.slots')"
      :description="t('example.doc.tabs.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Tabs v-model="active">
        <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
          {{ t('example.doc.tabs.sample.panelA') }}
        </TabPane>
        <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')">
          {{ t('example.doc.tabs.sample.panelB') }}
        </TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tabs.demo.lazy')"
      :description="t('example.doc.tabs.demo.lazyDesc')"
      :code="codeLazy"
    >
      <Tabs v-model="active" :aria-label="t('example.doc.tabs.sample.group')">
        <TabPane name="a" :label="t('example.doc.tabs.sample.tabA')">
          {{ t('example.doc.tabs.sample.panelA') }}
        </TabPane>
        <TabPane name="b" :label="t('example.doc.tabs.sample.tabB')" lazy>
          {{ t('example.doc.tabs.sample.panelB') }}
        </TabPane>
        <TabPane name="c" :label="t('example.doc.tabs.sample.tabC')" force-render>
          {{ t('example.doc.tabs.sample.panelC') }}
        </TabPane>
      </Tabs>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t('example.doc.tabs.api.tabsProps') }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t('example.doc.tabs.api.paneProps') }}</h3>
      <PropsTable :rows="panePropRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t('example.doc.tabs.api.tabsSlots') }}</h3>
      <PropsTable :rows="slotRows" />

      <h3 class="vp-curated__api-sub">{{ t('example.doc.tabs.api.paneSlots') }}</h3>
      <PropsTable :rows="paneSlotRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
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

.vp-tabs-demo__events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-tabs-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
