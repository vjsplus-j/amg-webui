# ImageViewer

ImageViewer：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

ImageViewer：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { ImageViewer } from 'amg-webui/core'`

```vue
<script setup>
import { ImageViewer } from 'amg-webui/core'
</script>

<template>
  <ImageViewer />
</template>
```

Curated demo：`example/demos/ImageViewer/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否可见 / Visibility (v-model:visible) |
| `urlList` | `string[]` | **必填** | urlList 字符串 |
| `initialIndex` | `number` | 0 | initialIndex 数值 |
| `infinite` | `boolean` | true | 是否启用 infinite |
| `zoomRate` | `number` | 1.2 | zoomRate 数值 |
| `minScale` | `number` | 0.25 | minScale 数值 |
| `maxScale` | `number` | 3 | maxScale 数值 |
| `teleported` | `boolean` | true | 是否启用 teleported |
| `class` | `string` | `undefined` | class 字符串 |
| `style` | `Record<string, string>` | `undefined` | style 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `close` | `event?: Event` | 关闭 / Close |
| `switch` | `index: number` | switch 时触发 |

### Public Types

- `ImageViewerProps`
- `ImageViewerEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ImageViewer uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ImageViewer RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ImageViewer client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ImageViewer.json` |
| API extract | `generated/component-api/ImageViewer.json` |

> 完整 Demo 见 `example/demos/ImageViewer`（example 本地调试，不上线）。

