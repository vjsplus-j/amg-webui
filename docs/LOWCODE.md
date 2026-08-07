# 低代码 Schema 引擎

画布 Schema 注册表 · 校验 / 迁移 · Schema 渲染 · Vue 代码生成。

对标 [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)「低代码 Schema」。包：[`packages/lowcode`](../packages/lowcode/README.md)。

> **与 Skill Pipeline 分离**：本引擎负责 **UI 页面级** Schema；Skill Pipeline JSON v1 是逻辑编排（见 [SKILL_RUNTIME.md](./SKILL_RUNTIME.md)），禁止把代码字符串当协议。

## Principles

- **Schema 是数据**：`CanvasSchema` JSON，无函数 / 无 eval
- **注册表驱动**：`type → Vue Component`，编辑器与预览共用
- **代码生成输出源码文本**：`generateVueSfc` 不执行生成结果
- **拖拽编排**：`DragMaterial` + `DragCanvas` + `PropPanel` + `CanvasIo` + `CanvasShortcut`（undo/redo/copy/paste 已接线）

## Schema 形状

```ts
interface CanvasSchema {
  version: number // CANVAS_SCHEMA_VERSION = 1
  mode: 'free' | 'grid'
  nodes: CanvasNodeData[]
}
```

`CanvasNodeData`：`id` · `type` · `label` · 几何（`x/y/w/h` 或 grid 字段）· `props` · `locked` / `hidden` / `zIndex` / `parentId`。

## Quick start

```ts
import {
  createComponentRegistry,
  validateCanvasSchema,
  migrateCanvasSchema,
  generateVueSfc
} from '@amg-webui/lowcode'
import { Button, Tag } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'

const registry = createComponentRegistry([
  {
    type: 'Button',
    label: 'Button',
    component: Button,
    group: 'general',
    defaultProps: { label: 'OK' },
    defaultSize: { w: 120, h: 40 },
    propsSchema: {
      label: { type: 'string', title: 'Label', required: true }
    }
  },
  { type: 'InputText', label: 'Input', component: InputText, group: 'form' },
  { type: 'Tag', label: 'Tag', component: Tag, group: 'general', defaultProps: { value: 'Tag' } }
])

const { ok, schema, issues } = validateCanvasSchema(raw, { registry, checkRequiredProps: true })
const migrated = migrateCanvasSchema(raw)
const sfc = generateVueSfc(schema, { registry, componentName: 'MyPage' })
```

## 渲染

```vue
<SchemaRenderer
  :schema="schema"
  :registry="registry"
  render-mode="component"
  :context="state"
  :handlers="{ onSave }"
/>
```

| 组件 | 角色 |
|------|------|
| `SchemaRenderer` | Schema → 真实组件树（任意深度 `parentId`；或 chrome 占位） |
| `SchemaNodeRenderer` | 递归节点；由 `SchemaRenderer` 提供 context / handlers |
| `CanvasPreview` | 缩放预览；`renderMode: 'component' \| 'chrome'` |
| `DragCanvas` | 放置面；`registry` + `renderMode: component` 时 **WYSIWYG** 真组件 |
| `DragMaterial` | 物料面板（`registry.toMaterials()`） |
| `PropPanel` | 选中节点属性；传入 `registry` 时读取 `propsSchema` |
| `CanvasIo` | JSON 导入导出；导入经 `validateCanvasSchema` |
| `CanvasShortcut` | 键盘：复制 / 粘贴 / 撤销 / 重做 / 删除（输入框内不抢快捷键） |

### Binding / Event（运行时 ↔ Codegen 同语义）

节点 `props` 保留键：

| Key | 含义 |
|-----|------|
| `__bindings` | `Record<prop, pathExpr>` — 路径白名单：`form.name` / `count`（无 eval） |
| `__events` | `Record<event, handlerName>` — 映射到 `handlers` / Codegen stub |

```ts
props: {
  __bindings: { modelValue: 'form.title' }, // → v-model / 运行时读写 context
  __events: { click: 'onSave' }             // → @click="onSave" / handlers.onSave
}
```

- **运行时**：`SchemaRenderer` 的 `context` + `handlers`；`modelValue` 绑定写回 context；`nodeEvent` 旁路上报。
- **Codegen**：同一键输出 `v-model` / `@event` 与 handler stubs。
- **禁止**：`eval` / `new Function` / 括号下标 / 运算符表达式。

## API（`@amg-webui/lowcode`）

| API | 作用 |
|-----|------|
| `createComponentRegistry` | 注册 / 查询 / `toMaterials()`；`onConflict: throw\|skip\|replace` |
| `validateCanvasSchema` | 严格结构 + 图完整性 + props/binding/event + 限额 |
| `migrateCanvasSchema` | 旧版 → 当前 `CANVAS_SCHEMA_VERSION` |
| `LOWCODE_LIMITS` | 默认 maxNodes / maxDepth / maxSchemaChars / 坐标尺寸 |
| `resolveNodeRender` | `type` → `{ component, props, meta }`（剥离 meta 键） |
| `resolveRuntimeRender` | 绑定 context + 映射 events（白名单路径） |
| `isSafePathExpr` / `getByPath` / `setByPath` | Binding 路径工具 |
| `generateVueSfc` / `generateVueTemplate` | Schema → Vue 源码字符串 |

## example

本地调试：`lab/lowcode`（`example/pages/lab/LowcodeLabPage.vue`）— **不上线**。

## 诚实边界（当前交付）

**定位：MVP 骨架，不是生产闭环。** lab 物料为抽样控件，非全量 base 目录自动接入。

已交付：注册表（冲突策略默认 `throw`）· **严格校验**（重复 id / parent / 循环 / 尺寸坐标 / props 类型与枚举 / Binding·Event·Handler / 节点数·深度·体积）· Schema 任意深度递归 · `__bindings`/`__events` 运行时与 Codegen 对齐 · `PropPanel` 键冲突修复（编辑实时刷新）· WYSIWYG / 迁移 / undo·redo / SFC 草图。

未交付（后续，勿宣传为已发货）：

- 完整 per-component JSON Schema 目录自动生成 / `unplugin-amg-webui`
- 文档站拖拽器上线；全量物料一键注册
- 对齐磁吸 / 多页 Schema / 可视化数据源绑定 UI
- 深嵌套拖入体验（drop-into-container 命中区）仍粗
- Codegen 仍是布局草图（无 slots / 完整响应式系统）
- 表达式仅支持白名单路径，不支持任意 JS
- 生成结果可部署性 / 热更新闭环未交付
- `CanvasPreview` / `CanvasNode` 编辑态仍用静态 `resolveNodeRender`（不跑 Binding；预览以 `SchemaRenderer` 为准）
