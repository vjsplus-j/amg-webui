<script setup lang="ts">
/**
 * Curated demo — Dialog
 */
import { ref } from 'vue'
import { Dialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import Basic from './parts/Basic.vue'
import basicSource from '@amg-webui/demos/dialog/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const footerOpen = ref(false)
const maxOpen = ref(false)
const nestedOuterOpen = ref(false)
const nestedInnerOpen = ref(false)

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

</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dialog.when') }}</p>

    <DemoBlock
      :title="t('example.doc.dialog.demo.basic')"
      :description="t('example.doc.dialog.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
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
  </div>
</template>
