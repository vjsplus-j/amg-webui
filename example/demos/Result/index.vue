<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Result
 */
import {  } from 'vue';
import { Result, Button } from '@amg-webui/core';
import type { ResultStatus } from "@amg-webui/core/Result/types";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import "../../components/demo/curatedDemo.scss";

const { t, tDyn } = useLocale();
const statuses = [
  "success",
  "warning",
  "error",
  "info",
] as const satisfies readonly ResultStatus[];
const subKey: Record<(typeof statuses)[number], string> = {
  success: "example.doc.result.sample.sub",
  warning: "example.doc.result.sample.subWarning",
  error: "example.doc.result.sample.subError",
  info: "example.doc.result.sample.subInfo",
};

const codeBasic = demoSfc({
  imports: [`import { Result, Button } from '@amg-webui/core'`],
  template: [
    `  <Result status="success" :sub-title="t('example.doc.result.sample.sub')">`,
    `    <template #extra>`,
    `      <Button size="sm" severity="primary">{{ t('button.continue') }}</Button>`,
    `    </template>`,
    `  </Result>`,
  ],
});

const codeStatus = demoCode(
  `<Result status="success" :sub-title="t('example.doc.result.sample.sub')" />`,
  `<Result status="warning" :sub-title="t('example.doc.result.sample.subWarning')" />`,
  `<Result status="error" :sub-title="t('example.doc.result.sample.subError')" />`,
  `<Result status="info" :sub-title="t('example.doc.result.sample.subInfo')" />`,
);

;

;

;
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.result.demo.basic')"
      :description="t('example.doc.result.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Result
          status="success"
          :sub-title="t('example.doc.result.sample.sub')"
        >
          <template #extra>
            <Button size="sm" variant="solid" severity="primary">
              {{ t(LocaleKeys.button.continue) }}
            </Button>
          </template>
        </Result>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.result.demo.status')"
      :description="t('example.doc.result.demo.statusDesc')"
      :code="codeStatus"
    >
      <div class="vp-curated__grid">
        <Result
          v-for="st in statuses"
          :key="st"
          :status="st"
          :sub-title="tDyn(subKey[st])"
        />
      </div>
    </DemoBlock>
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
  justify-content: center;
}

.vp-curated__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
