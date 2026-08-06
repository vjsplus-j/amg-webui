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
| `amg-webui/theme` | 主题服务（源码导出，需 Vite/TS 路径解析） |
| `amg-webui/telemetry` | 遥测（默认关闭） |
| `amg-webui/skill` | Skill Runtime Core + Vue 集成（experimental，不纳入 0.1 稳定承诺） |
| `amg-webui/skill/core` | 框架无关 Skill Core / Pipeline（experimental） |
| `amg-webui/icons` | 图标 catalog / resolver |
| `amg-webui/components/base` | 按需深路径（源码，利于 tree-shake） |

## 本地打库

```bash
npm run build:lib   # → 主库产物 + dist/skill/ 独立 ESM/CJS/types
npm run build:skill # → 仅 dist/skill/
```

## 验收（Release 0.1 分步）

### Step 1+2 — 发包元数据

- [x] `package.json` version = `0.1.0`
- [x] `peerDependencies`: `vue` · `@lucide/vue`
- [x] `exports` / `files` / `license` / `engines`
- [x] README 声明试用合同
- [x] `npm run build:lib` → `dist/amg-webui.js` · `.umd.cjs` · `style.css` · `index.d.ts`
- [x] Skill Runtime 独立 `dist/skill/index.*` · `core.*` · `.d.ts`；根入口不导出 Skill

### Step 3 — 子集 & Gallery 对齐

- [ ] v0.1 子集路由 / catalog / maturity 与 `example/v0.1-subset.ts` 一致
- [ ] Gallery 仅对子集显示「承诺」标记

### Step 4 — 构建 & 按需

- [ ] `build:lib` 产物体积基线记录
- [ ] 深路径 `@amg-webui/components/base/*` tree-shake 冒烟

### Step 5 — SSR 基础（本步）

- [x] `packages/utils/env.ts` — `isClient` · `isServer` · `getDocument` · `getWindow`
- [x] `packages/utils/dom.ts` — env 守卫，无 bare `window`/`document` 抛错
- [x]  overlay 最小守卫：Select · Dialog · Dropdown · MessageBox · Affix · Tour · ImageViewer · InfiniteScroll
- [x] `tests/unit/ssr-env.spec.ts` · `tests/unit/ssr-import.spec.ts`
- [x] `npm run test:ssr`
- [ ] Nuxt 示例应用（留 Step 6）

### Step 6 — 合规 & 1.0 预备

- [ ] `docs/MIGRATION.md` 定稿（当前为 skeleton）
- [ ] API freeze · codemod · 对外文档站补齐
- [ ] 见 `docs/MIGRATION.md` Final checklist
