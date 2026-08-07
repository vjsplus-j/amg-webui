# Drawer 抽屉

Drawer 抽屉：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Drawer 抽屉：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 模态遮罩
- 可关闭
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互
- 异步提交或加载过程反馈

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Drawer } from 'amg-webui/overlay'`

```vue
<script setup>
import { Drawer } from 'amg-webui/overlay'
</script>

<template>
  <Drawer />
</template>
```

Curated demo：`example/demos/Drawer/index.vue`

## 示例

<DocsDemo name="drawer-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否显示（v-model:visible）/ Visibility |
| `title` | `string` | `undefined` | 标题 / Title |
| `placement` | `DrawerPlacement` | `right` | 抽屉方向 / Drawer placement |
| `width` | `string` | `` | width 字符串 |
| `height` | `string` | `` | height 字符串 |
| `modal` | `boolean` | true | 模态遮罩 / Modal overlay |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `dismissible` | `boolean` | true | 是否启用 dismissible |
| `closeOnClickOverlay` | `boolean` | `undefined` | 是否启用 closeOnClickOverlay |
| `closeOnPressEscape` | `boolean` | `undefined` | 是否启用 closeOnPressEscape |
| `lockScroll` | `boolean` | true | 是否启用 lockScroll |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `teleportTo` | `string \| HTMLElement` | `body` | teleportTo 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `beforeClose` | `( reason: DrawerCloseReason, event?: Event, ) => boolean \| Promise<boolean>` | `undefined` | 是否启用 beforeClose |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `show` | `event?: Event` | show 时触发 |
| `hide` | `event?: Event` | hide 时触发 |
| `open` | `void` | 打开 / Open |
| `closed` | `void` | closed 时触发 |
| `close` | `event?: Event, reason?: DrawerCloseReason` | 关闭 / Close |
| `error` | `error: unknown` | error 时触发 |

### Public Types

- `DrawerPlacement`
- `DrawerCloseReason`
- `DrawerProps`
- `DrawerEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Escape`
- Escape: closes drawer with escape reason and emits update:visible false

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Drawer uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Drawer RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Drawer client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Dialog](./dialog)
- [Form](./form)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Drawer.json` |
| API extract | `generated/component-api/Drawer.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Drawer`。

