<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Form,
  FormItem,
  InputText,
  InputNumber,
  RadioGroup,
  Switch,
  Textarea
} from 'amg-webui'
import type { FormRules } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { AdminUserPayload } from '../mock/admin-users'
import { isUsernameAvailable } from '../mock/admin-users'

const props = withDefaults(
  defineProps<{
    model: AdminUserPayload
    mode?: 'create' | 'edit'
    loading?: boolean
    disabled?: boolean
    usernameReadonly?: boolean
    submitLabel?: string
  }>(),
  {
    mode: 'create',
    loading: false,
    disabled: false,
    usernameReadonly: false
  }
)

const emit = defineEmits<{
  submit: []
  reset: []
}>()

const { t } = useLocale()
const formRef = ref<InstanceType<typeof Form> | null>(null)
const feedback = ref<'idle' | 'success' | 'error'>('idle')
const feedbackMessage = ref('')

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' }
]

const phonePattern = /^\+?[\d\s\-()]{7,20}$/

const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t(LocaleKeys.error.required) },
    { min: 3, message: t(LocaleKeys.error.minLength, { min: 3 }) },
    {
      validator: async (value) => {
        if (props.mode === 'edit' && props.usernameReadonly) return true
        const available = await isUsernameAvailable(String(value ?? ''))
        return available || 'Username is already taken'
      }
    }
  ],
  displayName: [{ required: true, message: t(LocaleKeys.error.required) }],
  email: [
    { required: true, message: t(LocaleKeys.error.required) },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: t(LocaleKeys.error.invalidEmail)
    }
  ],
  phone: [
    { required: true, message: t(LocaleKeys.error.required) },
    {
      pattern: phonePattern,
      message: t(LocaleKeys.error.pattern)
    }
  ],
  department: [{ required: true, message: t(LocaleKeys.error.required) }]
}))

const statusActive = computed({
  get: () => props.model.status === 'active',
  set: (value: boolean) => {
    props.model.status = value ? 'active' : 'inactive'
  }
})

function setFeedback(kind: 'idle' | 'success' | 'error', message = '') {
  feedback.value = kind
  feedbackMessage.value = message
}

function onValidate(valid: boolean) {
  if (!valid) {
    setFeedback('error', 'Fix validation errors before submitting')
  }
}

function resetForm() {
  formRef.value?.resetFields()
  setFeedback('idle')
  emit('reset')
}

function onSubmit() {
  emit('submit')
}

defineExpose({
  setFeedback,
  resetForm
})
</script>

<template>
  <Form
    ref="formRef"
    :model="model as Record<string, unknown>"
    :rules="rules"
    :disabled="disabled || loading"
    label-position="top"
    class="admin-user-form"
    @validate="onValidate"
    @submit="onSubmit"
  >
    <div class="admin-user-form__grid">
      <FormItem label="Username" prop="username" required>
        <InputText
          v-model="model.username"
          fluid
          :readonly="usernameReadonly"
          autocomplete="username"
        />
      </FormItem>
      <FormItem label="Display name" prop="displayName" required>
        <InputText v-model="model.displayName" fluid autocomplete="name" />
      </FormItem>
      <FormItem label="Email" prop="email" required>
        <InputText v-model="model.email" fluid type="email" autocomplete="email" />
      </FormItem>
      <FormItem label="Phone" prop="phone" required>
        <InputText v-model="model.phone" fluid type="tel" autocomplete="tel" />
      </FormItem>
      <FormItem label="Department" prop="department" required>
        <InputText v-model="model.department" fluid />
      </FormItem>
      <FormItem label="Sort order" prop="sortOrder">
        <InputNumber v-model="model.sortOrder" :min="0" :max="999" fluid />
      </FormItem>
      <FormItem label="Role" prop="role">
        <RadioGroup v-model="model.role" :options="roleOptions" direction="horizontal" />
      </FormItem>
      <FormItem label="Status" prop="status">
        <Switch v-model="statusActive" inline-prompt active-text="Active" inactive-text="Inactive" />
      </FormItem>
    </div>

    <FormItem label="Remark" prop="remark">
      <Textarea v-model="model.remark" fluid :rows="4" placeholder="Optional notes" />
    </FormItem>

    <div class="admin-user-form__actions">
      <Button
        type="submit"
        severity="primary"
        :label="submitLabel ?? (mode === 'create' ? 'Create user' : 'Save changes')"
        :loading="loading"
        :disabled="disabled"
      />
      <Button
        variant="outlined"
        :label="t(LocaleKeys.button.reset)"
        :disabled="loading"
        @click="resetForm"
      />
    </div>

    <p
      v-if="feedback !== 'idle'"
      class="admin-user-form__feedback"
      :class="{
        'admin-user-form__feedback--success': feedback === 'success',
        'admin-user-form__feedback--error': feedback === 'error'
      }"
    >
      {{ feedbackMessage }}
    </p>
  </Form>
</template>

<style scoped lang="scss">
.admin-user-form__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.admin-user-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.admin-user-form__feedback {
  margin: 12px 0 0;
  font-size: 0.875rem;
}

.admin-user-form__feedback--success {
  color: var(--theme-success, #16a34a);
}

.admin-user-form__feedback--error {
  color: var(--theme-danger, #dc2626);
}
</style>
