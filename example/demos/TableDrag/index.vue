<script setup lang="ts">
import { computed, ref } from 'vue';
import { TableDrag } from '@amg-webui/data';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoSfc } from "../../components/demo/demoCode";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("TableDrag"));
const rows = ref([...(mountProps.value.rows as Record<string, unknown>[])]);

const codeBasic = demoSfc({
  imports: [
    `import { TableDrag } from '@amg-webui/data'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [
    `const mountProps = getSampleMountProps('TableDrag')`,
    `const rows = ref([...mountProps.rows])`,
  ],
  template: [`  <TableDrag v-bind="mountProps" v-model="rows" row-key="id" />`],
});

;
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.tableDrag.when") }}</p>
    <DemoBlock
      :title="t('example.doc.tableDrag.demo.basic')"
      :description="t('example.doc.tableDrag.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <TableDrag v-bind="mountProps" v-model="rows" row-key="id" />
    </DemoBlock>
</div>
</template>
