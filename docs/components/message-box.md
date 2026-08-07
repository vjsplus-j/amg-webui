# MessageBox 命令式对话框

命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。

## 概览

MessageBox 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```ts
import { MessageBox } from '@amg-webui/overlay'

const result = await MessageBox.confirm({
  title: 'Confirm',
  message: 'Proceed with this action?'
})
if (result === 'confirm') {
  /* … */
}
```

Curated demo：`example/demos/MessageBox/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| — | — | — | 见 `generated/component-api` 或源码 `types.ts` |

## Public types

- `MessageBoxMode`
- `MessageBoxAction`
- `MessageBoxCloseReason`
- `MessageBoxAutofocus`
- `MessageBoxInputType`
- `MessageBoxConfirmResult`
- `MessageBoxAlertResult`
- `MessageBoxPromptResult`
- `MessageBoxOptions`
- `MessageBoxHostProps`
- `MessageBoxHostEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/MessageBox.json` |

> 完整 Demo 见 `example/demos/MessageBox`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
