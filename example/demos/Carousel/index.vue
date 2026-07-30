<script setup lang="ts">
/**
 * Curated demo — Data wave1 Carousel
 */
import { computed, ref } from 'vue'
import { Carousel, Button, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const slideIndex = ref(0)
const autoplay = ref(true)

const slides = computed(() => [
  {
    id: 1,
    title: t('example.doc.carousel.sample.s1'),
    content: t('example.doc.carousel.sample.c1')
  },
  {
    id: 2,
    title: t('example.doc.carousel.sample.s2'),
    content: t('example.doc.carousel.sample.c2')
  },
  {
    id: 3,
    title: t('example.doc.carousel.sample.s3'),
    content: t('example.doc.carousel.sample.c3')
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Carousel } from '@amg-webui/components/base'`
  ],
  script: [
    `const slideIndex = ref(0)`,
    `const slides = computed(() => [/* … */])`
  ],
  template: [
    `  <Carousel v-model="slideIndex" :slides="slides" />`
  ]
})

const codeAutoplay = demoCode(
  `<Carousel`,
  `  v-model="slideIndex"`,
  `  :slides="slides"`,
  `  :autoplay="autoplay"`,
  `  :interval="4000"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'slides',
    description: t('example.doc.carousel.prop.slides'),
    type: 'Slide[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.carousel.prop.modelValue'),
    type: 'number',
    defaultValue: '0'
  },
  {
    name: 'autoplay / interval',
    description: t('example.doc.carousel.prop.autoplay'),
    type: 'boolean / number',
    defaultValue: 'true / 4000'
  },
  {
    name: 'disabled',
    description: t('example.doc.carousel.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.carousel.event.change'),
    type: '(index: number) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.carousel.demo.basic')"
      :description="t('example.doc.carousel.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Carousel v-model="slideIndex" :slides="slides" />
        <p class="vp-curated__hint">
          {{ t('example.doc.carousel.sample.active') }}: {{ slideIndex + 1 }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.carousel.demo.autoplay')"
      :description="t('example.doc.carousel.demo.autoplayDesc')"
      :code="codeAutoplay"
    >
      <Space direction="vertical" block size="md">
        <Button
          size="sm"
          :variant="autoplay ? 'solid' : 'outlined'"
          :label="t('example.doc.carousel.demo.autoplayToggle')"
          @click="autoplay = !autoplay"
        />
        <Carousel
          v-model="slideIndex"
          :slides="slides"
          :autoplay="autoplay"
          :interval="4000"
        />
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
