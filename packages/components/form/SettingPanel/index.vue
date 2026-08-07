<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import Form from '@amg-webui/form/Form/index.vue'
import FormItem from '@amg-webui/form/FormItem/index.vue'
import InputText from '@amg-webui/form/InputText/index.vue'
import Select from '@amg-webui/form/Select/index.vue'
import Switch from '@amg-webui/form/Switch/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import type { SettingPanelProps, SettingPanelEmits, SettingItem, SettingGroup } from './types'
import './style.scss'

const props = withDefaults(defineProps<SettingPanelProps>(), {
  modelValue: () => ({}),
  items: () => [],
  groups: () => [],
  defaultValue: () => ({}),
  telemetry: undefined
})

const emit = defineEmits<SettingPanelEmits>()
const { t } = useLocale()

const settings = computed(() => props.modelValue ?? {})

const resolvedGroups = computed<SettingGroup[]>(() => {
  if (props.groups.length) return props.groups
  if (props.items.length) return [{ id: 'default', items: props.items }]
  return []
})

const itemLabel = (item: SettingItem) => {
  if (item.label) return item.label
  if (item.labelKey) return t(item.labelKey)
  return item.key
}

const groupTitle = (group: SettingGroup) => {
  if (group.title) return group.title
  if (group.titleKey) return t(group.titleKey)
  return ''
}

function track(type: string) {
  trackEmit({
    component: 'SettingPanel',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const patch = (key: string, value: unknown) => {
  const next = { ...settings.value, [key]: value }
  emit('update:modelValue', next)
  emit('change', next)
}

const onSave = () => {
  track('save')
  emit('save', settings.value)
}

const onReset = () => {
  const baseline = { ...props.defaultValue }
  track('reset')
  emit('update:modelValue', baseline)
  emit('change', baseline)
  emit('reset', baseline)
}
</script>

<template>
  <div role="region" aria-label="SettingPanel"
    :class="['vp-setting-panel', props.class, { 'vp-setting-panel--disabled': disabled }]"
    :style="style"
    data-component="SettingPanel"
  >
    <header class="vp-setting-panel__header">
      <slot name="title">
        <h2 class="vp-setting-panel__title">{{ t('component.setting-panel.title') }}</h2>
      </slot>
      <div v-if="$slots.extra" class="vp-setting-panel__extra">
        <slot name="extra" />
      </div>
    </header>

    <Form :model="settings" class="vp-setting-panel__form">
      <section v-for="group in resolvedGroups" :key="group.id" class="vp-setting-panel__group">
        <h3 v-if="groupTitle(group)" class="vp-setting-panel__group-title">{{ groupTitle(group) }}</h3>
        <FormItem v-for="item in group.items" :key="item.key" :label="itemLabel(item)" :prop="item.key">
          <Switch
            v-if="item.type === 'switch'"
            :model-value="!!settings[item.key]"
            :disabled="disabled"
            @update:model-value="(v) => patch(item.key, v)"
          />
          <Select
            v-else-if="item.type === 'select'"
            :model-value="settings[item.key] as string | number | boolean | undefined"
            :options="item.options ?? []"
            :disabled="disabled"
            @update:model-value="(v) => patch(item.key, v)"
          />
          <InputText
            v-else
            :model-value="String(settings[item.key] ?? '')"
            :disabled="disabled"
            @update:model-value="(v) => patch(item.key, v)"
          />
        </FormItem>
      </section>

      <div class="vp-setting-panel__actions">
        <Button variant="outlined" :label="t(LocaleKeys.button.reset)" :disabled="disabled" @click="onReset" />
        <Button :label="t(LocaleKeys.button.save)" :disabled="disabled" @click="onSave" />
      </div>
    </Form>

    <footer v-if="$slots.footer" class="vp-setting-panel__footer">
      <slot name="footer" />
    </footer>

    <slot />
  </div>
</template>
