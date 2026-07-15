<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Avatar,
  Button,
  Card,
  Collapse,
  Progress,
  Space,
  Tag
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()
const open = ref('a')
const multi = ref(['a', 'b'])
const cardOpen = ref('profile')

const panels = computed(() => [
  {
    key: 'a',
    title: t('example.doc.collapse.sample.panelA'),
    content: t('example.doc.collapse.sample.bodyA')
  },
  {
    key: 'b',
    title: t('example.doc.collapse.sample.panelB'),
    content: t('example.doc.collapse.sample.bodyB')
  },
  {
    key: 'c',
    title: t('example.doc.collapse.sample.panelC'),
    content: t('example.doc.collapse.sample.bodyC'),
    disabled: true
  }
])

const propRows = computed<PropRow[]>(() => [
  {
    name: 'panels',
    description: t('example.doc.collapse.prop.panels'),
    type: 'CollapsePanel[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.collapse.prop.model'),
    type: 'string | string[]',
    defaultValue: '-'
  },
  {
    name: 'accordion',
    description: t('example.doc.collapse.prop.accordion'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'bordered / ghost',
    description: t('example.doc.collapse.prop.chrome'),
    type: 'boolean',
    defaultValue: 'true / false'
  },
  {
    name: '@change',
    description: t('example.doc.collapse.emit.change'),
    type: '(value: string | string[]) => void',
    defaultValue: '-'
  },
  {
    name: '@expand / @collapse',
    description: t('example.doc.collapse.emit.expand'),
    type: '(payload: { key; activeKeys }) => void',
    defaultValue: '-'
  }
])

const codeBasic = `<Collapse v-model="open" :panels="panels" />`
const codeGhost = `<Collapse ghost :accordion="false" :panels="…" />`
const codeCards = `<Collapse v-model="open">
  <template #profile>
    <Card>… Avatar / Tag / Button …</Card>
  </template>
  <template #progress>
    <Card>… Progress …</Card>
  </template>
</Collapse>`
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.collapse.demo.basic')"
      :description="t('example.doc.collapse.demo.basicDesc')"
      :code="codeBasic"
    >
      <Collapse v-model="open" :panels="panels" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.collapse.demo.ghost')"
      :description="t('example.doc.collapse.demo.ghostDesc')"
      :code="codeGhost"
    >
      <Collapse
        v-model="multi"
        ghost
        :accordion="false"
        :panels="panels.slice(0, 2)"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.collapse.demo.cards')"
      :description="t('example.doc.collapse.demo.cardsDesc')"
      :code="codeCards"
    >
      <Collapse
        v-model="cardOpen"
        :panels="[
          { key: 'profile', title: t('example.doc.collapse.sample.cardProfile') },
          { key: 'progress', title: t('example.doc.collapse.sample.cardProgress') },
          { key: 'actions', title: t('example.doc.collapse.sample.cardActions') },
          { key: 'metric', title: t('example.doc.collapse.sample.cardMetric') }
        ]"
      >
        <template #profile>
          <Card>
            <Space align="center" size="md">
              <Avatar text="VP" size="md" />
              <div class="vp-collapse-demo__meta">
                <strong>{{ t('example.doc.collapse.sample.userName') }}</strong>
                <span>{{ t('example.doc.collapse.sample.userRole') }}</span>
              </div>
              <Tag severity="success" size="sm">{{ t('example.doc.collapse.sample.online') }}</Tag>
            </Space>
            <template #footer>
              <Space>
                <Button size="sm" variant="outlined">{{ t('example.doc.collapse.sample.edit') }}</Button>
                <Button size="sm">{{ t('example.doc.collapse.sample.message') }}</Button>
              </Space>
            </template>
          </Card>
        </template>

        <template #progress>
          <Card :title="t('example.doc.collapse.sample.uploadTitle')">
            <Progress :percentage="68" />
            <Progress :percentage="42" status="warning" />
            <Progress type="circle" :percentage="88" status="success" />
          </Card>
        </template>

        <template #actions>
          <Card :header="t('example.doc.collapse.sample.quickActions')">
            <Space wrap>
              <Button size="sm" icon="Plus">{{ t('example.doc.collapse.sample.create') }}</Button>
              <Button size="sm" variant="outlined" icon="Upload">
                {{ t('example.doc.collapse.sample.import') }}
              </Button>
              <Button size="sm" variant="text" icon="Download">
                {{ t('example.doc.collapse.sample.export') }}
              </Button>
            </Space>
          </Card>
        </template>

        <template #metric>
          <Card raised skeleton="metric" :loading="false" :title="t('example.doc.collapse.sample.metricTitle')">
            <Space size="xl" wrap>
              <Avatar text="¥" size="lg" />
              <div class="vp-collapse-demo__metric">
                <span class="vp-collapse-demo__value">128,650</span>
                <span>{{ t('example.doc.collapse.sample.metricHint') }}</span>
              </div>
              <Button size="sm" variant="outlined">{{ t('example.doc.collapse.sample.detail') }}</Button>
            </Space>
          </Card>
        </template>
      </Collapse>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-collapse-demo__meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
  flex: 1 1 auto;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);

  strong {
    color: var(--text-primary);
    font-weight: var(--font-weight-heading, 600);
  }
}

.vp-collapse-demo__metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-collapse-demo__value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
</style>
