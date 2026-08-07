# DataCard

DataCard：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

DataCard：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 加载状态反馈
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { DataCard } from 'amg-webui/data'`

```vue
<script setup>
import { DataCard } from 'amg-webui/data'
</script>

<template>
  <DataCard />
</template>
```

Curated demo：`example/demos/DataCard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `value` | `DataCardValue` | `undefined` | 表格行数据或绑定值 / Row data or bound value |
| `data` | `DataCardValue` | `undefined` | Backward-compatible value alias. |
| `prefix` | `string` | `undefined` | prefix 字符串 |
| `suffix` | `string` | `undefined` | suffix 字符串 |
| `formatter` | `(value: DataCardValue) => string` | `undefined` | formatter 字符串 |
| `trend` | `number` | `undefined` | trend 数值 |
| `trendType` | `DataCardTrend` | `undefined` | trendType 配置项 |
| `trendLabel` | `string` | `undefined` | trendLabel 字符串 |
| `status` | `Severity` | `undefined` | status 配置项 |
| `icon` | `string` | `undefined` | 图标名 / Icon name |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `clickable` | `boolean` | false | 是否启用 clickable |
| `selected` | `boolean` | false | 是否启用 selected |
| `progress` | `number` | `undefined` | progress 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:selected` | `value: boolean` | `selected` 更新时触发（v-model） |
| `change` | `value: boolean` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

### Public Types

- `DataCardValue`
- `DataCardTrend`
- `DataCardProps`
- `DataCardEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DataCard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DataCard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DataCard client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/DataCard.json` |
| API extract | `generated/component-api/DataCard.json` |

> 完整 Demo 见 `example/demos/DataCard`（example 本地调试，不上线）。

