<script setup lang="ts">
/**
 * Row / Col curated demos — page-grade complex grids (not span swatches).
 */
import { computed, ref } from 'vue'
import { Row, Col, Button, Space, Card, Tag, Divider, Block } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc, demoCode } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t, tDyn } = useLocale()

type PagePreset = 'shell' | 'dashboard' | 'form' | 'detail' | 'editorial'
const page = ref<PagePreset>('shell')
const nav = ref('a')
const query = ref('')
const formName = ref('')
const formMail = ref('')
const formCity = ref('')
const selectedOrder = ref(1)

type MixPreset = 'aside' | 'dashboard' | 'uneven' | 'wrap'
const mix = ref<MixPreset>('dashboard')
const justify = ref<'start' | 'center' | 'space-between' | 'space-around'>('start')
const align = ref<'stretch' | 'start' | 'center' | 'end'>('stretch')

const mixRows = computed(() => {
  switch (mix.value) {
    case 'aside':
      return [[{ span: 6 }, { span: 18 }]]
    case 'uneven':
      return [[{ span: 4 }, { span: 8 }, { span: 12 }]]
    case 'wrap':
      return [
        [{ span: 6 }, { span: 6 }, { span: 6 }, { span: 6 }, { span: 8 }, { span: 8 }, { span: 8 }]
      ]
    default:
      return [
        [{ span: 16 }, { span: 8 }],
        [{ span: 8 }, { span: 8 }, { span: 8 }],
        [{ span: 12 }, { span: 6 }, { span: 6 }]
      ]
  }
})

const orders = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({
    id: n,
    title: t('example.doc.row.sample.orderTitle', { n }),
    meta: t('example.doc.row.sample.orderMeta', { n })
  }))
)

const kpis = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    n,
    label: t('example.doc.row.sample.kpiLabel', { n }),
    value: t('example.doc.row.sample.kpiValue', { n })
  }))
)

const codePage = demoSfc({
  imports: [
    `import { Row, Col, Card, Button, Space, Tag } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'`
  ],
  template: [
    '  <!-- shell: header 24 → sider 5 + main 19 (nested toolbar / content / aside) -->',
    '  <Row gutter="var(--spacing-md)">',
    '    <Col :span="24">…header…</Col>',
    '  </Row>',
    '  <Row gutter="var(--spacing-md)" align="stretch">',
    '    <Col :span="5">…nav…</Col>',
    '    <Col :span="19">',
    '      <Row gutter="var(--spacing-md)">',
    '        <Col :span="16">…main…</Col>',
    '        <Col :span="8">…aside…</Col>',
    '      </Row>',
    '    </Col>',
    '  </Row>'
  ]
})

const codeMixed = demoSfc({
  imports: [`import { Row, Col } from '@amg-webui/core'`],
  template: [
    '  <Row gutter="var(--spacing-md)">',
    '    <Col :span="16">…</Col>',
    '    <Col :span="8">…</Col>',
    '  </Row>',
    '  <Row gutter="var(--spacing-md)">',
    '    <Col :span="8">…</Col>',
    '    <Col :span="8">…</Col>',
    '    <Col :span="8">…</Col>',
    '  </Row>'
  ]
})

const codeOffset = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="12" :offset="6">centered band</Col>`,
  `</Row>`,
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="6">A</Col>`,
  `  <Col :span="6" :offset="6">B stepped</Col>`,
  `  <Col :span="6">C</Col>`,
  `</Row>`
)

const codeNestedDeep = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="16">`,
  `    <Row gutter="var(--spacing-sm)">`,
  `      <Col :span="24">toolbar</Col>`,
  `      <Col :span="12"><Row>…leaf…</Row></Col>`,
  `      <Col :span="12"><Row>…leaf…</Row></Col>`,
  `    </Row>`,
  `  </Col>`,
  `  <Col :span="8" flex>…</Col>`,
  `</Row>`
)

const codeFlex = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="6">fixed</Col>`,
  `  <Col flex>flex grow</Col>`,
  `  <Col :span="6">fixed</Col>`,
  `</Row>`
)

