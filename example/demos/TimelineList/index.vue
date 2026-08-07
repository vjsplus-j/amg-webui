<script setup lang="ts">
import { computed, ref } from "vue";
import { TimelineList } from '@amg-webui/data';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("TimelineList"));
const selected = ref<string | number | null>("review");

const codeBasic = demoSfc({
  imports: [
    `import { TimelineList } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [
    `const mountProps = getSampleMountProps('TimelineList')`,
    `const selected = ref('review')`,
  ],
  template: [`  <TimelineList v-bind="mountProps" v-model="selected" />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "class / style",
    type: "BaseProps",
    description: t("example.doc.timelineList.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.timelineList.when") }}</p>
    <DemoBlock
      :title="t('example.doc.timelineList.demo.basic')"
      :description="t('example.doc.timelineList.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TimelineList v-bind="mountProps" v-model="selected" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
