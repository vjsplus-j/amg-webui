# VideoSnapshot

VideoSnapshot 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

VideoSnapshot 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { VideoSnapshot } from '@amg-webui/media'
</script>

<template>
  <VideoSnapshot />
</template>
```

Curated demo：`example/demos/VideoSnapshot/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `videoRef` | `HTMLVideoElement \| null` | — | — |
| `src` | `string` | — | — |
| `stream` | `MediaStream \| null` | — | — |
| `crossOrigin` | `"" \| "anonymous" \| "use-credentials"` | — | — |
| `controls` | `boolean` | — | — |
| `autoplay` | `boolean` | — | — |
| `muted` | `boolean` | — | — |
| `format` | `VideoSnapshotFormat` | — | 日期格式 / Date format |
| `quality` | `number` | — | — |
| `maxWidth` | `number` | — | — |
| `maxHeight` | `number` | — | — |
| `preview` | `boolean` | — | — |
| `downloadable` | `boolean` | — | — |
| `fileName` | `string` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `title` | `string` | — | 标题 / Title |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `capture` | `dataUrl: string, result: VideoSnapshotResult` | — |
| `clear` | `void` | — |
| `download` | `result: VideoSnapshotResult` | — |
| `error` | `error: VideoSnapshotError` | — |

## Public types

- `VideoSnapshotFormat`
- `VideoSnapshotErrorCode`
- `VideoSnapshotResult`
- `VideoSnapshotError`
- `VideoSnapshotProps`
- `VideoSnapshotEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/VideoSnapshot.json` |

> 完整 Demo 见 `example/demos/VideoSnapshot`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
