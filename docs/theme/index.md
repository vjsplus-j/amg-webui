# 主题体系

AMG-WebUI 视觉由 **Token 三层**驱动：Primitive → Semantic（`--ds-*`）→ Component（`--theme-*`）。组件与页面只消费语义 Token，禁止硬编码 hex/px。

## ThemeService

运行时主题由 `ThemeService` 统一管理（`packages/theme/services/ThemeService.ts`）：

```ts
import { ThemeService } from 'amg-webui/theme'

// 启动时初始化
ThemeService.init({ design: 'linear', scheme: 'light', locale: 'zh-CN' })

// 切换
ThemeService.setDesign('mercedes')
ThemeService.setScheme('dark')
ThemeService.setFont('inter')
```

写入 DOM 的属性轴包括 `data-design` · `data-scheme` · `data-font` · `data-icon-style` · `data-locale`，对应 CSS 变量契约见 `packages/theme/TOKENS.md`。

## 六套官方主题（只读）

| design | 气质 | 圆角 / 密度 |
| --- | --- | --- |
| **mercedes** | 经典德系、舒适密度 | 直角 · comfortable |
| **linear** | SaaS / dev-tools、紧凑 | 6–8px · compact |
| **porsche** | 运动精致 | 8px |
| **lamborghini** | 棱角、高对比 | 4–8px |
| **ferrari** | 竞技、锐利 | 2px |
| **apple** | 零售、大圆角 | 11–14px pill |

源码锁定于 `packages/theme/styles/design/`，**不可**被业务直接 fork 覆盖；自定义主题走 CSS 变量 overlay。

## 亮 / 暗色

```ts
ThemeService.setScheme('light') // | 'dark'
```

Scheme 与 design 正交组合；Token 映射见各主题 SCSS partial。

## Theme Studio（概念）

[Theme Studio 规划](../THEME_STUDIO.md) 对标 [designmd Build](https://designmd.santiagoalonso.com/build)：

- 左侧调 Token → 右侧真实 base 组件预览
- 导出 `theme.ts` / CSS 变量 / SCSS
- 自定义主题经 `ThemeService.applyCustom(tokens)` 热应用，不重挂整树

> **0.1 docs 边界**：Studio 交互界面仅在本地 **example**（`group: 'theme'`），不在对外 docs 复刻完整编辑器。

## 相关文档

| 文档 | 说明 |
| --- | --- |
| [THEME_STUDIO.md](../THEME_STUDIO.md) | Studio 能力与导出契约 |
| [tokens.md](../tokens.md) | Token 捷径 |
| [design-specs.md](../design-specs.md) | 布局 / 密度 / 字阶 |
