# VideoSnapshot

VideoSnapshot：面向企业场景的 Media 组件（成熟度 rc）。

## 组件介绍

VideoSnapshot：面向企业场景的 Media 组件（成熟度 rc）。

## 核心特性

- Media 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 音视频播放与控制
- 监控预览场景

**不适用**

- 非媒体业务无需引入行业包

## 基础用法

> `import { VideoSnapshot } from 'amg-webui/media'`

```vue
<script setup>
import { VideoSnapshot } from 'amg-webui/media'
</script>

<template>
  <VideoSnapshot />
</template>
```

Curated demo：`example/demos/VideoSnapshot/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `videoRef` | `HTMLVideoElement \| null` | `undefined` | videoRef 配置项 |
| `src` | `string` | `undefined` | src 字符串 |
| `stream` | `MediaStream \| null` | `null` | stream 配置项 |
| `crossOrigin` | `"" \| "anonymous" \| "use-credentials"` | `anonymous` | crossOrigin 配置项 |
| `controls` | `boolean` | true | 是否启用 controls |
| `autoplay` | `boolean` | true | 是否启用 autoplay |
| `muted` | `boolean` | true | 是否启用 muted |
| `format` | `VideoSnapshotFormat` | `image/png` | 日期格式 / Date format |
| `quality` | `number` | 0.92 | quality 数值 |
| `maxWidth` | `number` | `undefined` | maxWidth 数值 |
| `maxHeight` | `number` | `undefined` | maxHeight 数值 |
| `preview` | `boolean` | true | 是否启用 preview |
| `downloadable` | `boolean` | true | 是否启用 downloadable |
| `fileName` | `string` | `undefined` | fileName 字符串 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `capture` | `dataUrl: string, result: VideoSnapshotResult` | capture 时触发 |
| `clear` | `void` | clear 时触发 |
| `download` | `result: VideoSnapshotResult` | download 时触发 |
| `error` | `error: VideoSnapshotError` | error 时触发 |

### Public Types

- `VideoSnapshotFormat`
- `VideoSnapshotErrorCode`
- `VideoSnapshotResult`
- `VideoSnapshotError`
- `VideoSnapshotProps`
- `VideoSnapshotEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts VideoSnapshot interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoSnapshot uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoSnapshot RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoSnapshot client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VideoSnapshot.json` |
| API extract | `generated/component-api/VideoSnapshot.json` |

> 完整 Demo 见 `example/demos/VideoSnapshot`（example 本地调试，不上线）。

