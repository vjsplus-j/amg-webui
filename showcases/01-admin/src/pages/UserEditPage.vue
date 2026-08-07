<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Dialog, Result, Skeleton } from 'amg-webui'
import AdminPageChrome from '../components/AdminPageChrome.vue'
import UserFormFields from '../components/UserFormFields.vue'
import {
  getAdminUser,
  setForceSubmitError,
  updateAdminUser
} from '../mock/admin-users'
import { userToModel, useUserFormModel } from '../composables/useUserFormModel'

const route = useRoute()
const router = useRouter()
const userId = String(route.params.id)

const model = useUserFormModel()
const formRef = ref<InstanceType<typeof UserFormFields> | null>(null)
const loading = ref(false)
const pageLoading = ref(true)
const notFound = ref(false)
const formDisabled = ref(false)
const simulateFailure = ref(false)

const feedbackDialogOpen = ref(false)
const feedbackDialogKind = ref<'success' | 'error'>('success')
const feedbackDialogMessage = ref('')

function showFeedback(kind: 'success' | 'error', message: string) {
  feedbackDialogKind.value = kind
  feedbackDialogMessage.value = message
  feedbackDialogOpen.value = true
}

onMounted(async () => {
  pageLoading.value = true
  const user = await getAdminUser(userId)
  if (!user) {
    notFound.value = true
    pageLoading.value = false
    return
  }
  Object.assign(model, userToModel(user))
  pageLoading.value = false
})

async function handleSubmit() {
  loading.value = true
  setForceSubmitError(simulateFailure.value)
  try {
    await updateAdminUser(userId, { ...model })
    formRef.value?.setFeedback('success', 'User updated successfully')
    showFeedback('success', 'User updated successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user'
    formRef.value?.setFeedback('error', message)
    showFeedback('error', message)
  } finally {
    loading.value = false
    setForceSubmitError(false)
  }
}

function handleReset() {
  simulateFailure.value = false
}
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome
      title="Edit user"
      :crumbs="[
        { label: 'Users', to: '/users' },
        { label: 'Edit user' }
      ]"
    >
      <template #extra>
        <Button variant="outlined" label="Back to list" @click="router.push('/users')" />
      </template>
    </AdminPageChrome>

    <Card v-if="pageLoading" title="Loading user">
      <Skeleton variant="card-form" :rows="6" />
    </Card>

    <Result
      v-else-if="notFound"
      status="404"
      title="User not found"
      sub-title="The requested user id does not exist in the mock store."
    >
      <template #extra>
        <Button severity="primary" label="Back to users" @click="router.push('/users')" />
      </template>
    </Result>

    <Card v-else title="User profile">
      <div class="showcase-toolbar user-edit__toolbar">
        <Button
          size="sm"
          variant="outlined"
          :label="formDisabled ? 'Enable form' : 'Disable form'"
          @click="formDisabled = !formDisabled"
        />
        <Button
          size="sm"
          variant="outlined"
          :severity="simulateFailure ? 'danger' : 'default'"
          :label="simulateFailure ? 'Failure mode on' : 'Simulate failure'"
          @click="simulateFailure = !simulateFailure"
        />
      </div>

      <UserFormFields
        ref="formRef"
        :model="model"
        mode="edit"
        username-readonly
        :loading="loading"
        :disabled="formDisabled"
        submit-label="Save changes"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </Card>

    <Dialog
      v-model:visible="feedbackDialogOpen"
      :title="feedbackDialogKind === 'success' ? 'Success' : 'Error'"
      size="sm"
    >
      <p>{{ feedbackDialogMessage }}</p>
      <template #footer>
        <Button severity="primary" label="OK" @click="feedbackDialogOpen = false" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.user-edit__toolbar {
  margin-bottom: 16px;
}
</style>
