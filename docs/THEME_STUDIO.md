# 自定义主题生成工具 Theme Studio（锁定）

> 参照能力范式：[designmd Build / Custom Remix](https://designmd.santiagoalonso.com/build?cat=Dev+Tools%2CSaaS&sort=popular)  
> 实现落点：`example/pages/system/ThemeStudioPage.vue`（规划）· `packages/theme/studio/`（规划）  
> Agent 记忆：`.cursor/rules/vue3-amg-webui-theme-studio.mdc`

---

## 1. 目标

提供 **可视化定制** 的主题生成器：从官方锁定主题 / Token 组装出发，让团队像 Remix 一样组合视觉语言，实时预览并导出可落地的主题包，**差异化传统后台「灰底表格」观感**，提升现代质感（产品级表面、清晰层次、精致排版与动效克制）。

官方六套 designmd 主题仍为**只读基线**；Studio 产出为用户自定义主题（`custom-*` 或导出文件），不得覆盖锁定清单中的 mercedes / linear / porsche / lamborghini / ferrari / apple 源码语义。

---

## 2. 参照能力（parity 清单）

对齐 designmd Build 展台可感知模块（不必像素克隆，需功能等价）：

| 模块 | 说明 |
|------|------|
| Color Palette | 背景 / 表面 / 主色 / 强调色 / 边框 / 状态色等 Token，实时改色 |
| Buttons | primary / secondary / tab-pill 形态预览 |
| Typography | 展示 / 标题 / 正文阶梯与字重字距 |
| Icons | Lucide（或主题 meta 指定）品牌匹配预览 |
| Form | focus ring · 输入态 |
| Card · Shapes | none / near / pill 等圆角语义 |
| Elevation | ring / card / elevated |
| Controls | Switch / Checkbox / Radio |
| Alerts · Badges · Tabs · Stats | 反馈与导航微元件 |
| Table · Avatars · Slider | 数据与控件 |
| Tooltip · Nav · Banner · Pricing · Stepper · Breadcrumb · Menu · Toast | 壳层与营销片段可选 |
| Code 导出 | `theme.ts` / CSS 变量 / SCSS 片段 |
| 亮暗切换 | scheme dark/light |

参考实现思路：左侧（或顶部）调 Token → 右侧活预览同一套组件树 → 一键导出 / 应用。

---

## 3. 产物与集成

```
导出目标（任选组合）：
├── CSS 变量块 → 写入 html[data-design="custom"] 或 用户覆写文件
├── theme.ts / tokens JSON → 业务项目直接 import
├── SCSS partial → packages/theme/styles/design/_custom.scss（可选生成位）
└── example 即时应用 → ThemeService.applyCustom(tokens)（不刷新）
```

- 运行时：**仅 CSS 变量覆盖**，禁止重挂整棵组件树。  
- 持久化：`localStorage` + 可选下载文件。  
- 前缀：导出 CSS 类名与组件前缀统一 **`vp-`**。  

---

## 4. 视觉方向（现代质感 · 反传统后台）

| 要 | 不要 |
|----|------|
| 清晰表面层次（bg / surface / elevated） | 一片死灰 + 重边框堆砌 |
| 产品级主色与克制强调 | 默认紫渐变堆叠或乱霓虹 |
| 字阶与字距有目的（display ≠ 表格字号） | 全站 14px 一刀切无层级 |
| 轻阴影 / hairline 边框 / 适度圆角（按主题） | 厚重拟物与多卡大阴影 |
| 壳层与内容分工（Inverted-L） | 把仪表盘卡片塞满首屏英雄区 |
| Token 驱动一切色值尺寸 | 组件内硬编码 hex / px |

详规仍以 `packages/theme/SPEC.md` · `TOKENS.md` 为准；Studio 只暴露允许调的 Token 轴。

---

## 5. 工程位置（规划）

```
packages/theme/studio/              # Token 编辑模型、预设、导出器
example/pages/theme/ThemeCustomPage.vue # 自定义主题 / Studio 入口（name: theme-custom）
scripts/export-theme.mjs            # CLI：JSON → scss/css（可选）
```

路由归入 `example/router/routes.ts`，`group: 'theme'`（见七大调试专区 · APP_WORKFLOW.md）。

---

## 6. Do / Don't

**Do**

- 先改 Token，再映到预览组件；导出与运行时走同一变量契约  
- 保留六套官方主题只读，自定义另存  
- 预览使用真实 base 组件（Button / Card / Table…），避免假图  

**Don't**

- 把 Studio 做成与库脱节的静态 HTML mock  
- 用替换全局 class 重建整页来「换肤」  
- 导出未带 `vp-` / 未映射语义 Token 的裸色值散落组件  

---

## 7. 变更流程

1. 更新 Token 契约（`TOKENS.md` / `_contract.scss`）  
2. Studio 模型增加对应字段  
3. 预览区加样例  
4. 导出模板同步  
5. 更新本文与 `vue3-amg-webui-theme-studio.mdc`  
