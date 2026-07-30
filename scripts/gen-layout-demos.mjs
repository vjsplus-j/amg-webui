import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demos = join(root, 'example/demos')

function writeDemo(folder, content) {
  const dir = join(demos, folder)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.vue'), content, 'utf8')
  console.log('wrote', folder)
}

writeDemo(
  'Split',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Split, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<number | string>('40%')
const direction = ref<'horizontal' | 'vertical'>('horizontal')

const codeBasic = demoSfc({
  imports: [\`import { Split } from '@amg-webui/components/base'\`],
  template: [
    '  <Split v-model:size="size" :direction="direction" class="demo-split">',
    '    <template #first><div class="pane">A</div></template>',
    '    <template #second><div class="pane">B</div></template>',
    '  </Split>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'direction',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: t('example.doc.split.prop.direction')
  },
  {
    name: 'size / v-model:size',
    type: 'number | string',
    defaultValue: "'50%'",
    description: t('example.doc.split.prop.size')
  },
  {
    name: 'min / max',
    type: 'number',
    defaultValue: '48 / -',
    description: t('example.doc.split.prop.minMax')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.split.when') }}</p>
    <DemoBlock
      :title="t('example.doc.split.demo.basic')"
      :description="t('example.doc.split.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="direction === 'horizontal' ? 'solid' : 'outlined'"
            @click="direction = 'horizontal'"
          >
            {{ t('example.doc.split.sample.horizontal') }}
          </Button>
          <Button
            size="sm"
            :variant="direction === 'vertical' ? 'solid' : 'outlined'"
            @click="direction = 'vertical'"
          >
            {{ t('example.doc.split.sample.vertical') }}
          </Button>
          <Button size="sm" variant="outlined" @click="size = '30%'">30%</Button>
          <Button size="sm" variant="outlined" @click="size = '50%'">50%</Button>
          <Button size="sm" variant="outlined" @click="size = '70%'">70%</Button>
        </Space>
        <p class="vp-curated__hint">{{ t('example.doc.split.sample.size', { size: String(size) }) }}</p>
        <Split v-model:size="size" :direction="direction" class="demo-split">
          <template #first>
            <div class="pane">{{ t('example.doc.split.sample.paneA') }}</div>
          </template>
          <template #second>
            <div class="pane">{{ t('example.doc.split.sample.paneB') }}</div>
          </template>
        </Split>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.demo-split {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 6);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
}
.pane {
  height: 100%;
  min-height: calc(var(--spacing-2xl) * 4);
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
`
)

writeDemo(
  'ResizeBox',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ResizeBox, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const width = ref(280)
const height = ref(160)
const last = ref('')

const codeBasic = demoSfc({
  imports: [\`import { ResizeBox } from '@amg-webui/components/base'\`],
  template: [
    '  <ResizeBox :width="width" :height="height" :min-width="160" :min-height="120" @resize="onResize">',
    \`    {{ t('example.doc.resizeBox.sample.body') }}\`,
    '  </ResizeBox>'
  ]
})

function onResize(payload: { width: number; height: number }) {
  width.value = payload.width
  height.value = payload.height
  last.value = \`\${Math.round(payload.width)}×\${Math.round(payload.height)}\`
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'width / height',
    type: 'number | string',
    defaultValue: "'100%' / 'auto'",
    description: t('example.doc.resizeBox.prop.size')
  },
  {
    name: 'minWidth / minHeight / max*',
    type: 'number',
    defaultValue: '120 / 80',
    description: t('example.doc.resizeBox.prop.minMax')
  },
  {
    name: 'directions',
    type: 'ResizeDirection[]',
    defaultValue: "['right','bottom','bottom-right']",
    description: t('example.doc.resizeBox.prop.directions')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.resizeBox.when') }}</p>
    <DemoBlock
      :title="t('example.doc.resizeBox.demo.basic')"
      :description="t('example.doc.resizeBox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" variant="outlined" @click="width = 240; height = 140">
            {{ t('example.doc.resizeBox.sample.reset') }}
          </Button>
        </Space>
        <p v-if="last" class="vp-curated__hint">
          {{ t('example.doc.resizeBox.sample.resized', { size: last }) }}
        </p>
        <div class="frame">
          <ResizeBox :width="width" :height="height" :min-width="160" :min-height="120" @resize="onResize">
            <div class="body">{{ t('example.doc.resizeBox.sample.body') }}</div>
          </ResizeBox>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 8);
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}
.body {
  height: 100%;
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}
</style>
`
)

writeDemo(
  'Row',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Row, Col, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const mode = ref<'thirds' | 'half' | 'aside'>('thirds')

const spans = computed(() => {
  if (mode.value === 'half') return [12, 12]
  if (mode.value === 'aside') return [6, 18]
  return [8, 8, 8]
})

const codeBasic = demoSfc({
  imports: [\`import { Row, Col } from '@amg-webui/components/base'\`],
  template: [
    '  <Row gutter="var(--spacing-md)">',
    '    <Col :span="8">…</Col>',
    '    <Col :span="8">…</Col>',
    '    <Col :span="8">…</Col>',
    '  </Row>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'gutter',
    type: 'string | number',
    defaultValue: 'var(--spacing-md)',
    description: t('example.doc.row.prop.gutter')
  },
  {
    name: 'align / justify / wrap',
    type: 'string / string / boolean',
    defaultValue: "'stretch' / 'start' / true",
    description: t('example.doc.row.prop.align')
  },
  {
    name: 'Col.span / offset',
    type: 'number',
    defaultValue: '24 / 0',
    description: t('example.doc.row.prop.span')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.row.when') }}</p>
    <DemoBlock
      :title="t('example.doc.row.demo.basic')"
      :description="t('example.doc.row.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="mode === 'thirds' ? 'solid' : 'outlined'"
            @click="mode = 'thirds'"
          >
            8 / 8 / 8
          </Button>
          <Button
            size="sm"
            :variant="mode === 'half' ? 'solid' : 'outlined'"
            @click="mode = 'half'"
          >
            12 / 12
          </Button>
          <Button
            size="sm"
            :variant="mode === 'aside' ? 'solid' : 'outlined'"
            @click="mode = 'aside'"
          >
            6 / 18
          </Button>
        </Space>
        <Row gutter="var(--spacing-md)">
          <Col v-for="(span, i) in spans" :key="\`\${mode}-\${i}\`" :span="span">
            <div class="cell">{{ t('example.doc.row.sample.col', { n: span }) }}</div>
          </Col>
        </Row>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.cell {
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
}
</style>
`
)

writeDemo('Col', `<script setup lang="ts">
import RowDemo from '../Row/index.vue'
</script>
<template><RowDemo /></template>
`)

const primitiveDemos = [
  [
    'Container',
    'container',
    `Container, Button, Space`,
    `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Container, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
const fluid = ref(false)

const codeBasic = demoSfc({
  imports: [\`import { Container } from '@amg-webui/components/base'\`],
  template: [
    '  <Container :size="size" :fluid="fluid">',
    \`    {{ t('example.doc.container.sample.body') }}\`,
    '  </Container>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'size', type: "'sm'|'md'|'lg'|'xl'|'full'", defaultValue: "'lg'", description: t('example.doc.container.prop.size') },
  { name: 'fluid / padded', type: 'boolean', defaultValue: 'false / true', description: t('example.doc.container.prop.fluid') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.container.when') }}</p>
    <DemoBlock :title="t('example.doc.container.demo.basic')" :description="t('example.doc.container.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="s in (['sm','md','lg','xl','full'] as const)" :key="s" size="sm" :variant="size===s && !fluid ? 'solid' : 'outlined'" @click="size=s; fluid=false">{{ s }}</Button>
          <Button size="sm" :variant="fluid ? 'solid' : 'outlined'" @click="fluid = !fluid">{{ t('example.doc.container.sample.fluid') }}</Button>
        </Space>
        <div class="host">
          <Container :size="size" :fluid="fluid" class="box">
            {{ t('example.doc.container.sample.body') }}
          </Container>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.host { width: 100%; background: var(--surface-1); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); }
.box { background: var(--surface-2); padding-block: var(--spacing-lg); color: var(--text-secondary); font-size: var(--font-size-sm); text-align: center; }
</style>
`
  ],
  [
    'Center',
    'center',
    null,
    `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Center, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const axis = ref<'both' | 'horizontal' | 'vertical'>('both')

const codeBasic = demoSfc({
  imports: [\`import { Center } from '@amg-webui/components/base'\`],
  template: [
    '  <Center :axis="axis" class="stage">',
    \`    <span>{{ t('example.doc.center.sample.body') }}</span>\`,
    '  </Center>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'axis', type: "'both'|'horizontal'|'vertical'", defaultValue: "'both'", description: t('example.doc.center.prop.axis') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.center.when') }}</p>
    <DemoBlock :title="t('example.doc.center.demo.basic')" :description="t('example.doc.center.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="a in (['both','horizontal','vertical'] as const)" :key="a" size="sm" :variant="axis===a ? 'solid' : 'outlined'" @click="axis=a">{{ a }}</Button>
        </Space>
        <Center :axis="axis" class="stage">
          <span class="chip">{{ t('example.doc.center.sample.body') }}</span>
        </Center>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.stage {
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 6);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}
.chip {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
`
  ]
]

for (const [folder, , , content] of primitiveDemos) {
  writeDemo(folder, content)
}

writeDemo(
  'Spacer',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Spacer, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const flex = ref(true)

const codeBasic = demoSfc({
  imports: [\`import { Spacer, Button } from '@amg-webui/components/base'\`],
  template: [
    '  <div class="row">',
    \`    <Button size="sm">{{ t('example.doc.spacer.sample.left') }}</Button>\`,
    '    <Spacer :flex="true" />',
    \`    <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.right') }}</Button>\`,
    '  </div>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'flex', type: 'boolean', defaultValue: 'true', description: t('example.doc.spacer.prop.flex') },
  { name: 'size / axis', type: "'xs'…'2xl' / 'horizontal'|'vertical'", defaultValue: '- / horizontal', description: t('example.doc.spacer.prop.size') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.spacer.when') }}</p>
    <DemoBlock :title="t('example.doc.spacer.demo.basic')" :description="t('example.doc.spacer.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Button size="sm" variant="outlined" @click="flex = !flex">
          {{ flex ? t('example.doc.spacer.sample.flexOn') : t('example.doc.spacer.sample.flexOff') }}
        </Button>
        <div class="row">
          <Button size="sm">{{ t('example.doc.spacer.sample.left') }}</Button>
          <Spacer :flex="flex" :size="flex ? undefined : 'xl'" />
          <Button size="sm" variant="outlined">{{ t('example.doc.spacer.sample.right') }}</Button>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}
</style>
`
)

writeDemo(
  'Block',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Block, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const bordered = ref(true)
const padded = ref(true)

const codeBasic = demoSfc({
  imports: [\`import { Block } from '@amg-webui/components/base'\`],
  template: [
    '  <Block :bordered="true" :padded="true">',
    \`    <p>{{ t('example.doc.block.sample.body') }}</p>\`,
    '  </Block>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'padded / bordered / gap', type: 'boolean', defaultValue: 'true / false / true', description: t('example.doc.block.prop.flags') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.block.when') }}</p>
    <DemoBlock :title="t('example.doc.block.demo.basic')" :description="t('example.doc.block.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" :variant="bordered ? 'solid' : 'outlined'" @click="bordered = !bordered">{{ t('example.doc.block.sample.border') }}</Button>
          <Button size="sm" :variant="padded ? 'solid' : 'outlined'" @click="padded = !padded">{{ t('example.doc.block.sample.pad') }}</Button>
        </Space>
        <Block :bordered="bordered" :padded="padded">
          <p>{{ t('example.doc.block.sample.body') }}</p>
          <p>{{ t('example.doc.block.sample.body2') }}</p>
        </Block>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
)

writeDemo(
  'StackLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { StackLayout, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const direction = ref<'vertical' | 'horizontal'>('vertical')
const gap = ref<'sm' | 'md' | 'lg' | 'section'>('md')

const codeBasic = demoSfc({
  imports: [\`import { StackLayout } from '@amg-webui/components/base'\`],
  template: [
    '  <StackLayout direction="vertical" gap="md">',
    '    <div class="item">A</div>',
    '    <div class="item">B</div>',
    '    <div class="item">C</div>',
    '  </StackLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'direction', type: "'vertical'|'horizontal'", defaultValue: "'vertical'", description: t('example.doc.stackLayout.prop.direction') },
  { name: 'gap / align / justify', type: 'token / align / justify', defaultValue: "'md'", description: t('example.doc.stackLayout.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.stackLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.stackLayout.demo.basic')" :description="t('example.doc.stackLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" :variant="direction==='vertical'?'solid':'outlined'" @click="direction='vertical'">vertical</Button>
          <Button size="sm" :variant="direction==='horizontal'?'solid':'outlined'" @click="direction='horizontal'">horizontal</Button>
          <Button v-for="g in (['sm','md','lg','section'] as const)" :key="g" size="sm" :variant="gap===g?'solid':'outlined'" @click="gap=g">{{ g }}</Button>
        </Space>
        <StackLayout :direction="direction" :gap="gap" class="host">
          <div class="item">{{ t('example.doc.stackLayout.sample.a') }}</div>
          <div class="item">{{ t('example.doc.stackLayout.sample.b') }}</div>
          <div class="item">{{ t('example.doc.stackLayout.sample.c') }}</div>
        </StackLayout>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.host { width: 100%; padding: var(--spacing-md); background: var(--surface-1); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); box-sizing: border-box; }
.item { padding: var(--spacing-sm) var(--spacing-md); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-btn-radius); font-size: var(--font-size-sm); color: var(--text-secondary); }
</style>
`
)

writeDemo(
  'FlowLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlowLayout, Button, Tag, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const count = ref(6)
const gap = ref<'sm' | 'md' | 'lg'>('md')

const codeBasic = demoSfc({
  imports: [\`import { FlowLayout, Tag } from '@amg-webui/components/base'\`],
  template: [
    '  <FlowLayout gap="md">',
    '    <Tag v-for="n in 6" :key="n" :label="String(n)" />',
    '  </FlowLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'gap', type: "'xs'|'sm'|'md'|'lg'|'xl'", defaultValue: "'md'", description: t('example.doc.flowLayout.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.flowLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.flowLayout.demo.basic')" :description="t('example.doc.flowLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" variant="outlined" @click="count = Math.max(2, count - 1)">−</Button>
          <Button size="sm" variant="outlined" @click="count++">+</Button>
          <Button v-for="g in (['sm','md','lg'] as const)" :key="g" size="sm" :variant="gap===g?'solid':'outlined'" @click="gap=g">{{ g }}</Button>
        </Space>
        <FlowLayout :gap="gap" class="host">
          <Tag v-for="n in count" :key="n" size="sm" :label="t('example.doc.flowLayout.sample.chip', { n })" />
        </FlowLayout>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.host { width: 100%; padding: var(--spacing-md); background: var(--surface-1); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); box-sizing: border-box; }
</style>
`
)

writeDemo(
  'ColumnLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ColumnLayout, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const columns = ref(3)

const codeBasic = demoSfc({
  imports: [\`import { ColumnLayout } from '@amg-webui/components/base'\`],
  template: [
    '  <ColumnLayout :columns="3" gap="md">',
    '    <div class="cell">1</div>',
    '    <div class="cell">2</div>',
    '    <div class="cell">3</div>',
    '  </ColumnLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'columns', type: 'number', defaultValue: '2', description: t('example.doc.columnLayout.prop.columns') },
  { name: 'gap', type: "'sm'|'md'|'lg'|'xl'", defaultValue: "'md'", description: t('example.doc.columnLayout.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.columnLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.columnLayout.demo.basic')" :description="t('example.doc.columnLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="n in 4" :key="n" size="sm" :variant="columns===n?'solid':'outlined'" @click="columns=n">{{ n }}</Button>
        </Space>
        <ColumnLayout :columns="columns" gap="md">
          <div v-for="n in columns * 2" :key="n" class="cell">{{ t('example.doc.columnLayout.sample.cell', { n }) }}</div>
        </ColumnLayout>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.cell { padding: var(--theme-card-pad); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); font-size: var(--font-size-sm); color: var(--text-secondary); }
</style>
`
)

writeDemo(
  'CardGrid',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { CardGrid, Card, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const minTrack = ref<'sm' | 'md' | 'lg'>('md')
const count = ref(4)

const codeBasic = demoSfc({
  imports: [\`import { CardGrid, Card } from '@amg-webui/components/base'\`],
  template: [
    '  <CardGrid min-track="md" gap="lg">',
    '    <Card v-for="n in 4" :key="n">…</Card>',
    '  </CardGrid>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'minTrack', type: "'sm'|'md'|'lg'", defaultValue: "'md'", description: t('example.doc.cardGrid.prop.minTrack') },
  { name: 'gap', type: "'sm'|'md'|'lg'|'xl'", defaultValue: "'lg'", description: t('example.doc.cardGrid.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cardGrid.when') }}</p>
    <DemoBlock :title="t('example.doc.cardGrid.demo.basic')" :description="t('example.doc.cardGrid.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="s in (['sm','md','lg'] as const)" :key="s" size="sm" :variant="minTrack===s?'solid':'outlined'" @click="minTrack=s">{{ s }}</Button>
          <Button size="sm" variant="outlined" @click="count = Math.max(2, count - 1)">−</Button>
          <Button size="sm" variant="outlined" @click="count++">+</Button>
        </Space>
        <CardGrid :min-track="minTrack" gap="lg">
          <Card v-for="n in count" :key="n">{{ t('example.doc.cardGrid.sample.card', { n }) }}</Card>
        </CardGrid>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
)

writeDemo(
  'FixedLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { FixedLayout, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const position = ref<'top' | 'bottom' | 'left' | 'right'>('top')

const codeBasic = demoSfc({
  imports: [\`import { FixedLayout } from '@amg-webui/components/base'\`],
  template: [
    '  <div class="frame">',
    '    <FixedLayout mode="absolute" :position="position" offset="md">',
    \`      {{ t('example.doc.fixedLayout.sample.bar') }}\`,
    '    </FixedLayout>',
    '  </div>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'mode', type: "'fixed'|'absolute'", defaultValue: "'fixed'", description: t('example.doc.fixedLayout.prop.mode') },
  { name: 'position / offset', type: 'edge / spacing', defaultValue: "'top' / 'none'", description: t('example.doc.fixedLayout.prop.position') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.fixedLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.fixedLayout.demo.basic')" :description="t('example.doc.fixedLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="p in (['top','bottom','left','right'] as const)" :key="p" size="sm" :variant="position===p?'solid':'outlined'" @click="position=p">{{ p }}</Button>
        </Space>
        <div class="frame">
          <p class="hint">{{ t('example.doc.fixedLayout.sample.body') }}</p>
          <FixedLayout mode="absolute" :position="position" offset="md" class="bar">
            {{ t('example.doc.fixedLayout.sample.bar') }}
          </FixedLayout>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 8);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  box-sizing: border-box;
}
.hint {
  margin: 0;
  padding: var(--theme-card-pad);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
.bar {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-elevated, var(--surface-2));
  border: 1px solid var(--ds-border);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
</style>
`
)

writeDemo(
  'EmbedLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { EmbedLayout, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const ratio = ref('16 / 9')

const codeBasic = demoSfc({
  imports: [\`import { EmbedLayout } from '@amg-webui/components/base'\`],
  template: [
    '  <EmbedLayout aspect-ratio="16 / 9">',
    \`    <span>{{ t('example.doc.embedLayout.sample.body') }}</span>\`,
    '  </EmbedLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'aspectRatio', type: 'string', defaultValue: "'16 / 9'", description: t('example.doc.embedLayout.prop.ratio') },
  { name: 'rounded / bordered', type: 'boolean', defaultValue: 'true / true', description: t('example.doc.embedLayout.prop.chrome') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.embedLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.embedLayout.demo.basic')" :description="t('example.doc.embedLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" :variant="ratio==='16 / 9'?'solid':'outlined'" @click="ratio='16 / 9'">16:9</Button>
          <Button size="sm" :variant="ratio==='4 / 3'?'solid':'outlined'" @click="ratio='4 / 3'">4:3</Button>
          <Button size="sm" :variant="ratio==='1 / 1'?'solid':'outlined'" @click="ratio='1 / 1'">1:1</Button>
        </Space>
        <EmbedLayout :aspect-ratio="ratio">
          <span class="label">{{ t('example.doc.embedLayout.sample.body') }}</span>
        </EmbedLayout>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.label { font-size: var(--font-size-sm); color: var(--text-secondary); }
</style>
`
)

writeDemo(
  'ScaleLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ScaleLayout, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const scale = ref(1)

const codeBasic = demoSfc({
  imports: [\`import { ScaleLayout } from '@amg-webui/components/base'\`],
  template: [
    '  <ScaleLayout :scale="0.85">',
    '    <div class="panel">…</div>',
    '  </ScaleLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'scale', type: 'number', defaultValue: '1', description: t('example.doc.scaleLayout.prop.scale') },
  { name: 'origin', type: "'top-left'|'center'", defaultValue: "'top-left'", description: t('example.doc.scaleLayout.prop.origin') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.scaleLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.scaleLayout.demo.basic')" :description="t('example.doc.scaleLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button size="sm" variant="outlined" @click="scale = Math.max(0.5, +(scale - 0.1).toFixed(2))">−</Button>
          <Button size="sm" variant="outlined" @click="scale = Math.min(1.5, +(scale + 0.1).toFixed(2))">+</Button>
          <Button size="sm" variant="outlined" @click="scale = 1">100%</Button>
        </Space>
        <p class="vp-curated__hint">{{ t('example.doc.scaleLayout.sample.scale', { n: scale }) }}</p>
        <div class="host">
          <ScaleLayout :scale="scale">
            <div class="panel">{{ t('example.doc.scaleLayout.sample.body') }}</div>
          </ScaleLayout>
        </div>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.host { width: 100%; min-height: calc(var(--spacing-2xl) * 6); padding: var(--spacing-md); background: var(--surface-1); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); box-sizing: border-box; overflow: auto; }
.panel { padding: var(--theme-card-pad); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); font-size: var(--font-size-sm); color: var(--text-secondary); }
</style>
`
)

writeDemo(
  'FormLayout',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { FormLayout, InputText, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const labelWidth = ref<'sm' | 'md' | 'lg'>('md')
const name = ref('')
const mail = ref('')

const codeBasic = demoSfc({
  imports: [\`import { FormLayout, InputText } from '@amg-webui/components/base'\`],
  template: [
    '  <FormLayout label-width="md">',
    '    <div class="vp-form-layout__row">',
    '      <label class="vp-form-layout__label">…</label>',
    '      <div class="vp-form-layout__control"><InputText /></div>',
    '    </div>',
    '  </FormLayout>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'labelWidth', type: "'sm'|'md'|'lg'|'auto'", defaultValue: "'md'", description: t('example.doc.formLayout.prop.labelWidth') },
  { name: 'gap', type: "'sm'|'md'|'lg'", defaultValue: "'md'", description: t('example.doc.formLayout.prop.gap') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.formLayout.when') }}</p>
    <DemoBlock :title="t('example.doc.formLayout.demo.basic')" :description="t('example.doc.formLayout.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button v-for="w in (['sm','md','lg'] as const)" :key="w" size="sm" :variant="labelWidth===w?'solid':'outlined'" @click="labelWidth=w">{{ w }}</Button>
        </Space>
        <FormLayout :label-width="labelWidth">
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.name') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="name" :placeholder="t('example.doc.formLayout.sample.namePh')" />
            </div>
          </div>
          <div class="vp-form-layout__row">
            <label class="vp-form-layout__label">{{ t('example.doc.formLayout.sample.mail') }}</label>
            <div class="vp-form-layout__control">
              <InputText v-model="mail" :placeholder="t('example.doc.formLayout.sample.mailPh')" />
            </div>
          </div>
        </FormLayout>
        <p v-if="name || mail" class="vp-curated__hint">{{ t('example.doc.formLayout.sample.echo', { name: name || '—', mail: mail || '—' }) }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
)

console.log('all demos written')
