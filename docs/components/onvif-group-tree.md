# OnvifGroupTree

OnvifGroupTree：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 组件介绍

OnvifGroupTree：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 核心特性

- ONVIF 家族组件
- 选项列表配置
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- ONVIF 设备发现与管理
- IPC 运维面板

**不适用**

- 非 ONVIF 设备对接场景

## 基础用法

> `import { OnvifGroupTree } from 'amg-webui/onvif'`

```vue
<script setup>
import { OnvifGroupTree } from 'amg-webui/onvif'
</script>

<template>
  <OnvifGroupTree />
</template>
```

Curated demo：`example/demos/OnvifGroupTree/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `OnvifGroupNode[]` | `() => []` | 树形数据 / Tree data |
| `options` | `OnvifGroupNode[]` | `() => []` | 选项列表 / Option list |
| `modelValue` | `Array<string \| number>` | `() => []` | 绑定值 / Bound value (v-model) |
| `expandedKeys` | `Array<string \| number>` | `() => []` | 展开的节点 key / Expanded node keys |
| `filter` | `string` | `` | filter 字符串 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `checkStrategy` | `"all" \| "leaf"` | `all` | checkStrategy 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: Array<string \| number>` | v-model 更新 / v-model update |
| `update:expandedKeys` | `value: Array<string \| number>` | `expandedKeys` 更新时触发（v-model） |
| `change` | `value: Array<string \| number>` | 值变更 / Change |
| `check` | `node: OnvifGroupNode, checked: boolean` | check 时触发 |
| `expand` | `node: OnvifGroupNode, expanded: boolean` | expand 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `OnvifGroupNode`
- `OnvifGroupTreeProps`
- `OnvifGroupTreeEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifGroupTree non-interactive display — keyboard N/A

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifGroupTree uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifGroupTree RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifGroupTree client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/onvif` |
| metadata | `component-metadata/OnvifGroupTree.json` |
| API extract | `generated/component-api/OnvifGroupTree.json` |

> 完整 Demo 见 `example/demos/OnvifGroupTree`（example 本地调试，不上线）。

