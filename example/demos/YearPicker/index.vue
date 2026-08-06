<script setup lang="ts">
/**
 * Curated demo — Form wave2 YearPicker
 */
import { computed, ref } from "vue";
import { YearPicker, Space } from "@amg-webui/components/base";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import type { ApiRow, PropRow } from "../../components/demo/types";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const year = ref<number | null>(2026);
const empty = ref<number | null>(null);

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { YearPicker } from '@amg-webui/components/base'`,
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

const propRows = computed<PropRow[]>(() => [
  {
    name: "modelValue",
    description: t("example.doc.yearPicker.prop.modelValue"),
    type: "string | Date | number | null",
    defaultValue: "null",
  },
  {
    name: "placeholder",
    description: t("example.doc.yearPicker.prop.placeholder"),
    type: "string",
    defaultValue: "—",
  },
  {
    name: "valueFormat",
    description: t("example.doc.yearPicker.prop.valueFormat"),
    type: "'number' | 'date' | 'iso'",
    defaultValue: "'number'",
  },
  {
    name: "yearRange",
    description: t("example.doc.yearPicker.prop.yearRange"),
    type: "number",
    defaultValue: "12",
  },
  {
    name: "disabled",
    description: t("example.doc.yearPicker.prop.disabled"),
    type: "boolean",
    defaultValue: "false",
  },
  {
    name: "min / max",
    description: t("example.doc.yearPicker.prop.yearRange"),
    type: "string | Date | number",
    defaultValue: "—",
  },
  {
    name: "clearable / readonly",
    description: t("example.doc.yearPicker.prop.disabled"),
    type: "boolean",
    defaultValue: "false",
  },
]);

const eventRows = computed<ApiRow[]>(() => [
  {
    name: "update:modelValue / change",
    description: t("example.doc.yearPicker.event.change"),
    type: "(value: string | Date | number | null) => void",
    defaultValue: "-",
  },
  {
    name: "clear / openChange / focus / blur",
    description: t("example.doc.yearPicker.event.change"),
    type: "events",
    defaultValue: "-",
  },
]);
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
