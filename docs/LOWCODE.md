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
import { Button, InputText, Tag } from '@amg-webui/components/base'

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

### 渲染

```vue
<SchemaRenderer :schema="schema" :registry="registry" render-mode="component" />
<CanvasPreview
  :nodes="schema.nodes"
  :registry="registry"
  render-mode="component"
  v-model="selectedId"
/>
```

| 组件 | 角色 |
|------|------|
| `SchemaRenderer` | Schema → 真实组件树（或 chrome 占位） |
| `CanvasPreview` | 缩放预览；`renderMode: 'component' \| 'chrome'` |
| `DragCanvas` | 放置面；`registry` + `renderMode: component` 时 **WYSIWYG** 真组件 |
| `DragMaterial` | 物料面板（`registry.toMaterials()`） |
| `PropPanel` | 选中节点属性；传入 `registry` 时读取 `propsSchema` |
| `CanvasIo` | JSON 导入导出；导入经 `validateCanvasSchema` |
| `CanvasShortcut` | 键盘：复制 / 粘贴 / 撤销 / 重做 / 删除（输入框内不抢快捷键） |

## API（`@amg-webui/lowcode`）

| API | 作用 |
|-----|------|
| `createComponentRegistry` | 注册 / 查询 / `toMaterials()` |
| `validateCanvasSchema` | 结构 + 可选类型 / 必填 props |
| `migrateCanvasSchema` | 旧版 → 当前 `CANVAS_SCHEMA_VERSION` |
| `resolveNodeRender` | `type` → `{ component, props, meta }` |
| `generateVueSfc` / `generateVueTemplate` | Schema → Vue 源码字符串 |

## example

本地调试：`lab/lowcode`（`example/pages/lab/LowcodeLabPage.vue`）— **不上线**。

## 诚实边界（当前交付）

已交付：注册表、**编辑器 WYSIWYG**（`DragCanvas`+`registry`）、Schema 渲染（含 `parentId` 树）、`PropPanel`↔`propsSchema` + 容器 `parentId` 选择、`wouldCreateCycle` / `setParent`、校验/迁移、undo/redo/clipboard、Vue SFC 代码生成（嵌套 + events stubs）、Preview 组件模式。

未交付（后续，勿宣传为已发货）：

- 完整 per-component JSON Schema 目录自动生成 / `unplugin-amg-webui`
- 文档站拖拽器上线
- 对齐磁吸 / 多页 Schema / 可视化数据源绑定
- 深嵌套拖入体验（drop-into-container 命中区）仍粗
- Codegen 仍是布局草图（无 slots / v-model / 响应式）
- 生成结果可部署性 / 热更新闭环未交付
