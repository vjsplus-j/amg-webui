# Button

Button 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Button 已通过 Component Hardening 证据门禁；下方 **DocsDemo** 提供 docs 站内嵌交互，完整 curated demo 见 example。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [ButtonGroup](./button-group)
- [Dialog](./dialog)

## 基础用法

```vue
<script setup>
import { Button } from '@amg-webui/core'
</script>

<template>
  <Button />
</template>
```

Curated demo：`example/demos/Button/index.vue`

## 交互演示

<DocsDemo name="button-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | — | 旋转动画 / Spin animation |
| `pulse` | `boolean` | — | 脉冲动画 / Pulse animation |
| `heartbeat` | `boolean` | — | — |
| `bounce` | `boolean` | — | — |
| `blink` | `boolean` | — | — |
| `breathe` | `boolean` | — | — |
| `glow` | `boolean` | — | — |
| `marqueeLeft` | `boolean` | — | — |
| `marqueeRight` | `boolean` | — | — |
| `scrollUp` | `boolean` | — | — |
| `scrollDown` | `boolean` | — | — |
| `dampOut` | `boolean` | — | — |
| `animationDuration` | `number \| string` | — | — |
| `label` | `string` | — | 显示文案 / Display label |
| `icon` | `string` | — | 图标名 / Icon name |
| `iconPos` | `ButtonIconPos` | — | 图标位置 / Icon position |
| `iconSize` | `Size` | — | — |
| `iconGap` | `Size \| string` | — | — |
| `severity` | `ButtonSeverity` | — | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `variant` | `ButtonVariant` | — | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `shape` | `ButtonShape` | — | 形状：`rectangle` · `pill` · `circle` / Button shape |
| `rounded` | `boolean` | — | 圆角按钮 / Rounded shape |
| `borderRadius` | `string` | — | — |
| `raised` | `boolean` | — | 浮起阴影 / Raised shadow |
| `link` | `boolean` | — | 链接样式 / Link appearance |
| `block` | `boolean` | — | 块级按钮（整行）/ Block-level button |
| `fluid` | `boolean` | — | 宽度 100% / Full width |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `loadingText` | `string` | — | 加载中文案 / Loading text |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `disabledTitle` | `string` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `confirm` | `event: Event` | — |
| `cancelConfirm` | `event: Event` | — |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |
| `icon` | `props: Record<string, never>` | — |
| `loading` | `props: Record<string, never>` | — |

## Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `el` | `HTMLElement \| null` | — |
| `focus` | `() => void` | — |
| `blur` | `() => void` | — |

## Public types

- `ButtonSeverity`
- `ButtonIconPos`
- `ButtonShape`
- `ButtonVariant`
- `ButtonClickGuard`
- `ButtonPermissionMode`
- `ButtonNativeType`
- `ButtonInstance`
- `ButtonProps`
- `ButtonEmits`
- `ButtonSlots`
- `ButtonExpose`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Button/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Button/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Button.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Button`。
