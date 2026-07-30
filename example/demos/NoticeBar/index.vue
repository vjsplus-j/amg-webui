<script setup lang="ts">
/**
 * Curated demo — Display wave2 NoticeBar
 */
import { computed, ref } from 'vue'
import { NoticeBar, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const closed = ref(false)

const codeBasic = demoSfc({
  imports: [`import { NoticeBar } from '@amg-webui/components/base'`],
  template: [
    `  <NoticeBar`,
    `    :message="t('example.doc.noticeBar.sample.message')"`,
    `    severity="info"`,
    `  />`
  ]
})

const codeScroll = demoCode(
  `<NoticeBar`,
  `  :message="t('example.doc.noticeBar.sample.message')"`,
  `  severity="warning"`,
  `  scrollable`,
  `  closable`,
  `  @close="closed = true"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'message',
    description: t('example.doc.noticeBar.prop.message'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'severity',
    description: t('example.doc.noticeBar.prop.severity'),
    type: 'Severity',
    defaultValue: "'info'"
  },
  {
    name: 'scrollable / closable',
    description: t('example.doc.noticeBar.prop.scrollable'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'close / click',
    description: t('example.doc.noticeBar.event.close'),
    type: '() => void / (event: MouseEvent) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.noticeBar.demo.basic')"
      :description="t('example.doc.noticeBar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <NoticeBar
        :message="t('example.doc.noticeBar.sample.message')"
        severity="info"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.noticeBar.demo.scroll')"
      :description="t('example.doc.noticeBar.demo.scrollDesc')"
      :code="codeScroll"
    >
      <Space direction="vertical" block size="md">
        <NoticeBar
          v-if="!closed"
          :message="t('example.doc.noticeBar.sample.message')"
          severity="warning"
          scrollable
          closable
          @close="closed = true"
        />
        <p v-else class="vp-noticebar-demo__hint">
          {{ t('example.doc.noticeBar.sample.closed') }}
        </p>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-noticebar-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
