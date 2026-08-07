import type { Component } from 'vue'

import ButtonBasic from './button/Basic.vue'
import buttonBasicSource from './button/Basic.vue?raw'

import InputTextBasic from './input-text/Basic.vue'
import inputTextBasicSource from './input-text/Basic.vue?raw'

import SelectBasic from './select/Basic.vue'
import selectBasicSource from './select/Basic.vue?raw'

import CheckboxBasic from './checkbox/Basic.vue'
import checkboxBasicSource from './checkbox/Basic.vue?raw'

import RadioBasic from './radio/Basic.vue'
import radioBasicSource from './radio/Basic.vue?raw'

import SwitchBasic from './switch/Basic.vue'
import switchBasicSource from './switch/Basic.vue?raw'

import DatePickerBasic from './date-picker/Basic.vue'
import datePickerBasicSource from './date-picker/Basic.vue?raw'

import FormBasic from './form/Basic.vue'
import formBasicSource from './form/Basic.vue?raw'

import DataTableBasic from './data-table/Basic.vue'
import dataTableBasicSource from './data-table/Basic.vue?raw'

import TreeBasic from './tree/Basic.vue'
import treeBasicSource from './tree/Basic.vue?raw'

import DialogBasic from './dialog/Basic.vue'
import dialogBasicSource from './dialog/Basic.vue?raw'

import DrawerBasic from './drawer/Basic.vue'
import drawerBasicSource from './drawer/Basic.vue?raw'

import TabsBasic from './tabs/Basic.vue'
import tabsBasicSource from './tabs/Basic.vue?raw'

import MenuBasic from './menu/Basic.vue'
import menuBasicSource from './menu/Basic.vue?raw'

import PaginationBasic from './pagination/Basic.vue'
import paginationBasicSource from './pagination/Basic.vue?raw'

import UploadBasic from './upload/Basic.vue'
import uploadBasicSource from './upload/Basic.vue?raw'

export interface SharedDemoEntry {
  component: Component
  source: string
  title?: string
}

/** SSOT: demo id → runnable SFC + ?raw source (same file). Consumed by docs, example, tests. */
export const sharedDemoRegistry: Record<string, SharedDemoEntry> = {
  'button-basic': {
    component: ButtonBasic,
    source: buttonBasicSource,
    title: '基础用法'
  },
  'input-text-basic': {
    component: InputTextBasic,
    source: inputTextBasicSource,
    title: '基础用法'
  },
  'select-basic': {
    component: SelectBasic,
    source: selectBasicSource,
    title: '基础用法'
  },
  'checkbox-basic': {
    component: CheckboxBasic,
    source: checkboxBasicSource,
    title: '基础用法'
  },
  'radio-basic': {
    component: RadioBasic,
    source: radioBasicSource,
    title: '基础用法'
  },
  'switch-basic': {
    component: SwitchBasic,
    source: switchBasicSource,
    title: '基础用法'
  },
  'date-picker-basic': {
    component: DatePickerBasic,
    source: datePickerBasicSource,
    title: '基础用法'
  },
  'form-basic': {
    component: FormBasic,
    source: formBasicSource,
    title: '基础用法'
  },
  'data-table-basic': {
    component: DataTableBasic,
    source: dataTableBasicSource,
    title: '基础用法'
  },
  'tree-basic': {
    component: TreeBasic,
    source: treeBasicSource,
    title: '基础用法'
  },
  'dialog-basic': {
    component: DialogBasic,
    source: dialogBasicSource,
    title: '基础用法'
  },
  'drawer-basic': {
    component: DrawerBasic,
    source: drawerBasicSource,
    title: '基础用法'
  },
  'tabs-basic': {
    component: TabsBasic,
    source: tabsBasicSource,
    title: '基础用法'
  },
  'menu-basic': {
    component: MenuBasic,
    source: menuBasicSource,
    title: '基础用法'
  },
  'pagination-basic': {
    component: PaginationBasic,
    source: paginationBasicSource,
    title: '基础用法'
  },
  'upload-basic': {
    component: UploadBasic,
    source: uploadBasicSource,
    title: '基础用法'
  }
}

export const sharedDemoIds = Object.keys(sharedDemoRegistry) as SharedDemoId[]

export type SharedDemoId = keyof typeof sharedDemoRegistry

/** @deprecated Use sharedDemoRegistry — kept for docs shim compatibility */
export const docsDemoRegistry = sharedDemoRegistry

export type DocsDemoId = SharedDemoId
