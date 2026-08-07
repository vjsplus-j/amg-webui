<script setup lang="ts">
import { StudioContainer, StudioForm } from '@amg-webui/lowcode'
import { InputText } from '@amg-webui/form'
import { Button } from '@amg-webui/core'
import { DataTable } from '@amg-webui/data'

import { createPageRuntime } from '@amg-webui/lowcode'

const runtime = createPageRuntime({
  initial: {
  "state": {
    "keyword": "",
    "createOpen": false
  },
  "data": {},
  "form": {
    "name": ""
  }
},
  dataSources: [
  {
    "id": "queryUsers",
    "type": "mock",
    "transform": "listTotal",
    "staticData": {
      "list": [
        {
          "id": 1,
          "name": "Ada Lovelace"
        },
        {
          "id": 2,
          "name": "Alan Turing"
        }
      ],
      "total": 2
    }
  }
]
})

const { state, form, data, page, route, user, env } = runtime.context

function onButtonClick(): void {
  // no document actions
}

function onDataTableRowClick(): void {
  // no document actions
}

function onInputTextUpdateModelValue(): void {
  // no document actions
}

function onSearch(): void {
  void runtime.runActionChain([
  {
    "type": "CallApi",
    "dataSourceId": "queryUsers"
  }
])
}
</script>

<template>
  <div class="vp-generated-canvas" style="position:relative;min-height:20rem;">
    <div class="vp-generated-container" style="position:absolute;left:24px;top:24px;width:960px;height:640px;z-index:1;">
      <StudioContainer title="Users" />
      <div class="vp-generated-container" style="position:relative;width:560px;min-height:120px;">
        <StudioForm title="Search" />
        <InputText placeholder="keyword" label="Search keyword" v-model="state.keyword" @update:modelValue="onInputTextUpdateModelValue" style="position:relative;width:280px;min-height:40px;" />
        <Button label="Search" severity="primary" @click="onSearch" style="position:relative;width:120px;min-height:40px;" />
      </div>
      <DataTable :columns='[{"field":"id","header":"ID","width":"80px"},{"field":"name","header":"Name"}]' paginator :rows='10' :value="data.queryUsers.list" @row-click="onDataTableRowClick" style="position:relative;width:920px;min-height:400px;" />
    </div>
  </div>
</template>
