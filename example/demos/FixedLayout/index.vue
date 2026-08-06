<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Avatar,
  Button,
  Card,
  FixedLayout,
  Icon,
  InputText,
  Space,
  Tag,
} from "@amg-webui/components/base";
import { useLocale } from "@amg-webui/hooks";
import DemoBlock from "../../components/demo/DemoBlock.vue";
import PropsTable from "../../components/demo/PropsTable.vue";
import { demoSfc } from "../../components/demo/demoCode";
import type { PropRow } from "../../components/demo/types";
import "../../components/demo/curatedDemo.scss";

const { t } = useLocale();

type NavId = "home" | "docs" | "users" | "settings";

const side = ref<"left" | "right">("left");
const nav = ref<NavId>("home");
const query = ref("");

const navItems = computed(() =>
  (
    [
      {
        id: "home" as const,
        icon: "LayoutDashboard",
        labelKey: "example.doc.fixedLayout.nav.home",
      },
      {
        id: "docs" as const,
        icon: "FileText",
        labelKey: "example.doc.fixedLayout.nav.docs",
      },
      {
        id: "users" as const,
        icon: "User",
        labelKey: "example.doc.fixedLayout.nav.users",
      },
      {
        id: "settings" as const,
        icon: "Settings",
        labelKey: "example.doc.fixedLayout.nav.settings",
      },
    ] as const
  ).map((item) => ({ ...item, label: t(item.labelKey) })),
);

const codeBasic = demoSfc({
  imports: [`import { FixedLayout, Button } from '@amg-webui/components/base'`],
  template: [
    '  <div class="frame frame--top">',
    '    <FixedLayout mode="absolute" position="top">',
    '      <div class="toolbar">',
    `        <span>{{ t('example.doc.fixedLayout.sample.top') }}</span>`,
    `        <Button size="sm">{{ t('example.doc.fixedLayout.sample.action') }}</Button>`,
    "      </div>",
    "    </FixedLayout>",
    '    <div class="body">…</div>',
    "  </div>",
  ],
});

const codeSide = demoSfc({
  imports: [
    `import { FixedLayout, Button, Icon } from '@amg-webui/components/base'`,
  ],
  template: [
    '  <div class="frame frame--left">',
    '    <FixedLayout mode="absolute" position="left">',
    '      <nav class="rail">',
    '        <Button variant="text" @click="nav = \'home\'">',
    '          <Icon name="LayoutDashboard" size="sm" />',
    "          {{ label }}",
    "        </Button>",
    "      </nav>",
    "    </FixedLayout>",
    '    <div class="body">…</div>',
    "  </div>",
  ],
});

const codeShell = demoSfc({
  imports: [
    `import { FixedLayout, Button, Icon, InputText, Card, Tag, Avatar } from '@amg-webui/components/base'`,
  ],
  template: [
    '  <div class="shell">',
    '    <FixedLayout mode="absolute" position="top">…header…</FixedLayout>',
    '    <div class="shell__row">',
    '      <FixedLayout mode="absolute" position="left">…rail…</FixedLayout>',
    '      <main class="body">…cards…</main>',
    "    </div>",
    "  </div>",
  ],
});

const codeFooter = demoSfc({
  imports: [`import { FixedLayout, Button } from '@amg-webui/components/base'`],
  template: [
    '  <div class="frame frame--bottom">',
    '    <div class="body">…</div>',
    '    <FixedLayout mode="absolute" position="bottom">',
    '      <div class="toolbar toolbar--footer">',
    `        <span>{{ t('example.doc.fixedLayout.sample.bottom') }}</span>`,
    `        <Button size="sm">{{ t('example.doc.fixedLayout.sample.action') }}</Button>`,
    "      </div>",
    "    </FixedLayout>",
    "  </div>",
  ],
});

