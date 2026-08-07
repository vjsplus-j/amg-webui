<script setup lang="ts">
/**
 * Curated demo — Feedback wave2 ConfirmDialog
 */
import { ref } from 'vue'
import { ConfirmDialog } from '@amg-webui/overlay'
import { Button, Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const openWarning = ref(false)
const openDanger = ref(false)
const openSuccess = ref(false)
const openInfo = ref(false)
const lastAction = ref('')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { ConfirmDialog } from '@amg-webui/overlay'
import { Button } from '@amg-webui/core'`
  ],
  script: ['const open = ref(false)'],
  template: [
    `  <Button @click="open = true">{{ t('example.doc.confirmDialog.sample.open') }}</Button>`,
    `  <ConfirmDialog`,
    `    v-model:visible="open"`,
    `    icon="warning"`,
    `    :title="t('example.doc.confirmDialog.sample.titleWarning')"`,
    `    :message="t('example.doc.confirmDialog.sample.message')"`,
    `  />`
  ]
})

const codeIcons = demoCode(
  `<Button @click="openDanger = true">{{ t('example.doc.confirmDialog.sample.openDanger') }}</Button>`,
  `<ConfirmDialog v-model:visible="openDanger" icon="danger" :title="t('example.doc.confirmDialog.sample.titleDanger')" :message="t('example.doc.confirmDialog.sample.message')" />`,
  `<Button @click="openSuccess = true">{{ t('example.doc.confirmDialog.sample.openSuccess') }}</Button>`,
  `<ConfirmDialog v-model:visible="openSuccess" icon="success" :title="t('example.doc.confirmDialog.sample.titleSuccess')" :message="t('example.doc.confirmDialog.sample.message')" />`
)

function noteAction(kind: string) {
  lastAction.value = kind
}

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.confirmDialog.demo.basic')"
      :description="t('example.doc.confirmDialog.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Button
          severity="primary"
          :label="t('example.doc.confirmDialog.sample.open')"
          @click="openWarning = true"
        />
      </div>
      <ConfirmDialog
        v-model:visible="openWarning"
        icon="warning"
        :title="t('example.doc.confirmDialog.sample.titleWarning')"
        :message="t('example.doc.confirmDialog.sample.message')"
        @confirm="noteAction('warning')"
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.confirmDialog.demo.icons')"
      :description="t('example.doc.confirmDialog.demo.iconsDesc')"
      :code="codeIcons"
    >
      <Space direction="vertical" block size="md">
        <div class="vp-curated__row">
          <Button
            severity="danger"
            size="sm"
            :label="t('example.doc.confirmDialog.sample.openDanger')"
            @click="openDanger = true"
          />
          <Button
            severity="success"
            size="sm"
            :label="t('example.doc.confirmDialog.sample.openSuccess')"
            @click="openSuccess = true"
          />
          <Button
            severity="info"
            size="sm"
            :label="t('example.doc.confirmDialog.sample.openInfo')"
            @click="openInfo = true"
          />
        </div>
        <p v-if="lastAction" class="vp-confirmdialog-demo__hint">
          {{ t('example.doc.confirmDialog.sample.confirmed', { kind: lastAction }) }}
        </p>
      </Space>
      <ConfirmDialog
        v-model:visible="openDanger"
        icon="danger"
        :title="t('example.doc.confirmDialog.sample.titleDanger')"
        :message="t('example.doc.confirmDialog.sample.message')"
        @confirm="noteAction('danger')"
      />
      <ConfirmDialog
        v-model:visible="openSuccess"
        icon="success"
        :title="t('example.doc.confirmDialog.sample.titleSuccess')"
        :message="t('example.doc.confirmDialog.sample.message')"
        @confirm="noteAction('success')"
      />
      <ConfirmDialog
        v-model:visible="openInfo"
        icon="info"
        :title="t('example.doc.confirmDialog.sample.titleInfo')"
        :message="t('example.doc.confirmDialog.sample.message')"
        @confirm="noteAction('info')"
      />
    </DemoBlock>
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

.vp-confirmdialog-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
