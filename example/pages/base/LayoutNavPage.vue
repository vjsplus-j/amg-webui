<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Card,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Steps,
  StepItem,
  Tabs,
  TabPane,
  Menu,
  Dropdown,
  Row,
  Col,
  Space,
  Split
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t, locale } = useLocale()
const tab = ref('a')
const step = ref(1)
const menuVal = ref('a')
const splitSize = ref(45)

const menuItems = computed(() => {
  void locale.value
  return [
    { label: t(LocaleKeys.nav.base), value: 'a' },
    { label: t(LocaleKeys.nav.biz), value: 'b' },
    { label: t(LocaleKeys.nav.theme), value: 'c' }
  ]
})
</script>

<template>
  <ComponentGallery
    zone="layout"
    title-key="page.base.layout.title"
    lead-key="page.base.layout.lead"
  >
    <template #featured>
      <Card>
        <div class="stack">
          <Breadcrumb>
            <BreadcrumbItem>{{ t(LocaleKeys.nav.overview) }}</BreadcrumbItem>
            <BreadcrumbItem>{{ t(LocaleKeys.nav.base) }}</BreadcrumbItem>
            <BreadcrumbItem>{{ t('page.base.layout.title') }}</BreadcrumbItem>
          </Breadcrumb>
          <Tabs v-model="tab">
            <TabPane name="a" :label="t(LocaleKeys.common.optional)">{{ t('page.base.layout.c1') }}</TabPane>
            <TabPane name="b" :label="t(LocaleKeys.common.actions)">{{ t('page.base.layout.c2') }}</TabPane>
          </Tabs>
          <Steps :active="step">
            <StepItem :title="t(LocaleKeys.button.create)" />
            <StepItem :title="t(LocaleKeys.button.edit)" />
            <StepItem :title="t(LocaleKeys.button.submit)" />
          </Steps>
          <div class="row">
            <Button size="sm" variant="outlined" :disabled="step <= 0" @click="step--">
              {{ t(LocaleKeys.button.cancel) }}
            </Button>
            <Button size="sm" :disabled="step >= 2" @click="step++">
              {{ t(LocaleKeys.button.continue) }}
            </Button>
            <Dropdown v-model="menuVal" :items="menuItems" />
          </div>
          <Row gutter="var(--spacing-md)">
            <Col :span="8"><Menu v-model="menuVal" :items="menuItems" /></Col>
            <Col :span="16">
              <Space>
                <span>{{ t(LocaleKeys.nav.base) }}</span>
                <span>{{ t(LocaleKeys.nav.biz) }}</span>
              </Space>
              <Split v-model:size="splitSize" class="split">
                <template #first><div class="pane">A</div></template>
                <template #second><div class="pane">B</div></template>
              </Split>
            </Col>
          </Row>
        </div>
      </Card>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.split {
  margin-top: var(--spacing-md);
  min-height: 8rem;
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--border-radius-md);
}

.pane {
  padding: var(--spacing-md);
  height: 100%;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
