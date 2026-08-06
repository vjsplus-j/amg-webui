# UI Telemetry Kernel（Vp Telemetry）

交互观测内核：把组件 click / 回调收成可配置的结构化事件（默认**关闭**），供习惯 / 告警 / 错误分析消费。

完整能力见 [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)「企业基建」节。

Skill Runtime 边界见 [SKILL_RUNTIME.md](./SKILL_RUNTIME.md)：SR1 / SR2 提供独立 Observer，Telemetry bridge 属 SR3 后续能力。

## Principles

- **默认关闭**（`enabled: false`）— 业务显式打开
- **旁路观测**：组件照常 `emit`；遥测失败绝不影响 UI
- **无硬编码后端**：契约 + 环形缓冲 + Sink；上报由业务适配器实现
- **Tree-shake 友好**：未 enable 时走 early-return 最小路径；实际成本以包体与运行时基准为准
- **与 Skill 解耦**：`amg-webui/skill/core` 不 import Telemetry；两者均可单独使用

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

`TelemetryProvider` 会响应配置变化，并默认在卸载时恢复挂载前的单例配置，避免局部示例或微前端污染宿主；可用 `restoreOnUnmount="false"` 显式保留配置。`trackLifecycle` 可选记录 Provider 的 mount/unmount。

Components accept `trackId` / `telemetry` props. Interactives call `trackEmit` beside `emit`.

> **Vue Boolean caveat:** omit `telemetry` must mean “inherit global”. Always default `telemetry: undefined` in `withDefaults` — Vue casts omitted Boolean props to `false`, which would skip every track.

## Event shape

See `packages/telemetry/types.ts` — `VpTelemetryEvent` with categories:
`interaction` | `habit` | `alert` | `error` | `lifecycle`.

## Skill Runtime Observer 边界

Skill Runtime SR1 / SR2 的 `SkillObserver` 是独立旁路扩展点，用于接收 setup / teardown 与 Pipeline 执行轨迹；它不是 `VpTelemetryEvent`，也不会自动写入 Telemetry buffer。

- Skill Core **零 Telemetry 依赖**，`amg-webui/skill/core` 在未安装 / 未开启 Telemetry 时照常工作。
- Observer 失败不得改变 Skill 或 Pipeline 结果；原始 config、output、state 与事件 payload 默认不观测。
- `createSkillConsoleObserver` 必须显式创建，且只输出最小元数据；它不等于启用 Vp Telemetry。
- SR3 可新增独立 Observer bridge，把允许的 Skill trace 映射为 Telemetry `lifecycle` / `error` 事件；bridge 必须显式安装、遵守 `enabled: false` 默认值、脱敏与 `includePayload` 契约。
- 在 SR3 bridge 实现、测试和文档完成前，禁止宣称 Skill 已接入 Telemetry，也不扩写现有 `VpTelemetryEvent` 类别。

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