const propRows = computed<PropRow[]>(() => [
  {
    name: "mode",
    type: "'fixed'|'absolute'",
    defaultValue: "'fixed'",
    description: t("example.doc.fixedLayout.prop.mode"),
  },
  {
    name: "position / offset",
    type: "edge / spacing",
    defaultValue: "'top' / 'none'",
    description: t("example.doc.fixedLayout.prop.position"),
  },
  {
    name: "placeholder / safeArea",
    type: "boolean",
    defaultValue: "true / false",
    description: t("example.doc.fixedLayout.prop.placeholder"),
  },
  {
    name: "as / teleportTo / ariaLabel",
    type: "element / target / string",
    defaultValue: "'div' / — / —",
    description: t("example.doc.fixedLayout.prop.mode"),
  },
  {
    name: "resize",
    type: "(size) => void",
    defaultValue: "—",
    description: t("example.doc.fixedLayout.prop.placeholder"),
  },
]);
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t("example.doc.fixedLayout.when") }}</p>

    <!-- 1. Header only -->
    <DemoBlock
      :title="t('example.doc.fixedLayout.demo.basic')"
      :description="t('example.doc.fixedLayout.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="frame frame--top">
        <FixedLayout
          mode="absolute"
          position="top"
          offset="none"
          class="chrome"
        >
          <div class="toolbar">
            <span class="toolbar__title">{{
              t("example.doc.fixedLayout.sample.top")
            }}</span>
            <Space>
              <Button size="sm" variant="outlined">{{
                t("example.doc.fixedLayout.sample.more")
              }}</Button>
              <Button size="sm">{{
                t("example.doc.fixedLayout.sample.action")
              }}</Button>
            </Space>
          </div>
        </FixedLayout>
        <div class="body">
          <p v-for="n in 5" :key="n" class="body__p">
            {{ t("example.doc.fixedLayout.sample.footerLine", { n }) }}
          </p>
        </div>
      </div>
    </DemoBlock>

    <!-- 2. Side rail -->
    <DemoBlock
      :title="t('example.doc.fixedLayout.demo.side')"
      :description="t('example.doc.fixedLayout.demo.sideDesc')"
      :code="codeSide"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="side === 'left' ? 'solid' : 'outlined'"
            @click="side = 'left'"
          >
            left
          </Button>
          <Button
            size="sm"
            :variant="side === 'right' ? 'solid' : 'outlined'"
            @click="side = 'right'"
          >
            right
          </Button>
        </Space>
        <div class="frame" :class="`frame--${side}`">
          <template v-if="side === 'left'">
            <FixedLayout
              mode="absolute"
              position="left"
              offset="none"
              class="chrome"
            >
              <nav
                class="rail"
                :aria-label="t('example.doc.fixedLayout.sample.side')"
              >
                <Button
                  v-for="item in navItems"
                  :key="item.id"
                  size="sm"
                  :variant="nav === item.id ? 'solid' : 'text'"
                  class="rail__item"
                  @click="nav = item.id"
                >
                  <Icon :name="item.icon" size="sm" />
                  <span>{{ item.label }}</span>
                </Button>
              </nav>
            </FixedLayout>
            <div class="body">
              <p class="body__lead">
                {{
                  t("example.doc.fixedLayout.sample.sideBody", {
                    name: t(`example.doc.fixedLayout.nav.${nav}`),
                  })
                }}
              </p>
              <p v-for="n in 4" :key="n" class="body__p">
                {{ t("example.doc.fixedLayout.sample.body") }}
              </p>
            </div>
          </template>
          <template v-else>
            <div class="body">
              <p class="body__lead">
                {{
                  t("example.doc.fixedLayout.sample.sideBody", {
                    name: t(`example.doc.fixedLayout.nav.${nav}`),
                  })
                }}
              </p>
              <p v-for="n in 4" :key="n" class="body__p">
                {{ t("example.doc.fixedLayout.sample.body") }}
              </p>
            </div>
            <FixedLayout
              mode="absolute"
              position="right"
              offset="none"
              class="chrome"
            >
              <nav
                class="rail rail--end"
                :aria-label="t('example.doc.fixedLayout.sample.side')"
              >
                <Button
                  v-for="item in navItems"
                  :key="item.id"
                  size="sm"
                  :variant="nav === item.id ? 'solid' : 'text'"
                  class="rail__item"
                  @click="nav = item.id"
                >
                  <Icon :name="item.icon" size="sm" />
                  <span>{{ item.label }}</span>
                </Button>
              </nav>
            </FixedLayout>
          </template>
        </div>
      </Space>
    </DemoBlock>

    <!-- 3. Shell: header + rail + components -->
    <DemoBlock
      :title="t('example.doc.fixedLayout.demo.shell')"
      :description="t('example.doc.fixedLayout.demo.shellDesc')"
      :code="codeShell"
    >
      <div class="shell">
        <FixedLayout
          mode="absolute"
          position="top"
          offset="none"
          class="chrome"
        >
          <div class="toolbar">
            <Space>
              <Icon name="PanelLeft" size="sm" />
              <span class="toolbar__title">{{
                t("example.doc.fixedLayout.sample.brand")
              }}</span>
            </Space>
            <Space>
              <InputText
                v-model="query"
                size="sm"
                :placeholder="t('example.doc.fixedLayout.sample.searchPh')"
                class="toolbar__search"
              />
              <Button
                size="sm"
                variant="outlined"
                shape="circle"
                icon="Bell"
                :aria-label="t('example.doc.fixedLayout.sample.notify')"
              />
              <Avatar size="sm" text="AM" />
            </Space>
          </div>
        </FixedLayout>
        <div class="shell__row">
          <FixedLayout
            mode="absolute"
            position="left"
            offset="none"
            class="chrome"
          >
            <nav
              class="rail"
              :aria-label="t('example.doc.fixedLayout.sample.side')"
            >
              <Button
                v-for="item in navItems"
                :key="item.id"
                size="sm"
                :variant="nav === item.id ? 'solid' : 'text'"
                class="rail__item"
                @click="nav = item.id"
              >
                <Icon :name="item.icon" size="sm" />
                <span>{{ item.label }}</span>
              </Button>
            </nav>
          </FixedLayout>
          <div class="body body--stack">
            <Space wrap>
              <Tag severity="primary">{{
                t(`example.doc.fixedLayout.nav.${nav}`)
              }}</Tag>
              <Tag v-if="query" severity="info">{{ query }}</Tag>
            </Space>
            <Card>
              <Space direction="vertical" block size="md">
                <p class="body__lead">
                  {{ t("example.doc.fixedLayout.sample.cardTitle") }}
                </p>
                <p class="body__p">
                  {{ t("example.doc.fixedLayout.sample.cardBody") }}
                </p>
                <Space>
                  <Button size="sm">{{
                    t("example.doc.fixedLayout.sample.action")
                  }}</Button>
                  <Button size="sm" variant="outlined">{{
                    t("example.doc.fixedLayout.sample.more")
                  }}</Button>
                </Space>
              </Space>
            </Card>
            <Card>
              <Space>
                <Avatar size="md" text="JD" />
                <div>
                  <p class="body__lead">
                    {{ t("example.doc.fixedLayout.sample.userName") }}
                  </p>
                  <p class="body__p">
                    {{ t("example.doc.fixedLayout.sample.userMeta") }}
                  </p>
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- 4. Bottom action bar -->
    <DemoBlock
      :title="t('example.doc.fixedLayout.demo.footer')"
      :description="t('example.doc.fixedLayout.demo.footerDesc')"
      :code="codeFooter"
    >
      <div class="frame frame--bottom">
        <div class="body">
          <p v-for="n in 5" :key="n" class="body__p">
            {{ t("example.doc.fixedLayout.sample.footerLine", { n }) }}
          </p>
        </div>
        <FixedLayout
          mode="absolute"
          position="bottom"
          offset="none"
          class="chrome"
        >
          <div class="toolbar toolbar--footer">
            <span class="toolbar__title">{{
              t("example.doc.fixedLayout.sample.bottom")
            }}</span>
            <Button size="sm">{{
              t("example.doc.fixedLayout.sample.action")
            }}</Button>
          </div>
        </FixedLayout>
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  display: flex;
  width: 100%;
  height: calc(var(--spacing-2xl) * 10);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  box-sizing: border-box;
}

