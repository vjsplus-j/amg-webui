<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Button,
  Card,
  Cascader,
  Dialog,
  Empty,
  Form,
  FormItem,
  InputText,
  PageHeader,
  Result,
  Select,
  Tree,
  TreeSelect
} from 'amg-webui'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  createAdminOrganization,
  deleteAdminOrganization,
  getOrganizationCascaderOptions,
  getOrganizationTree,
  getOrganizationTreeSelectOptions,
  setForceOrgListError,
  setForceOrgSubmitError,
  updateAdminOrganization,
  type AdminOrganization
} from '../mock/admin-organizations'

type FetchPhase = 'idle' | 'loading' | 'ready' | 'error'

const { t } = useLocale()

const phase = ref<FetchPhase>('idle')
const errorMessage = ref('')
const treeData = ref<TreeNode[]>([])
const selectedNodeId = ref<unknown>(null)
const activeOrg = ref<AdminOrganization | null>(null)
const treeSelectOptions = ref<ReturnType<typeof getOrganizationTreeSelectOptions>>([])
const cascaderOptions = ref<Awaited<ReturnType<typeof getOrganizationCascaderOptions>>>([])

const dialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const dialogSaving = ref(false)
const deleteDialogOpen = ref(false)

const form = reactive({
  id: '',
  name: '',
  code: '',
  parentId: null as string | null,
  leader: '',
  status: 'active' as AdminOrganization['status'],
  sortOrder: 0
})

const selectedLabel = computed(() => {
  if (!selectedNodeId.value) return 'No organization selected'
  const find = (nodes: TreeNode[]): string | null => {
    for (const node of nodes) {
      if (node.value === selectedNodeId.value) return node.label
      if (node.children?.length) {
        const child = find(node.children)
        if (child) return child
      }
    }
    return null
  }
  return find(treeData.value) ?? String(selectedNodeId.value)
})

async function loadTree() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const [tree, treeSelect, cascader] = await Promise.all([
      getOrganizationTree(),
      Promise.resolve(getOrganizationTreeSelectOptions()),
      getOrganizationCascaderOptions()
    ])
    treeData.value = tree
    treeSelectOptions.value = treeSelect
    cascaderOptions.value = cascader
    phase.value = tree.length ? 'ready' : 'ready'
  } catch (error) {
    phase.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load organizations'
  }
}

function resetFaults() {
  setForceOrgListError(false)
  setForceOrgSubmitError(false)
  void loadTree()
}

function simulateError() {
  setForceOrgListError(true)
  void loadTree()
}

function onNodeClick(node: TreeNode) {
  selectedNodeId.value = node.value ?? null
  activeOrg.value = {
    id: String(node.value),
    name: node.label,
    code: String(node.value),
    parentId: null,
    leader: '—',
    status: 'active',
    sortOrder: 0,
    updatedAt: new Date().toISOString()
  }
}

function openCreate() {
  dialogMode.value = 'create'
  form.id = ''
  form.name = ''
  form.code = ''
  form.parentId = selectedNodeId.value ? String(selectedNodeId.value) : 'org-root'
  form.leader = ''
  form.status = 'active'
  form.sortOrder = 0
  dialogOpen.value = true
}

function openEdit() {
  if (!selectedNodeId.value) return
  dialogMode.value = 'edit'
  form.id = String(selectedNodeId.value)
  form.name = selectedLabel.value
  form.code = String(selectedNodeId.value).replace('org-', '')
  form.parentId = null
  form.leader = activeOrg.value?.leader ?? ''
  form.status = activeOrg.value?.status ?? 'active'
  form.sortOrder = activeOrg.value?.sortOrder ?? 0
  dialogOpen.value = true
}

async function saveOrg() {
  dialogSaving.value = true
  setForceOrgSubmitError(false)
  try {
    if (dialogMode.value === 'create') {
      await createAdminOrganization({
        name: form.name,
        code: form.code,
        parentId: form.parentId,
        leader: form.leader,
        status: form.status,
        sortOrder: form.sortOrder
      })
    } else {
      await updateAdminOrganization(form.id, {
        name: form.name,
        code: form.code,
        leader: form.leader,
        status: form.status,
        sortOrder: form.sortOrder
      })
    }
    dialogOpen.value = false
    await loadTree()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Save failed'
  } finally {
    dialogSaving.value = false
  }
}

