# AMG-WebUI / Vue3-AMG-WebUI

**Enterprise Vue Web Application UI Platform** — Vue 3 企业 Web 应用 UI 基础设施；packages 单体架构；官方主题含 **designmd 六套 + WeChat / Alipay**；**foundation / industry / business** 包边界隔离；统一 **Overlay Runtime**；可选 **Vp Telemetry**；实验性、独立可选的 **Skill Runtime**；进行中的 **300 组件治理（Hardening）** 与 **Lowcode Studio**。  
愿景：[`docs/VISION.md`](./docs/VISION.md) · 深度超车：[`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md)

## 当前版本：0.1.0（试用 · 未到 1.0）

| 项 | 说明 |
|----|------|
| npm SemVer | **`0.1.0`** — **不是**正式 1.0 |
| 库存 | 映射约 **287** 个 UI 组件目录（不以凑满 300 为目标） |
| 承诺范围 | **v0.1 精选子集** · [`docs/V0_1_SUBSET.md`](./docs/V0_1_SUBSET.md) |
| API | **可变**；破坏性变更记 [`CHANGELOG.md`](./CHANGELOG.md) |
| Stable | 仅 Hardening 门禁 **`verifiedStable`**（Dashboard SSOT：`component-hardening/dashboard/component-dashboard.json`）；score / 目录数 **不**等于 Stable · [`docs/COMPONENT_HARDENING.md`](./docs/COMPONENT_HARDENING.md) |
| 发包说明 | [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md) |

```bash
npm install amg-webui@0.1.0
npm install vue@^3.4.0 @lucide/vue@^1.0.0   # peers
```

全量样式：

```ts
import 'amg-webui/style.css'
import { Button, ThemeService } from 'amg-webui'
```

按需组件 + 独立 CSS（不必拉根 `style.css`）：

```ts
import 'amg-webui/button/style.css'
import Button from 'amg-webui/button'
```

本地打库：`npm run build:lib` → `dist/`（主库 · runtime 分包 · on-demand · skill · theme · `generate:exports`）。

### Skill Runtime（experimental）

- `amg-webui/skill`：Core + Vue 集成（插件、`AmgSkillScope`、`v-skill`）。
- `amg-webui/skill/core`：框架无关 Core 与 Pipeline JSON v1。
- 根入口 `amg-webui` **不导出** Skill Runtime。
- SR1 / SR2 experimental 基线已落地；**SR3** 官方内置 Skill 与 example 调试页 **尚未实现**。

权威规范：[`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) · [`packages/skill/README.md`](./packages/skill/README.md)。

## 根目录

```
VUE3-AMG-WEBUI/
├── build/                      # 库打包脚本
├── docs/                       # 对外官方文档（VitePress，可部署）
├── packages/                   # 组件库源码（无路由）
│   ├── components/core|form|data|overlay/   # foundation
│   ├── components/charts|editor|media|gb28181|onvif/
│   ├── components/business/    # 五大业务域
│   ├── lowcode/                # Schema + Studio + ui/
│   ├── runtime/ · telemetry/ · skill/ · security/
│   ├── theme/ · hooks/ · locale/ · icons/ · utils/ · types/
├── component-hardening/        # 300 组件治理 SSOT（inventory / contracts / gates）
├── example/                    # 开发调试工具（仅本地，不上线）
├── scripts/                    # 工程脚本（含 scripts/hardening/）
├── dist/ · example-dist/       # 构建产物（不入库）
└── …
```

根目录只保留产品入口：`README` · `AGENTS` · `CHANGELOG` · `LICENSE`。  
专项计划与契约以 **`docs/`** + **`component-hardening/`** 为准（勿再堆根级草稿 md）。

> **example ≠ docs**：example 给库作者排障；docs 给业务方查阅。见 [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md)。  
> example 倒 L 壳：侧栏筛选**无分区标题**；顶栏 actions 溢出时隐藏原生滚动条轨道。详见 [`example/README.md`](./example/README.md)。

## 启动

```bash
npm install
npm run dev                 # example · 本地调试（不上线）
npm run docs:dev            # 官方文档本地编写
npm run build:lib           # 库发包产物 → dist/
npm run check:dist          # 发包产物契约
npm run check:boundaries    # foundation↛industry + 包 DAG
npm run hardening:all       # 组件治理流水线（inventory → verify → dashboard）
npm run hardening:evidence  # Family axe / 键盘 / 视觉证据（需 Playwright Chromium）
npm run build:example       # 本地冒烟 → example-dist/（禁止部署线上）
```

