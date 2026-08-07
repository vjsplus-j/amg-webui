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

Studio 0.1 重建中。LC-012 19 步验收未全部人工签核前，禁止宣传 Ready / 生产可用。
