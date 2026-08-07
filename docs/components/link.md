# Link

Link：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Link：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 支持禁用状态
- 只读模式
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Link } from 'amg-webui/core'`

```vue
<script setup>
import { Link } from 'amg-webui/core'
</script>

<template>
  <Link />
</template>
```

Curated demo：`example/demos/Link/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `undefined` | External URL — blocked for javascript:/data:/vbscript: |
| `to` | `string` | `undefined` | Internal path (vue-router `$router` when available) |
| `type` | `LinkType` | `default` | Semantic color; `link` = native hyperlink primary |
| `size` | `Size` | `md` | xs → xl, maps font-size tokens (aligned with Button) |
| `underline` | `LinkUnderline` | `hover` | Underline mode; `true`≡always, `false`≡never |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | false | Visual normal, clicks/navigation ignored (≠ disabled) |
| `loading` | `boolean` | false | Locks interaction; shows spinner (overrides custom icon) |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top' \| string` | `undefined` | target 字符串 |
| `replace` | `boolean` | false | 是否启用 replace |
| `icon` | `string` | `undefined` | Lucide icon name |
| `iconPos` | `LinkIconPos` | `left` | 图标位置 / Icon position |
| `iconSize` | `Size` | `undefined` | Override icon size token (defaults to link size) |
| `iconGap` | `Size \| string` | `undefined` | Gap between icon and text — Size token or CSS length |
| `ariaLabel` | `string` | `undefined` | Accessible name when slot text is insufficient |
| `tooltip` | `string` | `undefined` | Native title / tooltip hint |
| `stopPropagation` | `boolean` | false | Stop click bubbling (tables / nested actions) |
| `permission` | `boolean \| (() => boolean)` | true | Permission gate. `true` / missing = allowed. Vue Boolean props omit as `false` — component default must be `true` so hide mode does not blank every Link. `false` or failing checker → hide or disable per `permissionMode`. |
| `permissionMode` | `LinkPermissionMode` | `hide` | permissionMode 配置项 |
| `permissionTip` | `string` | `undefined` | permissionTip 字符串 |
| `beforeClick` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | `undefined` | Pre-click interceptor — return false / reject to abort |
| `clickGuard` | `LinkClickGuard` | `none` | clickGuard 配置项 |
| `wait` | `number` | `undefined` | Wait ms for debounce / throttle |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Public Types

- `LinkType`
- `LinkUnderline`
- `LinkIconPos`
- `LinkClickGuard`
- `LinkPermissionMode`
- `LinkProps`
- `LinkEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Link interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Link uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Link RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Link client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Link.json` |
| API extract | `generated/component-api/Link.json` |

> 完整 Demo 见 `example/demos/Link`（example 本地调试，不上线）。

