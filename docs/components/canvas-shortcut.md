# CanvasShortcut

CanvasShortcut：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

CanvasShortcut：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { CanvasShortcut } from 'amg-webui/lowcode'`

```vue
<script setup>
import { CanvasShortcut } from 'amg-webui/lowcode'
</script>

<template>
  <CanvasShortcut />
</template>
```

Curated demo：`example/demos/CanvasShortcut/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | true | 是否启用 enabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `commands` | `Array<{ key: string; label: string; shortcut?: string }>` | `() => [ { key: 'copy', label: 'Copy', shortcut: 'Ctrl/Cmd + C' }, { key: 'paste', label: 'Paste', shortcut: 'Ctrl/Cmd + V' }, { key: 'delete', label: 'Delete', shortcut: 'Delete / Backspace' }, { key: 'undo', label: 'Undo', shortcut: 'Ctrl/Cmd + Z' }, { key: 'redo', label: 'Redo', shortcut: 'Ctrl/Cmd + Shift + Z' } ]` | commands 字符串 |
| `showCommands` | `boolean` | true | 是否启用 showCommands |
| `keyboard` | `boolean` | true | 是否启用 keyboard |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `copy` | `void` | copy 时触发 |
| `paste` | `void` | paste 时触发 |
| `delete` | `void` | delete 时触发 |
| `undo` | `void` | undo 时触发 |
| `redo` | `void` | redo 时触发 |
| `execute` | `command: string` | execute 时触发 |

### Public Types

- `CanvasShortcutProps`
- `CanvasShortcutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasShortcut non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasShortcut uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasShortcut RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasShortcut client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CanvasShortcut.json` |
| API extract | `generated/component-api/CanvasShortcut.json` |

> 完整 Demo 见 `example/demos/CanvasShortcut`（example 本地调试，不上线）。

