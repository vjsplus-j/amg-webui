# UI Telemetry Kernel（Vp Telemetry）

交互观测内核：把组件 click / 回调收成可配置的结构化事件（默认**关闭**），供习惯 / 告警 / 错误分析消费。

完整能力见 [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)「企业基建」节。

## Principles

- **默认关闭**（`enabled: false`）— 业务显式打开
- **旁路观测**：组件照常 `emit`；遥测失败绝不影响 UI
- **无硬编码后端**：契约 + 环形缓冲 + Sink；上报由业务适配器实现
- **Tree-shake 友好**：未 enable 时 early return，接近零成本

## Quick start

```ts
import {
  TelemetryService,
  consoleSink,
  trackEmit,
  summarizeHabits,
  findAlerts
} from '@amg-webui/telemetry'

TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  includePayload: false,
  sinks: [consoleSink()],
  getRoute: () => location.pathname
})

// Or via provider
// <TelemetryProvider :enabled="true" :config="{ sinks: [consoleSink()] }" />
```

Components accept `trackId` / `telemetry` props. Interactives call `trackEmit` beside `emit`.

> **Vue Boolean caveat:** omit `telemetry` must mean “inherit global”. Always default `telemetry: undefined` in `withDefaults` — Vue casts omitted Boolean props to `false`, which would skip every track.

## Event shape

See `packages/telemetry/types.ts` — `VpTelemetryEvent` with categories:
`interaction` | `habit` | `alert` | `error` | `lifecycle`.

## Analyze

```ts
const events = TelemetryService.getBuffer()
summarizeHabits(events)
findAlerts(events)
```

Example debug（本地，不上线）: `example/pages/lab/TelemetryLabPage.vue` · route `lab/telemetry` / `lab-telemetry`。

## First-wave wired components

Button · Link · Tag · Badge · Avatar · AvatarGroup · Card · FloatButton · Collapse · CopyText · Progress · Statistic · Ellipsis · CardWidgets

Skipped (presentational): Divider · Space · Skeleton · Spin · Highlight · Empty · Icon · ButtonGroup
