<script setup lang="ts">
/**
 * Curated demo — Display wave2 Calendar
 */
import { ref } from 'vue'
import { Calendar } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
</style>
