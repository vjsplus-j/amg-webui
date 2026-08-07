# UserInfoCard

UserInfoCard：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

UserInfoCard：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { UserInfoCard } from 'amg-webui/core'`

```vue
<script setup>
import { UserInfoCard } from 'amg-webui/core'
</script>

<template>
  <UserInfoCard />
</template>
```

Curated demo：`example/demos/UserInfoCard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | `` | 表单字段名 / Form field name |
| `role` | `string` | `` | role 字符串 |
| `department` | `string` | `` | department 字符串 |
| `email` | `string` | `` | email 字符串 |
| `avatar` | `string` | `` | avatar 字符串 |
| `status` | `'online' \| 'offline' \| 'busy'` | `offline` | status 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `edit` | `void` | edit 时触发 |
| `action` | `action: string` | action 时触发 |

### Public Types

- `UserInfoCardProps`
- `UserInfoCardEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts UserInfoCard interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts UserInfoCard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts UserInfoCard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts UserInfoCard client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/core` |
| metadata | `component-metadata/UserInfoCard.json` |
| API extract | `generated/component-api/UserInfoCard.json` |

> 完整 Demo 见 `example/demos/UserInfoCard`（example 本地调试，不上线）。

