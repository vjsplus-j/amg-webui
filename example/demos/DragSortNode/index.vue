<script setup lang="ts">
import { computed, ref } from 'vue';
import { DragSortNode } from '@amg-webui/lowcode';
import type { CanvasNodeData } from "@amg-webui/utils";
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoSfc } from "../../components/demo/demoCode";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("DragSortNode"));
const nodes = ref(mountProps.value.nodes as CanvasNodeData[]);

const codeBasic = demoSfc({
  imports: [
    `import { DragSortNode } from '@amg-webui/lowcode'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [`const mountProps = getSampleMountProps('DragSortNode')`],
  template: [`  <DragSortNode v-bind="mountProps" />`],
});

;
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
</div>
</template>
