# CodeEditor

CodeEditor：面向企业场景的 Editor 组件（成熟度 rc）。

## 组件介绍

CodeEditor：面向企业场景的 Editor 组件（成熟度 rc）。

## 核心特性

- Editor 家族组件
- v-model 双向绑定
- 只读模式
- 事件回调

## 何时使用 / 不适用

**适用**

- 代码/富文本/Markdown 编辑

**不适用**

- 只读展示用 Typography / RichText 预览模式

## 基础用法

> `import { CodeEditor } from 'amg-webui/editor'`

```vue
<script setup>
import { CodeEditor } from 'amg-webui/editor'
</script>

<template>
  <CodeEditor />
</template>
```

Curated demo：`example/demos/CodeEditor/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `language` | `CodeLanguage` | `javascript` | language 配置项 |
| `readonly` | `boolean` | false | 是否只读 / Read-only |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CodeLanguage`
- `CodeEditorProps`
- `CodeEditorEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CodeEditor interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CodeEditor uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CodeEditor RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CodeEditor client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/editor` |
| metadata | `component-metadata/CodeEditor.json` |
| API extract | `generated/component-api/CodeEditor.json` |

> 完整 Demo 见 `example/demos/CodeEditor`（example 本地调试，不上线）。

