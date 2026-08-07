# VirtualTree

VirtualTree：面向企业场景的 Tree 组件（成熟度 rc）。

## 组件介绍

VirtualTree：面向企业场景的 Tree 组件（成熟度 rc）。

## 核心特性

- Tree 家族组件

## 何时使用 / 不适用

**适用**

- 层级数据展示与勾选
- 目录/组织架构

**不适用**

- 扁平列表请用 Table / List

## 基础用法

> `import { VirtualTree } from 'amg-webui/data'`

```vue
<script setup>
import { VirtualTree } from 'amg-webui/data'
</script>

<template>
  <VirtualTree />
</template>
```

Curated demo：`example/demos/VirtualTree/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| （无公开 Props） | | | |

## 键盘交互

- 状态：`PASS`
- 按键：`Enter`
- Enter: Enter on label button selects node and emits update:modelValue

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTree uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTree RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTree client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VirtualTree.json` |
| API extract | `generated/component-api/VirtualTree.json` |

> 完整 Demo 见 `example/demos/VirtualTree`（example 本地调试，不上线）。

