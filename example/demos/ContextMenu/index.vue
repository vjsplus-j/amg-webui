<script setup lang="ts">
import { computed, ref } from 'vue'
import { ContextMenu } from '@amg-webui/overlay'
import { Space } from '@amg-webui/core'
import type { ContextMenuItem } from '@amg-webui/overlay/ContextMenu'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const lastCommand = ref('')

const items = computed<ContextMenuItem[]>(() => [
  { label: t('example.doc.contextMenu.sample.copy'), command: 'copy' },
  { label: t('example.doc.contextMenu.sample.paste'), command: 'paste' },
  { divider: true, label: '' },
  {
    label: t('example.doc.contextMenu.sample.more'),
    children: [
      { label: t('example.doc.contextMenu.sample.rename'), command: 'rename' },
      { label: t('example.doc.contextMenu.sample.delete'), command: 'delete', disabled: true }
    ]
  }
])

const codeBasic = demoSfc({
  imports: [`import { ContextMenu } from '@amg-webui/overlay'`],
  template: [
    '  <ContextMenu :items="items" @command="onCommand">',
    `    <div class="area">{{ t('example.doc.contextMenu.sample.area') }}</div>`,
    '  </ContextMenu>'
  ]
})

function onCommand(command: string) {
  lastCommand.value = command
}
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.contextMenu.when') }}</p>

    <DemoBlock
      :title="t('example.doc.contextMenu.demo.basic')"
      :description="t('example.doc.contextMenu.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <ContextMenu :items="items" @command="onCommand">
          <div class="area">{{ t('example.doc.contextMenu.sample.area') }}</div>
        </ContextMenu>
        <p v-if="lastCommand" class="hint">
          {{ t('example.doc.contextMenu.sample.command', { command: lastCommand }) }}
        </p>
      </Space>
    </DemoBlock>
</div>
</template>

<style scoped>
.area {
  width: 100%;
  min-height: calc(var(--height-lg) * 4);
  padding: var(--theme-card-pad);
  box-sizing: border-box;
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
