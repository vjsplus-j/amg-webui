<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import Select from '../Select/index.vue'
import Switch from '../Switch/index.vue'
import Button from '../Button/index.vue'
import type { SettingPanelProps, SettingPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SettingPanelProps>(), {
  modelValue: () => ({}),
  items: () => []
})

const emit = defineEmits<SettingPanelEmits>()
const { t } = useLocale()

const settings = computed(() => props.modelValue ?? {})

const patch = (key: string, value: unknown) => {
  const next = { ...settings.value, [key]: value }
  emit('update:modelValue', next)
  emit('change', next)
}

const onSave = () => emit('save', settings.value)
</script>

<template>
  <div :class="['vp-setting-panel', props.class, { 'vp-setting-panel--disabled': disabled }]" :style="style" data-component="SettingPanel">
    <header class="vp-setting-panel__header">
      <h2 class="vp-setting-panel__title">{{ t('component.setting-panel.title') }}</h2>
    </header>
    <Form :model="settings" class="vp-setting-panel__form">
      <FormItem v-for="item in items" :key="item.key" :label="item.label" :prop="item.key">
        <Switch
          v-if="item.type === 'switch'"
          :model-value="!!settings[item.key]"
          :disabled="disabled"
          @update:model-value="(v) => patch(item.key, v)"
        />
        <Select
          v-else-if="item.type === 'select'"
          :model-value="settings[item.key]"
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
      <Button :label="t(LocaleKeys.button.save)" :disabled="disabled" @click="onSave" />
    </Form>
    <slot />
  </div>
</template>
