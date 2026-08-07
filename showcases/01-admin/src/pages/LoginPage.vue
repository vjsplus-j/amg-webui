<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Checkbox, Form, FormItem, InputText, Password } from 'amg-webui'
import type { FormRules } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ThemeService } from '@amg-webui/theme'
import { mockLogin } from '../mock/admin-users'
import { useAdminAuth } from '../composables/useAdminAuth'

const router = useRouter()
const route = useRoute()
const { t } = useLocale()
const { login, initFromStorage, isAuthenticated } = useAdminAuth()

initFromStorage()

if (isAuthenticated.value) {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect)
}

const form = reactive({
  username: 'admin',
  password: '',
  remember: false
})

const loading = ref(false)
const formDisabled = ref(false)
const authError = ref('')

const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t(LocaleKeys.error.required) }],
  password: [
    { required: true, message: t(LocaleKeys.error.required) },
    { min: 6, message: t(LocaleKeys.error.minLength, { min: 6 }) }
  ]
}))

async function onSubmit() {
  authError.value = ''
  loading.value = true
  try {
    const result = await mockLogin({
      username: form.username,
      password: form.password,
      remember: form.remember
    })
    if (result.ok && result.username && result.permissions) {
      login({ username: result.username, permissions: result.permissions }, form.remember)
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(redirect)
      return
    }
    authError.value = result.error ?? t(LocaleKeys.auth.loginFailed)
  } finally {
    loading.value = false
  }
}

function onValidate(valid: boolean) {
  if (!valid) {
    authError.value = 'Please fix validation errors'
  }
}

function toggleTheme() {
  ThemeService.toggleTheme()
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__panel">
      <Card title="Admin Console">
        <p class="login-page__lead">
          Sign in with AMG Form, InputText, Password, Checkbox, and Button.
        </p>

        <Form
          :model="form as Record<string, unknown>"
          :rules="rules"
          :disabled="formDisabled || loading"
          label-position="top"
          class="login-page__form"
          @validate="onValidate"
          @submit="onSubmit"
        >
          <FormItem :label="t(LocaleKeys.auth.username)" prop="username" required>
            <InputText
              v-model="form.username"
              fluid
              autocomplete="username"
              :disabled="loading"
            />
          </FormItem>

          <FormItem :label="t(LocaleKeys.auth.password)" prop="password" required>
            <Password
              v-model="form.password"
              fluid
              autocomplete="current-password"
              :disabled="loading"
            />
          </FormItem>

          <div class="login-page__meta">
            <Checkbox v-model="form.remember" :disabled="loading || formDisabled">
              {{ t(LocaleKeys.auth.remember) }}
            </Checkbox>
          </div>

          <p v-if="authError" class="login-page__error" role="alert">
            {{ authError }}
          </p>

          <Button
            type="submit"
            class="login-page__submit"
            severity="primary"
            fluid
            :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.signIn)"
            :loading="loading"
            :disabled="formDisabled"
          />
        </Form>

        <div class="login-page__demo">
          <p class="login-page__demo-label">Demo accounts</p>
          <p class="login-page__demo-hint">admin / admin123 · user / user123</p>
        </div>

        <div class="login-page__toolbar">
          <Button
            size="sm"
            variant="outlined"
            :label="formDisabled ? 'Enable form' : 'Disable form'"
            @click="formDisabled = !formDisabled"
          />
          <Button size="sm" variant="outlined" label="Toggle theme" @click="toggleTheme" />
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--theme-page-bg, #f5f7fb);
}

.login-page__panel {
  width: min(100%, 420px);
}

.login-page__lead {
  margin: 0 0 16px;
  color: var(--theme-text-secondary, #64748b);
  font-size: 0.875rem;
}

.login-page__form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-page__meta {
  margin: 4px 0 8px;
}

.login-page__error {
  margin: 0 0 8px;
  color: var(--theme-danger, #dc2626);
  font-size: 0.875rem;
}

.login-page__submit {
  margin-top: 4px;
}

.login-page__demo {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--theme-border, #e2e8f0);
}

.login-page__demo-label {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
}

.login-page__demo-hint {
  margin: 4px 0 0;
  font-size: 0.8125rem;
  color: var(--theme-text-secondary, #64748b);
}

.login-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px 12px;
  }

  .login-page__panel {
    width: 100%;
  }
}
</style>
