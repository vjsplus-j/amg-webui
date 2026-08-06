<script setup lang="ts">
import { computed, ref } from "vue";
import { PieChart } from "@amg-webui/components/base";
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("PieChart"));
const selected = ref<string | number | null>(0);

const codeBasic = demoSfc({
  imports: [
    `import { PieChart } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [
    `const mountProps = getSampleMountProps('PieChart')`,
    `const selected = ref(0)`,
  ],
  template: [`  <PieChart v-bind="mountProps" v-model="selected" />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "class / style",
    type: "BaseProps",
    description: t("example.doc.pieChart.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.pieChart.when") }}</p>
    <DemoBlock
      :title="t('example.doc.pieChart.demo.basic')"
      :description="t('example.doc.pieChart.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <PieChart v-bind="mountProps" v-model="selected" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
