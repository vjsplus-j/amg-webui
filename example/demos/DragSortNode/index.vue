<script setup lang="ts">
import { computed, ref } from "vue";
import { DragSortNode } from "@amg-webui/components/base";
import type { CanvasNodeData } from "@amg-webui/utils";
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("DragSortNode"));
const nodes = ref(mountProps.value.nodes as CanvasNodeData[]);

const codeBasic = demoSfc({
  imports: [
    `import { DragSortNode } from '@amg-webui/components/base'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [`const mountProps = getSampleMountProps('DragSortNode')`],
  template: [`  <DragSortNode v-bind="mountProps" />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "modelValue / nodes",
    type: "CanvasNodeData[]",
    description: t("example.doc.dragSortNode.prop.base"),
  },
  {
    name: "selectedId / disabled / clearable",
    type: "string | boolean",
    description: t("example.doc.dragSortNode.prop.base"),
  },
  {
    name: "reorder / move / select / clear",
    type: "events",
    description: t("example.doc.dragSortNode.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.dragSortNode.when") }}</p>
    <DemoBlock
      :title="t('example.doc.dragSortNode.demo.basic')"
      :description="t('example.doc.dragSortNode.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <DragSortNode v-bind="mountProps" v-model="nodes" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
