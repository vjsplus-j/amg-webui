<script setup lang="ts">
import { computed, ref } from 'vue'
import { Block, Button, Space } from '@amg-webui/components/base'
import type { BlockBg, BlockMargin } from '@amg-webui/components/base/Block'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const bordered = ref(true)
const padded = ref(true)
const fullBleed = ref(false)
const margin = ref<BlockMargin>('md')
const bg = ref<BlockBg>('surface-1')

const margins: BlockMargin[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'section']
const bgs: BlockBg[] = ['transparent', 'surface-0', 'surface-1', 'surface-2', 'elevated']

const raised = ref(false)

const codeBasic = demoSfc({
  imports: [`import { Block } from '@amg-webui/components/base'`],
  template: [
    '  <Block bordered padded margin="md" bg="surface-1">',
    `    <p>{{ t('example.doc.block.sample.body') }}</p>`,
    '  </Block>'
  ]
})

const codeNested = demoCode(
  `<Block bordered padded margin="md" bg="surface-1">`,
  `  <Block padded bg="surface-2" :raised="true">…</Block>`,
  `</Block>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'padded / bordered / gap / raised',
    type: 'boolean | gap token',
    defaultValue: 'true / false / true / false',
    description: t('example.doc.block.prop.flags')
  },
  {
    name: 'padding / display / bg / radius',
    type: 'token keys',
    defaultValue: "card / block / surface-1 / card",
    description: t('example.doc.block.prop.tokens')
  },
  {
    name: 'margin',
    type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section'",
    defaultValue: "'none'",
    description: t('example.doc.block.prop.margin')
  },
  {
    name: 'fullBleed',
    type: 'boolean',
    defaultValue: 'false',
    description: t('example.doc.block.prop.fullBleed')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.block.when') }}</p>
    <DemoBlock
      :title="t('example.doc.block.demo.basic')"
      :description="t('example.doc.block.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="host">
        <Space direction="vertical" block size="md">
          <Space wrap>
            <Button
              size="sm"
              :variant="bordered ? 'solid' : 'outlined'"
              @click="bordered = !bordered"
            >
              {{ t('example.doc.block.sample.border') }}
            </Button>
            <Button
              size="sm"
              :variant="padded ? 'solid' : 'outlined'"
              @click="padded = !padded"
            >
              {{ t('example.doc.block.sample.pad') }}
            </Button>
            <Button
              size="sm"
              :variant="fullBleed ? 'solid' : 'outlined'"
              @click="fullBleed = !fullBleed"
            >
              {{ t('example.doc.block.sample.fullBleed') }}
            </Button>
          </Space>
          <Space wrap>
            <Button
              v-for="m in margins"
              :key="m"
              size="sm"
              :variant="margin === m ? 'solid' : 'outlined'"
              @click="margin = m"
            >
              {{ t('example.doc.block.sample.margin', { m }) }}
            </Button>
          </Space>
          <Space wrap>
            <Button
              v-for="b in bgs"
              :key="b"
              size="sm"
              :variant="bg === b ? 'solid' : 'outlined'"
              @click="bg = b"
            >
              {{ b }}
            </Button>
          </Space>
          <Block
            :bordered="bordered"
            :padded="padded"
            :margin="margin"
            :bg="bg"
            :full-bleed="fullBleed"
          >
            <p>{{ t('example.doc.block.sample.body') }}</p>
            <p>{{ t('example.doc.block.sample.body2') }}</p>
          </Block>
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.block.demo.nested')"
      :description="t('example.doc.block.demo.nestedDesc')"
      :code="codeNested"
    >
      <div class="host">
        <Block bordered padded margin="md" bg="surface-1">
          <p>{{ t('example.doc.block.sample.body') }}</p>
          <Block padded bg="surface-2" :raised="raised">
            <p>{{ t('example.doc.block.sample.nested') }}</p>
          </Block>
        </Block>
        <Button size="sm" variant="outlined" class="host__toggle" @click="raised = !raised">
          {{ raised ? t('example.doc.block.sample.raisedOn') : t('example.doc.block.sample.raisedOff') }}
        </Button>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped>
.host {
  width: 100%;
  box-sizing: border-box;
  background: var(--surface-2);
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-md);
  overflow: hidden;
}

.host__toggle {
  margin-top: var(--spacing-md);
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