深链示例：`/base/button` · `/lab/hardening` · `/lab/lowcode-studio` · `/lab/telemetry` · `/biz/users` · `/?design=wechat` · `/?design=alipay` · `/?design=porsche` · `?lang=ja-JP` · `?dir=rtl`

## 使用库（0.1）

详见 [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md)。摘要：

```ts
import 'amg-webui/style.css'
import { Button, BizUsers, ThemeService } from 'amg-webui'
import { TelemetryService, consoleSink } from 'amg-webui/telemetry'
import { createOverlayRuntime } from 'amg-webui/runtime'

TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  sinks: [consoleSink()]
})

const overlayRt = createOverlayRuntime({ zIndexBase: 3000, namespace: 'mfe-a' })
```

| 路径 | 说明 |
|------|------|
| `.` · `./style.css` | 全量入口 / 全量样式 |
| `./button` · `./button/style.css` · … | 按需组件 JS + 侧载 CSS |
| `./core` · `./form` · `./data` · `./overlay` | foundation 包 barrel |
| `./media` · `./gb28181` · `./onvif` | 行业包（opt-in） |
| `./runtime` · `./telemetry` · `./security` · `./lowcode` · `./theme` · `./icons` | 平台能力 |
| `./hooks` · `./utils` · … | 白名单深路径 |
| `./components/base` | legacy → **仅再导出 core** |
| `./skill` · `./skill/core` | Skill Runtime（experimental） |

## 近期能力（摘要）

| 能力 | 说明 | 文档 |
|------|------|------|
| **Component Hardening** | Inventory / Family / Contract / `verify:*` / Family 证据 / Dashboard | [`docs/COMPONENT_HARDENING.md`](./docs/COMPONENT_HARDENING.md) |
| **Shared Engines** | FormControl · Selection · Keyboard · Floating · DateTime · Tree · Virtual · Table · Upload · Feedback · Nav · MediaAdapter | `packages/utils/engines` |
| **Lowcode Studio 0.1** | Schema 文档模型 + Studio 壳（example `lab-lowcode-studio`） | [`docs/LOWCODE.md`](./docs/LOWCODE.md) |
| **Overlay Runtime** | Escape / FocusTrap / ScrollLock；多 Runtime / MFE | [`docs/OVERLAY.md`](./docs/OVERLAY.md) |
| **按需 CSS** | `amg-webui/<kebab>/style.css`；`check:dist` + consumers | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) |
| **包边界 / DAG** | foundation↛industry；`check:boundaries` | [`packages/README.md`](./packages/README.md) |
| **Vp Telemetry** | 默认关闭；`trackEmit` 旁路 | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) |
| **Skill Runtime（experimental）** | 独立子路径；SR3 未实现 | [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) |
| **强类型 i18n** | 十语种（`zh-HK` / `hi-IN` / `ug-CN` 等）+ **独立** LTR/RTL 方向 | [`packages/locale/I18N.md`](./packages/locale/I18N.md) |

## 规范文档

| 主题 | 文档 |
|------|------|
| 愿景 / 超车 EP | [`docs/VISION.md`](./docs/VISION.md) · [`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md) |
| 总计划 | [`docs/LIBRARY_PLAN.md`](./docs/LIBRARY_PLAN.md) · [`docs/plan.md`](./docs/plan.md) |
| **300 组件治理** | [`docs/COMPONENT_HARDENING.md`](./docs/COMPONENT_HARDENING.md) · [`component-hardening/`](./component-hardening/) |
| **example 文档化方向** | [`docs/EXAMPLE_DOCUMENTATION.md`](./docs/EXAMPLE_DOCUMENTATION.md) |
| Overlay / Telemetry / Skill / Security / Lowcode | `docs/OVERLAY` · `TELEMETRY` · `SKILL_RUNTIME` · `SECURITY` · `LOWCODE` |
| Theme Studio · 工程 · 发包 | `docs/THEME_STUDIO` · `ENGINEERING` · `RELEASE_0.1` |
| Token · SPEC · i18n · 工作流 | `packages/theme/*` · `packages/locale/I18N.md` · `docs/APP_WORKFLOW.md` |
| 完成定义 DoD | [`docs/engineering/definition-of-done.md`](./docs/engineering/definition-of-done.md) |
| Agent 总入口 · Cursor rules | [`AGENTS.md`](./AGENTS.md) · [`.cursor/rules/`](./.cursor/rules/)（编号 `00`–`42`） |
