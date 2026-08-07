<script setup lang="ts">
import { computed, ref } from "vue";
import { MergeTable } from '@amg-webui/data';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("MergeTable"));
const selected = ref<Record<string, unknown> | null>(null);

const codeBasic = demoSfc({
  imports: [
    `import { MergeTable } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [`const mountProps = getSampleMountProps('MergeTable')`],
  template: [`  <MergeTable v-bind="mountProps" />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "rows / columns",
    type: "MergeTableRow[] / MergeTableColumn[]",
    description: t("example.doc.mergeTable.prop.base"),
  },
  {
    name: "mergeField / mergeFields / rowKey",
    type: "string / string[] / key getter",
    description: t("example.doc.mergeTable.prop.base"),
  },
  {
    name: "rowClick / sortChange / change",
    type: "events",
    description: t("example.doc.mergeTable.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.mergeTable.when") }}</p>
    <DemoBlock
      :title="t('example.doc.mergeTable.demo.basic')"
      :description="t('example.doc.mergeTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <MergeTable v-bind="mountProps" v-model="selected" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
