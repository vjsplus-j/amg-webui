# 全局视觉规范 · 设计 Token · 设计变量（锁定）

> 配套：`packages/theme/SPEC.md`（布局/密度）· `packages/theme/specs.ts`（可导入）· `_contract.scss` / `tokens.scss`  
> Agent 记忆：`.cursor/rules/vue3-amg-webui-tokens.mdc`

---

## 1. 三层模型（强制）

```
Primitive（原色/原始尺）  →  Semantic（用途别名）  →  Component（组件契约）
     --primary-500              --ds-accent              .p-button / --theme-btn-*
     --surface-0                --ds-bg
     --spacing-md               --theme-section-gap
```

| 层 | 谁写 | 谁读 |
|----|------|------|
| Primitive | `tokens.scss` + 各 `[data-design]` | 仅主题包 |
| Semantic | `_contract` bridge / 主题 | **base / business / example** |
| Component | `theme-components.scss` · 组件 SCSS | 组件实现 |

**禁止**：在业务、基础组件或 **example 调试页**写死 `#5e6ad2`、`14px`、`8px` 圆角等魔法数；一并禁止硬编码用户可见文案（见 `I18N.md` · `vue3-amg-webui-no-hardcode.mdc`）。

---

## 2. 设计 Token 清单

### 2.1 颜色 Color

**色板原色（主题覆盖）**

| 族 | Token | 用途 |
|----|-------|------|
| Primary | `--primary-300`…`--primary-600` | 品牌强调；默认 CTA |
| Semantic status | `--success-500` · `--warning-500` · `--danger-500` · `--info-500` | 状态色 |
| Surface | `--surface-0`…`--surface-5` | 画布 → 抬升层 |
| Text | `--text-primary` · `--text-secondary` · `--text-muted` · `--text-on-primary` | 正文层级 |
| Border | `--border-color` · `--border-color-hover` | 描边 |

**语义变量（组件优先）**

| Token | 映射 |
|-------|------|
| `--ds-bg` | 页面画布 |
| `--ds-surface` / `--ds-surface-raised` | 面板 / 抬升 |
| `--ds-text` / `--ds-text-muted` | 主/次文字 |
| `--ds-border` / `--ds-panel-border` | 边框 |
| `--ds-accent` / `--ds-accent-hover` / `--ds-accent-muted` | 强调 |
| `--ds-focus-ring` | 焦点环 |
| `--ds-glow` | 辉光（默认 transparent） |

主题告警底：`--theme-alert-info-bg` 等（见各主题 SCSS）。

### 2.2 字号 · 行高 Typography

| Token | 默认角色 |
|-------|----------|
| `--font-size-display-xl` / `display-lg` / `display` | 品牌 Display |
| `--font-size-2xl` / `xl` / `lg` | 标题阶梯 |
| `--font-size-md` | **默认正文**（主题 contract，Linear≈0.875rem） |
| `--font-size-sm` / `xs` | 辅助 / 标签 |
| `--theme-body-lg` | 导语 |
| `--font-weight-display` / `heading` / `body` | 字重 |
| `--letter-spacing` / `--letter-spacing-display` | 字距 |
| `--line-height-body` | **正文行高 1.5** |

字体族：`--font-family-sans` · `--font-family-display` · `--font-family-mono`（`[data-font]`）。

### 2.3 间距 Spacing

| Token | 基准（合同默认） |
|-------|------------------|
| `--spacing-xs` | 4px |
| `--spacing-sm` | 8px |
| `--spacing-md` | 12px |
| `--spacing-lg` | 16px |
| `--spacing-xl` | 24px |
| `--spacing-2xl` | 32px |
| `--theme-page-pad` | 页面内边距 |
| `--theme-section-gap` | 区块垂直间距 |
| `--theme-card-pad` | 卡片内边距 |

### 2.4 圆角 Radius

