<script setup lang="ts">
import { computed, ref } from 'vue';
import { VcrStorageDashboard } from '@amg-webui/media';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoSfc } from "../../components/demo/demoCode";
import { getSampleMountProps } from "../_shared/sampleMountProps";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

const mountProps = computed(() => getSampleMountProps("VcrStorageDashboard"));
const selectedId = ref<string | null>(null);

const codeBasic = demoSfc({
  imports: [
    `import { VcrStorageDashboard } from '@amg-webui/media'`,
    `import { getSampleMountProps } from '../_shared/sampleMountProps'`,
  ],
  script: [`const mountProps = getSampleMountProps('VcrStorageDashboard')`],
  template: [`  <VcrStorageDashboard v-bind="mountProps" />`],
});

;
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">
      {{ t("example.doc.vcrStorageDashboard.when") }}
    </p>
    <DemoBlock
      :title="t('example.doc.vcrStorageDashboard.demo.basic')"
      :description="t('example.doc.vcrStorageDashboard.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <VcrStorageDashboard
        v-bind="mountProps"
        v-model:selected-id="selectedId"
      />
    </DemoBlock>
</div>
</template>
