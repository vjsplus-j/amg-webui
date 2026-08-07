# TabPane

TabPane：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

TabPane：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- 支持禁用状态
- 远程/懒加载数据

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导
- 需要禁用/只读控制的表单场景

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { TabPane } from 'amg-webui/core'`

```vue
<script setup>
import { TabPane } from 'amg-webui/core'
</script>

<template>
  <TabPane />
</template>
```

Curated demo：`example/demos/TabPane/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | `string \| number` | **必填** | 表单字段名 / Form field name |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `lazy` | `boolean` | false | Defer rendering until the pane is first activated |
| `forceRender` | `boolean` | false | Always keep content mounted (overrides lazy after first paint) |
| `destroyInactive` | `boolean` | false | Unmount content whenever the pane becomes inactive |
| `ariaLabel` | `string` | `undefined` | Accessible name when rendered outside Tabs or without a label |
| `tabindex` | `number` | `undefined` | Focus order for the active panel |

### Public Types

- `TabPaneProps`
- `TabPaneEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts TabPane interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TabPane uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TabPane RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TabPane client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/TabPane.json` |
| API extract | `generated/component-api/TabPane.json` |

> 完整 Demo 见 `example/demos/TabPane`（example 本地调试，不上线）。

