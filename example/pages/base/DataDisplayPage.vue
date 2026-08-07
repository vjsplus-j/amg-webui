<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button, Card, Icon, Carousel } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Dialog } from '@amg-webui/overlay'
import { DataTable, ProTable, Tree } from '@amg-webui/data'
import { BarChart } from '@amg-webui/charts'
import { ToastService, ConfirmService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { userService } from '../../mock/service'
import type { User } from '../../mock/data'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t, locale } = useLocale()

const users = ref<User[]>([])
const searchKeyword = ref('')
const selectedRole = ref('')
const showDialog = ref(false)
const editingUser = ref<User | null>(null)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const treeData = [
  {
    label: 'A',
    value: 'a',
    children: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' }
    ]
  },
  { label: 'B', value: 'b', children: [{ label: 'B1', value: 'b1' }] }
]

const chartData = [12, 28, 18, 40, 22, 35]

const roles = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allRoles') },
    { value: 'admin', label: t('biz.roleAdmin') },
    { value: 'ops', label: t('biz.roleOps') },
    { value: 'dev', label: t('biz.roleDev') }
  ]
})

const formRoles = computed(() => roles.value.filter((r) => r.value))

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

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const kw = searchKeyword.value.trim().toLowerCase()
    const matchKw =
      !kw ||
      u.name.toLowerCase().includes(kw) ||
      u.email.toLowerCase().includes(kw)
    const matchRole = !selectedRole.value || u.role === selectedRole.value
    return matchKw && matchRole
  })
})

onMounted(async () => {
  const { list } = await userService.getUsers({ size: 100 })
  users.value = list
})

function openCreate() {
  editingUser.value = null
  formData.value = { name: '', email: '', phone: '', role: '' }
  showDialog.value = true
}

function openEdit(user: User) {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role
  }
  showDialog.value = true
}

async function saveUser() {
  if (!formData.value.name || !formData.value.email) {
    ToastService.warn({
      summary: t(LocaleKeys.error.validation),
      detail: t(LocaleKeys.tip.fillRequired)
    })
    return
  }
  if (editingUser.value) {
    await userService.updateUser(editingUser.value.id, formData.value)
    ToastService.success({
      summary: t(LocaleKeys.common.success),
      detail: t(LocaleKeys.tip.updated)
    })
  } else {
    await userService.createUser(formData.value)
    ToastService.success({
      summary: t(LocaleKeys.common.success),
      detail: t(LocaleKeys.tip.created)
    })
  }
  const { list } = await userService.getUsers({ size: 100 })
  users.value = list
  showDialog.value = false
}

function removeUser(user: User) {
  ConfirmService.require({
    header: t(LocaleKeys.button.delete),
    message: `${t(LocaleKeys.button.delete)} ${user.name}?`,
    accept: async () => {
      await userService.deleteUser(user.id)
      const { list } = await userService.getUsers({ size: 100 })
      users.value = list
      ToastService.success({
        summary: t(LocaleKeys.tip.deleted),
        detail: user.name
      })
    }
  })
}

function roleLabel(code: string) {
  const hit = roles.value.find((r) => r.value === code)
  return hit?.label ?? code
}
</script>

<template>
  <ComponentGallery zone="data" title-key="page.base.data.title" lead-key="page.base.data.lead">
    <template #featured>
      <header class="featured-head">
        <Button @click="openCreate">
          <Icon name="Plus" size="sm" /> {{ t(LocaleKeys.button.create) }}
        </Button>
      </header>

      <Card class="vp-toolbar">
        <InputText
          v-model="searchKeyword"
          :placeholder="t(LocaleKeys.common.search)"
          class="search"
        />
        <Select v-model="selectedRole" :options="roles" :placeholder="t('biz.role')" />
      </Card>

      <Card>
        <DataTable :value="filteredUsers" :columns="columns">
          <template #body-role="{ row }">
            {{ roleLabel((row as User).role) }}
          </template>
          <template #body-actions="{ row }">
            <Button size="sm" variant="text" @click.stop="openEdit(row as User)">
              {{ t(LocaleKeys.button.edit) }}
            </Button>
            <Button
              size="sm"
              variant="text"
              severity="danger"
              @click.stop="removeUser(row as User)"
            >
              {{ t(LocaleKeys.button.delete) }}
            </Button>
          </template>
        </DataTable>
      </Card>

      <div class="featured-grid">
        <ProTable :rows="(filteredUsers as unknown as Record<string, unknown>[])" :columns="columns" />
        <Tree :options="treeData" />
        <BarChart :data="chartData" />
        <Carousel :slides="filteredUsers.slice(0, 3).map((u) => ({ title: u.name, content: u.email }))" />
      </div>

      <Dialog
        v-model:visible="showDialog"
        :header="editingUser ? t('biz.editUser') : t('biz.createUser')"
        modal
      >
        <div class="form">
          <label>
            <span>{{ t('biz.name') }}</span>
            <InputText v-model="formData.name" fluid />
          </label>
          <label>
            <span>{{ t(LocaleKeys.auth.email) }}</span>
            <InputText v-model="formData.email" fluid />
          </label>
          <label>
            <span>{{ t(LocaleKeys.auth.phone) }}</span>
            <InputText v-model="formData.phone" fluid />
          </label>
          <label>
            <span>{{ t('biz.role') }}</span>
            <Select
              v-model="formData.role"
              :options="formRoles"
              :placeholder="t('biz.role')"
            />
          </label>
        </div>
        <template #footer>
          <Button size="sm" variant="outlined" @click="showDialog = false">
            {{ t(LocaleKeys.button.cancel) }}
          </Button>
          <Button size="sm" @click="saveUser">{{ t(LocaleKeys.button.save) }}</Button>
        </template>
      </Dialog>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.featured-head {
  display: flex;
  justify-content: flex-end;
}

.search {
  min-width: 12rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--theme-section-gap);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
