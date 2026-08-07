<script setup lang="ts">
/**
 * Curated demo — Form wave2 MonthPicker
 */
import { ref } from 'vue';
import { MonthPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const month = ref<string | null>("2026-07-01");
const empty = ref<string | null>(null);

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { MonthPicker } from '@amg-webui/form'`,
  ],
  script: [`const month = ref('2026-07-01')`],
  template: [
    `  <MonthPicker`,
    `    v-model="month"`,
    `    value-format="iso"`,
    `    :placeholder="t('example.doc.monthPicker.sample.placeholder')"`,
    `  />`,
  ],
});

const codeDisabled = demoCode(
  `<MonthPicker v-model="empty" :placeholder="t('example.doc.monthPicker.sample.placeholder')" />`,
  `<MonthPicker v-model="month" disabled />`,
);

;

;
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.monthPicker.demo.basic')"
      :description="t('example.doc.monthPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <MonthPicker
          v-model="month"
          value-format="iso"
          min="2025-01-01"
          max="2027-12-01"
          clearable
          :placeholder="t('example.doc.monthPicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.monthPicker.demo.disabled')"
      :description="t('example.doc.monthPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <MonthPicker
            v-model="empty"
            :placeholder="t('example.doc.monthPicker.sample.placeholder')"
          />
          <MonthPicker v-model="month" disabled />
        </Space>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
