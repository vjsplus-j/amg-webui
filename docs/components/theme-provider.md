# ThemeProvider

ThemeProvider：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

ThemeProvider：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { ThemeProvider } from 'amg-webui/core'`

```vue
<script setup>
import { ThemeProvider } from 'amg-webui/core'
</script>

<template>
  <ThemeProvider />
</template>
```

Curated demo：`example/demos/ThemeProvider/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `design` | `DesignStyleName \| string` | `undefined` | Official design brand (mercedes / linear / …). |
| `theme` | `string` | `undefined` | Alias of `design` for ConfigProvider-compatible naming. |
| `scheme` | `ColorScheme` | `undefined` | scheme 配置项 |
| `font` | `FontName \| string` | `undefined` | font 字符串 |
| `iconStyle` | `IconStyleName \| string` | `undefined` | iconStyle 字符串 |
| `tokens` | `Record<string, string>` | `undefined` | CSS custom property overlay (keys with or without `--`). |
| `primary` | `string` | `undefined` | Primary color → full `--primary-*` scale + semantic bridges. |
| `runtime` | `ThemeRuntime` | `undefined` | Inject an existing runtime (provider will not dispose it). |
| `persist` | `boolean` | false | Persist axes to storage. Default false for scoped providers. |
| `storageNamespace` | `string` | `undefined` | storageNamespace 字符串 |
| `tag` | `string` | `div` | tag 字符串 |
| `display` | `'block' \| 'contents' \| 'inline'` | `block` | display 配置项 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `change` | `state: ReturnType<ThemeRuntime['getState']>` | 值变更 / Change |

### Public Types

- `ThemeProviderProps`
- `ThemeProviderEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ThemeProvider non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ThemeProvider uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ThemeProvider RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ThemeProvider client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ThemeProvider.json` |
| API extract | `generated/component-api/ThemeProvider.json` |

> 完整 Demo 见 `example/demos/ThemeProvider`（example 本地调试，不上线）。

