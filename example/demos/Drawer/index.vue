<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Drawer
 */
import { ref } from 'vue'
import { Drawer } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from '@amg-webui/demos/drawer/Basic.vue'
import basicSource from '@amg-webui/demos/drawer/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const leftOpen = ref(false)
const rightOpen = ref(false)

const codePlacement = demoCode(
  `<Button :label="t('example.doc.drawer.sample.openLeft')" @click="leftOpen = true" />`,
  `<Button :label="t('example.doc.drawer.sample.openRight')" @click="rightOpen = true" />`,
  `<Drawer v-model:visible="leftOpen" placement="left" :title="t('example.doc.drawer.sample.title')">`,
  `  {{ t('example.doc.drawer.sample.body') }}`,
  `</Drawer>`,
  `<Drawer v-model:visible="rightOpen" placement="right" :title="t('example.doc.drawer.sample.title')">`,
  `  {{ t('example.doc.drawer.sample.body') }}`,
  `</Drawer>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.drawer.demo.basic')"
      :description="t('example.doc.drawer.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.drawer.demo.placement')"
      :description="t('example.doc.drawer.demo.placementDesc')"
      :code="codePlacement"
    >
      <div class="vp-curated__row">
        <Space>
          <Button
            variant="outlined"
            :label="t('example.doc.drawer.sample.openLeft')"
            @click="leftOpen = true"
          />
          <Button
            variant="outlined"
            :label="t('example.doc.drawer.sample.openRight')"
            @click="rightOpen = true"
          />
        </Space>
        <Drawer
          v-model:visible="leftOpen"
          placement="left"
          :title="t('example.doc.drawer.sample.title')"
        >
          {{ t('example.doc.drawer.sample.body') }}
        </Drawer>
        <Drawer
          v-model:visible="rightOpen"
          placement="right"
          :title="t('example.doc.drawer.sample.title')"
        >
          {{ t('example.doc.drawer.sample.body') }}
        </Drawer>
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
