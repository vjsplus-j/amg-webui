<script setup lang="ts">
/**
 * Layout lab — interactive playground for all catalog layout components.
 * Individual /base/:name pages use curated demos; this page is the zone hub.
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Block, Button, Card, CardGrid, Center, Col, ColumnLayout, Container, EmbedLayout, FixedLayout, FlowLayout, FormLayout, Layout, Main, Header, Footer, Menu, ResizeBox, Row, ScaleLayout, Sider, Space, Spacer, Split, StackLayout, Tag, TabsNav, TopNav, Breadcrumb } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { Dropdown } from '@amg-webui/overlay'
import type { MenuItem } from '@amg-webui/core/Menu'
import type { NavItem } from '@amg-webui/utils/nav'
import type { BreadcrumbItemData } from '@amg-webui/core/Breadcrumb'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t, locale } = useLocale()
const router = useRouter()

const collapsed = ref(false)
const active = ref('home')
const openKeys = ref(['more'])
const tab = ref('overview')
const splitSize = ref<number | string>('42%')
const splitDir = ref<'horizontal' | 'vertical'>('horizontal')
const boxW = ref(220)
const boxH = ref(120)
const rowMode = ref<'thirds' | 'half' | 'aside'>('thirds')
const stackDir = ref<'vertical' | 'horizontal'>('horizontal')
const columns = ref(3)
const flowCount = ref(5)
const formName = ref('')
const pin = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

const rowSpans = computed(() => {
  if (rowMode.value === 'half') return [12, 12]
  if (rowMode.value === 'aside') return [6, 18]
  return [8, 8, 8]
})

const menuItems = computed<MenuItem[]>(() => {
  void locale.value
  return [
    { key: 'home', label: t('example.doc.layout.sample.home'), icon: 'House' },
    { key: 'docs', label: t('example.doc.layout.sample.docs'), icon: 'BookOpen' },
    {
      key: 'more',
      label: t('example.doc.layout.sample.more'),
      icon: 'Folder',
      children: [
        { key: 'a', label: t('example.doc.layout.sample.itemA') },
        { key: 'b', label: t('example.doc.layout.sample.itemB') }
      ]
    }
  ]
})

const tabItems = computed(() => [
  { name: 'overview', label: t('example.doc.layout.sample.tabOverview'), closable: true },
  { name: 'detail', label: t('example.doc.layout.sample.tabDetail'), closable: true }
])

const topNavActive = ref<string | number>('home')
const dropdownActive = ref<string | number>('edit')

const topNavItems = computed<NavItem[]>(() => {
  void locale.value
  return [
    { label: t('example.doc.topNav.sample.home'), value: 'home' },
    { label: t('example.doc.topNav.sample.docs'), value: 'docs' },
    { label: t('example.doc.topNav.sample.lab'), value: 'lab' }
  ]
})

const dropdownItems = computed<NavItem[]>(() => {
  void locale.value
  return [
    { label: t('example.doc.dropdown.sample.edit'), value: 'edit' },
    { label: t('example.doc.dropdown.sample.duplicate'), value: 'duplicate' },
    { label: t('example.doc.dropdown.sample.delete'), value: 'delete' }
  ]
})

const crumbItems = computed<BreadcrumbItemData[]>(() => {
  void locale.value
  return [
    { label: t('example.doc.breadcrumb.sample.home'), href: '#', icon: 'House' },
    { label: t('example.doc.breadcrumb.sample.list'), href: '#' },
    { label: t('example.doc.breadcrumb.sample.detail') }
  ]
})

function openDoc(name: string) {
  router.push({ name: 'base-component', params: { name } })
}

function onResize(p: { width: number; height: number }) {
  boxW.value = p.width
  boxH.value = p.height
}
</script>

<template>
  <ComponentGallery
    zone="layout"
    title-key="page.base.layout.title"
    lead-key="page.base.layout.lead"
    link-to-doc
    preview-mode="link"
  >
    <template #featured>
      <div class="lab">
        <Card>
          <template #header>{{ t('example.doc.layout.demo.shell') }}</template>
          <Layout has-sider class="lab-shell">
            <Sider v-model:collapsed="collapsed" collapsible>
              <template #header>{{ t('example.doc.layout.sample.brand') }}</template>
              <Menu
                v-model="active"
                v-model:open-keys="openKeys"
                :items="menuItems"
                :collapsed="collapsed"
              />
            </Sider>
            <Layout>
              <Header>
                <template #title>{{ t('example.doc.layout.sample.title') }}</template>
                <template #extra>
                  <Button size="sm" variant="outlined" @click="openDoc('Layout')">Layout</Button>
                </template>
              </Header>
              <TabsNav v-model="tab" :items="tabItems" closable />
              <Main>
                <p class="muted">{{ t('example.doc.layout.sample.content') }}</p>
              </Main>
              <Footer>{{ t(LocaleKeys.chrome.brandFoot) }}</Footer>
            </Layout>
          </Layout>
        </Card>

        <Card>
          <template #header>{{ t('example.doc.topNav.when') }}</template>
          <Space direction="vertical" block size="md">
            <Breadcrumb :items="crumbItems" />
            <TopNav v-model="topNavActive" :items="topNavItems" />
            <Space wrap>
              <Dropdown v-model="dropdownActive" :items="dropdownItems">
                <template #trigger>{{ t('example.doc.dropdown.sample.trigger') }}</template>
              </Dropdown>
              <Button size="sm" variant="text" @click="openDoc('TopNav')">TopNav</Button>
              <Button size="sm" variant="text" @click="openDoc('Dropdown')">Dropdown</Button>
              <Button size="sm" variant="text" @click="openDoc('Breadcrumb')">Breadcrumb</Button>
            </Space>
          </Space>
        </Card>

        <Card>
          <template #header>{{ t('example.doc.split.demo.basic') }} · ResizeBox</template>
          <Space direction="vertical" block size="md">
            <Space wrap>
              <Button
                size="sm"
                :variant="splitDir === 'horizontal' ? 'solid' : 'outlined'"
                @click="splitDir = 'horizontal'"
              >
                {{ t('example.doc.split.sample.horizontal') }}
              </Button>
              <Button
                size="sm"
                :variant="splitDir === 'vertical' ? 'solid' : 'outlined'"
                @click="splitDir = 'vertical'"
              >
                {{ t('example.doc.split.sample.vertical') }}
              </Button>
              <Button size="sm" variant="text" @click="openDoc('Split')">Split</Button>
              <Button size="sm" variant="text" @click="openDoc('ResizeBox')">ResizeBox</Button>
            </Space>
            <Split v-model:size="splitSize" :direction="splitDir" class="lab-split">
              <template #first>
                <div class="pane">{{ t('example.doc.split.sample.paneA') }}</div>
              </template>
              <template #second>
                <div class="pane frame">
                  <ResizeBox
                    :width="boxW"
                    :height="boxH"
                    :min-width="140"
                    :min-height="80"
                    @resize="onResize"
                  >
                    <div class="pane-inner">{{ t('example.doc.resizeBox.sample.body') }}</div>
                  </ResizeBox>
                </div>
              </template>
            </Split>
          </Space>
        </Card>

        <Card>
          <template #header>{{ t('example.doc.row.demo.basic') }}</template>
          <Space direction="vertical" block size="md">
            <Space wrap>
              <Button
                size="sm"
                :variant="rowMode === 'thirds' ? 'solid' : 'outlined'"
                @click="rowMode = 'thirds'"
              >
                8/8/8
              </Button>
              <Button
                size="sm"
                :variant="rowMode === 'half' ? 'solid' : 'outlined'"
                @click="rowMode = 'half'"
              >
                12/12
              </Button>
              <Button
                size="sm"
                :variant="rowMode === 'aside' ? 'solid' : 'outlined'"
                @click="rowMode = 'aside'"
              >
                6/18
              </Button>
              <Button size="sm" variant="text" @click="openDoc('Row')">Row</Button>
            </Space>
            <Row gutter="var(--spacing-md)">
              <Col v-for="(span, i) in rowSpans" :key="`${rowMode}-${i}`" :span="span">
                <div class="cell">{{ t('example.doc.row.sample.col', { n: span }) }}</div>
              </Col>
            </Row>
          </Space>
        </Card>

        <Card>
          <template #header>{{ t('example.doc.layoutLab.section.primitives') }}</template>
          <Space direction="vertical" block size="lg">
            <Space wrap>
              <Button
                size="sm"
                :variant="stackDir === 'horizontal' ? 'solid' : 'outlined'"
                @click="stackDir = 'horizontal'"
              >
                {{ t('example.doc.layoutLab.stackH') }}
              </Button>
              <Button
                size="sm"
                :variant="stackDir === 'vertical' ? 'solid' : 'outlined'"
                @click="stackDir = 'vertical'"
              >
                {{ t('example.doc.layoutLab.stackV') }}
              </Button>
              <Button
                v-for="n in 4"
                :key="n"
                size="sm"
                :variant="columns === n ? 'solid' : 'outlined'"
                @click="columns = n"
              >
                {{ t('example.doc.layoutLab.colN', { n }) }}
              </Button>
              <Button size="sm" variant="outlined" @click="flowCount = Math.max(2, flowCount - 1)">
                {{ t('example.doc.layoutLab.tagMinus') }}
              </Button>
              <Button size="sm" variant="outlined" @click="flowCount++">
                {{ t('example.doc.layoutLab.tagPlus') }}
              </Button>
            </Space>
            <StackLayout :direction="stackDir" gap="md">
              <div class="cell">{{ t('example.doc.stackLayout.sample.a') }}</div>
              <div class="cell">{{ t('example.doc.stackLayout.sample.b') }}</div>
              <Spacer v-if="stackDir === 'horizontal'" />
              <div class="cell">{{ t('example.doc.stackLayout.sample.c') }}</div>
            </StackLayout>
            <FlowLayout gap="md">
              <Tag
                v-for="n in flowCount"
                :key="n"
                size="sm"
                :label="t('example.doc.flowLayout.sample.chip', { n })"
              />
            </FlowLayout>
            <ColumnLayout :columns="columns" gap="md">
              <div v-for="n in columns" :key="n" class="cell">
                {{ t('example.doc.columnLayout.sample.cell', { n }) }}
              </div>
            </ColumnLayout>
            <CardGrid min-track="sm" gap="md">
              <Card v-for="n in 3" :key="n">{{ t('example.doc.cardGrid.sample.card', { n }) }}</Card>
            </CardGrid>
          </Space>
        </Card>

        <Card>
          <template #header>{{ t('example.doc.layoutLab.section.misc') }}</template>
          <Space direction="vertical" block size="lg">
            <Container size="md" class="cell">{{ t('example.doc.container.sample.body') }}</Container>
            <Center axis="both" class="stage">
              <span class="chip">{{ t('example.doc.center.sample.body') }}</span>
            </Center>
            <Block bordered padded>
              <p>{{ t('example.doc.block.sample.body') }}</p>
            </Block>
            <div class="embed-host">
              <EmbedLayout aspect-ratio="16 / 9">
                <span class="muted">{{ t('example.doc.embedLayout.sample.body') }}</span>
              </EmbedLayout>
            </div>
            <div class="stage stage--scale">
              <ScaleLayout :width="960" :height="540" fit="contain" fill>
                <div class="scale-board">
                  <span class="muted">{{ t('example.doc.scaleLayout.sample.body') }}</span>
                </div>
              </ScaleLayout>
            </div>
            <Space wrap>
              <Button
                v-for="p in (['top', 'bottom', 'left', 'right'] as const)"
                :key="p"
                size="sm"
                :variant="pin === p ? 'solid' : 'outlined'"
                @click="pin = p"
              >
                {{ p }}
              </Button>
            </Space>
            <div class="stage stage--rel" :class="`stage--pin-${pin}`">
              <template v-if="pin === 'top' || pin === 'left'">
                <FixedLayout mode="absolute" :position="pin" offset="none" class="chrome">
                  <div
                    class="toolbar"
                    :class="{ 'toolbar--side': pin === 'left' }"
                  >
                    <span v-if="pin === 'top'" class="toolbar__title">{{
                      t('example.doc.fixedLayout.sample.top')
                    }}</span>
                    <span v-else class="toolbar__mark">{{ t('example.doc.fixedLayout.sample.side') }}</span>
                    <Space v-if="pin === 'top'">
                      <Button size="sm">{{ t('example.doc.fixedLayout.sample.action') }}</Button>
                    </Space>
                  </div>
                </FixedLayout>
                <div class="body-scroll">
                  <p class="muted">{{ t('example.doc.fixedLayout.sample.body') }}</p>
                </div>
              </template>
              <template v-else>
                <div class="body-scroll">
                  <p class="muted">{{ t('example.doc.fixedLayout.sample.body') }}</p>
                </div>
                <FixedLayout mode="absolute" :position="pin" offset="none" class="chrome">
                  <div
                    class="toolbar"
                    :class="{
                      'toolbar--side': pin === 'right',
                      'toolbar--footer': pin === 'bottom'
                    }"
                  >
                    <span v-if="pin === 'bottom'" class="toolbar__title">{{
                      t('example.doc.fixedLayout.sample.bottom')
                    }}</span>
                    <span v-else class="toolbar__mark">{{ t('example.doc.fixedLayout.sample.side') }}</span>
                    <Space v-if="pin === 'bottom'">
                      <Button size="sm">{{ t('example.doc.fixedLayout.sample.action') }}</Button>
                    </Space>
                  </div>
                </FixedLayout>
              </template>
            </div>
            <FormLayout label-width="md">
              <div class="vp-form-layout__row">
                <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.name') }}</label>
                <div class="vp-form-layout__control">
                  <InputText v-model="formName" :placeholder="t('example.doc.formLayout.sample.namePh')" />
                </div>
              </div>
            </FormLayout>
          </Space>
        </Card>
      </div>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.lab {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
  min-width: 0;
}

.lab-shell {
  min-height: calc(var(--spacing-2xl) * 10);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
}

.lab-split {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 7);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
}

.pane {
  height: 100%;
  min-height: calc(var(--spacing-2xl) * 5);
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}

.pane.frame {
  background: var(--surface-1);
}

.pane-inner {
  height: 100%;
  padding: var(--spacing-sm);
  background: var(--surface-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  box-sizing: border-box;
}

.cell {
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
  box-sizing: border-box;
}

.stage {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 5);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.stage--scale {
  height: calc(var(--spacing-2xl) * 10);
  min-height: 0;
  padding: 0;
  overflow: hidden;
  background: var(--surface-0);
}

.scale-board {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  padding: var(--theme-page-pad);
}

.stage--rel {
  position: relative;
  display: flex;
  height: calc(var(--spacing-2xl) * 8);
  overflow: hidden;
  padding: 0;
}

.stage--pin-top,
.stage--pin-bottom {
  flex-direction: column;
}

.stage--pin-left,
.stage--pin-right {
  flex-direction: row;
  align-items: stretch;
}

.stage--rel > .muted {
  flex: 1;
  min-width: 0;
  padding: var(--theme-card-pad);
}

.body-scroll {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: var(--theme-card-pad);
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

.toolbar--side {
  flex-direction: column;
  justify-content: flex-start;
  width: calc(var(--spacing-2xl) * 2.5);
  height: 100%;
  min-height: 100%;
  padding: var(--spacing-md) var(--spacing-sm);
  border-bottom: none;
  border-inline-end: 1px solid var(--ds-border);
}

.stage--pin-right .toolbar--side {
  border-inline-end: none;
  border-inline-start: 1px solid var(--ds-border);
}

.toolbar__title {
  font-weight: var(--font-weight-heading);
  color: var(--text-primary);
}

.toolbar__mark {
  writing-mode: vertical-rl;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.chip {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.muted {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.embed-host {
  width: 100%;
  max-width: calc(var(--spacing-2xl) * 10);
  min-width: 0;
}
</style>
