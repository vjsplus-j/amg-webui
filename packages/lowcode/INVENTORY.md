# Lowcode UI inventory (Studio 0.1)

Frozen: **do not add** new `CanvasXXX` / `DragXXX` / `TemplateXXX` thin components until LC-012 DoD passes.

| Component | Status | Notes |
|-----------|--------|--------|
| SchemaRenderer | KEEP | Unified runtime renderer |
| SchemaNodeRenderer | KEEP | Recursive node |
| DragCanvas | REFACTOR | Logic folds into EditorCanvas + managers |
| CanvasNode | REFACTOR | Chrome wrapper for editor |
| DragMaterial | KEEP | Palette; Studio may wrap |
| PropPanel | REFACTOR | Becomes Inspector Properties tab |
| CanvasIo | KEEP | Import/export JSON |
| CanvasShortcut | REFACTOR | Prefer editor.shortcut + Studio |
| CanvasLayer | REFACTOR | Outline tree supersedes |
| CanvasPreview | KEEP | Scale preview; bindings via SchemaRenderer |
| FreeLayoutDrag | MERGE | → MoveManager |
| DragWrapper | MERGE | → DropManager |
| GridLayoutDrag | KEEP (idle) | Grid mode later |
| DragRuler | DEPRECATE | 0.1 no expansion |
| DragSelect | DEPRECATE | 0.1 no expansion |
| DragSortNode | DEPRECATE | 0.1 no expansion |
| TemplateDrag | DEPRECATE | Real templates via document API |
| TemplateSelect | DEPRECATE | Real templates via document API |