.frame--top,
.frame--bottom {
  flex-direction: column;
}

.frame--left,
.frame--right {
  flex-direction: row;
  align-items: stretch;
}

.shell {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(var(--spacing-2xl) * 12);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  box-sizing: border-box;
}

.shell__row {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: row;
  align-items: stretch;
}

.chrome {
  z-index: 2;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  width: 100%;
  min-height: var(--height-md);
  padding: var(--spacing-sm) var(--spacing-md);
  box-sizing: border-box;
  background: var(--surface-2);
  border-bottom: 1px solid var(--ds-border);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.toolbar--footer {
  border-bottom: none;
  border-top: 1px solid var(--ds-border);
}

.toolbar__title {
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
}

.toolbar__search {
  width: calc(var(--spacing-2xl) * 6);
  max-width: 100%;
}

.rail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: calc(var(--spacing-2xl) * 5);
  height: 100%;
  min-height: 100%;
  padding: var(--spacing-md);
  box-sizing: border-box;
  background: var(--surface-2);
  border-inline-end: 1px solid var(--ds-border);
}

.rail--end {
  border-inline-end: none;
  border-inline-start: 1px solid var(--ds-border);
}

.rail__item {
  justify-content: flex-start;
  width: 100%;
  gap: var(--spacing-sm);
}

.body {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: var(--theme-card-pad);
  background: var(--surface-0);
}

.body--stack {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.body__lead {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-body);
}

.body__p {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.body__p:last-child {
  margin-bottom: 0;
}
</style>
