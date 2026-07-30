<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import Select from '../Select/index.vue'
import Switch from '../Switch/index.vue'
import DatePicker from '../DatePicker/index.vue'
import Button from '../Button/index.vue'
import type { DynamicFormProps, DynamicFormEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DynamicFormProps>(), {
  modelValue: () => ({}),
  schema: () => [],
  loading: false
})

const emit = defineEmits<DynamicFormEmits>()
const { t } = useLocale()

const fields = computed(() => props.schema.filter((f) => f.visible !== false))
const formModel = computed(() => props.modelValue ?? {})

const emitValue = (next: Record<string, unknown>) => {
  emit('update:modelValue', next)
  emit('change', next)
}

const updateField = (key: string, value: unknown) => {
  emitValue({ ...formModel.value, [key]: value })
}

const addField = () => {
  const key = `field_${Object.keys(formModel.value).length + 1}`
  emitValue({ ...formModel.value, [key]: '' })
}

const removeField = (key: string) => {
  const next = { ...formModel.value }
  delete next[key]
  emitValue(next)
}

const onSubmit = () => {
  emit('submit', formModel.value)
}
</script>

<template>
  <div
    :class="['vp-dynamic-form', props.class, { 'vp-dynamic-form--loading': loading }]"
    :style="style"
    data-component="DynamicForm"
  >
  <Form
    :model="formModel as Record<string, unknown>"
    @submit="onSubmit"
  >
    <FormItem
      v-for="field in fields"
      :key="field.key"
      :label="field.label"
      :prop="field.key"
      :required="field.required"
    >
      <InputText
        v-if="field.type === 'text'"
        :model-value="String(formModel[field.key] ?? '')"
        :disabled="disabled || loading"
        @update:model-value="(v) => updateField(field.key, v)"
      />
      <input
        v-else-if="field.type === 'number'"
        class="vp-dynamic-form__number"
        type="number"
        :value="formModel[field.key] ?? ''"
        :disabled="disabled || loading"
        @input="(e) => updateField(field.key, Number((e.target as HTMLInputElement).value))"
      />
      <Select
        v-else-if="field.type === 'select'"
        :model-value="formModel[field.key] as string | number | boolean | undefined"
        :options="field.options ?? []"
        :disabled="disabled || loading"
        @update:model-value="(v) => updateField(field.key, v)"
      />
      <Switch
        v-else-if="field.type === 'switch'"
        :model-value="!!formModel[field.key]"
        :disabled="disabled || loading"
        @update:model-value="(v) => updateField(field.key, v)"
      />
      <DatePicker
        v-else-if="field.type === 'date'"
        :model-value="formModel[field.key] as string"
        :disabled="disabled || loading"
        @update:model-value="(v) => updateField(field.key, v)"
      />
      <Button
        v-if="!field.required"
        variant="text"
        size="sm"
        severity="danger"
        :label="t(LocaleKeys.button.delete)"
        @click="removeField(field.key)"
      />
    </FormItem>
    <div class="vp-dynamic-form__toolbar">
      <Button variant="outlined" size="sm" :label="t(LocaleKeys.button.create)" :disabled="disabled || loading" @click="addField" />
      <Button type="submit" :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.submit)" :loading="loading" :disabled="disabled" />
    </div>
    <slot />
  </Form>
  </div>
</template>

<style scoped>
.vp-dynamic-form__number {
  width: 100%;
  height: var(--height-md);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-input-radius, var(--border-radius-md));
  padding: 0 var(--spacing-md);
  background: var(--surface-0, var(--surface-1));
  color: var(--text-primary);
  font-size: var(--font-size-md);
}
</style>
