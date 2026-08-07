# VideoPreview

VideoPreview：面向企业场景的 Media 组件（成熟度 rc）。

## 组件介绍

VideoPreview：面向企业场景的 Media 组件（成熟度 rc）。

## 核心特性

- Media 家族组件
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 音视频播放与控制
- 监控预览场景

**不适用**

- 非媒体业务无需引入行业包

## 基础用法

> `import { VideoPreview } from 'amg-webui/media'`

```vue
<script setup>
import { VideoPreview } from 'amg-webui/media'
</script>

<template>
  <VideoPreview />
</template>
```

Curated demo：`example/demos/VideoPreview/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `src` | `string \| File \| Blob \| null` | `null` | src 字符串 |
| `poster` | `string` | `` | poster 字符串 |
| `controls` | `boolean` | true | 是否启用 controls |
| `autoplay` | `boolean` | false | 是否启用 autoplay |
| `loop` | `boolean` | false | 是否启用 loop |
| `muted` | `boolean` | false | 是否启用 muted |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `play` | `void` | play 时触发 |
| `pause` | `void` | pause 时触发 |
| `error` | `void` | error 时触发 |
| `fullscreen` | `active: boolean` | fullscreen 时触发 |

### Public Types

- `VideoPreviewProps`
- `VideoPreviewEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts VideoPreview interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoPreview uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoPreview RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoPreview client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/media` |
| metadata | `component-metadata/VideoPreview.json` |
| API extract | `generated/component-api/VideoPreview.json` |

> 完整 Demo 见 `example/demos/VideoPreview`（example 本地调试，不上线）。

