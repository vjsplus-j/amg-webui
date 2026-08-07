# AMG-WebUI 视觉与布局规范（锁定）

> 源码契约：`packages/theme/styles/design/_contract.scss`  
> Token 全文：`packages/theme/TOKENS.md`  
> 机器可读：`packages/theme/specs.ts`  
> Agent 记忆：`.cursor/rules/20-design-system.mdc`  
> 官方主题可覆盖字阶/圆角/控件高，但**不得绕过语义 token 硬编码魔法数**。

---

## 1. 字体 Font

| 主题 | Font token | 代理字体（Google） | 角色 |
|------|------------|-------------------|------|
| mercedes | `inter` | Inter | 正文 + 标题 |
| linear | `inter` | Inter Variable | 正文 + 标题（默认产品面） |
| porsche | `barlow` | Barlow | 正文 + Display |
| lamborghini | `anton` | Anton | Display 大写冲击；正文同栈 |
| ferrari | `archivo` | Archivo | 正文 + 标题 |
| apple | `albert-sans` | Albert Sans | 正文 + Display |

**规则**

- 通过 `html[data-font]` + `FontService` 切换；主题切换自动同步品牌字体。
- UI 一律用 `var(--font-family-sans)`；大标题可用 `var(--font-family-display)`。
- 禁止在组件内写死 `Inter` / `Arial` / system-only 栈（除 fonts.scss 定义处）。

---

## 2. 字号 · 字重 · 字距 · 行高 Typography

### 2.1 语义字阶（CSS 变量）

| Token | 默认（contract） | 用途 |
|-------|------------------|------|
| `--font-size-display-xl` | 3rem | Hero / 营销巨号（品牌页） |
| `--font-size-display-lg` | 2.5rem | 大 Display |
| `--font-size-display` | 2rem | 板块 Display |
| `--font-size-2xl` | 1.5rem | 页面主标题（`ln-page-title`） |
| `--font-size-xl` | 1.25rem | 小节标题 |
| `--font-size-lg` | 1.125rem | 卡片/表头强调 |
| `--font-size-md` | 0.875rem | **默认正文 / 表格 / 表单** |
| `--font-size-sm` | 0.8125rem | 次要说明 |
| `--font-size-xs` | 0.75rem | 标签、辅助、meta |
| `--theme-body-lg` | 1.125rem | 导语 / lead |

### 2.2 字重 / 字距 / 行高

| Token | 默认 |
|-------|------|
| `--font-weight-display` | 510（Linear）· 各主题可 400–600 |
| `--font-weight-heading` | 500 |
| `--font-weight-body` | 400 |
| `--letter-spacing-display` | −0.03em 量级（品牌可覆盖） |
| `--letter-spacing` | −0.011em（正文） |
| `--line-height-body` | **1.5**（正文标准行高） |

**规则**

- 后台信息密度默认以 `md/sm` 为主，不用 display 字号铺列表。
- 标题只用 weight token，禁止 `font-weight: 700` 硬刷（Apple/Linear 允许 heading 600 写在主题包内）。

### 2.3 主题字阶差异（摘要）

| 主题 | Display 特征 | Body | Tracking |
|------|--------------|------|----------|
| mercedes | 72/48px 级克制 | 16px 级 | 近 0 |
| linear | 72/64/48 · weight 510 | 14px | 负字距 |
| porsche | 120/90 电影级 | 16px | 大标题负字距 |
| lamborghini | 120/80 · 大写 | 16px | 正文略正字距 |
| ferrari | 偏小编辑风格 | 16px | ≈0 |
| apple | 56/40 · weight 600 | 16px | 微负/微正 |

---

## 3. 间距 Spacing

### 3.1 比例尺（4px 起步）