async function confirmDelete() {
  if (!selectedNodeId.value) return
  try {
    await deleteAdminOrganization(String(selectedNodeId.value))
    selectedNodeId.value = null
    activeOrg.value = null
    deleteDialogOpen.value = false
    await loadTree()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Delete failed'
  }
}

onMounted(loadTree)
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Organizations">
      <template #extra>
        <div class="showcase-toolbar">
          <Button severity="primary" label="Add child" @click="openCreate" />
          <Button
            variant="outlined"
            label="Edit selected"
            :disabled="!selectedNodeId"
            @click="openEdit"
          />
          <Button
            variant="outlined"
            label="Delete selected"
            :disabled="!selectedNodeId"
            @click="deleteDialogOpen = true"
          />
          <Button variant="outlined" label="Simulate error" @click="simulateError" />
          <Button variant="outlined" :label="t(LocaleKeys.button.refresh)" @click="resetFaults" />
        </div>
      </template>
    </PageHeader>

    <div class="org-layout">
      <Card title="Organization tree" class="org-layout__tree">
        <Result
          v-if="phase === 'error'"
          status="error"
          title="Failed to load organizations"
          :sub-title="errorMessage"
        >
          <template #extra>
            <Button severity="primary" label="Retry" @click="resetFaults" />
          </template>
        </Result>

        <template v-else>
          <Tree
            v-model="selectedNodeId"
            :data="treeData"
            :loading="phase === 'loading'"
            :checkable="false"
            default-expand-all
            @node-click="onNodeClick"
          />
          <Empty v-if="phase === 'ready' && !treeData.length" description="No organizations" />
        </template>
      </Card>

      <Card title="Details & assignment" class="org-layout__detail">
        <p class="org-detail__selected">
          Selected: <strong>{{ selectedLabel }}</strong>
        </p>

        <Form label-position="top">
          <FormItem label="Assign user org (TreeSelect)">
            <TreeSelect
              v-model="selectedNodeId"
              :options="treeSelectOptions"
              filterable
              clearable
              placeholder="Pick organization"
            />
          </FormItem>
          <FormItem label="Move under path (Cascader)">
            <Cascader
              v-model="form.parentId"
              :options="cascaderOptions"
              placeholder="Select parent path"
            />
          </FormItem>
          <FormItem label="Status preview">
            <Select
              v-model="form.status"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]"
              fluid
            />
          </FormItem>
        </Form>
      </Card>
    </div>

    <Dialog
      v-model:visible="dialogOpen"
      :title="dialogMode === 'create' ? 'Add organization' : 'Edit organization'"
      size="md"
    >
      <Form :model="form" label-position="top">
        <FormItem label="Name" prop="name">
          <InputText v-model="form.name" fluid />
        </FormItem>
        <FormItem label="Code" prop="code">
          <InputText v-model="form.code" fluid />
        </FormItem>
        <FormItem v-if="dialogMode === 'create'" label="Parent" prop="parentId">
          <TreeSelect
            v-model="form.parentId"
            :options="treeSelectOptions"
            filterable
            placeholder="Parent organization"
          />
        </FormItem>
        <FormItem label="Leader" prop="leader">
          <InputText v-model="form.leader" fluid />
        </FormItem>
        <FormItem label="Sort order" prop="sortOrder">
          <InputText v-model="form.sortOrder" fluid type="number" />
        </FormItem>
      </Form>
      <template #footer>
        <Button variant="outlined" label="Cancel" @click="dialogOpen = false" />
        <Button severity="primary" label="Save" :loading="dialogSaving" @click="saveOrg" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteDialogOpen" title="Delete organization" size="sm">
      <p>Delete "{{ selectedLabel }}"? Child nodes must be removed first.</p>
      <template #footer>
        <Button variant="outlined" label="Cancel" @click="deleteDialogOpen = false" />
        <Button severity="danger" label="Delete" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.org-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.org-detail__selected {
  margin: 0 0 16px;
}

@media (max-width: 900px) {
  .org-layout {
    grid-template-columns: 1fr;
  }
}
</style>
