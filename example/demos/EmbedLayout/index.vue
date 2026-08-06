<script setup lang="ts">
/**
 * Curated demo — Layout wave2 EmbedLayout
 */
import { computed, ref } from "vue";
import { EmbedLayout, Button, Space } from "@amg-webui/components/base";
import { useLocale } from "@amg-webui/hooks";
import { LocaleKeys } from "@amg-webui/locale";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoCode, demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();
const ratio = ref("16 / 9");
const fill = ref(false);
const bordered = ref(true);

const codeBasic = demoSfc({
  imports: [`import { EmbedLayout } from '@amg-webui/components/base'`],
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

const propRows = computed<PropRow[]>(() => [
  {
    name: "aspectRatio / fill",
    type: "string / boolean",
    defaultValue: "'16 / 9' / false",
    description: t("example.doc.embedLayout.prop.ratio"),
  },
  {
    name: "rounded / bordered / objectFit",
    type: "boolean / fit",
    defaultValue: "true / true / cover",
    description: t("example.doc.embedLayout.prop.chrome"),
  },
  {
    name: "interactive / disabled / loading",
    type: "boolean",
    defaultValue: "false / false / false",
    description: t("example.doc.embedLayout.prop.chrome"),
  },
  {
    name: "caption / frame-click",
    type: "string / event",
    defaultValue: "—",
    description: t("example.doc.embedLayout.prop.ratio"),
  },
]);
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
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

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
