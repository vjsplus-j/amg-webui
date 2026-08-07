# MessageBox 命令式对话框

命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。

## 组件介绍

命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。

## 核心特性

- Overlay 家族组件

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { MessageBox } from 'amg-webui/overlay'`

```ts
import { MessageBox } from 'amg-webui/overlay'

const result = await MessageBox.confirm({
  title: 'Confirm',
  message: 'Proceed with this action?'
})
if (result === 'confirm') {
  /* … */
}
```

Curated demo：`example/demos/MessageBox/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| （无公开 Props） | | | |

### Public Types

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

## 键盘交互

- 状态：`PASS`
- 按键：`Escape`
- Escape: Escape dismisses message box and emits cancel

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MessageBox uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts MessageBox RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MessageBox client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/MessageBox.json` |
| API extract | `generated/component-api/MessageBox.json` |

> 完整 Demo 见 `example/demos/MessageBox`（example 本地调试，不上线）。

