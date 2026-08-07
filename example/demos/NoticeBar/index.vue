<script setup lang="ts">
/**
 * Curated demo — Display wave2 NoticeBar
 */
import { ref } from 'vue'
import { NoticeBar, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const closed = ref(false)

const codeBasic = demoSfc({
  imports: [`import { NoticeBar } from '@amg-webui/core'`],
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
</style>
