# Result

Result：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Result：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Result } from 'amg-webui/core'`

```vue
<script setup>
import { Result } from 'amg-webui/core'
</script>

<template>
  <Result />
</template>
```

Curated demo：`example/demos/Result/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `status` | `ResultStatus` | `info` | status 配置项 |
| `title` | `string` | `undefined` | 标题 / Title |
| `subTitle` | `string` | `undefined` | subTitle 字符串 |
| `icon` | `string \| false` | `undefined` | 图标名 / Icon name |
| `image` | `string` | `undefined` | image 字符串 |
| `size` | `ResultSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fullScreen` | `boolean` | false | 是否启用 fullScreen |
| `actions` | `ResultAction[]` | `() => []` | actions 列表数据 |
| `live` | `"polite" \| "assertive" \| "off"` | `polite` | live 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `extra-click` | `event: MouseEvent` | extra-click 时触发 |
| `action` | `key: string, event: MouseEvent` | action 时触发 |

### Public Types

- `ResultStatus`
- `ResultSize`
- `ResultAction`
- `ResultProps`
- `ResultEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Result non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Result uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Result RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Result client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Result.json` |
| API extract | `generated/component-api/Result.json` |

> 完整 Demo 见 `example/demos/Result`（example 本地调试，不上线）。

