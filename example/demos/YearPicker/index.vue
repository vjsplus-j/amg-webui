<script setup lang="ts">
/**
 * Curated demo — Form wave2 YearPicker
 */
import { ref } from 'vue';
import { YearPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const year = ref<number | null>(2026);
const empty = ref<number | null>(null);

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { YearPicker } from '@amg-webui/form'`,
  ],
  script: [`const year = ref(2026)`],
  template: [
    `  <YearPicker`,
    `    v-model="year"`,
    `    value-format="number"`,
    `    :placeholder="t('example.doc.yearPicker.sample.placeholder')"`,
    `  />`,
  ],
});

const codeDisabled = demoCode(
  `<YearPicker v-model="empty" :placeholder="t('example.doc.yearPicker.sample.placeholder')" />`,
  `<YearPicker v-model="year" disabled />`,
);

;

;
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.yearPicker.demo.basic')"
      :description="t('example.doc.yearPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <YearPicker
          v-model="year"
          value-format="number"
          :min="2020"
          :max="2030"
          clearable
          :placeholder="t('example.doc.yearPicker.sample.placeholder')"
        />
      </div>
      <p v-if="year != null" class="vp-curated__hint">
        {{ t("example.doc.yearPicker.sample.selected", { year }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.yearPicker.demo.disabled')"
      :description="t('example.doc.yearPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <YearPicker
            v-model="empty"
            :placeholder="t('example.doc.yearPicker.sample.placeholder')"
          />
          <YearPicker v-model="year" disabled />
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

.vp-curated__hint {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