const codePushPull = demoCode(
  `<Row gutter="var(--spacing-md)">`,
  `  <Col :span="8" :push="8">push 8</Col>`,
  `  <Col :span="8" :pull="8">pull 8</Col>`,
  `  <Col :span="8">span 8</Col>`,
  `</Row>`
)

const codeAlign = computed(() =>
  demoCode(
    `<Row align="${align.value}" justify="${justify.value}" gutter="var(--spacing-md)">`,
    `  <Col :span="6">…</Col>`,
    `  <Col :span="6">…</Col>`,
    `  <Col :span="6">…</Col>`,
    `</Row>`
  )
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'Row.gutter',
    type: 'string | number',
    defaultValue: 'var(--spacing-md)',
    description: t('example.doc.row.prop.gutter')
  },
  {
    name: 'Row.align / justify / wrap',
    type: 'string / string / boolean',
    defaultValue: "'stretch' / 'start' / true",
    description: t('example.doc.row.prop.align')
  },
  {
    name: 'Col.span',
    type: 'number (1–24)',
    defaultValue: '-',
    description: t('example.doc.row.prop.span')
  },
  {
    name: 'Col.offset',
    type: 'number (0–23)',
    defaultValue: '0',
    description: t('example.doc.row.prop.offset')
  },
  {
    name: 'Col.push / pull',
    type: 'number',
    defaultValue: '0',
    description: t('example.doc.row.prop.pushPull')
  },
  {
    name: 'Col.flex',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.row.prop.flex')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.row.when') }}</p>

    <!-- 1. Real page compositions -->
    <DemoBlock
      :title="t('example.doc.row.demo.page')"
      :description="t('example.doc.row.demo.pageDesc')"
      :code="codePage"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="p in (['shell', 'dashboard', 'form', 'detail', 'editorial'] as const)"
            :key="p"
            size="sm"
            :variant="page === p ? 'solid' : 'outlined'"
            @click="page = p"
          >
            {{ t(`example.doc.row.sample.page.${p}`) }}
          </Button>
        </Space>

        <!-- SHELL: app chrome -->
        <div v-if="page === 'shell'" class="frame">
          <Row gutter="var(--spacing-md)">
            <Col :span="24">
              <div class="bar bar--header">
                <span class="bar__brand">{{ t('example.doc.row.sample.brand') }}</span>
                <Space wrap>
                  <Tag size="sm" :label="t('example.doc.row.sample.env')" />
                  <Button size="sm" variant="outlined">{{ t('example.doc.row.sample.actionPrimary') }}</Button>
                </Space>
              </div>
            </Col>
          </Row>
          <Row gutter="var(--spacing-md)" align="stretch" class="frame__body">
            <Col :span="5">
              <Block bordered padded class="panel panel--nav">
                <p class="panel__title">{{ t('example.doc.row.sample.navTitle') }}</p>
                <button
                  v-for="k in (['a', 'b', 'c'] as const)"
                  :key="k"
                  type="button"
                  class="nav-item"
                  :class="{ 'nav-item--active': nav === k }"
                  @click="nav = k"
                >
                  {{ t(`example.doc.row.sample.nav.${k}`) }}
                </button>
              </Block>
            </Col>
            <Col :span="19">
              <Space direction="vertical" block size="md">
                <Row gutter="var(--spacing-md)" align="center">
                  <Col :span="14">
                    <InputText
                      v-model="query"
                      :placeholder="t('example.doc.row.sample.searchPh')"
                    />
                  </Col>
                  <Col :span="10">
                    <Space wrap justify="end" block>
                      <Button size="sm" variant="outlined">{{ t('example.doc.row.sample.filter') }}</Button>
                      <Button size="sm">{{ t('example.doc.row.sample.create') }}</Button>
                    </Space>
                  </Col>
                </Row>
                <Row gutter="var(--spacing-md)" align="stretch">
                  <Col :span="16">
                    <Card bordered :header="t('example.doc.row.sample.mainTitle', { nav: tDyn(`example.doc.row.sample.nav.${nav}`) })">
                      <Space direction="vertical" block size="md">
                        <p class="prose">{{ t('example.doc.row.sample.mainBody') }}</p>
                        <Row gutter="var(--spacing-sm)">
                          <Col :span="8">
                            <div class="tile">{{ t('example.doc.row.sample.tile', { n: 1 }) }}</div>
                          </Col>
                          <Col :span="8">
                            <div class="tile">{{ t('example.doc.row.sample.tile', { n: 2 }) }}</div>
                          </Col>
                          <Col :span="8">
                            <div class="tile">{{ t('example.doc.row.sample.tile', { n: 3 }) }}</div>
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </Col>
                  <Col :span="8">
                    <Card bordered :header="t('example.doc.row.sample.asideTitle')">
                      <Space direction="vertical" block size="sm">
                        <p class="prose">{{ t('example.doc.row.sample.asideBody') }}</p>
                        <Button size="sm" variant="outlined" block>{{ t('example.doc.row.sample.asideCta') }}</Button>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </div>

        <!-- DASHBOARD -->
        <div v-else-if="page === 'dashboard'" class="frame">
          <Row gutter="var(--spacing-md)">
            <Col v-for="k in kpis" :key="k.n" :span="6">
              <Card bordered>
                <p class="kpi__label">{{ k.label }}</p>
                <p class="kpi__value">{{ k.value }}</p>
              </Card>
            </Col>
          </Row>
          <Row gutter="var(--spacing-md)" align="stretch" class="frame__gap">
            <Col :span="16">
              <Card bordered :header="t('example.doc.row.sample.chartTitle')">
                <div class="chart-fake">
                  <Row gutter="var(--spacing-sm)" align="end" class="chart-fake__bars">
                    <Col v-for="n in 8" :key="n" :span="3">
                      <div class="chart-fake__bar" :style="{ height: `calc(var(--spacing-2xl) * ${0.8 + (n % 5) * 0.35})` }" />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.feedTitle')">
                <Space direction="vertical" block size="md">
                  <div v-for="n in 4" :key="n" class="feed-row">
                    <Tag size="sm" :label="t('example.doc.row.sample.feedTag', { n })" />
                    <span class="prose">{{ t('example.doc.row.sample.feedLine', { n }) }}</span>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter="var(--spacing-md)" class="frame__gap">
            <Col :span="24">
              <Card bordered :header="t('example.doc.row.sample.tableTitle')">
                <Row gutter="var(--spacing-sm)">
                  <Col :span="4"><div class="th">ID</div></Col>
                  <Col :span="10"><div class="th">{{ t('example.doc.row.sample.colName') }}</div></Col>
                  <Col :span="6"><div class="th">{{ t('example.doc.row.sample.colStatus') }}</div></Col>
                  <Col :span="4"><div class="th">{{ t('example.doc.row.sample.colAction') }}</div></Col>
                </Row>
                <Divider />
                <Row v-for="n in 3" :key="n" gutter="var(--spacing-sm)" align="center">
                  <Col :span="4"><div class="td">0{{ n }}</div></Col>
                  <Col :span="10"><div class="td">{{ t('example.doc.row.sample.rowName', { n }) }}</div></Col>
                  <Col :span="6">
                    <Tag size="sm" :label="t('example.doc.row.sample.rowStatus', { n })" />
                  </Col>
                  <Col :span="4">
                    <Button size="sm" variant="text">{{ t('example.doc.row.sample.open') }}</Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        <!-- FORM -->
        <div v-else-if="page === 'form'" class="frame">
          <Row gutter="var(--spacing-lg)">
            <Col :span="16">
              <Card bordered :header="t('example.doc.row.sample.formTitle')">
                <Space direction="vertical" block size="md">
                  <Row gutter="var(--spacing-md)" align="center">
                    <Col :span="6"><span class="label">{{ t('example.doc.row.sample.fieldName') }}</span></Col>
                    <Col :span="18"><InputText v-model="formName" :placeholder="t('example.doc.row.sample.fieldNamePh')" /></Col>
                  </Row>
                  <Row gutter="var(--spacing-md)" align="center">
                    <Col :span="6"><span class="label">{{ t('example.doc.row.sample.fieldMail') }}</span></Col>
                    <Col :span="18"><InputText v-model="formMail" :placeholder="t('example.doc.row.sample.fieldMailPh')" /></Col>
                  </Row>
                  <Row gutter="var(--spacing-md)">
                    <Col :span="6"><span class="label">{{ t('example.doc.row.sample.fieldCity') }}</span></Col>
                    <Col :span="10"><InputText v-model="formCity" :placeholder="t('example.doc.row.sample.fieldCityPh')" /></Col>
                    <Col :span="8">
                      <Button size="sm" variant="outlined" class="w-full">{{ t('example.doc.row.sample.pickCity') }}</Button>
                    </Col>
                  </Row>
                  <Row gutter="var(--spacing-md)">
                    <Col :span="12">
                      <Row gutter="var(--spacing-sm)">
                        <Col :span="12"><div class="tile tile--sm">{{ t('example.doc.row.sample.halfA') }}</div></Col>
                        <Col :span="12"><div class="tile tile--sm">{{ t('example.doc.row.sample.halfB') }}</div></Col>
                      </Row>
                    </Col>
                    <Col :span="12">
                      <div class="tile tile--sm">{{ t('example.doc.row.sample.halfC') }}</div>
                    </Col>
                  </Row>
                  <Row gutter="var(--spacing-md)">
                    <Col :span="8" :offset="16">
                      <Space wrap justify="end" block>
                        <Button size="sm" variant="outlined">{{ t('example.doc.row.sample.cancel') }}</Button>
                        <Button size="sm">{{ t('example.doc.row.sample.submit') }}</Button>
                      </Space>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.formHintTitle')">
                <p class="prose">{{ t('example.doc.row.sample.formHintBody') }}</p>
              </Card>
            </Col>
          </Row>
        </div>

        <!-- MASTER DETAIL -->
        <div v-else-if="page === 'detail'" class="frame">
          <Row gutter="var(--spacing-md)" align="stretch">
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.listTitle')">
                <button
                  v-for="o in orders"
                  :key="o.id"
                  type="button"
                  class="list-item"
                  :class="{ 'list-item--active': selectedOrder === o.id }"
                  @click="selectedOrder = o.id"
                >
                  <span class="list-item__title">{{ o.title }}</span>
                  <span class="list-item__meta">{{ o.meta }}</span>
                </button>
              </Card>
            </Col>
            <Col :span="16">
              <Card bordered>
                <template #header>
                  {{ t('example.doc.row.sample.detailTitle', { n: selectedOrder }) }}
                </template>
                <template #extra>
                  <Space wrap>
                    <Button size="sm" variant="outlined">{{ t('example.doc.row.sample.edit') }}</Button>
                    <Button size="sm">{{ t('example.doc.row.sample.save') }}</Button>
                  </Space>
                </template>
                <Space direction="vertical" block size="md">
                  <Row gutter="var(--spacing-md)">
                    <Col :span="8"><div class="meta"><span class="meta__k">{{ t('example.doc.row.sample.metaStatus') }}</span><Tag size="sm" :label="t('example.doc.row.sample.rowStatus', { n: selectedOrder })" /></div></Col>
                    <Col :span="8"><div class="meta"><span class="meta__k">{{ t('example.doc.row.sample.metaOwner') }}</span><span class="meta__v">{{ t('example.doc.row.sample.owner', { n: selectedOrder }) }}</span></div></Col>
                    <Col :span="8"><div class="meta"><span class="meta__k">{{ t('example.doc.row.sample.metaTime') }}</span><span class="meta__v">{{ t('example.doc.row.sample.time', { n: selectedOrder }) }}</span></div></Col>
                  </Row>
                  <Divider />
                  <Row gutter="var(--spacing-md)">
                    <Col :span="14">
                      <p class="prose">{{ t('example.doc.row.sample.detailBody', { n: selectedOrder }) }}</p>
                    </Col>
                    <Col :span="10">
                      <Block bordered padded>
                        <p class="panel__title">{{ t('example.doc.row.sample.sideNote') }}</p>
                        <p class="prose">{{ t('example.doc.row.sample.sideNoteBody') }}</p>
                      </Block>
                    </Col>
                  </Row>
                  <Row gutter="var(--spacing-sm)">
                    <Col :span="6"><div class="tile tile--sm">A</div></Col>
                    <Col :span="6"><div class="tile tile--sm">B</div></Col>
                    <Col :span="6"><div class="tile tile--sm">C</div></Col>
                    <Col :span="6"><div class="tile tile--sm">D</div></Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        <!-- EDITORIAL / asymmetric -->
        <div v-else class="frame">
          <Row gutter="var(--spacing-md)">
            <Col :span="18" :offset="3">
              <div class="hero">
                <p class="hero__title">{{ t('example.doc.row.sample.heroTitle') }}</p>
                <p class="hero__lead">{{ t('example.doc.row.sample.heroLead') }}</p>
                <Space wrap>
                  <Button size="sm">{{ t('example.doc.row.sample.heroCta') }}</Button>
                  <Button size="sm" variant="outlined">{{ t('example.doc.row.sample.heroSecondary') }}</Button>
                </Space>
              </div>
            </Col>
          </Row>
          <Row gutter="var(--spacing-md)" class="frame__gap">
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.feature', { n: 1 })">
                <p class="prose">{{ t('example.doc.row.sample.featureBody', { n: 1 }) }}</p>
              </Card>
            </Col>
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.feature', { n: 2 })">
                <p class="prose">{{ t('example.doc.row.sample.featureBody', { n: 2 }) }}</p>
              </Card>
            </Col>
            <Col :span="8">
              <Card bordered :header="t('example.doc.row.sample.feature', { n: 3 })">
                <p class="prose">{{ t('example.doc.row.sample.featureBody', { n: 3 }) }}</p>
              </Card>
            </Col>
          </Row>
          <Row gutter="var(--spacing-md)" class="frame__gap" align="stretch">
            <Col :span="10">
              <div class="media">{{ t('example.doc.row.sample.media') }}</div>
            </Col>
            <Col :span="14">
              <Space direction="vertical" block size="md">
                <Row gutter="var(--spacing-sm)">
                  <Col :span="16"><div class="tile">{{ t('example.doc.row.sample.storyWide') }}</div></Col>
                  <Col :span="8"><div class="tile">{{ t('example.doc.row.sample.storyNarrow') }}</div></Col>
                </Row>
                <Row gutter="var(--spacing-sm)">
                  <Col :span="8" :offset="4"><div class="tile tile--accent">{{ t('example.doc.row.sample.storyOffset') }}</div></Col>
                  <Col :span="8" flex><div class="tile">{{ t('example.doc.row.sample.storyFlex') }}</div></Col>
                </Row>
                <Row gutter="var(--spacing-sm)">
                  <Col :span="8" :push="8"><div class="tile">{{ t('example.doc.row.sample.push', { n: 8 }) }}</div></Col>
                  <Col :span="8" :pull="8"><div class="tile tile--accent">{{ t('example.doc.row.sample.pull', { n: 8 }) }}</div></Col>
                  <Col :span="8"><div class="tile">{{ t('example.doc.row.sample.col', { n: 8 }) }}</div></Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </div>
      </Space>
    </DemoBlock>

    <!-- restored: mixed span presets -->
    <DemoBlock
      :title="t('example.doc.row.demo.mixed')"
      :description="t('example.doc.row.demo.mixedDesc')"
      :code="codeMixed"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="mix === 'dashboard' ? 'solid' : 'outlined'"
            @click="mix = 'dashboard'"
          >
            {{ t('example.doc.row.sample.preset.dashboard') }}
          </Button>
          <Button
            size="sm"
            :variant="mix === 'aside' ? 'solid' : 'outlined'"
            @click="mix = 'aside'"
          >
            {{ t('example.doc.row.sample.preset.aside') }}
          </Button>
          <Button
            size="sm"
            :variant="mix === 'uneven' ? 'solid' : 'outlined'"
            @click="mix = 'uneven'"
          >
            {{ t('example.doc.row.sample.preset.uneven') }}
          </Button>
          <Button
            size="sm"
            :variant="mix === 'wrap' ? 'solid' : 'outlined'"
            @click="mix = 'wrap'"
          >
            {{ t('example.doc.row.sample.preset.wrap') }}
          </Button>
        </Space>
        <div class="stack">
          <Row
            v-for="(row, ri) in mixRows"
            :key="`${mix}-${ri}`"
            gutter="var(--spacing-md)"
          >
            <Col v-for="(c, ci) in row" :key="ci" :span="c.span">
              <div class="tile">{{ t('example.doc.row.sample.col', { n: c.span }) }}</div>
            </Col>
          </Row>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.row.demo.offset')"
      :description="t('example.doc.row.demo.offsetDesc')"
      :code="codeOffset"
    >
      <Space direction="vertical" block size="md">
        <Row gutter="var(--spacing-md)">
          <Col :span="12" :offset="6">
            <div class="tile">{{ t('example.doc.row.sample.offset', { span: 12, offset: 6 }) }}</div>
          </Col>
        </Row>
        <Row gutter="var(--spacing-md)">
          <Col :span="6"><div class="tile">A · 6</div></Col>
          <Col :span="6" :offset="6"><div class="tile tile--accent">B · 6 + offset 6</div></Col>
          <Col :span="6"><div class="tile">C · 6</div></Col>
        </Row>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.row.demo.nested')"
      :description="t('example.doc.row.demo.nestedDesc')"
      :code="codeNestedDeep"
    >
      <Row gutter="var(--spacing-md)" align="stretch">
        <Col :span="16">
          <Block bordered padded>
            <Space direction="vertical" block size="md">
              <div class="bar bar--sub">{{ t('example.doc.row.sample.nestedToolbar') }}</div>
              <Row gutter="var(--spacing-sm)">
                <Col :span="12">
                  <Row gutter="var(--spacing-xs)">
                    <Col :span="12"><div class="tile tile--sm">L1</div></Col>
                    <Col :span="12"><div class="tile tile--sm">L2</div></Col>
                  </Row>
                </Col>
                <Col :span="12">
                  <Row gutter="var(--spacing-xs)">
                    <Col :span="8"><div class="tile tile--sm">R1</div></Col>
                    <Col :span="16"><div class="tile tile--sm">R2</div></Col>
                  </Row>
                </Col>
              </Row>
            </Space>
          </Block>
        </Col>
        <Col :span="8">
          <Card bordered :header="t('example.doc.row.sample.nestedSide')">
            <p class="prose">{{ t('example.doc.row.sample.nestedSideBody') }}</p>
          </Card>
        </Col>
      </Row>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.row.demo.flex')"
      :description="t('example.doc.row.demo.flexDesc')"
      :code="codeFlex"
    >
      <Row gutter="var(--spacing-md)">
        <Col :span="6">
          <div class="tile">{{ t('example.doc.row.sample.fixed', { n: 6 }) }}</div>
        </Col>
        <Col flex>
          <div class="tile tile--accent">{{ t('example.doc.row.sample.flexGrow') }}</div>
        </Col>
        <Col :span="6">
          <div class="tile">{{ t('example.doc.row.sample.fixed', { n: 6 }) }}</div>
        </Col>
      </Row>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.row.demo.pushPull')"
      :description="t('example.doc.row.demo.pushPullDesc')"
      :code="codePushPull"
    >
      <Row gutter="var(--spacing-md)">
        <Col :span="8" :push="8">
          <div class="tile">{{ t('example.doc.row.sample.push', { n: 8 }) }}</div>
        </Col>
        <Col :span="8" :pull="8">
          <div class="tile tile--accent">{{ t('example.doc.row.sample.pull', { n: 8 }) }}</div>
        </Col>
        <Col :span="8">
          <div class="tile">{{ t('example.doc.row.sample.col', { n: 8 }) }}</div>
        </Col>
      </Row>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.row.demo.align')"
      :description="t('example.doc.row.demo.alignDesc')"
      :code="codeAlign"
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="j in (['start', 'center', 'space-between', 'space-around'] as const)"
            :key="j"
            size="sm"
            :variant="justify === j ? 'solid' : 'outlined'"
            @click="justify = j"
          >
            {{ j }}
          </Button>
        </Space>
        <Space wrap>
          <Button
            v-for="a in (['stretch', 'start', 'center', 'end'] as const)"
            :key="a"
            size="sm"
            :variant="align === a ? 'solid' : 'outlined'"
            @click="align = a"
          >
            {{ a }}
          </Button>
        </Space>
        <Row :align="align" :justify="justify" gutter="var(--spacing-md)">
          <Col :span="6">
            <div class="tile tile--tall">{{ t('example.doc.row.sample.col', { n: 6 }) }}</div>
          </Col>
          <Col :span="6">
            <div class="tile">{{ t('example.doc.row.sample.col', { n: 6 }) }}</div>
          </Col>
          <Col :span="6">
            <div class="tile tile--mid">{{ t('example.doc.row.sample.col', { n: 6 }) }}</div>
          </Col>
        </Row>
      </Space>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  min-width: 0;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.frame__body,