| Token | 值 | 用途 |
|-------|-----|------|
| `--spacing-xs` | 0.25rem (4px) | 图标与文字间隙 |
| `--spacing-sm` | 0.5rem (8px) | 紧凑控件内边距 |
| `--spacing-md` | 0.75rem (12px) | 默认控件/栅格间隙 |
| `--spacing-lg` | 1rem (16px) | 卡片内块间距 |
| `--spacing-xl` | 1.5rem (24px) | 区块分隔 |
| `--spacing-2xl` | 2rem (32px) | 大段落 |

### 3.2 布局级间距

| Token | 默认 | 用途 |
|-------|------|------|
| `--theme-page-pad` | 1.5rem | 页面内容区内边距 |
| `--theme-section-gap` | 1.25rem | 同页区块垂直间距 |
| `--theme-card-pad` | 1rem | 卡片内边距 |

Porsche 可将 `--theme-page-pad` 提到 2rem；Lamborghini 1.75rem。

**规则**：组件间距只用上述 token；禁止 `margin: 13px` 等游离值。

---

## 4. 圆角 Radius

语义映射（必遵守）：

| Token | 用途 |
|-------|------|
| `--border-radius-sm` | Badge、小芯片 |
| `--border-radius-md` | 按钮、输入、Tab |
| `--border-radius-lg` | **卡片**（=`--theme-card-radius`） |
| `--border-radius-xl` | 大面板/对话框外轮廓 |
| `--border-radius-full` / pill | 头像、Apple 胶囊按钮 |

### 各主题圆角规格

| 主题 | sm / md / lg / xl | 气质 |
|------|-------------------|------|
| mercedes | **0 / 0 / 0 / 0** | 精密零圆角 |
| linear | 4 / **6** / 8 / 12 | SaaS 默认 |
| porsche | 0 / 8 / 8 / pill | 舞台感 |
| lamborghini | 2 / 4 / 8 / 8 | 锋利略圆 |
| ferrari | **2 / 2 / 2 / 4** | 外科锐角 |
| apple | 8 / **11** / 14 / 18 · pill≈980 | 零售柔和 |

`--theme-btn-radius` = md；`--theme-input-radius` = md；`--theme-card-radius` = lg。

---

## 5. 卡片 Card

**结构**

- 背景：`var(--surface-1)`
- 边框：`1px solid var(--border-color)`（或 `--ds-panel-border`）
- 圆角：`var(--theme-card-radius)`
- 内边距：`var(--theme-card-pad)`
- 阴影：默认 `var(--shadow-sm)`；抬升层用 `shadow-md`

**规则**

- 页面内容区用 `.theme-kit-card` / `Card` / `.ln-page-card`，不要自造第二套卡面。
- Hero **不用卡片包裹**；卡片只承载可交互或成组信息。
- 禁止多层重阴影、彩色发光描边（Linear `--ds-glow` 仅微强调或 transparent）。

---

## 6. 按钮 Button

| 形态 | 用途 | Token / 类 |
|------|------|------------|
| solid primary | 主 CTA（内容区一页一个主操作） | `--theme-btn-solid-bg/fg/hover` · `.vp-button` / `.p-button` |
| outlined | 次要 / 取消 | `.vp-button--outlined` · `.p-button-outlined` |
| text / ghost | 铬层、表格行内操作 | `--theme-btn-ghost-hover` |

**规格**

- 高度五档：`--height-xs|sm|md|lg|xl`（极小→超大；密度主题仍覆盖 sm/md/lg）
- 形状：`rect`（默认）· `square` · `circle`（等宽高）
- 角标 `badge` / 标星 `star|rated` / 图片 `img` / 图标 `icon`
- 圆角：`--theme-btn-radius`（Apple solid 可强制胶囊；`circle` / `rounded` 用全圆）
- 字重：`--font-weight-heading`；Linear ≈500 + 负字距
- 动效：`≤ var(--transition-normal)`；hover lift · active scale；focus `--ds-focus-ring`；loading 禁用防连点

**规则**

