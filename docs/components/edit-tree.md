# EditTree

EditTree：面向企业场景的 Tree 组件（成熟度 rc）。

## 组件介绍

EditTree：面向企业场景的 Tree 组件（成熟度 rc）。

## 核心特性

- Tree 家族组件
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 层级数据展示与勾选
- 目录/组织架构
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 扁平列表请用 Table / List

## 基础用法

> `import { EditTree } from 'amg-webui/data'`

```vue
<script setup>
import { EditTree } from 'amg-webui/data'
</script>

<template>
  <EditTree />
</template>
```

Curated demo：`example/demos/EditTree/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `unknown` | `undefined` | 树形数据 / Tree data |
| `modelValue` | `unknown` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | `undefined` | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | v-model 更新 / v-model update |
| `change` | `value: unknown` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `EditTreeProps`
- `EditTreeEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Enter`
- Enter: Enter in inline edit input commits node label change

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts EditTree uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts EditTree RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts EditTree client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/data` |
| metadata | `component-metadata/EditTree.json` |
| API extract | `generated/component-api/EditTree.json` |

> 完整 Demo 见 `example/demos/EditTree`（example 本地调试，不上线）。

