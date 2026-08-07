# Component Hardening Program

> SSOT：仓库根目录 `component-hardening/`（见 [engineering 入口](/engineering/component-hardening/)）  
> 本文件为仓库内**唯一权威**治理说明。旧版根目录 V1/V2/V3 草稿与任务 CSV 已归档删除，勿再引用。

## Goal

把映射库存（约 **287** 个 Public 组件）从「目录存在 / Demo 可开 / score 高」推进到：

**API Contract + Hard Gates + Automated Evidence → Stable**

- 不为凑 300 新建低价值组件（见 `component-hardening/inventory/gap-report.json`）。
- `depthScore` / maturity v2 **永不**直接决定 Stable。

### 三条主线（对齐原 V3 口径）

| Track | 内容 |
|-------|------|
| **A · API Contract** | Props / Emits / Slots / Expose / Model / Instance / Service / Context / Behavior |
| **B · Hardening** | Keyboard · A11Y · Theme/RTL · SSR · Cleanup · Visual · Package · Perf（按需） |
| **C · Documentation** | 组件页结构、Demo 与源码同源、API 表防漂移 → [`EXAMPLE_DOCUMENTATION.md`](./EXAMPLE_DOCUMENTATION.md) |

代码稳定但文档契约不完整，不允许宣称「对外 Stable 文档完成」。

## Pipeline

```text
hardening:generate → audit:api → verify:component → promote → dashboard
                 ↘ hardening:evidence（Family axe/键盘/视觉）
```

| npm script | Purpose |
|---|---|
| `hardening:generate` | Inventory / family map / batches / maturity v4 / contracts / gate profiles |
| `audit:api` | Props/Emits/Slots/Expose/Model 扫描 |
| `verify:component` | 单组件 Gate（`Name` / `--all` / `--batch B01`） |
| `verify:family` | Family Engine + 组件聚合 |
| `hardening:changed` | PR 变更组件检测 |
| `hardening:ssr` / `hardening:visual` | SSR / Visual 矩阵报告 |
| `hardening:promote` | PASS → API Freeze + Stable |
| `hardening:dashboard` | Dashboard + stable 清单 |
| `hardening:evidence` | Unit + Playwright Family 证据 → 合并报告 |
| `hardening:all` | 全量本地流水线 |

产物目录：

```text
component-hardening/
├── inventory/   # component-inventory · family-map · batches · maturity-v4 · gap
├── contracts/   # 每组件 JSON + schema + family-api-profiles
├── gates/       # profiles · results
├── dashboard/   # component-dashboard.json / .md
└── reports/     # api-audit · family-evidence · ssr · visual · stable · program-close
```

## Shared Engines

`packages/utils/engines`（亦可 `@amg-webui/utils` 再导出）：

FormControl · Selection · KeyboardNav · Floating · DateTime · Tree · Virtualizer · TableColumn · Upload · FeedbackQueue · Navigation · MediaAdapter

## Family evidence（已加深）

example：`/lab/hardening`（`lab-hardening`）。

当前已采证 Family（Unit + E2E）：**foundation · input · form · selection · datetime · table · overlay**。  
报告：`component-hardening/reports/family-evidence.md`。

模板五件（Button / Select / DatePicker / Dialog / DataTable）已各自具备 evidence 包并通过 `verify:component` strict → promote Stable。

## Stable rule

1. `verify:component <Name>` **strict** mandatory gates **PASS**（含 evidence 包，禁止结构占位假 PASS）
2. `component-hardening/evidence/<Name>/*.json` 中 mandatory 门禁均为 `PASS` 或 `N/A`
3. Contract `maturity === 'stable'` 且 `apiFreeze.frozen === true`（仅 `hardening:promote`）
4. （对外文档）Track C 页面契约完整 —— 见 Example Documentation

**禁止**：用 `hardening:promote --all-passing --ratio-target 90` 批量刷 Stable。  
当前诚实基线见 `component-hardening/program-status.json` 与 dashboard `stableRatio`。

## 与旧「组件深化波次」关系

[`COMPONENT_DEEPEN_PLAN.md`](./COMPONENT_DEEPEN_PLAN.md) 为早期波次清单，**执行主线已切换为本治理程序**；请以本页 + `component-hardening/` 为准。