.frame__gap {
  margin-top: var(--spacing-md);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.bar--header {
  min-height: var(--height-lg);
}

.bar--sub {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.bar__brand {
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  font-size: var(--font-size-md);
}

.panel--nav {
  height: 100%;
  min-height: calc(var(--spacing-2xl) * 10);
}

.panel__title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.nav-item {
  display: block;
  width: 100%;
  margin: 0 0 var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: start;
  border: 1px solid transparent;
  border-radius: var(--theme-btn-radius);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  box-sizing: border-box;
}

.nav-item--active {
  border-color: var(--ds-accent);
  color: var(--text-primary);
  background: var(--surface-1);
}

.prose {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.tile {
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
  box-sizing: border-box;
  min-height: calc(var(--spacing-2xl) * 2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile--sm {
  min-height: calc(var(--spacing-2xl) * 1.5);
}

.tile--tall {
  min-height: calc(var(--spacing-2xl) * 4);
}

.tile--mid {
  min-height: calc(var(--spacing-2xl) * 2.5);
}

.tile--accent {
  border-color: var(--ds-accent);
  color: var(--text-primary);
}

.kpi__label {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.kpi__value {
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.chart-fake {
  min-height: calc(var(--spacing-2xl) * 6);
  padding: var(--spacing-md);
  background: var(--surface-2);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.chart-fake__bars {
  min-height: calc(var(--spacing-2xl) * 5);
}

.chart-fake__bar {
  width: 100%;
  background: color-mix(in srgb, var(--ds-accent) 35%, var(--surface-1));
  border-radius: var(--theme-btn-radius) var(--theme-btn-radius) 0 0;
}

.feed-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.th,
.td {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding-block: var(--spacing-xs);
}

.th {
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.w-full {
  width: 100%;
}

.list-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
  margin: 0 0 var(--spacing-sm);
  padding: var(--spacing-md);
  text-align: start;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  cursor: pointer;
  box-sizing: border-box;
}

.list-item--active {
  border-color: var(--ds-accent);
}

.list-item__title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: var(--font-weight-heading, 600);
}

.list-item__meta {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.meta__k {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.meta__v {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.hero {
  padding: var(--theme-card-pad);
  text-align: center;
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.hero__title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.hero__lead {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--spacing-2xl) * 8);
  background: var(--surface-2);
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
