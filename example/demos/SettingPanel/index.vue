<script setup lang="ts">
import { computed, ref } from 'vue'
import { SettingPanel, StatusTip } from '@amg-webui/components/base'
import type { SettingGroup } from '@amg-webui/components/base/SettingPanel/types'
import { useLocale } from '@amg-webui/hooks'
import { LOCALE_META } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const settings = ref({ darkMode: false, locale: 'en-US', emailAlerts: true })
const action = ref('')

const defaults = { darkMode: false, locale: 'en-US', emailAlerts: true }

const groups = computed<SettingGroup[]>(() => [
  {
    id: 'general',
    titleKey: 'example.doc.settingPanel.sample.groupGeneral',
    items: [
      { key: 'darkMode', labelKey: 'example.doc.settingPanel.sample.darkMode', type: 'switch' },
      {
        key: 'locale',
        labelKey: 'example.doc.settingPanel.sample.locale',
        type: 'select',
        options: [
          { label: LOCALE_META['en-US'].label, value: 'en-US' },
          { label: LOCALE_META['zh-CN'].label, value: 'zh-CN' }
        ]
      }
    ]
  },
  {
    id: 'notifications',
    titleKey: 'example.doc.settingPanel.sample.groupNotify',
    items: [
      { key: 'emailAlerts', labelKey: 'example.doc.settingPanel.sample.emailAlerts', type: 'switch' }
    ]
  }
])

const codeBasic = demoSfc({
  imports: [`import { SettingPanel } from '@amg-webui/components/base'`],
  template: [
    '  <SettingPanel v-model="settings" :groups="groups" :default-value="defaults" @save="onSave" @reset="onReset" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'Record<string, unknown>', description: t('example.doc.settingPanel.prop.modelValue') },
  { name: 'groups', type: 'SettingGroup[]', description: t('example.doc.settingPanel.prop.groups') },
  { name: 'defaultValue', type: 'Record<string, unknown>', description: t('example.doc.settingPanel.prop.defaultValue') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.settingPanel.when') }}</p>

    <DemoBlock
      :title="t('example.doc.settingPanel.demo.grouped')"
      :description="t('example.doc.settingPanel.demo.groupedDesc')"
      :code="codeBasic"
    >
      <div class="vp-curated__stack">
        <SettingPanel
          v-model="settings"
          :groups="groups"
          :default-value="defaults"
          @save="action = t('example.doc.settingPanel.sample.saved')"
          @reset="action = t('example.doc.settingPanel.sample.reset')"
        />
        <StatusTip v-if="action" severity="success" :message="action" />
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  width: 100%;
}
</style>
