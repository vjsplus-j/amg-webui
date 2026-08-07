<template>
  <ThemeProvider design="mercedes" scheme="light" :persist="false">
    <div class="consumer-nuxt" data-test="consumer-nuxt-root">
      <Button label="nuxt-button" data-test="nuxt-button" />

      <Form :model="formModel" data-test="nuxt-form">
        <FormItem label="Name" prop="name">
          <InputText v-model="formModel.name" data-test="nuxt-input" />
        </FormItem>
      </Form>

      <Select
        v-model="selected"
        :options="selectOptions"
        placeholder="Choose"
        data-test="nuxt-select"
      />

      <DataTable
        :value="tableRows"
        :columns="tableColumns"
        :virtual="false"
        data-test="nuxt-datatable"
      />

      <Dialog :visible="dialogOpen" title="Nuxt Dialog" data-test="nuxt-dialog">
        Dialog body for hydration smoke
      </Dialog>

      <p data-test="ssr-env">ssr-env:{{ clientFlag }}</p>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'amg-webui/button'
import { Form, FormItem, InputText, Select } from 'amg-webui/form'
import DataTable from 'amg-webui/data-table'
import { Dialog } from 'amg-webui/dialog'
import { ThemeProvider } from 'amg-webui/theme-provider'
import { sanitizeHtml } from 'amg-webui/security'
import { isClient } from 'amg-webui/utils/env'
import 'amg-webui/style.css'

const formModel = ref({ name: 'Ada' })
const selected = ref('a')
const dialogOpen = ref(true)
const selectOptions = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' }
]
const tableRows = [
  { id: 1, name: 'Row One' },
  { id: 2, name: 'Row Two' }
]
const tableColumns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' }
]

void sanitizeHtml('<b>nuxt</b>')
const clientFlag = String(isClient())
</script>
