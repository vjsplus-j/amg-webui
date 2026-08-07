<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Popover
 */
import { ref } from 'vue'
import { Popover } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const controlled = ref(false)

const codeBasic = demoSfc({
  imports: [`import { Popover } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`],
  template: [
    `  <Popover :title="t('example.doc.popover.sample.title')">`,
    `    <template #trigger>`,
    `      <Button :label="t('example.doc.popover.sample.trigger')" />`,
    `    </template>`,
    `    {{ t('example.doc.popover.sample.body') }}`,
    `  </Popover>`
  ]
})

const codeControlled = demoCode(
  `<Popover v-model:visible="open" :title="t('example.doc.popover.sample.title')">`,
  `  <template #trigger>`,
  `    <Button :label="t('example.doc.popover.sample.trigger')" />`,
  `  </template>`,
  `  {{ t('example.doc.popover.sample.body') }}`,
  `</Popover>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.popover.demo.basic')"
      :description="t('example.doc.popover.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Popover :title="t('example.doc.popover.sample.title')">
          <template #trigger>
            <Button :label="t('example.doc.popover.sample.trigger')" />
          </template>
          {{ t('example.doc.popover.sample.body') }}
        </Popover>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.popover.demo.controlled')"
      :description="t('example.doc.popover.demo.controlledDesc')"
      :code="codeControlled"
    >
      <div class="vp-curated__row">
        <Space>
          <Popover
            v-model:visible="controlled"
            :title="t('example.doc.popover.sample.title')"
          >
            <template #trigger>
              <Button
                variant="outlined"
                :label="t('example.doc.popover.sample.trigger')"
              />
            </template>
            {{ t('example.doc.popover.sample.body') }}
          </Popover>
          <Button
            size="sm"
            variant="text"
            :label="t('example.doc.popover.sample.close')"
            @click="controlled = false"
          />
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

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
