<script setup lang="ts">
import { computed, ref } from 'vue'
import { CardGrid, Card, Button, Space, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc, demoCode } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

type Mode = 'auto' | 'fixed'
type SelectMode = 'single' | 'multiple'
const mode = ref<Mode>('auto')
const selectMode = ref<SelectMode>('single')
const minTrack = ref<'sm' | 'md' | 'lg'>('md')
const fit = ref<'fill' | 'fit'>('fill')
const columns = ref(3)
const gap = ref<'sm' | 'md' | 'lg' | 'xl' | 'section'>('lg')
const equalHeight = ref(true)
const count = ref(5)
const selected = ref<number[]>([1])

const cards = computed(() =>
  Array.from({ length: count.value }, (_, i) => {
    const n = i + 1
    return {
      n,
      title: t('example.doc.cardGrid.sample.title', { n }),
      body:
        n % 3 === 0
          ? t('example.doc.cardGrid.sample.bodyLong', { n })
          : t('example.doc.cardGrid.sample.body', { n })
    }
  })
)

const selectedLabel = computed(() =>
  selected.value.length
    ? selected.value.join(', ')
    : t('example.doc.cardGrid.sample.noneSelected')
)

const codeAuto = demoSfc({
  imports: [`import { CardGrid, Card } from '@amg-webui/core'`],
  template: [
    '  <CardGrid min-track="md" gap="lg" equal-height>',
    '    <Card',
    '      v-for="n in 5"',
    '      :key="n"',
    '      bordered',
    '      selectable',
    '      :selected="selected.includes(n)"',
    '      @click="toggle(n)"',
    '    >…</Card>',
    '  </CardGrid>'
  ]
})

const codeFixed = demoCode(
  `<CardGrid :columns="3" gap="lg" equal-height>`,
  `  <Card v-for="n in 6" :key="n" bordered selectable :selected="…">…</Card>`,
  `</CardGrid>`
)

function isSelected(n: number) {
  return selected.value.includes(n)
}

function toggle(n: number) {
  if (selectMode.value === 'single') {
    selected.value = selected.value[0] === n ? [] : [n]
    return
  }
  if (isSelected(n)) {
    selected.value = selected.value.filter((x) => x !== n)
  } else {
    selected.value = [...selected.value, n].sort((a, b) => a - b)
  }
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'columns',
    type: 'number (1–6)',
    defaultValue: '-',
    description: t('example.doc.cardGrid.prop.columns')
  },
  {
    name: 'minTrack',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: t('example.doc.cardGrid.prop.minTrack')
  },
  {
    name: 'fit',
    type: "'fill' | 'fit'",
    defaultValue: "'fill'",
    description: t('example.doc.cardGrid.prop.fit')
  },
  {
    name: 'gap',
    type: "'sm' | 'md' | 'lg' | 'xl' | 'section'",
    defaultValue: "'lg'",
    description: t('example.doc.cardGrid.prop.gap')
  },
  {
    name: 'equalHeight',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.cardGrid.prop.equalHeight')
  },
  {
    name: 'Card.selected / selectable',
    type: 'boolean',
    defaultValue: 'false / false',
    description: t('example.doc.cardGrid.prop.selected')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.cardGrid.when') }}</p>

    <DemoBlock
      :title="t('example.doc.cardGrid.demo.basic')"
      :description="t('example.doc.cardGrid.demo.basicDesc')"
      :code="codeAuto"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            size="sm"
            :variant="mode === 'auto' ? 'solid' : 'outlined'"
            @click="mode = 'auto'"
          >
            {{ t('example.doc.cardGrid.sample.modeAuto') }}
          </Button>
          <Button
            size="sm"
            :variant="mode === 'fixed' ? 'solid' : 'outlined'"
            @click="mode = 'fixed'"
          >
            {{ t('example.doc.cardGrid.sample.modeFixed') }}
          </Button>
          <Button size="sm" variant="outlined" @click="count = Math.max(2, count - 1)">−</Button>
          <Button size="sm" variant="outlined" @click="count++">+</Button>
          <Tag size="sm" :label="t('example.doc.cardGrid.sample.count', { n: count })" />
        </Space>

        <Space wrap>
          <Button
            size="sm"
            :variant="selectMode === 'single' ? 'solid' : 'outlined'"
            @click="selectMode = 'single'; selected = selected.slice(0, 1)"
          >
            {{ t('example.doc.cardGrid.sample.selectSingle') }}
          </Button>
          <Button
            size="sm"
            :variant="selectMode === 'multiple' ? 'solid' : 'outlined'"
            @click="selectMode = 'multiple'"
          >
            {{ t('example.doc.cardGrid.sample.selectMultiple') }}
          </Button>
          <Button size="sm" variant="text" @click="selected = []">
            {{ t('example.doc.cardGrid.sample.clear') }}
          </Button>
        </Space>

        <Space v-if="mode === 'auto'" wrap>
          <Button
            v-for="s in (['sm', 'md', 'lg'] as const)"
            :key="s"
            size="sm"
            :variant="minTrack === s ? 'solid' : 'outlined'"
            @click="minTrack = s"
          >
            {{ t('example.doc.cardGrid.sample.track', { s }) }}
          </Button>
          <Button
            size="sm"
            :variant="fit === 'fill' ? 'solid' : 'outlined'"
            @click="fit = 'fill'"
          >
            {{ t('example.doc.cardGrid.sample.fitFill') }}
          </Button>
          <Button
            size="sm"
            :variant="fit === 'fit' ? 'solid' : 'outlined'"
            @click="fit = 'fit'"
          >
            {{ t('example.doc.cardGrid.sample.fitFit') }}
          </Button>
        </Space>

        <Space v-else wrap>
          <Button
            v-for="n in 4"
            :key="n"
            size="sm"
            :variant="columns === n ? 'solid' : 'outlined'"
            @click="columns = n"
          >
            {{ t('example.doc.cardGrid.sample.cols', { n }) }}
          </Button>
        </Space>

        <Space wrap>
          <Button
            v-for="g in (['sm', 'md', 'lg', 'xl', 'section'] as const)"
            :key="g"
            size="sm"
            :variant="gap === g ? 'solid' : 'outlined'"
            @click="gap = g"
          >
            {{ g }}
          </Button>
          <Button
            size="sm"
            :variant="equalHeight ? 'solid' : 'outlined'"
            @click="equalHeight = !equalHeight"
          >
            {{ t('example.doc.cardGrid.sample.equalHeight') }}
          </Button>
        </Space>

        <p class="vp-curated__hint">
          {{ t('example.doc.cardGrid.sample.selected', { list: selectedLabel }) }}
        </p>

        <CardGrid
          :columns="mode === 'fixed' ? columns : undefined"
          :min-track="minTrack"
          :fit="fit"
          :gap="gap"
          :equal-height="equalHeight"
        >
          <Card
            v-for="c in cards"
            :key="c.n"
            bordered
            selectable
            :selected="isSelected(c.n)"
            :header="c.title"
            @click="toggle(c.n)"
          >
            {{ c.body }}
          </Card>
        </CardGrid>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.cardGrid.demo.fixed')"
      :description="t('example.doc.cardGrid.demo.fixedDesc')"
      :code="codeFixed"
    >
      <CardGrid :columns="3" gap="md" equal-height>
        <Card
          v-for="n in 6"
          :key="n"
          bordered
          selectable
          :selected="isSelected(n)"
          :header="t('example.doc.cardGrid.sample.title', { n })"
          @click="toggle(n)"
        >
          {{ t('example.doc.cardGrid.sample.body', { n }) }}
        </Card>
      </CardGrid>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>
