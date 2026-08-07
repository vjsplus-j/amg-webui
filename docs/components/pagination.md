# Pagination 分页

Pagination 分页：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

Pagination 分页：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导
- 需要禁用/只读控制的表单场景

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { Pagination } from 'amg-webui/data'`

```vue
<script setup>
import { Pagination } from 'amg-webui/data'
</script>

<template>
  <Pagination />
</template>
```

Curated demo：`example/demos/Pagination/index.vue`

## 示例

<DocsDemo name="pagination-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `total` | `number` | 0 | 总条数 / Total count |
| `page` | `number` | 1 | page 数值 |
| `pageSize` | `number` | 10 | 每页条数 / Page size |
| `pageSizes` | `number[]` | `() => [10, 20, 50, 100]` | pageSizes 数值 |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:page` | `value: number` | `page` 更新时触发（v-model） |
| `update:pageSize` | `value: number` | `pageSize` 更新时触发（v-model） |
| `change` | `payload: { page: number; pageSize: number }` | 值变更 / Change |

### Public Types

- `PaginationProps`
- `PaginationEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Pagination interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Pagination uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Pagination RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Pagination client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [DataTable](./data-table)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/data` |
| metadata | `component-metadata/Pagination.json` |
| API extract | `generated/component-api/Pagination.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Pagination`。

