# AMG-WebUI 0.1.0 试用发包说明

> SemVer：**0.1.0**（试用 / pre-1.0）· 正式 1.0 仍须完成工程门禁、对外文档、合规上架（见 `docs/LIBRARY_PLAN.md` P4–P5）。

## 承诺边界（合同）

| 项 | 说明 |
|----|------|
| **承诺组件** | Gallery「v0.1」子集（契约 0.1.3：Core∪B1–B4，去重 140），名单：`example/v0.1-subset.ts` · 说明：`docs/V0_1_SUBSET.md` |
| **API** | **可变**；破坏性变更会记入 CHANGELOG，不保证到 1.0 前零破坏 |
| **非承诺** | 子集外组件（行业套件 / 全量图表 / 编辑器深度等）视为 **experimental**，可存在于包内但不作 SLA |
| **example** | 仅本地调试，**禁止**当官网或线上 demo |

## 安装

```bash
npm install amg-webui@0.1.0
# peers
npm install vue@^3.4.0 @lucide/vue@^1.0.0
```

## 使用

```ts
import 'amg-webui/style.css'
// 或 import 'amg-webui/dist/style.css'
import { Button, ThemeService } from 'amg-webui'
```

子路径：

| 路径 | 用途 |
|------|------|
| `amg-webui` | 主入口（`dist` ESM/UMD + types） |
| `amg-webui/style.css` | 全量样式 |
| `amg-webui/button` · `amg-webui/data-table` · … | 按需组件（kebab，指向 `dist/es/...` 编译产物） |
| `amg-webui/theme` · `theme/core` · `theme/style.css` | 主题运行时（`dist/theme/`） |
| `amg-webui/security` · `telemetry` · `lowcode` · `icons` | 子系统（均指向 **编译后的** `dist/<pkg>/`） |
| `amg-webui/hooks` · `utils` · `locale` · … | 运行时深路径（显式 exports，如 `amg-webui/utils/env`） |
| `amg-webui/skill` · `skill/core` | Skill Runtime（experimental，不纳入 0.1 稳定承诺） |
| `amg-webui/biz-login` · … | 业务域按需入口 |
| `amg-webui/components/base` · `components/business` | 域 barrel（编译后的 re-export，非源码） |

> **合同硬约束**：公共子路径禁止指向 `packages/**/*.ts` / `.vue`。消费者不应需要解析仓库 alias、编译 SFC 或处理内部 SCSS 才能导入库。

## 本地打库

```bash
npm run build:lib      # → 主库 + runtime 分包 + on-demand + skill + theme + generate:exports
npm run build:runtime  # → 仅 dist/{security,telemetry,lowcode,runtime,hooks,utils,…}
npm run build:ondemand # → dist/es/** + exports 刷新
npm run build:skill    # → 仅 dist/skill/
npm run test:consumers # → npm pack 后在 vite / webpack / nuxt fixture 中安装并构建
```

## 验收（Release 0.1 分步）

### Step 1+2 — 发包元数据

- [x] `package.json` version = `0.1.0`
- [x] `peerDependencies`: `vue` · `@lucide/vue`
- [x] `exports` / `files` / `license` / `engines`
- [x] README 声明试用合同
- [x] `npm run build:lib` → `dist/amg-webui.js` · `.umd.cjs` · `style.css` · `index.d.ts`
- [x] Skill Runtime 独立 `dist/skill/index.*` · `core.*` · `.d.ts`；根入口不导出 Skill
- [x] Theme / Skill / security / telemetry / lowcode / icons / hooks / utils / locale 子路径指向 **dist 编译产物**（不再导出源码）
- [x] Consumer fixtures：`tests/consumer-vite` · `consumer-webpack` · `consumer-nuxt`（`npm run test:consumers`）

### Step 3 — 子集 & Gallery 对齐

- [ ] v0.1 子集路由 / catalog / maturity 与 `example/v0.1-subset.ts` 一致
- [ ] Gallery 仅对子集显示「承诺」标记

### Step 4 — 构建 & 按需

- [ ] `build:lib` 产物体积基线记录
- [x] 按需入口 `amg-webui/<kebab>` + 深路径 `amg-webui/utils/*` 经 consumer fixture 冒烟
- [ ] 按需 chunk CSS 独立入口稳定化（当前可先用根 `style.css`）

### Step 5 — SSR 基础（本步）

- [x] `packages/utils/env.ts` — `isClient` · `isServer` · `getDocument` · `getWindow`
- [x] `packages/utils/dom.ts` — env 守卫，无 bare `window`/`document` 抛错
- [x]  overlay 最小守卫：Select · Dialog · Dropdown · MessageBox · Affix · Tour · ImageViewer · InfiniteScroll
- [x] `tests/unit/ssr-env.spec.ts` · `tests/unit/ssr-import.spec.ts`
- [x] `npm run test:ssr`
- [x] Nuxt consumer fixture（`tests/consumer-nuxt`，构建冒烟；≠ 生产 SSR 全矩阵）

### Step 6 — 合规 & 1.0 预备

- [ ] `docs/MIGRATION.md` 定稿（当前为 skeleton）
- [ ] API freeze · codemod · 对外文档站补齐
- [ ] 见 `docs/MIGRATION.md` Final checklist

## 尚未完全解决（诚实边界）

- Overlay / Focus / Teleport / ScrollLock **统一内核已交付**（`amg-webui/runtime` + `useOverlay`；见 `docs/OVERLAY.md`）
- 按需组件 CSS 可能仍依赖根 `style.css`（非整文件稳定 side-entry）
- Consumer fixtures 是 **安装+构建冒烟**，不是视觉 / a11y / SSR hydration 全覆盖
- 行业组件仍在 `base`；成熟度 JSON 仅开发盘点启发式（**≠** 质量证书）
- E2E：多浏览器 smoke + Chromium Dialog trap/axe/RTL 附件已进 CI；**仍非**全组件键盘矩阵 / 像素基线 / 性能基准
- 本轮只推进「包发布契约」主路径：**源码导出 → dist 导出 + consumer 验证**；不宣称 1.0 / 超越 Element Plus