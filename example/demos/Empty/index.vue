<script setup lang="ts">
/**
 * Curated demo — aligned to Avatar gold standard (`demoCode.ts` header).
 */
import { computed, ref } from 'vue'
import { Button, Empty } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const lastEvent = ref('')
const imgBroken = 'https://invalid.amg-webui.local/empty-404.png'
const imgOk =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" viewBox="0 0 96 64"><rect width="96" height="64" rx="8" fill="%23e8eef5"/><path d="M28 40h40v4H28zm8-12h24v4H36z" fill="%2390a4b8"/></svg>`
  )

function noteEvent(kind: string) {
  lastEvent.value = kind
}

/* ─── Code snippets: must mirror preview 1:1 (no `…`) ─── */

const codeBasic = demoSfc({
  imports: [`import { Empty } from '@amg-webui/core'`],
  template: [`  <Empty />`]
})

const codeTitle = demoCode(
  `<Empty`,
  `  :title="t('example.doc.empty.sample.title')"`,
  `  :description="t('example.doc.empty.sample.description')"`,
  `/>`
)

const codeImage = demoCode(
  `<Empty`,
  `  :image="imgOk"`,
  `  :image-alt="t('example.doc.empty.sample.title')"`,
  `  image-size="lg"`,
  `  :description="t('example.doc.empty.sample.description')"`,
  `/>`
)

const codeImageError = demoCode(
  `<Empty`,
  `  :image="imgBroken"`,
  `  :description="t('example.doc.empty.sample.brokenImage')"`,
  `  @image-error="onImageError"`,
  `/>`
)

const codeSlots = demoCode(
  `<Empty>`,
  `  <template #title>{{ t('example.doc.empty.sample.title') }}</template>`,
  `  <template #description>`,
  `    {{ t('example.doc.empty.sample.description') }}`,
  `  </template>`,
  `  <Button size="sm">{{ t('example.doc.empty.sample.action') }}</Button>`,
  `</Empty>`
)

const codeEvents = demoCode(
  `<Empty`,
  `  :image="imgBroken"`,
  `  @image-error="noteEvent('imageError')"`,
  `/>`
)

/* ─── API tables ─── */

const propRows = computed<PropRow[]>(() => [
  {
    name: 'description',
    description: t('example.doc.empty.prop.description'),
    type: 'string',
    defaultValue: 't(common.noData)'
  },
  {
    name: 'title',
    description: t('example.doc.empty.prop.title'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'image',
    description: t('example.doc.empty.prop.image'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'imageAlt',
    description: t('example.doc.empty.prop.imageAlt'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'imageSize',
    description: t('example.doc.empty.prop.imageSize'),
    type: "Size | number | string",
    defaultValue: "'md'"
  },
  {
    name: 'imageStyle',
    description: t('example.doc.empty.prop.imageStyle'),
    type: 'Record<string, string>',
    defaultValue: '-'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'imageError',
    description: t('example.doc.empty.emit.imageError'),
    type: '(event: Event) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.empty.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'image',
    description: t('example.doc.empty.slot.image'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'title',
    description: t('example.doc.empty.slot.title'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'description',
    description: t('example.doc.empty.slot.description'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.empty.demo.basic')"
      :description="t('example.doc.empty.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Empty />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.empty.demo.title')"
      :description="t('example.doc.empty.demo.titleDesc')"
      :code="codeTitle"
    >
      <Empty
        :title="t('example.doc.empty.sample.title')"
        :description="t('example.doc.empty.sample.description')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.empty.demo.image')"
      :description="t('example.doc.empty.demo.imageDesc')"
      :code="codeImage"
    >
      <Empty
        :image="imgOk"
        :image-alt="t('example.doc.empty.sample.title')"
        image-size="lg"
        :description="t('example.doc.empty.sample.description')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.empty.demo.imageError')"
      :description="t('example.doc.empty.demo.imageErrorDesc')"
      :code="codeImageError"
    >
      <Empty
        :image="imgBroken"
        :description="t('example.doc.empty.sample.brokenImage')"
        @image-error="noteEvent('imageError')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.empty.demo.slots')"
      :description="t('example.doc.empty.demo.slotsDesc')"
      :code="codeSlots"
    >
      <Empty>
        <template #title>{{ t('example.doc.empty.sample.title') }}</template>
        <template #description>
          {{ t('example.doc.empty.sample.description') }}
        </template>
        <Button size="sm">{{ t('example.doc.empty.sample.action') }}</Button>
      </Empty>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.empty.demo.events')"
      :description="t('example.doc.empty.demo.eventsDesc')"
      :code="codeEvents"
    >
      <div class="vp-empty-demo__events">
        <Empty
          :image="imgBroken"
          @image-error="noteEvent('imageError')"
        />
        <p class="vp-empty-demo__log">
          {{
            lastEvent
              ? t('example.doc.empty.sample.eventLog', { event: lastEvent })
              : t('example.doc.empty.sample.eventIdle')
          }}
        </p>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />

      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-empty-demo__events {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-empty-demo__log {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
