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
  type BizUser,
  type BizOrder,
  type BizContentItem,
  type BizLoginCredentials,
  type BizRegisterPayload,
  type BizForgotPasswordPayload
} from '@amg-webui/components/business'
import { Button } from '@amg-webui/components/base'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

defineProps<{ module: 'login' | 'users' | 'orders' | 'content' | 'settings' }>()
const router = useRouter()
const { t } = useLocale()

type AuthPane = 'login' | 'register' | 'forgot'
const authPane = ref<AuthPane>('login')

const users = ref<BizUser[]>([
  { id: 1, name: 'Avery Quinn', email: 'aq@amg.io', phone: '13800000001', role: 'admin', status: 'active' },
  { id: 2, name: 'Jordan Lee', email: 'jl@amg.io', phone: '13800000002', role: 'ops', status: 'active' },
  { id: 3, name: 'Sam Rivera', email: 'sr@amg.io', role: 'dev', status: 'disabled' }
])

const orders = ref<BizOrder[]>([
  { id: '1', orderNo: 'ORD-10021', customer: 'Avery', amount: 1280, status: 'paid', createdAt: '2026-07-12' },
  { id: '2', orderNo: 'ORD-10022', customer: 'Jordan', amount: 560, status: 'pending', createdAt: '2026-07-13' },
  { id: '3', orderNo: 'ORD-10023', customer: 'Sam', amount: 2499, status: 'shipped', createdAt: '2026-07-14' }
])

const contents = ref<BizContentItem[]>([
  {
    id: 'c1',
    title: 'Release notes',
    category: 'announce',
    status: 'published',
    updatedAt: '2026-07-10',
    summary: 'AMG-WebUI packages ready.'
  },
  {
    id: 'c2',
    title: 'Theme guide',
    category: 'docs',
    status: 'draft',
    updatedAt: '2026-07-14',
    summary: 'Six designmd themes handbook.'
  }
])

function onLoginSubmit(payload: BizLoginCredentials) {
  ToastService.success({
    summary: t(LocaleKeys.auth.loginSuccess),
    detail: `${payload.username}`
  })
  router.push({ name: 'biz-users' })
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

function onCreateUser(u: Omit<BizUser, 'id'>) {
  users.value.push({ id: Date.now(), ...u, status: u.status || 'active' })
  ToastService.success({ summary: t(LocaleKeys.tip.created) })
}

function onUpdateUser(u: BizUser) {
  const i = users.value.findIndex((x) => x.id === u.id)
  if (i >= 0) users.value[i] = u
  ToastService.success({ summary: t(LocaleKeys.tip.updated) })
}

function onDeleteUser(id: BizUser['id']) {
  users.value = users.value.filter((u) => u.id !== id)
  ToastService.success({ summary: t(LocaleKeys.tip.deleted) })
}

function onCancelOrder(id: string) {
  const o = orders.value.find((x) => x.id === id)
  if (o) o.status = 'cancelled'
}

function onPublish(id: string) {
  const it = contents.value.find((c) => c.id === id)
  if (it) it.status = 'published'
}

function onArchive(id: string) {
  const it = contents.value.find((c) => c.id === id)
  if (it) it.status = 'archived'
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
      default-username="admin"
      show-captcha
      captcha-mode="checkbox"
      @submit="onLoginSubmit"
      @register="authPane = 'register'"
      @forgot="authPane = 'forgot'"
    />

    <BizRegister
      v-else-if="authPane === 'register'"
      captcha-mode="slider"
      @submit="onRegisterSubmit"
      @login="authPane = 'login'"
      @send-code="onSendCode(t(LocaleKeys.auth.register))"
    />

    <BizForgotPassword
      v-else
      captcha-mode="checkbox"
      @submit="onForgotSubmit"
      @login="authPane = 'login'"
      @send-code="onSendCode(t(LocaleKeys.auth.forgotPassword))"
    />
  </div>

  <BizUsers
    v-else-if="module === 'users'"
    :users="users"
    @create="onCreateUser"
    @update="onUpdateUser"
    @delete="onDeleteUser"
    @refresh="ToastService.info({ summary: t(LocaleKeys.button.refresh), detail: t(LocaleKeys.tip.hostRefreshUsers) })"
  />

  <BizOrders
    v-else-if="module === 'orders'"
    :orders="orders"
    @view="(o) => ToastService.info({ summary: o.orderNo, detail: o.customer })"
    @cancel="onCancelOrder"
    @refresh="ToastService.info({ summary: t(LocaleKeys.tip.hostRefreshOrders) })"
  />

  <BizContent
    v-else-if="module === 'content'"
    :items="contents"
    @create="ToastService.info({ summary: t(LocaleKeys.tip.newContent) })"
    @edit="(it) => ToastService.info({ summary: t(LocaleKeys.tip.editContent), detail: it.title })"
    @publish="onPublish"
    @archive="onArchive"
    @refresh="ToastService.info({ summary: t(LocaleKeys.tip.hostRefreshContent) })"
  />

  <BizSettings
    v-else
    @save="(p) => ToastService.success({ summary: t(LocaleKeys.tip.saved), detail: JSON.stringify(p) })"
    @theme-change="(s) => ToastService.info({ summary: t(LocaleKeys.tip.theme), detail: s })"
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
