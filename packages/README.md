# packages/

库源码主战场（无路由、无 mock 页）。统一入口：`packages/index.ts` → npm 发包 `dist/`。

## 包一览

| 包 / 目录 | 别名 | 说明 |
|-----------|------|------|
| `components/core` | `@amg-webui/core` | 真正的 UI 原语 / 布局 / 导航 / 页面态；**不知** GB28181/ONVIF |
| `components/form` | `@amg-webui/form` | 表单与录入控件 |
| `components/data` | `@amg-webui/data` | 表格 / 树 / 列表 / 分页等数据展示 |
| `components/overlay` | `@amg-webui/overlay` | Dialog / Drawer / Message 等浮层 UI（内核见 `runtime`） |
| `components/charts` | `@amg-webui/charts` | 图表（Bar/Line/Pie/…） |
| `components/editor` | `@amg-webui/editor` | CodeEditor / MdEditor / RichText |
| `components/media` | `@amg-webui/media` | 音视频 / VCR / PTZ / 电视墙（**行业 opt-in**） |
| `components/gb28181` | `@amg-webui/gb28181` | GB28181 套件（**行业 opt-in**） |
| `components/onvif` | `@amg-webui/onvif` | ONVIF 套件（**行业 opt-in**） |
| `components/business` | `@amg-webui/business` · `@amg-webui/components/business` | 五大域：`login` · `users` · `orders` · `content` · `settings` |
| `components/base` | `@amg-webui/components/base` | **已废弃**：仅再导出 `@amg-webui/core`（硬切，无胖 shim） |
| `telemetry` | `@amg-webui/telemetry` | Vp Telemetry 交互观测内核（**默认关闭**） |
| `security` | `@amg-webui/security` | 安全防护层：消毒 / 协议拦截 / 表单过滤 |
| `lowcode` | `@amg-webui/lowcode` | Schema 引擎 + `ui/`（SchemaRenderer / Canvas*） |
| `runtime` | `@amg-webui/runtime` | UI Overlay 统一内核（栈 / Focus / ScrollLock / Escape） |
| `skill` | `@amg-webui/skill` · `@amg-webui/skill/core` | Skill Runtime（**experimental**；独立可选） |
| `theme` | `@amg-webui/theme` | 六套 designmd 主题 · Token · Theme Studio |
| `locale` | `@amg-webui/locale` | 8 语种 · `LocaleKeys` · `LocaleService` |
| `hooks` | `@amg-webui/hooks` | `useTheme` / `useLocale` / `useTrackedEmit` … |
| `icons` | `@amg-webui/icons` | Lucide / SVG 目录 |
| `animations` | `@amg-webui/animations` | 过渡 · motion · neon · shimmer |
| `utils` · `types` · `constants` | `@amg-webui/utils` 等 | 工具、公共类型、常量 |

根再导出：foundation（`core` + `form` + `data` + `overlay`）+ business + hooks/theme/…。**不**从根泄漏 `gb28181` / `onvif` / `media` / `charts` / `editor`。**Skill Runtime** 只允许从 `amg-webui/skill` 或 `/skill/core` 显式导入。

## 分层硬规则

- **core / form / data / overlay 绝不能 import 行业包**（`gb28181` / `onvif` / `media`）；门禁：`npm run check:boundaries`
- **行业包可依赖 foundation**；基础组件库不知道 GB28181 是什么
- **business → 只吃 foundation / hooks / theme / utils / locale / telemetry（旁路）**
- 类名前缀 **`vp-`**；样式只消费语义 Token（`--ds-*` · `--theme-*` · spacing / type / radius）
- 用户可见文案只走 i18n key（8 语种齐套）
- 列表类组件：**虚拟滚动默认开启**
- Skill 不进入组件源码、不渲染 UI；组件不得硬编码依赖 Skill Runtime
- 组件归属 SSOT：`scripts/component-package-map.mjs`

## Skill Runtime 状态

- 目录：`packages/skill/`；完整契约见 [`skill/README.md`](./skill/README.md)。
- `amg-webui/skill` 提供 Core + Vue 集成；`amg-webui/skill/core` 提供框架无关能力。
- SR1 / SR2 experimental 最小基线已实现并通过当前类型检查、单元测试、构建和发包结构基础门禁；稳定化 DoD 仍以 `docs/SKILL_RUNTIME.md` 为准。
- SR3 官方 built-ins（`table-search`、`dict-mapping`、`form-submit`、`table-export`、`request-wrapper`）与 example 调试页尚未实现，不属于当前可用 API。
- 状态为 **experimental**，不纳入 0.1 稳定承诺；根入口保持零导出、零隐式初始化。

## 通用分类（catalog `general`）

Avatar · AvatarGroup · Badge · Button · ButtonGroup · Card · **CardWidgets** · Collapse · **CopyText** · Divider · Ellipsis · Empty · FloatButton · Highlight · Icon · Link · Progress · Skeleton · Space · **Spin** · Statistic · Tag · Typography

交互件旁路接入 `trackEmit`（见 [`docs/TELEMETRY.md`](../docs/TELEMETRY.md)）；纯展示件（Divider / Space / Skeleton / Spin / …）不伪造交互事件。

## 新增组件

```bash
npm run create:component -- core Foo
npm run create:component -- form MyField
npm run create:component -- gb28181 GbsFoo   # 行业扩展
npm run generate:entry
npm run check:boundaries
npm run extract:i18n
npm run validate:catalog   # 若登记了 catalog
```

组件对外文档：[`docs/components/`](../docs/components/)（薄 API stub）· example curated demos（深度演示，不上线）。  
工程脚本清单与「一次性脚本勿入库」约定：[`docs/ENGINEERING.md`](../docs/ENGINEERING.md)。
