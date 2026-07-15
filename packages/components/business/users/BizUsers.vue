<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, InputText, Select, Dialog, DataTable, Card, Icon } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizUsersProps, BizUsersEmits, BizUser } from './types'
import { useUsersTable } from './composables/useUsersTable'
import './style.scss'

const props = withDefaults(defineProps<BizUsersProps>(), {
  loading: false,
  title: undefined,
  roles: undefined
})

const emit = defineEmits<BizUsersEmits>()
const { t, locale } = useLocale()
const { keyword, role, filtered } = useUsersTable(() => props.users)

const showDialog = ref(false)
const editing = ref<BizUser | null>(null)
const form = ref({ name: '', email: '', phone: '', role: '', status: 'active' })

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.usersTitle))

const roleOptions = computed(() => {
  void locale.value
  if (props.roles) return props.roles
  return [
    { value: '', label: t('biz.allRoles') },
    { value: 'admin', label: t('biz.roleAdmin') },
    { value: 'ops', label: t('biz.roleOps') },
    { value: 'dev', label: t('biz.roleDev') }
  ]
})

function roleLabel(code: string) {
  const map: Record<string, string> = {
    admin: t('biz.roleAdmin'),
    ops: t('biz.roleOps'),
    dev: t('biz.roleDev')
  }
  return map[code] ?? code
}

const columns = computed(() => {
  void locale.value
  return [
    { field: 'name', header: t('biz.colName'), sortable: true },
    { field: 'email', header: t(LocaleKeys.auth.email), sortable: true },
    { field: 'phone', header: t(LocaleKeys.auth.phone) },
    { field: 'role', header: t('biz.role') },
    { field: 'status', header: t('biz.status') },
    { field: 'actions', header: t(LocaleKeys.common.actions), width: '140px' }
  ]
})

const formRoles = computed(() => roleOptions.value.filter((r) => r.value))

function openCreate() {
  editing.value = null
  form.value = { name: '', email: '', phone: '', role: '', status: 'active' }
  showDialog.value = true
}

function openEdit(user: BizUser) {
  editing.value = user
  form.value = {
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    status: user.status
  }
  showDialog.value = true
}

function save() {
  if (editing.value) {
    emit('update', { ...editing.value, ...form.value })
  } else {
    emit('create', { ...form.value })
  }
  showDialog.value = false
}
</script>

<template>
  <div class="biz-users">
    <header class="biz-users__hero ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <Card class="biz-users__toolbar">
      <InputText v-model="keyword" :placeholder="t('biz.searchUser')" class="biz-users__search" />
      <Select v-model="role" :options="roleOptions" :placeholder="t('biz.role')" class="biz-users__role" />
      <Button severity="secondary" variant="outlined" @click="emit('refresh')">
        <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
      </Button>
      <Button severity="primary" variant="solid" @click="openCreate">
        <Icon name="Plus" size="sm" /> {{ t('biz.newUser') }}
      </Button>
    </Card>

    <Card>
      <DataTable :value="filtered" :columns="columns" :loading="loading">
        <template #body-role="{ row }">
          {{ roleLabel((row as BizUser).role) }}
        </template>
        <template #body-actions="{ row }">
          <div class="biz-users__actions">
            <Button size="sm" variant="text" @click="openEdit(row as BizUser)">
              {{ t(LocaleKeys.button.edit) }}
            </Button>
            <Button size="sm" variant="text" severity="danger" @click="emit('delete', (row as BizUser).id)">
              {{ t(LocaleKeys.button.delete) }}
            </Button>
          </div>
        </template>
      </DataTable>
    </Card>

    <Dialog
      v-model:visible="showDialog"
      :header="editing ? t('biz.editUser') : t('biz.createUser')"
      modal
    >
      <div class="biz-users__form">
        <InputText v-model="form.name" :placeholder="t('biz.name')" fluid />
        <InputText v-model="form.email" :placeholder="t(LocaleKeys.auth.email)" fluid />
        <InputText v-model="form.phone" :placeholder="t(LocaleKeys.auth.phone)" fluid />
        <Select v-model="form.role" :options="formRoles" :placeholder="t('biz.role')" fluid />
      </div>
      <template #footer>
        <Button variant="outlined" @click="showDialog = false">{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button severity="primary" variant="solid" @click="save">{{ t(LocaleKeys.button.save) }}</Button>
      </template>
    </Dialog>
  </div>
</template>
