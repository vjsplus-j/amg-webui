<script setup lang="ts">
/**
 * Curated demo — feedback wave1 Loading
 */
import { computed, ref } from 'vue'
import { Loading, Button, Space } from '@amg-webui/components/base'
import type { LoadingSize } from '@amg-webui/components/base/Loading/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const inlineVisible = ref(false)
const fullscreenVisible = ref(false)
const sizes: LoadingSize[] = ['sm', 'md', 'lg']

function toggleInline() {
  inlineVisible.value = !inlineVisible.value
}

function toggleFullscreen() {
  fullscreenVisible.value = !fullscreenVisible.value
}

const codeToggle = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Loading, Button } from '@amg-webui/components/base'`
  ],
  script: [`const visible = ref(false)`],
  template: [
    `  <Button :label="t('example.doc.loading.sample.show')" @click="visible = true" />`,
    `  <Loading :visible="visible" />`
  ]
})

const codeSize = demoCode(
  `<Loading visible size="sm" />`,
  `<Loading visible size="md" />`,
  `<Loading visible size="lg" />`
)

const codeFullscreen = demoCode(
  `<Button :label="t('example.doc.loading.sample.show')" @click="visible = true" />`,
  `<Loading :visible="visible" fullscreen />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.loading.prop.visible'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'size',
    description: t('example.doc.loading.prop.size'),
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'"
  },
  {
    name: 'text / fullscreen / lockScroll',
    description: t('example.doc.loading.prop.text'),
    type: 'string | boolean',
    defaultValue: '— / false / true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'after-enter / after-leave',
    description: t('example.doc.loading.event.transition'),
    type: '() => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.loading.demo.toggle')"
      :description="t('example.doc.loading.demo.toggleDesc')"
      :code="codeToggle"
      default-open
    >
      <div class="vp-curated__panel">
        <Space>
          <Button
            severity="primary"
            :label="
              inlineVisible
                ? t('example.doc.loading.sample.hide')
                : t('example.doc.loading.sample.show')
            "
            @click="toggleInline"
          />
        </Space>
        <div class="vp-curated__panel-body">
          <Loading :visible="inlineVisible" />
          <p v-if="!inlineVisible" class="vp-curated__placeholder">
            {{ t('example.doc.loading.sample.placeholder') }}
          </p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.loading.demo.size')"
      :description="t('example.doc.loading.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <div v-for="sz in sizes" :key="sz" class="vp-curated__size-cell">
            <Loading visible :size="sz" />
            <span class="vp-curated__size-label">{{ sz }}</span>
          </div>
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.loading.demo.fullscreen')"
      :description="t('example.doc.loading.demo.fullscreenDesc')"
      :code="codeFullscreen"
    >
      <div class="vp-curated__row">
        <Button
          variant="outlined"
          :label="
            fullscreenVisible
              ? t('example.doc.loading.sample.hide')
              : t('example.doc.loading.sample.show')
          "
          @click="toggleFullscreen"
        />
        <Loading :visible="fullscreenVisible" fullscreen />
      </div>
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
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

.vp-curated__panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.vp-curated__panel-body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--height-xl, 8rem);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}

.vp-curated__placeholder {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__size-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: var(--height-lg, 4rem);
}

.vp-curated__size-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
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
