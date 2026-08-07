<script setup lang="ts">
/**
 * Curated demo — Layout wave2 EmbedLayout
 */
import { ref } from 'vue';
import { EmbedLayout, Button, Space } from '@amg-webui/core';
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const ratio = ref("16 / 9");
const fill = ref(false);
const bordered = ref(true);

const codeBasic = demoSfc({
  imports: [`import { EmbedLayout } from '@amg-webui/core'`],
  template: [
    '  <div class="embed-host">',
    '    <EmbedLayout aspect-ratio="16 / 9">',
    `      <span>{{ t('example.doc.embedLayout.sample.body') }}</span>`,
    "    </EmbedLayout>",
    "  </div>",
  ],
});

const codeFill = demoCode(
  `<EmbedLayout aspect-ratio="4 / 3" fill :bordered="bordered">`,
  `  <span>{{ t('example.doc.embedLayout.sample.body') }}</span>`,
  `</EmbedLayout>`,
);

;
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.embedLayout.demo.basic')"
      :description="t('example.doc.embedLayout.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="ratio === '16 / 9' ? 'solid' : 'outlined'"
            @click="ratio = '16 / 9'"
          >
            16:9
          </Button>
          <Button
            size="sm"
            :variant="ratio === '4 / 3' ? 'solid' : 'outlined'"
            @click="ratio = '4 / 3'"
          >
            4:3
          </Button>
          <Button
            size="sm"
            :variant="ratio === '1 / 1' ? 'solid' : 'outlined'"
            @click="ratio = '1 / 1'"
          >
            1:1
          </Button>
        </Space>
        <div class="embed-host">
          <EmbedLayout :aspect-ratio="ratio">
            <span class="label">{{
              t("example.doc.embedLayout.sample.body")
            }}</span>
          </EmbedLayout>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.embedLayout.demo.fill')"
      :description="t('example.doc.embedLayout.demo.fillDesc')"
      :code="codeFill"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="fill ? 'solid' : 'outlined'"
            @click="fill = !fill"
          >
            fill
          </Button>
          <Button
            size="sm"
            :variant="bordered ? 'solid' : 'outlined'"
            @click="bordered = !bordered"
          >
            {{ t("example.doc.embedLayout.sample.borderToggle") }}
          </Button>
        </Space>
        <EmbedLayout
          aspect-ratio="4 / 3"
          :fill="fill"
          :bordered="bordered"
          class="embed-full"
        >
          <span class="label">{{
            t("example.doc.embedLayout.sample.body")
          }}</span>
        </EmbedLayout>
      </Space>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.embed-host {
  width: 100%;
  max-width: calc(var(--spacing-2xl) * 10);
  min-width: 0;
}

.embed-full {
  width: 100%;
  min-width: 0;
}

.label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
