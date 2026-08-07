# VideoAdjust

VideoAdjust：面向企业场景的 Media 组件（成熟度 rc）。

## 组件介绍

VideoAdjust：面向企业场景的 Media 组件（成熟度 rc）。

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

> `import { VideoAdjust } from 'amg-webui/media'`

```vue
<script setup>
import { VideoAdjust } from 'amg-webui/media'
</script>

<template>
  <VideoAdjust />
</template>
```

Curated demo：`example/demos/VideoAdjust/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `brightness` | `number` | 100 | brightness 数值 |
| `contrast` | `number` | 100 | contrast 数值 |
| `saturation` | `number` | 100 | saturation 数值 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:brightness` | `v: number` | `brightness` 更新时触发（v-model） |
| `update:contrast` | `v: number` | `contrast` 更新时触发（v-model） |
| `update:saturation` | `v: number` | `saturation` 更新时触发（v-model） |
| `change` | `payload: { brightness: number; contrast: number; saturation: number }` | 值变更 / Change |

### Public Types

- `VideoAdjustProps`
- `VideoAdjustEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts VideoAdjust interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoAdjust uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoAdjust RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VideoAdjust client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VideoAdjust.json` |
| API extract | `generated/component-api/VideoAdjust.json` |

> 完整 Demo 见 `example/demos/VideoAdjust`（example 本地调试，不上线）。

