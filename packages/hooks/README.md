# @amg-webui/hooks

全局组合式 API：主题、语种、尺寸、弹窗、运动、以及遥测薄封装等。

| hook | 说明 |
|------|------|
| `useTheme` / 相关 | 设计主题切换 |
| `useLocale` | `t(key)` · 语种 |
| `useTrackedEmit` | 对 `@amg-webui/telemetry` 的 `trackEmit` / Service 薄封装 |
| `useMotion` | 组件 motion class 拼装 |

入口：`packages/hooks/index.ts`。调试：example `/lab/hooks`。
