# Low-code Schema 引擎

画布 Schema 注册表 · 校验 / 迁移 · Schema → Vue 代码生成。配合 `SchemaRenderer` / `CanvasPreview` / `DragCanvas` 使用。

完整契约见 [`docs/LOWCODE.md`](../../docs/LOWCODE.md) · 对标 [`docs/OVERTAKE_ELEMENT_PLUS.md`](../../docs/OVERTAKE_ELEMENT_PLUS.md)「低代码 Schema」。

## Principles

- **Schema 是数据**：`CanvasSchema` JSON，无函数 / 无 eval
- **注册表驱动渲染**：`type → Vue Component`，预览与编辑共用
- **代码生成是源码文本**：`generateVueSfc` 输出 SFC 字符串，不执行
- **与 Skill Pipeline 分离**：UI 低代码 ≠ Skill Pipeline JSON（逻辑编排另见 `SKILL_RUNTIME.md`）

## Quick start

```ts
import { createComponentRegistry, validateCanvasSchema, generateVueSfc } from '@amg-webui/lowcode'
import { Button, InputText } from '@amg-webui/components/base'

const registry = createComponentRegistry([
  { type: 'Button', label: 'Button', component: Button, defaultProps: { label: 'OK' } },
  { type: 'InputText', label: 'Input', component: InputText, group: 'form' }
])

const { ok, schema, issues } = validateCanvasSchema(rawJson, { registry })
const sfc = generateVueSfc(schema, { registry })
```

```vue
<SchemaRenderer :schema="schema" :registry="registry" />
<CanvasPreview :nodes="schema.nodes" :registry="registry" render-mode="component" />
```

## Package boundary

- Alias：`@amg-webui/lowcode` · 发包子路径 `amg-webui/lowcode`
- 根入口可再导出；**不**进入 `skill/core`
- UI 组件（`SchemaRenderer`）在 `packages/components/base/SchemaRenderer`