- Chrome（侧栏/顶栏）默认 ghost/outline；实心主色留给内容区主 CTA。
- 危险操作用 `severity="danger"` + outlined/text，不铺大面积红底。
- 类名双轨：新样式优先 `vp-button*`，兼容存量 `p-button*`。

---

## 7. 页面布局 Layout

### 7.1 Chrome（倒 L）

| 尺寸 | Token / 值 |
|------|------------|
| 侧栏宽 | `--ln-sidebar-width: 244px` |
| 侧栏收起 | `--ln-sidebar-width-collapsed: 64px` |
| 顶栏高 | `--ln-header-height: 48px` |
| Tabs 高 | `--ln-tabs-height: 36px` |
| 壳高 | `.ln-shell` → `100vh`，内部滚动 |

模块边界：Chrome ≠ View chrome ≠ Content（见 `packages/theme/design/linear/rules.ts`）。

### 7.2 页面内容节奏

```
.ln-page-hero
  eyebrow → title → lead → actions
.ln-page-grid / table / forms
```

- Tabs 属壳层，不在内容区再造一套页签导航。
- 列表/表格在 viewport 内滚动，不撑破 shell。

### 7.3 栅格建议

- 业务页纵向：`gap: var(--theme-section-gap)`
- 工具条横排：`gap: var(--spacing-md)`，控件默认高 `--height-md`
- 卡片网格：`minmax(240–280px, 1fr)`，间隙 `--spacing-lg`

---

## 8. 信息密度 Density

### 8.1 控件高度（按主题）

| 主题 | sm | md（默认） | lg |
|------|-----|-----------|-----|
| linear | 28 | **32** | 36 |
| ferrari | 28 | 36 | 44 |
| apple | 32 | 36 | 44 |
| mercedes / porsche / lambo | 32 | 40 | 48 |

密度定位：

- **compact（Linear）**：后台默认，表密、行矮、字号 md=14px。
- **comfortable（Mercedes/Porsche/Lambo）**：控件 40px，适合品牌/运营面。
- **retail（Apple）**：中等高度 + 更大圆角，空间更呼吸。

### 8.2 密度规则

1. 同一视图内不要混用三档控件高；默认 md。
2. 表格行、菜单项、Tab 跟随主题密度，不额外加 padding「变松」。
3. 统计数字用 `--theme-stat-value-size`，与正文层级拉开即可，不堆第三种字号体系。
4. 侧栏导航、Tabs、顶栏保持 Chrome 规格，页面不得私自加高顶栏。

---


### 卡片内布局（重要）

`Card` 的默认插槽渲染在 `.p-card-body`，**不是** `.p-card` 直接子节点。

- 给 `<Card class="…__toolbar">` 写 `display:flex; gap` **无效** —— 必须依赖 Card 内置：`.p-card-body` 默认纵向 `gap: var(--spacing-md)`；类名含 `__toolbar` 或 `vp-toolbar` 时改为横向 wrap。
- 工具条控件间距：`--spacing-md`（12px）；块与块：`--theme-section-gap`（1.25rem）；卡片内边距：`--theme-card-pad`。
- 禁止再写 `gap: 0.15rem` / `4px` 等魔法值挤在一起。

## 9. Do / Don't

**Do**

- 只读语义变量：`--ds-*` · `--surface-*` · `--text-*` · `--theme-*` · `--spacing-*` · `--font-size-*`
- 换肤只改 `[data-design]` 主题包

**Don't**

- 在 base/business 组件写死 hex、px 圆角、字号
- 复制 Linear 紫到其他主题做「统一强调色」
- 在业务模块重造导航壳或第二套字阶

---

## 10. 变更流程

1. 改规格先更新本文件 + `specs.ts` + `_contract.scss` 默认值  
2. 同步各主题 SCSS 覆盖  
3. 更新 `.cursor/rules/20-design-system.mdc`
4. 在 play ThemePage / 业务页目检六主题
