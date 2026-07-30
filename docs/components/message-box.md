# MessageBox 命令式对话框

命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。

## 基础用法

```ts
import { MessageBox } from '@amg-webui/components/base'

const result = await MessageBox.confirm({
  title: 'Confirm',
  message: 'Proceed with this action?'
})
if (result === 'confirm') {
  /* … */
}
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `title` | `string` | — | — |
| `message` | `string` | — | — |
| `mode` | `MessageBoxMode` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:visible` | — |
| `confirm` | — |
| `cancel` | — |

> 完整 Demo 见 `example/demos/MessageBox/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
