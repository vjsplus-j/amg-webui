<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from '@amg-webui/core'
import { GbsAlarmModal } from '@amg-webui/gb28181';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const mountProps = computed(() => getSampleMountProps("GbsAlarmModal"));
const open = ref(true);

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { GbsAlarmModal } from '@amg-webui/gb28181'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [
    `const mountProps = getSampleMountProps('GbsAlarmModal')`,
    `const open = ref(true)`,
  ],
  template: [`  <GbsAlarmModal v-bind="mountProps" v-model:open="open" />`],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "class / style",
    type: "BaseProps",
    description: t("example.doc.gbsAlarmModal.prop.base"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.gbsAlarmModal.when") }}</p>
    <DemoBlock
      :title="t('example.doc.gbsAlarmModal.demo.basic')"
      :description="t('example.doc.gbsAlarmModal.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Button @click="open = true">
        {{ t("button.confirm") }}
      </Button>
      <GbsAlarmModal
        v-bind="mountProps"
        :open="open"
        @update:open="open = $event"
      />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
