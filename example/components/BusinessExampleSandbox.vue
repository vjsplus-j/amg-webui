<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BizLogin,
  BizRegister,
  BizForgotPassword,
  BizUsers,
  BizOrders,
  BizContent,
  BizSettings,
  BizTenants,
  type BizLoginCredentials,
  type BizRegisterPayload,
  type BizForgotPasswordPayload,
  type BizTenant
} from '@amg-webui/components/business'
import { Button } from '@amg-webui/core'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  createUsersMockStore,
  createOrdersMockStore,
  createContentMockStore,
  createSettingsMockStore,
  createTenantsMockStore,
  createAuthMockAdapter
} from '../mock/biz/adapters'

defineProps<{ module: 'login' | 'users' | 'orders' | 'content' | 'settings' | 'tenants' }>()
const router = useRouter()
const { t } = useLocale()

type AuthPane = 'login' | 'register' | 'forgot'
const authPane = ref<AuthPane>('login')

const usersStore = createUsersMockStore()
const ordersStore = createOrdersMockStore()
const contentStore = createContentMockStore()
const settingsStore = createSettingsMockStore()
const tenantsStore = createTenantsMockStore()
const activeTenantId = tenantsStore.activeTenantId
const authAdapter = createAuthMockAdapter()

function onTenantSwitch(tenant: BizTenant) {
  tenantsStore.setActive(tenant.id)
  ToastService.success({
    summary: t('biz.tenants.switch'),
    detail: `${tenant.name} · ${tenant.slug}`
  })
}

function onLoginSubmit(payload: BizLoginCredentials) {
  ToastService.success({
    summary: t(LocaleKeys.auth.loginSuccess),
    detail: `${payload.mode ?? 'password'} · ${payload.username || payload.phone}`
  })
  router.push({ name: 'biz-users' })
}

function onLoginSuccess(result: { displayName?: string; token?: string }) {
  if (result.displayName) {
    ToastService.info({ summary: t(LocaleKeys.auth.loginSuccess), detail: result.displayName })
  }
}

function onRegisterSubmit(payload: BizRegisterPayload) {
  ToastService.success({
    summary: t(LocaleKeys.auth.registerSuccess),
    detail: `${payload.username} · ${payload.email || payload.phone}`
  })
  authPane.value = 'login'
}

function onForgotSubmit(payload: BizForgotPasswordPayload) {
  ToastService.success({
    summary: t(LocaleKeys.auth.resetSuccess),
    detail: payload.account
  })
  authPane.value = 'login'
}

function onSendCode(kind: string) {
  ToastService.info({ summary: t(LocaleKeys.auth.sendCode), detail: kind })
}
function onParamsUpdate(p: Record<string, string | number | boolean>) {
  ToastService.info({ summary: t(LocaleKeys.tip.saved), detail: JSON.stringify(p) })
}
</script>

<template>
  <div v-if="module === 'login'" class="biz-auth-play">
    <div class="biz-auth-play__tabs" role="tablist" :aria-label="t(LocaleKeys.biz.loginTitle)">
      <Button
        type="button"
        size="sm"
        :severity="authPane === 'login' ? 'primary' : 'secondary'"
        :variant="authPane === 'login' ? 'solid' : 'outlined'"
        @click="authPane = 'login'"
      >
        {{ t(LocaleKeys.button.signIn) }}
      </Button>
      <Button
        type="button"
        size="sm"
        :severity="authPane === 'register' ? 'primary' : 'secondary'"
        :variant="authPane === 'register' ? 'solid' : 'outlined'"
        @click="authPane = 'register'"
      >
        {{ t(LocaleKeys.auth.register) }}
      </Button>
      <Button
        type="button"
        size="sm"
        :severity="authPane === 'forgot' ? 'primary' : 'secondary'"
        :variant="authPane === 'forgot' ? 'solid' : 'outlined'"
        @click="authPane = 'forgot'"
      >
        {{ t(LocaleKeys.auth.forgotPassword) }}
      </Button>
    </div>

    <BizLogin
      v-if="authPane === 'login'"
      :adapter="authAdapter"
      default-username="admin"
      show-captcha
      captcha-mode="checkbox"
      @submit="onLoginSubmit"
      @auth-success="onLoginSuccess"
      @send-code="onSendCode('sms')"
      @register="authPane = 'register'"
      @forgot="authPane = 'forgot'"
    >
      <template #qr>
        <p class="theme-kit-body-lg">{{ t('biz.login.qrPlaceholder') }}</p>
      </template>
      <template #oauth>
        <p class="theme-kit-body-lg">{{ t('biz.login.oauthPlaceholder') }}</p>
      </template>
    </BizLogin>

    <BizRegister
      v-else-if="authPane === 'register'"
      :adapter="authAdapter"
      captcha-mode="slider"
      @submit="onRegisterSubmit"
      @login="authPane = 'login'"
      @send-code="onSendCode(t(LocaleKeys.auth.register))"
    />

    <BizForgotPassword
      v-else
      :adapter="authAdapter"
      captcha-mode="checkbox"
      @submit="onForgotSubmit"
      @login="authPane = 'login'"
      @send-code="onSendCode(t(LocaleKeys.auth.forgotPassword))"
    />
  </div>

  <BizUsers
    v-else-if="module === 'users'"
    :adapter="usersStore.adapter"
    :page-size="3"
  >
    <template #actions>
      <Button size="sm" variant="outlined" @click="usersStore.adapter.list({ page: 1, pageSize: 3 })">
        {{ t(LocaleKeys.button.refresh) }}
      </Button>
    </template>
  </BizUsers>

  <BizOrders
    v-else-if="module === 'orders'"
    :adapter="ordersStore.adapter"
    :page-size="3"
    @cancel="ordersStore.cancel"
    @refund="ordersStore.refund"
    @batch-cancel="ordersStore.batchCancel"
    @refresh="void ordersStore.adapter.list({ page: 1, pageSize: 3 })"
  />

  <BizContent
    v-else-if="module === 'content'"
    :adapter="contentStore.adapter"
    :categories="contentStore.categories"
    :page-size="4"
    @publish="contentStore.publish"
    @archive="contentStore.archive"
  />

  <BizTenants
    v-else-if="module === 'tenants'"
    :adapter="tenantsStore.adapter"
    :active-tenant-id="activeTenantId"
    :page-size="5"
    @update:active-tenant-id="tenantsStore.setActive"
    @switch="onTenantSwitch"
  />

  <BizSettings
    v-else
    :adapter="settingsStore.adapter"
    @update:params="onParamsUpdate"
    @change-password="
      (p) => ToastService.success({ summary: t('biz.settings.changePassword'), detail: p.newPassword.length + '' })
    "
    @save="(p) => ToastService.success({ summary: t(LocaleKeys.tip.saved), detail: JSON.stringify(p) })"
    @theme-change="(s) => ToastService.info({ summary: t(LocaleKeys.tip.theme), detail: s })"
    @locale-change="(c) => ToastService.info({ summary: t('biz.settings.locale'), detail: c })"
  />
</template>

<style scoped>
.biz-auth-play {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 0.75rem);
  min-height: 100%;
}

.biz-auth-play__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm, 0.5rem);
  justify-content: center;
  padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 0.75rem) 0;
}
</style>
