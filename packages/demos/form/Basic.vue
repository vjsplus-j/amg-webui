<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Form, FormItem, InputText } from '@amg-webui/form'
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

const { t } = useLocale()

const model = reactive({
  username: '',
  email: ''
})

const rules = computed(() => ({
  username: [{ required: true, message: t(LocaleKeys.error.required) }],
  email: [
    { required: true, message: t(LocaleKeys.error.required) },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: t(LocaleKeys.error.invalidEmail)
    }
  ]
}))
</script>

<template>
  <Form :model="model" :rules="rules" class="amg-demo-form">
    <FormItem :label="t('example.doc.form.sample.username')" prop="username">
      <InputText v-model="model.username" fluid />
    </FormItem>
    <FormItem :label="t('example.doc.form.sample.email')" prop="email">
      <InputText v-model="model.email" fluid />
    </FormItem>
    <Button type="submit" severity="primary">{{ t(LocaleKeys.button.submit) }}</Button>
  </Form>
</template>

<style scoped>
.amg-demo-form {
  width: 100%;
  min-width: 0;
  max-width: 28rem;
}
</style>
