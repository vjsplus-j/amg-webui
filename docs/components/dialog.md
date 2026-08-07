# Dialog 对话框

Dialog 对话框：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Dialog 对话框：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 模态遮罩
- 可关闭
- 多尺寸规格
- 事件回调
- 插槽自定义
- 实例方法暴露

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Dialog } from 'amg-webui/overlay'`

```vue
<script setup>
import { Dialog } from 'amg-webui/overlay'
</script>

<template>
  <Dialog />
</template>
```

Curated demo：`example/demos/Dialog/index.vue`

## 示例

<DocsDemo name="dialog-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否显示（v-model:visible）/ Visibility |
| `header` | `string` | `undefined` | header 字符串 |
| `footer` | `string` | `undefined` | footer 字符串 |
| `title` | `string` | `undefined` | 标题 / Title |
| `modal` | `boolean` | true | 模态遮罩 / Modal overlay |
| `dismissible` | `boolean` | true | 是否启用 dismissible |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `maximizable` | `boolean` | false | 是否启用 maximizable |
| `minimizable` | `boolean` | false | 是否启用 minimizable |
| `size` | `DialogSize` | `md` | Preset width — ignored when maximized |
| `width` | `string` | `` | Custom width CSS value (overrides size) |
| `lockScroll` | `boolean` | true | Lock document scroll while open (modal only). @default true |
| `closeOnPressEscape` | `boolean` | `undefined` | Close on Escape. @default dismissible |
| `closeOnClickOverlay` | `boolean` | `undefined` | Close on overlay click. @default dismissible |
| `teleportTo` | `string \| HTMLElement` | `body` | Teleport target. @default body (via Overlay runtime) |
| `zIndex` | `number` | `undefined` | Explicit stacking order; otherwise Overlay z-index manager. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `maximize` | `maximized: boolean` | maximize 时触发 |
| `close` | `event?: Event, reason?: DialogCloseReason` | 关闭 / Close |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | Main dialog body |
| `header` | `props: Record<string, never>` | Header region — replaces `title` / `header` props when provided |
| `footer` | `props: Record<string, never>` | Footer region — replaces `footer` prop when provided |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `open` | `() => void` | Open the dialog (`update:visible` true) |
| `close` | `(reason?: DialogCloseReason) => void` | Close the dialog with an optional reason |

### Public Types

- `DialogSize`
- `DialogCloseReason`
- `DialogInstance`
- `DialogProps`
- `DialogEmits`
- `DialogSlots`
- `DialogExpose`

## 键盘交互

- 状态：`PASS`
- 按键：`Escape`
- Escape: closes dialog and emits update:visible false

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- optional

## RTL

- 状态：`N/A`
- optional

## SSR

- 状态：`PASS`
- structural DOM + component entry

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Button](./button)
- [Form](./form)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Dialog.json` |
| API extract | `generated/component-api/Dialog.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Dialog`。

