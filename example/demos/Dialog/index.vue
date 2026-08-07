<script setup lang="ts">
/**
 * Curated demo — Dialog
 */
import { computed, ref } from 'vue'
import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const basicOpen = ref(false)
const footerOpen = ref(false)
const maxOpen = ref(false)
const nestedOuterOpen = ref(false)
const nestedInnerOpen = ref(false)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: ['const open = ref(false)'],
  template: [
    `  <Button severity="primary" :label="t('example.doc.dialog.sample.open')" @click="open = true" />`,
    `  <Dialog v-model:visible="open" :title="t('example.doc.dialog.sample.title')">`,
    `    {{ t('example.doc.dialog.sample.body') }}`,
    `  </Dialog>`
  ]
})

const codeFooter = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: ['const open = ref(false)'],
  template: [
    `  <Button :label="t('example.doc.dialog.sample.open')" @click="open = true" />`,
    `  <Dialog v-model:visible="open" :title="t('example.doc.dialog.sample.title')">`,
    `    {{ t('example.doc.dialog.sample.body') }}`,
    `    <template #footer>`,
    `      <Button variant="outlined" :label="t('button.cancel')" @click="open = false" />`,
    `      <Button severity="primary" :label="t('button.confirm')" @click="open = false" />`,
    `    </template>`,
    `  </Dialog>`
  ]
})

const codeMax = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: ['const open = ref(false)'],
  template: [
    `  <Button :label="t('example.doc.dialog.sample.openMax')" @click="open = true" />`,
    `  <Dialog`,
    `    v-model:visible="open"`,
    `    maximizable`,
    `    size="lg"`,
    `    :title="t('example.doc.dialog.sample.title')"`,
    `  >`,
    `    {{ t('example.doc.dialog.sample.body') }}`,
    `  </Dialog>`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'visible',
    description: t('example.doc.dialog.prop.visible'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'title / header',
    description: t('example.doc.dialog.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'size',
    description: t('example.doc.dialog.prop.size'),
    type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
    defaultValue: "'md'"
  },
  {
    name: 'modal / dismissible / closable',
    description: t('example.doc.dialog.prop.modal'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'maximizable',
    description: t('example.doc.dialog.prop.maximizable'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:visible / close / show / hide',
    description: t('example.doc.dialog.event.visible'),
    type: '(value: boolean | Event) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.dialog.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  },
  {
    name: 'header / footer',
    description: t('example.doc.dialog.slot.footer'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dialog.when') }}</p>

    <DemoBlock
      :title="t('example.doc.dialog.demo.basic')"
      :description="t('example.doc.dialog.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Button
          severity="primary"
          :label="t('example.doc.dialog.sample.open')"
          @click="basicOpen = true"
        />
      </div>
      <Dialog v-model:visible="basicOpen" :title="t('example.doc.dialog.sample.title')">
        {{ t('example.doc.dialog.sample.body') }}
      </Dialog>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dialog.demo.footer')"
      :description="t('example.doc.dialog.demo.footerDesc')"
      :code="codeFooter"
    >
      <div class="vp-curated__row">
        <Button
          variant="outlined"
          :label="t('example.doc.dialog.sample.open')"
          @click="footerOpen = true"
        />
      </div>
      <Dialog v-model:visible="footerOpen" :title="t('example.doc.dialog.sample.title')">
        {{ t('example.doc.dialog.sample.body') }}
        <template #footer>
          <Button
            variant="outlined"
            :label="t(LocaleKeys.button.cancel)"
            @click="footerOpen = false"
          />
          <Button
            severity="primary"
            :label="t(LocaleKeys.button.confirm)"
            @click="footerOpen = false"
          />
        </template>
      </Dialog>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dialog.demo.max')"
      :description="t('example.doc.dialog.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-curated__row">
        <Button
          severity="secondary"
          :label="t('example.doc.dialog.sample.openMax')"
          @click="maxOpen = true"
        />
      </div>
      <Dialog
        v-model:visible="maxOpen"
        maximizable
        size="lg"
        :title="t('example.doc.dialog.sample.title')"
      >
        {{ t('example.doc.dialog.sample.body') }}
      </Dialog>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dialog.demo.nested')"
      :description="t('example.doc.dialog.demo.nestedDesc')"
    >
      <div class="vp-curated__row" data-demo="dialog-nested-stack">
        <Button
          severity="primary"
          :label="t('example.doc.dialog.sample.open')"
          @click="nestedOuterOpen = true"
        />
      </div>
      <Dialog
        v-model:visible="nestedOuterOpen"
        :title="t('example.doc.dialog.sample.title')"
      >
        {{ t('example.doc.dialog.sample.body') }}
        <div class="vp-curated__row">
          <Button
            severity="secondary"
            :label="t('example.doc.dialog.sample.openInner')"
            @click="nestedInnerOpen = true"
          />
        </div>
        <Dialog
          v-model:visible="nestedInnerOpen"
          :title="t('example.doc.dialog.sample.innerTitle')"
        >
          {{ t('example.doc.dialog.sample.innerBody') }}
        </Dialog>
      </Dialog>
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
