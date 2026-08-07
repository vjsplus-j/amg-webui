<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Dialog } from 'amg-webui'
import AdminPageChrome from '../components/AdminPageChrome.vue'
import UserFormFields from '../components/UserFormFields.vue'
import { createAdminUser, setForceSubmitError } from '../mock/admin-users'
import { useUserFormModel } from '../composables/useUserFormModel'

const router = useRouter()
const model = useUserFormModel()
const formRef = ref<InstanceType<typeof UserFormFields> | null>(null)
const loading = ref(false)
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

async function handleSubmit() {
  loading.value = true
  setForceSubmitError(simulateFailure.value)
  try {
    await createAdminUser({ ...model })
    formRef.value?.setFeedback('success', 'User created successfully')
    showFeedback('success', 'User created successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user'
    formRef.value?.setFeedback('error', message)
    showFeedback('error', message)
  } finally {
    loading.value = false
    setForceSubmitError(false)
  }
}

function onFeedbackClose() {
  feedbackDialogOpen.value = false
  if (feedbackDialogKind.value === 'success') {
    router.push('/users')
  }
}

function handleReset() {
  simulateFailure.value = false
}
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome
      title="Create user"
      :crumbs="[
        { label: 'Users', to: '/users' },
        { label: 'Create user' }
      ]"
    >
      <template #extra>
        <Button variant="outlined" label="Back to list" @click="router.push('/users')" />
      </template>
    </AdminPageChrome>

    <Card title="User profile">
      <div class="showcase-toolbar user-create__toolbar">
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
        mode="create"
        :loading="loading"
        :disabled="formDisabled"
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
        <Button severity="primary" label="OK" @click="onFeedbackClose" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.user-create__toolbar {
  margin-bottom: 16px;
}
</style>
