<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Form,
  FormItem,
  InputText,
  Password,
  Switch,
  Rate,
  Button
} from '@amg-webui/components/base'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t } = useLocale()
const model = ref({
  username: '',
  password: '',
  enabled: true,
  score: 3
})

function submit() {
  ToastService.success({
    summary: t(LocaleKeys.common.success),
    detail: t(LocaleKeys.tip.formSubmitted)
  })
}
</script>

<template>
  <ComponentGallery zone="forms" title-key="page.base.forms.title" lead-key="page.base.forms.lead">
    <template #featured>
      <Card :title="t('biz.settings.profile')">
        <Form class="featured-form" @submit.prevent="submit">
          <FormItem :label="t(LocaleKeys.auth.username)" required>
            <InputText v-model="model.username" fluid />
          </FormItem>
          <FormItem :label="t(LocaleKeys.auth.password)">
            <Password v-model="model.password" />
          </FormItem>
          <FormItem :label="t(LocaleKeys.chrome.toggle)">
            <Switch v-model="model.enabled" />
          </FormItem>
          <FormItem :label="t(LocaleKeys.common.success)">
            <Rate v-model="model.score" />
          </FormItem>
          <Button type="submit">{{ t(LocaleKeys.button.submit) }}</Button>
        </Form>
      </Card>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.featured-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 28rem;
}
</style>
