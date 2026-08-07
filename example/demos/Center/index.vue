<script setup lang="ts">
/**
 * Curated demo — Layout wave2 Center
 */
import { computed, ref } from 'vue'
import { Center, Button, Space } from '@amg-webui/core'
import type { CenterAxis } from '@amg-webui/core/Center'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { LocaleKey } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const axis = ref<CenterAxis>('top')
const flush = ref(true)
const fill = ref(false)
const axes: CenterAxis[] = ['both', 'horizontal', 'vertical', 'top', 'bottom', 'left', 'right']

const AXIS_KEYS = {
  both: 'example.doc.center.sample.axis.both',
  horizontal: 'example.doc.center.sample.axis.horizontal',
  vertical: 'example.doc.center.sample.axis.vertical',
  top: 'example.doc.center.sample.axis.top',
  bottom: 'example.doc.center.sample.axis.bottom',
  left: 'example.doc.center.sample.axis.left',
  right: 'example.doc.center.sample.axis.right'
} as const satisfies Record<CenterAxis, LocaleKey>

const bodyText = computed(() =>
  t('example.doc.center.sample.bodyState', {
    axis: t(AXIS_KEYS[axis.value]),
    flush: flush.value
      ? t('example.doc.center.sample.flushOn')
      : t('example.doc.center.sample.flushOff')
  })
)

const codeBasic = demoSfc({
  imports: [`import { Center } from '@amg-webui/core'`],
  template: [
    '  <Center axis="top" :flush="false" class="stage">',
    `    <p>{{ t('example.doc.center.sample.body') }}</p>`,
    '  </Center>'
  ]
})

const codeFill = demoCode(
  `<Center axis="both" fill min-height="viewport" class="stage">`,
  `  <p>{{ t('example.doc.center.sample.body') }}</p>`,
  `</Center>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'axis',
    type: "'both' | 'horizontal' | 'vertical' | 'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'both'",
    description: t('example.doc.center.prop.axis')
  },
  {
    name: 'flush',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.center.prop.flush')
  },
  {
    name: 'minHeight / fill',
    type: "token | 'fill' | 'viewport' / boolean",
    defaultValue: "'none' / false",
    description: t('example.doc.center.prop.minHeight')
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.center.demo.basic')"
      :description="t('example.doc.center.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Space wrap>
          <Button
            v-for="a in axes"
            :key="a"
            size="sm"
            :variant="axis === a ? 'solid' : 'outlined'"
            @click="axis = a"
          >
            {{ t(AXIS_KEYS[a]) }}
          </Button>
        </Space>
        <Space wrap>
          <Button
            size="sm"
            :variant="flush ? 'solid' : 'outlined'"
            @click="flush = true"
          >
            {{ t('example.doc.center.sample.flushOn') }}
          </Button>
          <Button
            size="sm"
            :variant="!flush ? 'solid' : 'outlined'"
            @click="flush = false"
          >
            {{ t('example.doc.center.sample.flushOff') }}
          </Button>
        </Space>
        <Center :axis="axis" :flush="flush" min-height="lg" class="stage">
          <p class="vp-center-demo__text">{{ bodyText }}</p>
        </Center>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.center.demo.fill')"
      :description="t('example.doc.center.demo.fillDesc')"
      :code="codeFill"
    >
      <Space direction="vertical" block size="md">
        <Button
          size="sm"
          :variant="fill ? 'solid' : 'outlined'"
          @click="fill = !fill"
        >
          {{ fill ? t('example.doc.center.sample.fillOn') : t('example.doc.center.sample.fillOff') }}
        </Button>
        <Center axis="both" :fill="fill" min-height="lg" class="stage stage--tall">
          <p class="vp-center-demo__text">{{ t('example.doc.center.sample.body') }}</p>
        </Center>
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
.stage {
  width: 100%;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}

.stage--tall {
  min-height: calc(var(--spacing-2xl) * 6);
}

.vp-center-demo__text {
  margin: 0;
  max-width: calc(var(--spacing-2xl) * 10);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
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
