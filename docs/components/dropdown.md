# Dropdown

Dropdown：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Dropdown：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互
- 需要禁用/只读控制的表单场景

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Dropdown } from 'amg-webui/overlay'`

```vue
<script setup>
import { Dropdown } from 'amg-webui/overlay'
</script>

<template>
  <Dropdown />
</template>
```

Curated demo：`example/demos/Dropdown/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `NavItem[]` | `() => []` | 菜单项 / Menu items |
| `modelValue` | `string \| number` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `select` | `item: NavItem, event: MouseEvent` | 选中 / Select |
| `openChange` | `open: boolean` | openChange 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DropdownProps`
- `DropdownEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Escape`
- ArrowDown: moves roving focus among open dropdown menuitems; Escape: closes dropdown menu and restores trigger focus

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Dropdown uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Dropdown RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Dropdown client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Dropdown.json` |
| API extract | `generated/component-api/Dropdown.json` |

> 完整 Demo 见 `example/demos/Dropdown`（example 本地调试，不上线）。

