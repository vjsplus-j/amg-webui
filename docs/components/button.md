# Button 按钮

Button 按钮：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Button 按钮：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 语义色变体
- 外观变体
- 多尺寸规格
- 块级布局
- 宽度 100%
- 加载状态反馈
- 支持禁用状态
- 只读模式
- 内置确认交互
- 点击涟漪反馈
- 事件回调
- 插槽自定义
- 实例方法暴露

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Button } from 'amg-webui/core'`

```vue
<script setup>
import { Button } from 'amg-webui/core'
</script>

<template>
  <Button />
</template>
```

Curated demo：`example/demos/Button/index.vue`

## 示例

<DocsDemo name="button-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | false | Continuous rotate — shared Motion |
| `pulse` | `boolean` | false | Soft opacity pulse — shared Motion |
| `heartbeat` | `boolean` | false | Scale heartbeat — shared Motion |
| `bounce` | `boolean` | false | Jump upward — shared Motion |
| `blink` | `boolean` | false | Sharp flash — shared Motion |
| `breathe` | `boolean` | false | Breathing light — shared Motion |
| `glow` | `boolean` | false | Fluorescent glow — shared Motion |
| `marqueeLeft` | `boolean` | false | Marquee scroll left — shared Motion |
| `marqueeRight` | `boolean` | false | Marquee scroll right — shared Motion |
| `scrollUp` | `boolean` | false | Vertical scroll up — shared Motion |
| `scrollDown` | `boolean` | false | Vertical scroll down — shared Motion |
| `dampOut` | `boolean` | false | Damped zoom then fade out — shared Motion |
| `animationDuration` | `number \| string` | `undefined` | Animation duration (ms or CSS time) — shared Motion |
| `label` | `string` | `` | 显示文案 / Display label |
| `icon` | `string` | `undefined` | Lucide icon name (e.g. `Star`) — used when `#icon` slot is empty |
| `iconPos` | `ButtonIconPos` | `left` | 图标位置 / Icon position |
| `iconSize` | `Size` | `undefined` | Override icon size token (defaults to button size) |
| `iconGap` | `Size \| string` | `undefined` | Gap between icon and label — Size token or CSS length |
| `severity` | `ButtonSeverity` | `undefined` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `variant` | `ButtonVariant` | `undefined` | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `size` | `Size` | `undefined` | 极小 xs → 超大 xl，映射 `--height-*` |
| `shape` | `ButtonShape` | `rect` | 形状：矩形（默认）/ 方形 / 圆形 |
| `rounded` | `boolean` | `undefined` | Pill / full radius |
| `borderRadius` | `string` | `undefined` | Custom radius — CSS value (prefer token / `%`) |
| `raised` | `boolean` | `undefined` | 浮起阴影 / Raised shadow |
| `link` | `boolean` | `undefined` | Alias for severity=`link` / link morph |
| `block` | `boolean` | `undefined` | Block-level: width 100% |
| `fluid` | `boolean` | `undefined` | Alias of block (FluidProps parity) |
| `loading` | `boolean` | `undefined` | 加载中状态 / Loading state |
| `loadingText` | `string` | `undefined` | Shown next to loader when loading |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `disabledTitle` | `string` | `undefined` | Native title when disabled (hover tip) |
| `readonly` | `boolean` | `undefined` | Visual normal, clicks ignored (≠ disabled) |
| `type` | `ButtonNativeType` | `button` | 输入类型 / Input type |
| `badge` | `string \| number` | `undefined` | 角标 / 微章内容（绝对定位，不撑布局） |
| `star` | `boolean` | false | 标星指示 |
| `rated` | `boolean` | false | 标星别名 |
| `img` | `string` | `undefined` | 图片按钮（avatar 风格） |
| `ariaLabel` | `string` | `undefined` | icon-only / img 时的无障碍标签 |
| `title` | `string` | `undefined` | Native tooltip text |
| `ariaExpanded` | `boolean` | `undefined` | State semantics for disclosure/toggle buttons |
| `ariaPressed` | `boolean` | `undefined` | 是否启用 ariaPressed |
| `permission` | `boolean \| (() => boolean)` | `undefined` | Permission gate. `true` / missing = allowed. `false` or failing checker → hide or disable per `permissionMode`. |
| `permissionMode` | `ButtonPermissionMode` | `hide` | permissionMode 配置项 |
| `permissionTip` | `string` | `undefined` | Tip when permission denied (disable mode / click tip) |
| `confirm` | `boolean \| string` | `undefined` | Enable built-in confirm before click emit |
| `confirmTitle` | `string` | `undefined` | confirmTitle 字符串 |
| `beforeClick` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | `undefined` | Pre-click interceptor — return false / reject to abort |
| `clickGuard` | `ButtonClickGuard` | `undefined` | Debounce / throttle / none |
| `wait` | `number` | `undefined` | Wait ms for debounce / throttle (falls back to global config) |
| `href` | `string` | `undefined` | Safe external / internal href — renders as `<a>` when set |
| `to` | `string` | `undefined` | Route path string (uses vue-router `$router` when available) |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `undefined` | target 配置项 |
| `replace` | `boolean` | false | 是否启用 replace |
| `ripple` | `boolean` | `undefined` | Ripple click feedback |
| `colorBg` | `string` | `undefined` | Optional CSS color overrides (pass token vars, never raw hex in library demos) |
| `colorText` | `string` | `undefined` | colorText 字符串 |
| `colorBorder` | `string` | `undefined` | colorBorder 字符串 |
| `colorHoverBg` | `string` | `undefined` | colorHoverBg 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `confirm` | `event: Event` | 确认时触发 |
| `cancelConfirm` | `event: Event` | 取消确认时触发 |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | Default label content |
| `icon` | `props: Record<string, never>` | Leading / custom icon |
| `loading` | `props: Record<string, never>` | Loading indicator override |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `el` | `HTMLElement \| null` | Native button / anchor element |
| `focus` | `() => void` | Focus the control |
| `blur` | `() => void` | Blur the control |

### Public Types

- `ButtonSeverity`
- `ButtonIconPos`
- `ButtonShape`
- `ButtonVariant`
- `ButtonClickGuard`
- `ButtonPermissionMode`
- `ButtonNativeType`
- `ButtonInstance`
- `ButtonProps`
- `ButtonEmits`
- `ButtonSlots`
- `ButtonExpose`

## 键盘交互

- 状态：`PASS`
- 按键：`Space`
- Space: Space on focused anchor Button synthesizes click and emits click; Space: disabled Button does not emit click on Space

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- theme optional

## RTL

- 状态：`N/A`
- rtl optional

## SSR

- 状态：`PASS`
- structural top-level DOM clean

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [ButtonGroup](./button-group)
- [Dialog](./dialog)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/core` |
| metadata | `component-metadata/Button.json` |
| API extract | `generated/component-api/Button.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Button`。

