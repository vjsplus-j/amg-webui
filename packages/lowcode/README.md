# Low-code Schema 引擎 · Studio 0.1

画布 Schema 注册表 · 校验 / 迁移 · Schema → Vue 代码生成 · **Studio 设计器（重建中）**。

完整契约见 [`docs/LOWCODE.md`](../../docs/LOWCODE.md)。组件冻结清单见 [`INVENTORY.md`](./INVENTORY.md)。

## Principles

- **Schema 是数据**：无函数 / 无 eval
- **Editor / Preview / Runtime 同一 Renderer**
- **Command + Transaction**：一次拖动 = 一条 Undo
- **与 Skill Pipeline 分离**

## Packages

| Path | Role |
|------|------|
| `editor/` | `createLowcodeEditor` · Command · Tree · Viewport · Snap |
| `materials/` | Material Protocol v2 · `createStudioRegistry` |
| `runtime/` | PageContext · ActionEngine · DataSource |
| `document/` | `LowcodeDocument` · localStorage · user template |
| `studio/` | `StudioShell` / `EditorCanvas` / `StudioInspector` |
| `ui/` | Legacy parts (KEEP / REFACTOR / DEPRECATE) |

## Quick start

```ts
import { createLowcodeEditor, createStudioRegistry, StudioShell } from '@amg-webui/lowcode'
```

example：`lab/lowcode-studio`（主入口）· `lab/lowcode`（零件 Lab）。

## Honesty

| 维度 | 状态 |
|------|------|
| 引擎 / Schema / Codegen | Beta — 可用 |
| LC-012 黄金路径 E2E | **PASS** 19/19（`lowcode-golden-path.json`） |
| Studio 产品 `productionReady` | **false** — experimental |
| 六维 Studio Ready DoD | 未全过 |

Studio 0.1 闭环增强中：Action 链 / Runtime 同语义 / DS 面板 / Codegen 结构检查已落地。  
**LC-012 PASS ≠ Studio 生产可用。** 报告：`component-hardening/reports/lowcode-golden-path.json` · 程序状态：`component-hardening/program-status.json`。
