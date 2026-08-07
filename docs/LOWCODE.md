# 低代码 Schema 引擎 · Lowcode Studio 0.1

画布 Schema 注册表 · 校验 / 迁移 · Schema 渲染 · Vue 代码生成 · **Studio 设计器（重建中）**。

对标 [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)「低代码 Schema」。包：`packages/lowcode`（见仓库内 `packages/lowcode/README.md`）。

> **与 Skill Pipeline 分离**：本引擎负责 **UI 页面级** Schema；Skill Pipeline JSON v1 是逻辑编排（见 [SKILL_RUNTIME.md](./SKILL_RUNTIME.md)），禁止把代码字符串当协议。

## 产品定位（Studio 0.1）

**基于 AMG-WebUI 的企业后台页面可视化设计器**——不是万能低代码平台。

黄金路径：用户管理 CRUD（搜索 + DataTable + Dialog + REST/Mock）。表单页 / Dashboard 仅作物料扩展位。

**状态：Prototype → Studio 0.1 重建中。** 引擎零件可用；设计器产品未 Ready。禁止宣传「生产可用 / Lowcode ready」。

组件冻结清单见仓库内 `packages/lowcode/INVENTORY.md`。

## Principles

- **Schema 是数据**：`CanvasSchema` / `LowcodeDocument` JSON，无函数 / 无 eval
- **注册表驱动**：`type → Vue Component`，Editor / Preview / Runtime 共用同一 Renderer
- **Command + Transaction**：一次拖动 / 一次 Resize = 一条 Undo
- **代码生成输出源码文本**：`generateVueSfc` 不执行生成结果
- Chrome（选中框、Handle、Guide）只包在 Editor 外层，不污染业务组件语义

## 架构包

| 路径 | 职责 |
|------|------|
| `packages/lowcode/editor/` | `createLowcodeEditor` · Command · Tree · Selection · Viewport |
| `packages/lowcode/materials/` | Material Protocol v2 · 内置物料子集 |
| `packages/lowcode/runtime/` | PageContext · ActionEngine · DataSource |
| `packages/lowcode/document/` | LowcodeDocument · localStorage · migrate |
| `packages/lowcode/studio/` | Studio 壳 Vue（Toolbar / Canvas / Inspector） |
| `packages/lowcode/ui/` | 既有零件（KEEP/REFACTOR/DEPRECATE 见 INVENTORY） |

## Schema 形状

```ts
interface CanvasSchema {
  version: number // CANVAS_SCHEMA_VERSION = 1
  mode: 'free' | 'grid'
  nodes: CanvasNodeData[]
}
```

`CanvasNodeData`：`id` · `type` · `label` · 几何 · `props` · `locked` / `hidden` / `zIndex` / `parentId`。

文档级：`LowcodeDocument` 含 `variables` · `dataSources` · `actions` · `theme` · 时间戳。

## Binding / Event / Action

| 机制 | 说明 |
|------|------|
| `__bindings` | `Record<prop, pathExpr>` — 白名单路径，无 eval |
| `__events` | 映射到 Action 链（`SetState` / `CallApi` / …） |
| PageContext | `{ page, state, form, data, route, user, env }` |

## example

| 路由 | 角色 |
|------|------|
| `lab/lowcode-studio` | **Studio 0.1 主入口**（全屏设计器）— 不上线 |
| `lab/lowcode` | 零件调试 Lab — 不上线 |

## 19 步验收（LC-012）

缺一条不得写「Lowcode ready」：

1. 创建空白页面  
2. 拖 Container  
3. 拖 Form  
4. 拖 InputText  
5. 修改 label  
6. 绑定 `state.keyword`  
7. 添加 Button  
8. click → call queryUsers  
9. 拖 DataTable  
10. value → `data.queryUsers.list`  
11. 点击 Preview  
12. 页面真实工作  
13. Save  
14. Refresh Browser  
15. 页面恢复  
16. Export JSON  
17. Import JSON  
18. Generate Vue  
19. Generated Vue 可编译  

## DoD（Studio Ready）

Engine · Interaction · Runtime · Persistence · Production · Test 六维全过。见 [`LOWCODE.md`](./LOWCODE.md) 与 `packages/lowcode/`。

## 诚实边界

**当前：Studio 0.1 闭环增强中。** 已补：Action 链可视化、编辑态 `resolveRuntimeRender` 与 Preview 同语义、parentRules Drop、Align UI、DataSource 配置面板、Codegen 结构检查（`assertGeneratedSfcShape` + `@vue/compiler-sfc` parse）、生成 SFC 内嵌 `createPageRuntime` 与 `runActionChain`。

仍未宣称 Ready：无 Playwright E2E 全量签核 19 步；编辑态仍扁平绝对定位（非 SchemaRenderer 树内嵌套 Chrome）；生成页需宿主注入 `fetch` / `onNavigate` 方可对接真实 REST。

未交付（勿宣传）：云端版本库、协作、GraphQL/WS、设备管理/Dashboard 完整模板、AI 生成页、文档站拖拽器上线、全量物料自动目录。
