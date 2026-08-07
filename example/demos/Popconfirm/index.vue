<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Popconfirm
 */
import { ref } from 'vue'
import { Popconfirm, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const confirmed = ref(false)

function onConfirm() {
  confirmed.value = true
  window.setTimeout(() => {
    confirmed.value = false
  }, 2000)
}

const codeBasic = demoSfc({
  imports: [`import { Popconfirm, Button } from '@amg-webui/core'`],
  template: [
    `  <Popconfirm :title="t('example.doc.popconfirm.sample.title')">`,
    `    <template #trigger>`,
    `      <Button severity="danger" :label="t('example.doc.popconfirm.sample.trigger')" />`,
    `    </template>`,
    `  </Popconfirm>`
  ]
})

const codeEvent = demoSfc({
  imports: [`import { Popconfirm, Button } from '@amg-webui/core'`],
  script: [`function onConfirm() { /* handle confirm */ }`],
  template: [
    `  <Popconfirm :title="t('example.doc.popconfirm.sample.title')" @confirm="onConfirm">`,
    `    <template #trigger>`,
    `      <Button severity="danger" :label="t('example.doc.popconfirm.sample.trigger')" />`,
    `    </template>`,
    `  </Popconfirm>`
  ]
})

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.popconfirm.demo.basic')"
      :description="t('example.doc.popconfirm.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Popconfirm :title="t('example.doc.popconfirm.sample.title')">
          <template #trigger>
            <Button
              severity="danger"
              :label="t('example.doc.popconfirm.sample.trigger')"
            />
          </template>
        </Popconfirm>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.popconfirm.demo.event')"
      :description="t('example.doc.popconfirm.demo.eventDesc')"
      :code="codeEvent"
    >
      <div class="vp-curated__row">
        <Space>
          <Popconfirm
            :title="t('example.doc.popconfirm.sample.title')"
            @confirm="onConfirm"
          >
            <template #trigger>
              <Button
                severity="danger"
                :label="t('example.doc.popconfirm.sample.trigger')"
              />
            </template>
          </Popconfirm>
          <span v-if="confirmed" class="vp-curated__hint">
            {{ t('example.doc.popconfirm.sample.confirmed') }}
          </span>
        </Space>
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
}

.vp-curated__hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
