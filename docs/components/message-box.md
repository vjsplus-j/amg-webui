# MessageBox 命令式对话框

命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。

## 基础用法

```ts
import { MessageBox } from '@amg-webui/overlay'

const result = await MessageBox.confirm(
  'Proceed with this action?',
  'Confirm',
  {
    severity: 'warning'
  }
)
if (result === 'confirm') {
  /* … */
}
```

## 命令式 API

| 方法 | 返回值 |
| --- | --- |
| `confirm(message, title?, options?)` | `Promise<'confirm' \| 'cancel'>` |
| `alert(message, title?, options?)` | `Promise<'confirm'>` |
| `prompt(message, title?, options?)` | `Promise<{ value: string } \| 'cancel'>` |

## 常用 Options

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `severity` | `ConfirmSeverity` | `warning` | 语义和确认按钮色调 |
| `dismissible` / `closable` | `boolean` | `true` | 遮罩/Esc 与关闭按钮 |
| `closeOnClickOverlay` | `boolean` | 继承 `dismissible` | 单独控制遮罩关闭 |
| `closeOnPressEscape` | `boolean` | 继承 `dismissible` | 单独控制 Esc 关闭 |
| `autofocus` | `confirm \| cancel \| input \| none` | 按模式 | 初始焦点 |
| `inputPattern` / `inputValidator` | `RegExp \| string` / 函数 | — | prompt 同步/异步校验 |
| `beforeClose` | `(action, value?) => boolean \| Promise<boolean>` | — | 异步关闭守卫 |
| `teleportTo` | `string \| HTMLElement` | `body` | 挂载目标 |

> 完整 Demo 见 `example/demos/MessageBox/`；交互预览仅在本地 example（不上线）。
