<script setup lang="ts">
/**
 * Curated demo — Display wave2 Calendar
 */
import { computed, ref } from 'vue'
import { Calendar } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const date = ref<string | null>('2026-07-30')
const picked = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Calendar } from '@amg-webui/data'`
  ],
  script: [`const date = ref('2026-07-30')`],
  template: [`  <Calendar v-model="date" value-format="iso" />`]
})

const codeSelect = demoCode(
  `<Calendar v-model="picked" value-format="iso" @select="onSelect" />`,
  `<p>{{ t('example.doc.calendar.sample.picked') }}: {{ picked }}</p>`
)

function onSelect(value: string | Date) {
  picked.value = String(value)
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.calendar.prop.model'),
    type: 'string | Date | null',
    defaultValue: 'null'
  },
  {
    name: 'valueFormat',
    description: t('example.doc.calendar.prop.valueFormat'),
    type: "'date' | 'iso'",
    defaultValue: "'iso'"
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / select / change',
    description: t('example.doc.calendar.event.change'),
    type: '(value: string | Date | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.calendar.demo.basic')"
      :description="t('example.doc.calendar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Calendar v-model="date" value-format="iso" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.calendar.demo.select')"
      :description="t('example.doc.calendar.demo.selectDesc')"
      :code="codeSelect"
    >
      <div class="vp-calendar-demo">
        <Calendar v-model="picked" value-format="iso" @select="onSelect" />
        <p v-if="picked" class="vp-calendar-demo__hint">
          {{ t('example.doc.calendar.sample.picked') }}: {{ picked }}
        </p>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-calendar-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}

.vp-calendar-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
