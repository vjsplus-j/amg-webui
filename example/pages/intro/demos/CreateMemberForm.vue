<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Card, Button, StatusTip } from 'amg-webui/core'
import { Form, FormItem, InputText, Select } from 'amg-webui/form'

const model = reactive({
  name: '',
  role: undefined as string | undefined
})

const rules = {
  name: [{ required: true, message: 'Name is required' }],
  role: [{ required: true, message: 'Role is required' }]
}

const roles = [
  { label: 'Engineer', value: 'engineer' },
  { label: 'Designer', value: 'designer' },
  { label: 'PM', value: 'pm' }
]

const ok = ref(false)

function onValidate(valid: boolean) {
  ok.value = valid
}
</script>

<template>
  <Card title="Create member">
    <Form :model="model" :rules="rules" label-width="5.5rem" @validate="onValidate">
      <FormItem label="Name" prop="name">
        <InputText v-model="model.name" placeholder="Ada Lovelace" />
      </FormItem>
      <FormItem label="Role" prop="role">
        <Select v-model="model.role" :options="roles" placeholder="Select a role" />
      </FormItem>
      <Button type="submit" variant="solid" severity="primary" label="Submit" />
    </Form>
    <StatusTip v-if="ok" severity="success" message="Member created" style="margin-top: 1rem" />
  </Card>
</template>
