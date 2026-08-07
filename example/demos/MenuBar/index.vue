<script setup lang="ts">
/**
 * Curated demo — Navigation wave2 MenuBar
 */
import { computed, ref } from 'vue'
import { MenuBar, Space } from '@amg-webui/core'
import type { MenuBarItem } from '@amg-webui/core/MenuBar'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref('file-new')
const lastCommand = ref('')
const compactActive = ref('edit-undo')

const items = computed<MenuBarItem[]>(() => [
  {
    label: t('example.doc.menuBar.sample.file'),
    command: 'file',
    children: [
      { label: t('example.doc.menuBar.sample.new'), command: 'file-new' },
      { label: t('example.doc.menuBar.sample.open'), command: 'file-open' },
      { divider: true, label: '' },
      { label: t('example.doc.menuBar.sample.save'), command: 'file-save' }
    ]
  },
  {
    label: t('example.doc.menuBar.sample.edit'),
    command: 'edit',
    children: [
      { label: t('example.doc.menuBar.sample.undo'), command: 'edit-undo' },
      { label: t('example.doc.menuBar.sample.redo'), command: 'edit-redo', disabled: true }
    ]
  },
  { label: t('example.doc.menuBar.sample.help'), command: 'help' }
])

const compactItems = computed<MenuBarItem[]>(() => [
  {
    label: t('example.doc.menuBar.sample.edit'),
    command: 'edit',
    children: [
      { label: t('example.doc.menuBar.sample.undo'), command: 'edit-undo' },
      { label: t('example.doc.menuBar.sample.redo'), command: 'edit-redo', disabled: true },
      { label: t('example.doc.menuBar.sample.cut'), command: 'edit-cut', disabled: true }
    ]
  }
])

const codeBasic = demoSfc({
  imports: [`import { ref, computed } from 'vue'`, `import { MenuBar } from '@amg-webui/core'`],
  script: [`const active = ref('file-new')`, `const items = computed(() => [/* … */])`],
  template: [`  <MenuBar v-model="active" :items="items" @command="onCommand" />`]
})

const codeDisabled = demoCode(
  `<MenuBar v-model="compactActive" :items="compactItems" @command="onCommand" />`
)

function onCommand(command: string) {
  lastCommand.value = command
}

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.menuBar.demo.basic')"
      :description="t('example.doc.menuBar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <MenuBar v-model="active" :items="items" @command="onCommand" />
        <p class="vp-menubar-demo__hint">
          {{ t('example.doc.menuBar.sample.active', { key: active }) }}
        </p>
        <p v-if="lastCommand" class="vp-menubar-demo__hint">
          {{ t('example.doc.menuBar.sample.command', { command: lastCommand }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.menuBar.demo.disabled')"
      :description="t('example.doc.menuBar.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <MenuBar v-model="compactActive" :items="compactItems" @command="onCommand" />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-menubar-demo__hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
