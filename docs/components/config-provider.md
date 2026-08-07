# ConfigProvider 全局配置

ConfigProvider 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

ConfigProvider 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { ConfigProvider } from '@amg-webui/core'
</script>

<template>
  <ConfigProvider />
</template>
```

Curated demo：`example/demos/ConfigProvider/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `zIndex` | `number` | — | — |
| `namespace` | `string` | — | — |
| `overlayTeleportTo` | `TeleportTarget` | — | — |
| `overlayRuntime` | `OverlayRuntimeApi` | — | — |
| `direction` | `ConfigProviderDirection` | — | — |
| `density` | `ConfigProviderDensity` | — | — |
| `theme` | `string` | — | — |
| `design` | `DesignStyleName \| string` | — | — |
| `scheme` | `ColorScheme` | — | — |
| `font` | `FontName \| string` | — | — |
| `iconStyle` | `IconStyleName \| string` | — | — |
| `tokens` | `Record<string, string>` | — | — |
| `primary` | `string` | — | — |
| `themeRuntime` | `ThemeRuntime` | — | — |
| `themePersist` | `boolean` | — | — |
| `themeStorageNamespace` | `string` | — | — |
| `locale` | `string` | — | — |
| `validateMessages` | `Record<string, string>` | — | — |
| `componentDefaults` | `Record<string, Record<string, unknown> \| undefined>` | — | — |
| `empty` | `ConfigProviderEmptyConfig` | — | — |
| `button` | `ButtonGlobalConfig` | — | — |
| `tag` | `TagGlobalConfig` | — | — |
| `badge` | `BadgeGlobalConfig` | — | — |
| `avatar` | `AvatarGlobalConfig` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `change` | `config: ConfigProviderResolvedConfig` | 值变更 / Change |

## Public types

- `ConfigProviderDirection`
- `ConfigProviderDensity`
- `ConfigProviderResolvedConfig`
- `ConfigProviderEmptyConfig`
- `ConfigProviderRuntimeConfig`
- `ConfigProviderProps`
- `ConfigProviderEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/ConfigProvider.json` |

> 完整 Demo 见 `example/demos/ConfigProvider`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