| Token | 用途 |
|-------|------|
| `--border-radius-sm` | Badge |
| `--border-radius-md` | 按钮 / 输入 / Tab（=`--theme-btn-radius`） |
| `--border-radius-lg` | 卡片（=`--theme-card-radius`） |
| `--border-radius-xl` | 大面板 |
| `--border-radius-full` | 胶囊 / 头像 |
| `--theme-avatar-radius` | 方形头像圆角契约 |
| `--theme-avatar-group-overlap` | 头像组堆叠负边距（默认 `spacing-sm`） |
| `--theme-avatar-group-overlap-sm` | 小屏头像组堆叠负边距（默认 `spacing-xs`） |
| `--theme-skeleton-bg` / `--theme-skeleton-shine` | 骨架底色 / 微光色（默认 `surface-2` / `surface-3`） |
| `--theme-skeleton-radius` / `--theme-skeleton-gap` / `--theme-skeleton-duration` | 骨架圆角、行距、动画时长 |

各主题覆盖表见 `SPEC.md` §4。

### 2.5 阴影 Shadow

| Token | 用途 |
|-------|------|
| `--shadow-sm` | 卡片默认、轻浮层 |
| `--shadow-md` | 下拉 / 菜单 / 抬升卡 |
| `--shadow-lg` | 对话框 / 大型浮层 |
| `--shadow-xl` | 稀用 · 营销层 |

主题可覆写为 `none`（如 Porsche 极简）。**禁止**多层彩色 drop-shadow 堆叠；`--ds-glow` 仅作微强调或透明。

### 2.6 边框 Border

| Token | 用途 |
|-------|------|
| `--border-color` | 默认 1px 边 |
| `--border-color-hover` | hover 态 |
| `--ds-border` / `--ds-panel-border` | 语义边框 |
| `--ds-focus-ring` | focus outline 色 |

线宽约定：**默认 1px**；强调分割可用 `border-strong` 主题色（Mercedes `--mb-border-strong`）。组件写：

```css
border: 1px solid var(--ds-border);
```

---

## 3. 设计变量（Design Variables）

### 3.1 定义位置

| 变量类型 | 文件 |
|----------|------|
| 全局 fallback | `packages/theme/styles/tokens.scss`（`:root`） |
| 主题覆盖 | `packages/theme/styles/design/<brand>.scss`（`[data-design]`） |
| 跨主题组件契约 | `theme-components.scss`（`--theme-*`） |
| 壳尺寸 | `styles/chrome/shell.scss`（`--ln-*`） |
| 字体栈 | `styles/fonts.scss`（`[data-font]`） |
| 图标描边 | `[data-icon-style]` → `--icon-stroke-width` |

### 3.2 命名约定

```
--{category}-{role}[-{modifier}]

--primary-500
--text-secondary
--spacing-md
--theme-btn-solid-bg
--ds-accent
--ln-sidebar-width
```

- `theme-*`：主题包写入的**组件契约**（按钮实心色、Tab 激活态…）  
- `ds-*`：跨组件**语义 UI**  
- `ln-*`：Chrome 壳专用  
- 禁止 `--blue` / `--myColor` 等未分类名  

### 3.3 运行时写入

| Attribute / Service | 变量影响 |
|---------------------|----------|
| `html[data-design]` | 全套色板 / 圆角 / 字阶 / 控件高 |
| `html[data-scheme]` | Linear / Apple 亮暗 |
| `html[data-font]` | 字族 |
| `html[data-icon-style]` | 图标描边 |
| `html[data-locale]` | 文案语言（见 i18n 规范） |

切换：`ThemeService` · `FontService` · `IconStyleService` · `LocaleService`。

### 3.4 TS 常量镜像

```ts
import { SPACING, RADIUS, SHADOW, BORDER, COLOR_SEMANTIC } from '@amg-webui/theme'
```

仅引用 `var(--…)` 字符串，**不复制 hex**。

---

## 4. 校验清单

- [ ] 新组件样式只用 semantic / theme-* token  
- [ ] 新主题实现完整 `_contract` mixin + bridge-ds  
- [ ] 阴影不超过 sm/md/lg 三档常用  
- [ ] 边框统一 1px + `--ds-border`  
- [ ] 改 token 同步 `TOKENS.md` + `specs.ts` + Cursor rule  

---

## 5. 相关文档

- 布局 / 密度 / 按钮卡片：`SPEC.md`  
- 多语言文案：`packages/locale/I18N.md`  
- 应用路由：`docs/APP_WORKFLOW.md`
