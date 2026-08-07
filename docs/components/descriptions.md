# Descriptions

Descriptions：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

Descriptions：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 多尺寸规格

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { Descriptions } from 'amg-webui/data'`

```vue
<script setup>
import { Descriptions } from 'amg-webui/data'
</script>

<template>
  <Descriptions />
</template>
```

Curated demo：`example/demos/Descriptions/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `column` | `number` | 3 | column 数值 |
| `bordered` | `boolean` | false | 是否启用 bordered |
| `size` | `DescriptionsSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `labelWidth` | `string \| number` | `undefined` | 标签宽度 / Label width |

### Public Types

- `DescriptionsSize`
- `DescriptionsContext`
- `DescriptionsProps`
- `DescriptionsItemProps`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Descriptions uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Descriptions RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Descriptions client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/data` |
| metadata | `component-metadata/Descriptions.json` |
| API extract | `generated/component-api/Descriptions.json` |

> 完整 Demo 见 `example/demos/Descriptions`（example 本地调试，不上线）。

