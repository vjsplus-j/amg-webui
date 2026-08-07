<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { ref } from 'vue'
import { Icon, Space, Statistic } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'

const { t } = useLocale()

const lastEvent = ref('')

function noteFinish(value: number | string) {
  lastEvent.value = String(value)
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Space, Statistic } from '@amg-webui/core'`],
  template: [
    `  <Space size="xl" wrap>`,
    `    <Statistic`,
    `      :title="t('example.doc.statistic.sample.revenue')"`,
    `      :value="128650.55"`,
    `      prefix="¥"`,
    `      :precision="2"`,
    `      animate`,
    `    />`,
    `    <Statistic`,
    `      :title="t('example.doc.statistic.sample.users')"`,
    `      :value="10842"`,
    `      animate`,
    `    />`,
    `  </Space>`
  ]
})

const codeTrend = demoCode(
  `<Statistic`,
  `  :title="t('example.doc.statistic.sample.growth')"`,
  `  :value="12.6"`,
  `  suffix="%"`,
  `  :precision="1"`,
  `  trend="up"`,
  `/>`,
  `<Statistic`,
  `  :title="t('example.doc.statistic.sample.churn')"`,
  `  :value="3.2"`,
  `  suffix="%"`,
  `  :precision="1"`,
  `  trend="down"`,
  `/>`
)

const codeFormat = demoCode(
  `<Statistic`,
  `  :title="t('example.doc.statistic.sample.revenue')"`,
  `  :value="128650.55"`,
  `  prefix="¥"`,
  `  :precision="2"`,
  `  group-separator=","`,
  `  decimal-separator="."`,
  `/>`,
  `<Statistic`,
  `  :title="t('example.doc.statistic.sample.users')"`,
  `  :value="10842"`,
  `  group-separator=" "`,
  `/>`
)

const codeSlots = demoCode(
  `<Statistic :value="2560" :precision="0">`,
  `  <template #title>`,
  `    {{ t('example.doc.statistic.sample.users') }}`,
  `  </template>`,
  `  <template #prefix>`,
  `    <Icon name="User" />`,
  `  </template>`,
  `  <template #suffix>`,
  `    {{ t('example.doc.statistic.sample.unitPeople') }}`,
  `  </template>`,
  `</Statistic>`
)

const codeEvents = demoCode(
  `<Statistic`,
  `  :title="t('example.doc.statistic.sample.revenue')"`,
  `  :value="128650.55"`,
  `  prefix="¥"`,
  `  :precision="2"`,
  `  animate`,
  `  :duration="1200"`,
  `  @finish="noteFinish"`,
  `/>`
)

/* ─── API tables ─── */

</script>

<template>
  <div class="vp-curated">
    <!-- 1. Basic -->
    <DemoBlock
      :title="t('example.doc.statistic.demo.basic')"
      :description="t('example.doc.statistic.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space size="xl" wrap>
        <Statistic
          :title="t('example.doc.statistic.sample.revenue')"
          :value="128650.55"
          prefix="¥"
          :precision="2"
          animate
        />
        <Statistic
          :title="t('example.doc.statistic.sample.users')"
          :value="10842"
          animate
        />
      </Space>
    </DemoBlock>

    <!-- 2. Features -->
    <DemoBlock
      :title="t('example.doc.statistic.demo.trend')"
      :description="t('example.doc.statistic.demo.trendDesc')"
      :code="codeTrend"
    >
      <Space size="xl" wrap>
        <Statistic
          :title="t('example.doc.statistic.sample.growth')"
          :value="12.6"
          suffix="%"
          :precision="1"
          trend="up"
        />
        <Statistic
          :title="t('example.doc.statistic.sample.churn')"
          :value="3.2"
          suffix="%"
          :precision="1"
          trend="down"
        />
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.statistic.demo.format')"
      :description="t('example.doc.statistic.demo.formatDesc')"
      :code="codeFormat"
    >
      <Space size="xl" wrap>
        <Statistic
          :title="t('example.doc.statistic.sample.revenue')"
          :value="128650.55"
          prefix="¥"
          :precision="2"
          group-separator=","
          decimal-separator="."
        />
        <Statistic
          :title="t('example.doc.statistic.sample.users')"
          :value="10842"
          group-separator=" "
        />
      </Space>
    </DemoBlock>

    <!-- 3. Slots -->
    <DemoBlock
      :title="t('example.doc.statistic.demo.slots')"
      :description="t('example.doc.statistic.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Statistic :value="2560" :precision="0">
        <template #title>
          {{ t('example.doc.statistic.sample.users') }}
        </template>
        <template #prefix>
          <Icon name="User" />
        </template>
        <template #suffix>
          {{ t('example.doc.statistic.sample.unitPeople') }}
        </template>
      </Statistic>
    </DemoBlock>

    <!-- 4. Events -->
    <DemoBlock
      :title="t('example.doc.statistic.demo.events')"
      :description="t('example.doc.statistic.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-statistic-events">
        <Statistic
          :title="t('example.doc.statistic.sample.revenue')"
          :value="128650.55"
          prefix="¥"
          :precision="2"
          animate
          :duration="1200"
          @finish="noteFinish"
        />
        <p class="vp-statistic-events__log">
          {{
            t('example.doc.statistic.sample.eventLog', {
              event: lastEvent || t('example.doc.statistic.sample.eventIdle')
            })
          }}
        </p>
      </div>
    </DemoBlock>

    <!-- 7. API -->
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
.vp-statistic-events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-statistic-events__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
