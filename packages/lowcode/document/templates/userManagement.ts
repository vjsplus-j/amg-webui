import {
  CANVAS_SCHEMA_VERSION,
  createCanvasNode,
  type CanvasNodeData
} from '@amg-webui/utils'
import type { LowcodeDocument } from '../types'
import { createEmptyDocument } from '../types'
import type { DataSourceDef, LowcodeAction } from '../../runtime'
import { LOWCODE_BINDINGS_KEY, LOWCODE_EVENTS_KEY } from '../../types'

const MOCK_USERS = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', status: 'active' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com', status: 'active' },
  { id: 3, name: 'Grace Hopper', email: 'grace@example.com', status: 'inactive' },
  { id: 4, name: 'Katherine Johnson', email: 'kj@example.com', status: 'active' },
  { id: 5, name: 'Donald Knuth', email: 'knuth@example.com', status: 'active' }
]

export function createUserManagementTemplate(): LowcodeDocument {
  const doc = createEmptyDocument('User Management')

  const container = createCanvasNode('Container', 'Page', {
    id: 'node-page',
    x: 24,
    y: 24,
    w: 960,
    h: 640,
    props: { title: 'Users' },
    zIndex: 1
  })

  const searchInput = createCanvasNode('InputText', 'Search', {
    id: 'node-search',
    x: 16,
    y: 48,
    w: 280,
    h: 40,
    parentId: 'node-page',
    props: {
      placeholder: 'keyword',
      [LOWCODE_BINDINGS_KEY]: { modelValue: 'state.keyword' }
    },
    zIndex: 2
  })

  const searchBtn = createCanvasNode('Button', 'Search', {
    id: 'node-search-btn',
    x: 312,
    y: 48,
    w: 120,
    h: 40,
    parentId: 'node-page',
    props: {
      label: 'Search',
      severity: 'primary',
      [LOWCODE_EVENTS_KEY]: { click: 'onSearch' }
    },
    zIndex: 3
  })

  const createBtn = createCanvasNode('Button', 'Create', {
    id: 'node-create-btn',
    x: 448,
    y: 48,
    w: 120,
    h: 40,
    parentId: 'node-page',
    props: {
      label: 'Create',
      [LOWCODE_EVENTS_KEY]: { click: 'onOpenCreate' }
    },
    zIndex: 4
  })

  const table = createCanvasNode('DataTable', 'Users', {
    id: 'node-table',
    x: 16,
    y: 112,
    w: 920,
    h: 400,
    parentId: 'node-page',
    props: {
      columns: [
        { field: 'id', header: 'ID', width: '80px' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
        { field: 'status', header: 'Status', width: '100px' }
      ],
      value: [],
      paginator: true,
      rows: 10,
      [LOWCODE_BINDINGS_KEY]: { value: 'data.queryUsers.list' }
    },
    zIndex: 5
  })

  const dialog = createCanvasNode('Dialog', 'Create User', {
    id: 'node-dialog',
    x: 200,
    y: 160,
    w: 400,
    h: 280,
    props: {
      header: 'Create User',
      visible: false,
      [LOWCODE_BINDINGS_KEY]: { visible: 'state.createOpen' }
    },
    zIndex: 10
  })

  const nameInput = createCanvasNode('InputText', 'Name', {
    id: 'node-name',
    x: 24,
    y: 24,
    w: 320,
    h: 40,
    parentId: 'node-dialog',
    props: {
      placeholder: 'name',
      [LOWCODE_BINDINGS_KEY]: { modelValue: 'form.name' }
    },
    zIndex: 11
  })

  const submitBtn = createCanvasNode('Button', 'Submit', {
    id: 'node-submit',
    x: 24,
    y: 88,
    w: 120,
    h: 40,
    parentId: 'node-dialog',
    props: {
      label: 'Submit',
      severity: 'primary',
      [LOWCODE_EVENTS_KEY]: { click: 'onSubmitCreate' }
    },
    zIndex: 12
  })

  const nodes: CanvasNodeData[] = [
    container,
    searchInput,
    searchBtn,
    createBtn,
    table,
    dialog,
    nameInput,
    submitBtn
  ]

  const queryUsers: DataSourceDef = {
    id: 'queryUsers',
    type: 'mock',
    name: 'Query Users',
    transform: 'listTotal',
    staticData: {
      list: MOCK_USERS,
      total: MOCK_USERS.length
    }
  }

  const actions: Record<string, LowcodeAction[]> = {
    onSearch: [
      {
        type: 'CallApi',
        dataSourceId: 'queryUsers'
      }
    ],
    onOpenCreate: [{ type: 'OpenDialog', target: 'state.createOpen' }],
    onSubmitCreate: [
      { type: 'ShowMessage', message: 'Saved', severity: 'success' },
      { type: 'CloseDialog', target: 'state.createOpen' },
      { type: 'CallApi', dataSourceId: 'queryUsers' }
    ]
  }

  return {
    ...doc,
    name: 'User Management',
    schemaVersion: CANVAS_SCHEMA_VERSION,
    page: { mode: 'free', breakpoint: 'pc' },
    nodes,
    variables: { keyword: '' },
    dataSources: [queryUsers],
    actions,
    updatedAt: new Date().toISOString()
  }
}
