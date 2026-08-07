# DescriptionsItem

DescriptionsItem：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

DescriptionsItem：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { DescriptionsItem } from 'amg-webui/data'`

```vue
<script setup>
import { DescriptionsItem } from 'amg-webui/data'
</script>

<template>
  <DescriptionsItem />
</template>
```

Curated demo：`example/demos/DescriptionsItem/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `span` | `number` | 1 | span 数值 |
| `colon` | `boolean` | false | 是否启用 colon |
| `labelAlign` | `"start" \| "end"` | `start` | labelAlign 配置项 |
| `labelWidth` | `string \| number` | `undefined` | 标签宽度 / Label width |

### Public Types

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
- tests/unit/hardening/real-mount-remaining.spec.ts DescriptionsItem uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DescriptionsItem RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DescriptionsItem client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/DescriptionsItem.json` |
| API extract | `generated/component-api/DescriptionsItem.json` |

> 完整 Demo 见 `example/demos/DescriptionsItem`（example 本地调试，不上线）。

