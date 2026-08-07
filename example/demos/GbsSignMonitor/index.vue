<script setup lang="ts">
import { computed, ref } from 'vue';
import { GbsSignMonitor } from '@amg-webui/gb28181';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoSfc } from "../../components/demo/demoCode";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
type DemoSignEntry = {
  id: string;
  type: string;
  message: string;
  time: string;
  direction?: "in" | "out";
  status?: string | number;
};

const mountProps = computed(() => getSampleMountProps("GbsSignMonitor"));
const logs = ref(mountProps.value.logs as DemoSignEntry[]);

const codeBasic = demoSfc({
  imports: [
    `import { GbsSignMonitor } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [`const mountProps = getSampleMountProps('GbsSignMonitor')`],
  template: [`  <GbsSignMonitor v-bind="mountProps" />`],
});

;
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.gbsSignMonitor.when") }}</p>
    <DemoBlock
      :title="t('example.doc.gbsSignMonitor.demo.basic')"
      :description="t('example.doc.gbsSignMonitor.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <GbsSignMonitor v-bind="mountProps" v-model:logs="logs" />
    </DemoBlock>
</div>
</template>
