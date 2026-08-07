# DragRuler

DragRuler：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

DragRuler：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 加载状态反馈
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { DragRuler } from 'amg-webui/lowcode'`

```vue
<script setup>
import { DragRuler } from 'amg-webui/lowcode'
</script>

<template>
  <DragRuler />
</template>
```

Curated demo：`example/demos/DragRuler/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `scale` | `number` | 1 | scale 数值 |
| `showGuides` | `boolean` | true | 是否启用 showGuides |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `title` | `string` | `undefined` | 标题 / Title |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `toggle-guides` | `value: boolean` | toggle-guides 时触发 |

### Public Types

- `DragRulerProps`
- `DragRulerEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts DragRuler interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragRuler uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragRuler RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragRuler client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/lowcode` |
| metadata | `component-metadata/DragRuler.json` |
| API extract | `generated/component-api/DragRuler.json` |

> 完整 Demo 见 `example/demos/DragRuler`（example 本地调试，不上线）。

