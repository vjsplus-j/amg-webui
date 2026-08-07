# VcrStorageDashboard

VcrStorageDashboard：面向企业场景的 VCR 组件（成熟度 rc）。

## 组件介绍

VcrStorageDashboard：面向企业场景的 VCR 组件（成熟度 rc）。

## 核心特性

- VCR 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 录像回放与存储运维
- 监控中心 VCR 能力

**不适用**

- 无录像业务时勿引入

## 基础用法

> `import { VcrStorageDashboard } from 'amg-webui/media'`

```vue
<script setup>
import { VcrStorageDashboard } from 'amg-webui/media'
</script>

<template>
  <VcrStorageDashboard />
</template>
```

Curated demo：`example/demos/VcrStorageDashboard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `volumes` | `VcrStorageVolume[]` | `() => []` | volumes 列表数据 |
| `selectedId` | `string \| null` | `null` | selectedId 字符串 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |
| `warningThreshold` | `number` | 75 | warningThreshold 数值 |
| `dangerThreshold` | `number` | 90 | dangerThreshold 数值 |
| `valueFormatter` | `(value: number) => string` | `undefined` | valueFormatter 数值 |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:selectedId` | `id: string \| null` | `selectedId` 更新时触发（v-model） |
| `refresh` | `void` | refresh 时触发 |
| `export` | `volumes: VcrStorageVolume[], summary: VcrStorageSummary` | export 时触发 |
| `select` | `volume: VcrStorageVolume` | 选中 / Select |

### Public Types

- `VcrStorageVolume`
- `VcrStorageSummary`
- `VcrStorageDashboardProps`
- `VcrStorageDashboardEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts VcrStorageDashboard interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrStorageDashboard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrStorageDashboard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrStorageDashboard client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VcrStorageDashboard.json` |
| API extract | `generated/component-api/VcrStorageDashboard.json` |

> 完整 Demo 见 `example/demos/VcrStorageDashboard`（example 本地调试，不上线）。

