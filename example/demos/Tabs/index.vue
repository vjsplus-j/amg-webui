<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { TabPane, Tabs } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from '@amg-webui/demos/tabs/Basic.vue'
import basicSource from '@amg-webui/demos/tabs/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const active = ref('a')
const lastEvent = ref('')

function noteEvent(kind: string, name?: string | number) {
  lastEvent.value = name != null ? `${kind}:${String(name)}` : kind
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

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

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tabs.demo.basic')"
      :description="t('example.doc.tabs.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
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
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
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
