# Icon 图标

基于 Lucide 的图标宿主：Token 尺寸、描边风格、共享 Motion、无障碍与可选交互。

## 基础用法

```vue
<script setup>
import { Icon } from '@amg-webui/components/base'
</script>

<template>
  <Icon name="Settings" />
  <Icon name="Search" size="lg" />
  <Icon name="Star" color="var(--primary-500)" />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | Lucide 图标名（PascalCase） |
| `size` | `Size \| number \| string` | `'md'` | Token 尺寸或自定义长度 |
| `color` | `string` | — | 颜色（优先 Token / `currentColor`） |
| `strokeWidth` | `number` | IconStyleService | 描边宽度覆盖 |
| `absoluteStrokeWidth` | `boolean` | `false` | 缩放时保持屏幕像素描边 |
| `spin` / `pulse` / `heartbeat` / `bounce` … | `boolean` | `false` | 共享 Motion |
| `rotate` | `number` | — | 静态旋转（度） |
| `flip` / `flipH` / `flipV` | 翻转 | — | 水平 / 垂直 / both |
| `disabled` / `loading` / `selected` | `boolean` | `false` | 状态 |
| `label` / `alt` | `string` | — | 无障碍名称；缺省则 `aria-hidden` |
| `interactive` | `boolean` | `false` | `role=button` + 键盘；或父级 `@click` 自动开启 |
| `title` | `string` | — | 原生 title |

| 事件 | 说明 |
| --- | --- |
| `click` | 交互态点击 / Enter / Space（禁用与 loading 不触发） |
| `focus` / `blur` | 交互态焦点 |
| `keydown` | 键盘事件旁路 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 未传 `name` 时的自定义 SVG |

> 完整图库浏览、样式/动画联调见本地 example curated demo（`example/demos/Icon/`）。本阶段对外 docs 以薄 API stub 为主；无 Telemetry（纯展示件，见 `TELEMETRY.md`）。
