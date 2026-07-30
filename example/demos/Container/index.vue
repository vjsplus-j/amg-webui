<script setup lang="ts">
/**
 * Curated demo — Layout wave1 Container
 */
import { computed, ref } from 'vue'
import { Container, Space, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const size = ref<'sm' | 'md' | 'lg' | 'xl'>('lg')
const fluid = ref(false)

const sizes = ['sm', 'md', 'lg', 'xl'] as const

const codeSize = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Container } from '@amg-webui/components/base'`
  ],
  script: [`const size = ref('lg')`],
  template: [
    `  <Container :size="size" gap="md">`,
    `    <p>{{ t('example.doc.container.sample.body') }}</p>`,
    `  </Container>`
  ]
})

const codeFluid = demoCode(
  `<Container :fluid="fluid" gap="section">`,
  `  <p>{{ t('example.doc.container.sample.body') }}</p>`,
  `</Container>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'size',
    description: t('example.doc.container.prop.size'),
    type: "'sm' | 'md' | 'lg' | 'xl' | 'fluid'",
    defaultValue: "'lg'"
  },
  {
    name: 'fluid',
    description: t('example.doc.container.prop.fluid'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'padded / align / gap',
    description: t('example.doc.container.prop.layout'),
    type: 'boolean / string / token gap',
    defaultValue: 'padded=true'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.container.demo.size')"
      :description="t('example.doc.container.demo.sizeDesc')"
      :code="codeSize"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="s in sizes"
            :key="s"
            size="sm"
            :variant="size === s && !fluid ? 'solid' : 'outlined'"
            @click="size = s; fluid = false"
          >
            {{ s }}
          </Button>
        </Space>
        <div class="preview-band">
          <Container :size="size" gap="md" :fluid="fluid">
            <div class="panel">
              <p class="panel__title">{{ t('example.doc.container.sample.title') }}</p>
              <p class="panel__body">{{ t('example.doc.container.sample.body') }}</p>
            </div>
          </Container>
        </div>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.container.demo.fluid')"
      :description="t('example.doc.container.demo.fluidDesc')"
      :code="codeFluid"
    >
      <Space direction="vertical" block size="md">
        <Button
          size="sm"
          :variant="fluid ? 'solid' : 'outlined'"
          @click="fluid = !fluid"
        >
          {{ t('example.doc.container.sample.fluid') }}
        </Button>
        <div class="preview-band">
          <Container :fluid="fluid" gap="section">
            <div class="panel">
              <p class="panel__title">{{ t('example.doc.container.sample.title') }}</p>
              <p class="panel__body">{{ t('example.doc.container.sample.lead') }}</p>
            </div>
          </Container>
        </div>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.preview-band {
  width: 100%;
  min-width: 0;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.panel {
  padding: var(--theme-card-pad);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-sizing: border-box;
}

.panel__title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.panel__body {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
