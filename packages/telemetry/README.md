# @amg-webui/telemetry

Vp Telemetry — **UI 交互观测内核**（企业基建独家能力；对标 EP「只做 UI」空缺）。

权威说明：[`docs/TELEMETRY.md`](../../docs/TELEMETRY.md) · OVERTAKE「企业基建」§4 · Cursor：`vue3-amg-webui-telemetry.mdc`

## 原则

- **默认关闭**（`enabled: false`）
- **旁路**：不绑架业务 `emit`；失败不影响 UI
- **无硬编码后端**：契约 + 环形缓冲 + Sink
- **近零成本**：未 enable 时 early return

## 快速使用

```ts
import {
  TelemetryService,
  consoleSink,
  trackEmit,
  summarizeHabits,
  findAlerts,
  findErrors
} from '@amg-webui/telemetry'

TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  sinks: [consoleSink()],
  getRoute: () => location.pathname
})
```

或组件树：

```vue
<TelemetryProvider :enabled="true" :config="{ appId: 'my-app' }">
  <App />
</TelemetryProvider>
```

Provider 默认 `restoreOnUnmount`，卸载后恢复此前配置；需要把配置永久写入全局单例时显式传 `:restore-on-unmount="false"`。`trackLifecycle` 可选记录 Provider 生命周期。

## 组件挂钩

```ts
trackEmit({
  component: 'Button',
  type: 'click',
  trackId: props.trackId,
  telemetry: props.telemetry // 必须默认 undefined，勿让 Vue Boolean 省略成 false
})
emit('click', event)
```

Props（`BaseProps`）：`trackId?` · `telemetry?: boolean`（仅显式 `false` 跳过）。

## 目录

```
packages/telemetry/
├── index.ts
├── types.ts · config.ts
├── TelemetryService.ts      # globalThis 单例（防 Vite 双实例）
├── trackEmit.ts · analyze.ts · redact.ts · ringBuffer.ts
└── sinks/                   # console · buffer · custom
```

Play 调试：`/lab/telemetry`（仅本地）。
