# VcrDownloadPanel

VcrDownloadPanel：面向企业场景的 VCR 组件（成熟度 rc）。

## 组件介绍

VcrDownloadPanel：面向企业场景的 VCR 组件（成熟度 rc）。

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

> `import { VcrDownloadPanel } from 'amg-webui/media'`

```vue
<script setup>
import { VcrDownloadPanel } from 'amg-webui/media'
</script>

<template>
  <VcrDownloadPanel />
</template>
```

Curated demo：`example/demos/VcrDownloadPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `VcrDownloadItem[]` | `() => [ { id: 'dl1', name: 'clip-20260714-1000.mp4', progress: 100, status: 'done' }, { id: 'dl2', name: 'clip-20260714-1030.mp4', progress: 45, status: 'running' } ]` | 菜单项 / Menu items |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `download` | `id: string` | download 时触发 |
| `cancel` | `id: string` | cancel 时触发 |

### Public Types

- `VcrDownloadItem`
- `VcrDownloadPanelProps`
- `VcrDownloadPanelEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts VcrDownloadPanel interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrDownloadPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrDownloadPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VcrDownloadPanel client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VcrDownloadPanel.json` |
| API extract | `generated/component-api/VcrDownloadPanel.json` |

> 完整 Demo 见 `example/demos/VcrDownloadPanel`（example 本地调试，不上线）。

