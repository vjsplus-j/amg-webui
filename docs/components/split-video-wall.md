# SplitVideoWall

SplitVideoWall：面向企业场景的 Media 组件（成熟度 rc）。

## 组件介绍

SplitVideoWall：面向企业场景的 Media 组件（成熟度 rc）。

## 核心特性

- Media 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 音视频播放与控制
- 监控预览场景

**不适用**

- 非媒体业务无需引入行业包

## 基础用法

> `import { SplitVideoWall } from 'amg-webui/media'`

```vue
<script setup>
import { SplitVideoWall } from 'amg-webui/media'
</script>

<template>
  <SplitVideoWall />
</template>
```

Curated demo：`example/demos/SplitVideoWall/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `undefined` | 绑定值 / Bound value (v-model) |
| `layout` | `WallLayout` | 4 | layout 配置项 |
| `selected` | `number` | 0 | selected 数值 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `layouts` | `WallLayout[]` | `() => [1, 4, 9]` | layouts 列表数据 |
| `showToolbar` | `boolean` | true | 是否启用 showToolbar |
| `keyboard` | `boolean` | true | 是否启用 keyboard |
| `aspectRatio` | `string` | `16 / 9` | aspectRatio 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `index: number` | v-model 更新 / v-model update |
| `update:selected` | `index: number` | `selected` 更新时触发（v-model） |
| `update:layout` | `layout: WallLayout` | `layout` 更新时触发（v-model） |
| `select` | `index: number` | 选中 / Select |
| `layout-change` | `layout: WallLayout` | layout-change 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `WallLayout`
- `SplitVideoWallProps`
- `SplitVideoWallEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts SplitVideoWall interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SplitVideoWall uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SplitVideoWall RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SplitVideoWall client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/SplitVideoWall.json` |
| API extract | `generated/component-api/SplitVideoWall.json` |

> 完整 Demo 见 `example/demos/SplitVideoWall`（example 本地调试，不上线）。

