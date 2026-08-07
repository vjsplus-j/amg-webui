<script setup lang="ts">
/**
 * Curated demo — Data wave1 Carousel
 */
import { ref, computed } from 'vue'
import { Carousel, Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { Carousel } from '@amg-webui/core'`
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
</style>
