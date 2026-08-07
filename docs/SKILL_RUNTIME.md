# AMG-WebUI Skill Runtime（锁定）

> 定位：独立、可选、可编排、可隔离的微型业务逻辑运行时。  
> 核心原则：**UI 归 UI，逻辑归 Skill；组件不感知 Skill，Skill 不参与 UI 渲染。**  
> 关联：`docs/LIBRARY_PLAN.md` · `docs/OVERTAKE_ELEMENT_PLUS.md` · `docs/ENGINEERING.md` · `docs/TELEMETRY.md`

---

## 0. 状态与口径

Skill Runtime 是 AMG-WebUI 的新增差异化赛道，不把规划能力提前写成已发布能力。

| 阶段 | 范围 | 状态口径 |
|------|------|----------|
| **SR1 · Core** | SkillUnit / SkillContext / Runtime、注册、执行、销毁、Adapter、Observer | 最小基线已进入工程并通过基础门禁；保持 experimental |
| **SR2 · Compose + Vue** | Scope、Pipeline（顺序 / 并行 / 条件 / 重试 / 降级）、`v-skill`、`AmgSkillScope`、Vue Plugin | 最小基线已进入工程并通过基础门禁；稳定化仍按本文 DoD 推进 |
| **SR3 · Ecosystem** | 官方 built-ins、Runtime Inspector / Pipeline Debugger、Telemetry Bridge、example Skill Lab | experimental 基线已进入工程；稳定化仍按本文 DoD 推进 |
| **SR4 · Low-code** | Pipeline 可视化编辑、Schema 校验、导入导出、版本迁移 | 后续，不属于本次交付 |

附件中的“100%”“零成本”“全覆盖”“无任何硬编码”等表述统一转换为**可验证目标**，不得直接作为当前完成结论。成熟度必须由类型检查、单测、构建、包导出与真实示例共同证明。

---

## 1. 定位与非目标

### 1.1 要解决的问题

- 把分页查询、提交、字典映射、导出、请求重试等业务逻辑从组件实现中抽离。
- 让同一 Skill 可绑定组件，也可在无 UI 场景独立运行。
- 为多组件联动提供显式 Scope，而不是依赖全局可变单例。
- 为复杂异步流程提供可序列化 Pipeline，并保持可取消、可清理、可观测。
- 通过 Adapter 隔离后端协议，通过 Observer 隔离日志与观测系统。

### 1.2 明确不做

- 不替换 base 组件，不要求业务改用“Pro 版组件”。
- 不在 Skill 中渲染 DOM、拼装样式或写入 Theme Token。
- 不让 `packages/components/**` 依赖 Skill Runtime。
- 不把全局 `EventService` 当作实例上下文；跨实例共享必须通过显式 Scope。
- 不内置后端协议、云上报、AI 大模型或隐式网络请求。
- 不执行来自 JSON 的 JavaScript、表达式字符串或动态模块代码。

---

## 2. 包形与依赖边界

源码位于 `packages/skill/`，公共入口锁定为：

| 入口 | 内容 |
|------|------|
| `amg-webui/skill/core` | 框架无关的 Unit / Context / Runtime / Scope / Pipeline / Adapter / Observer |
| `amg-webui/skill` | Core + Vue 集成：`vSkill` / `AmgSkillScope` |
| `@amg-webui/skill` | 仓库内部别名 |

硬规则：

1. 根入口 `amg-webui` **不再导出** Skill Runtime；使用者必须显式导入 subpath。
2. 未导入 Skill subpath 时，不应进入业务运行时 bundle；“零负担”只指 bundle/runtime，不宣称 npm 安装体积为零。
3. `skill/core` 不得 import Vue、组件、主题、i18n、Telemetry 或浏览器全局对象。
4. `skill` 的 Vue 层只负责生命周期与 Scope 注入，不承载业务 Skill。
5. base / business 组件保持纯粹，不 import `@amg-webui/skill`，不新增 Skill 专用 props。
6. Adapter 与 Observer 采用依赖注入；核心不绑定请求库、日志库或后端格式。

依赖方向：

```text
consumer / business code
        │
        ├── amg-webui components
        └── amg-webui/skill ──→ amg-webui/skill/core

components ──X──→ skill
skill/core ──X──→ Vue / components / telemetry / backend
```

---

## 3. 核心模型

### 3.1 SkillUnit

SkillUnit 是可注册、可执行、可销毁的最小逻辑单元。公共类型禁止 `any` 与裸 `Function`。

```ts
type MaybePromise<T> = T | Promise<T>

interface SkillUnit<Config = unknown, Output = unknown> {
  readonly name: string
  setup(ctx: SkillContext, config: Config): MaybePromise<Output>
  teardown(ctx: SkillContext): MaybePromise<void>
  onError?(error: Error, ctx: SkillContext): MaybePromise<void>
}
```

约束：

- `name` 在一个 Runtime 注册表内唯一；重复注册默认报错，显式 `{ override: true }` 才可覆盖。
- Unit 定义应近似无状态；单次执行状态放在 `ctx.state`，禁止把实例数据写入模块级变量。
- `setup` 每次挂载最多执行一次；同一实例的 `teardown` 最多执行一次。
- `setup` 失败、主动取消、Scope 销毁、指令卸载都必须进入统一清理路径。
- `onError` 只做归一化、记录或降级决策，不能吞掉取消信号或破坏清理。

推荐使用 `defineSkill()` 保留泛型推导：

```ts
const searchSkill = defineSkill({
  name: 'table-search',
  async setup(ctx, config: { keyword: string }) {
    return ctx.useAdapter('search', config)
  },
  teardown() {}
})
```

### 3.2 SkillContext

每次挂载 / 执行创建独立 Context；`instanceId` 不复用。

```ts
interface SkillContext {
  readonly instanceId: string
  readonly skillName: string
  readonly state: Record<string, unknown>
  readonly signal: AbortSignal
  readonly scope?: SkillScopeContext
  readonly host?: object
  readonly utils: SkillContextUtils
  emit(event: string, payload: unknown): void
  on(event: string, handler: (payload: unknown) => void): () => void
  useAdapter<Input, Output>(name: string, input: Input): Promise<Output>
}
```

隔离规则：

- `ctx.state` 只属于当前执行实例；两个组件挂载同一 Unit 时不得串状态。
- `ctx.scope?.state` 才是 Scope 内显式共享状态；共享 key 必须命名空间化。
- `on()` 必须返回取消订阅函数；Runtime 在销毁时兜底清理仍未释放的监听。
- `signal` 是请求、sleep、retry、Adapter 的统一取消源；不得另造无法追踪的取消体系。
- `utils` 统一提供 sleep、retry、请求取消器等可回收能力；Adapter 通过 `useAdapter()` 解析。
- `host` 应传入版本化、最小化的公开能力对象，不读取 Vue 私有实例或组件内部响应式对象。

### 3.3 Runtime

`createSkillRuntime()` 创建显式 Runtime；禁止隐藏的跨应用可变单例。锁定的最小调用面为：

```ts
const runtime = createSkillRuntime()
runtime.register(unit)

const scope = runtime.createScope('orders-page')
const handle = runtime.mount('table-search', config, { scope, host })
await handle.ready
await handle.dispose()
```

Runtime 负责：

- Unit、Adapter、Observer 的注册与查找；Condition 由 Pipeline Executor 显式注册；
- 创建 Scope 与实例 Context；
- `mount` 与实例 `handle.dispose()` 生命周期；
- 取消、错误归一化和迟到异步结果抑制；
- Pipeline 执行与结构化 Observer 事件。

生命周期状态：

```text
setting-up → active → disposing → disposed
          ↘ failed ─────────────↗
```

`dispose()` 必须幂等。若卸载发生在异步 `setup()` 完成前，Runtime 先取消信号，并保证迟到结果不能写入 output 或重新激活实例。JavaScript 不能强制终止任意 Promise，因此 Unit / Adapter 必须协作监听 `ctx.signal`；忽略取消且永不 settle 的第三方 Promise 仍会阻塞其自身 teardown。

---

## 4. Scope

Scope 用于一组组件 / 任务之间的显式协作。它拥有 Scope 内事件总线、`scope.state` 与挂载句柄所有权；Unit / Adapter / Observer 属于显式 Runtime，Condition 则属于具体 Pipeline Executor，不复制到 Scope。

每次 Skill 执行仍拥有独立 `instanceId`、`ctx.state`、AbortController 与上下文托管资源。Scope 不是把所有实例塞进同一个全局 store。

嵌套 Scope 使用同一显式 Runtime 的注册表，但各自拥有事件与状态边界；不得通过嵌套 Scope 隐式覆盖 Runtime 注册项。Scope 销毁时先取消所属实例，再清空监听与状态。

Vue 使用 `AmgSkillScope` 提供 Scope：

```vue
<AmgSkillScope v-slot="{ scope }">
  <SearchForm v-skill="{ name: 'app.search-form', scope }" />
  <OrderTable v-skill="{ name: 'app.order-table', scope }" />
</AmgSkillScope>
```

`AmgSkillScope` 只负责 provide / inject 和生命周期，不渲染业务 UI、不修改子组件源码。

应用级安装使用显式 Runtime，不创建隐藏单例：

```ts
app.use(createSkillPlugin({ runtime }))
```

Plugin 注册 `v-skill` 与 `AmgSkillScope`。指令不会读取 Vue 私有实例来猜测 Scope，因此必须像上例显式传入 slot 中的 `scope`。直接导入裸 `vSkill` 时，binding 还必须提供 `runtime`；应用级绑定优先使用 `createSkillDirective(runtime)` 或 Plugin。

---

## 5. Pipeline

### 5.1 可序列化协议

Pipeline 顶层 Schema 固定版本：

```ts
interface SkillPipelineDefinition {
  version: 1
  name?: string
  items: SkillPipelineItem[]
}
```

顶层 `items` 按数组顺序执行，即 sequence。节点能力：

```ts
type SkillPipelineItem =
  | { type: 'skill'; name: string; id?: string; config?: JsonValue }
  | { type: 'parallel'; items: SkillPipelineItem[] }
  | { type: 'if'; condition: string; then: SkillPipelineItem[]; else?: SkillPipelineItem[] }
  | { type: 'retry'; max: number; delayMs?: number; backoff?: number; item: SkillPipelineItem }
  | { type: 'fallback'; item: SkillPipelineItem; fallback: SkillPipelineItem }
```

`JsonValue` 仅允许 JSON primitive / object / array；不得出现函数、DOM、Vue 实例、Symbol、循环引用或动态 import 描述。

### 5.2 执行语义

- **sequence**：顶层或分支数组按顺序执行；前一项失败时停止当前序列。
- **parallel**：并行启动子项，返回结果顺序与配置顺序一致；Scope / Runtime 被取消时统一中止。
- **if**：`condition` 只能引用 Executor 中通过 `registerCondition()` 预先注册的受信任谓词；未知条件直接返回结构化错误。
- **retry**：`max` 是 `1–10` 的总尝试次数；默认只重试 `SkillExecutionError`，取消、注册 / 配置类错误不重试；每次 Unit 失败都可观测。
- **fallback**：只在主项产生 `SkillExecutionError` 时执行显式 fallback；取消、未知注册和配置错误直接失败，不能被降级分支掩盖。

`condition: "some JavaScript"`、`eval`、`new Function`、字符串模板求值全部禁止。低代码只序列化谓词 ID 与 JSON 入参，谓词实现由受信任代码注册。

以下名称是假设业务方已经注册的示意 Skill，不代表 SR3 官方 built-ins 已交付：

```ts
const pipeline = createSkillPipeline({
  version: 1,
  items: [
    { type: 'skill', name: 'form-submit', config: { reset: true } },
    {
      type: 'fallback',
      item: { type: 'retry', max: 3, item: { type: 'skill', name: 'table-search' } },
      fallback: { type: 'skill', name: 'notify-recoverable-error' }
    }
  ]
})

const executor = createSkillPipelineExecutor(runtime)
executor.registerCondition('can-submit', ({ scope }) => Boolean(scope.state.canSubmit))
const execution = executor.start(pipeline, { scope })
try {
  await execution.ready
} finally {
  await execution.dispose()
}
```

---

## 6. Adapter

Adapter 隔离后端与外部能力。Skill 只依赖稳定业务语义，不解析项目专属响应壳。

```ts
interface SkillAdapter<Input = unknown, Output = unknown> {
  readonly name: string
  execute(input: Input, context: SkillContext): MaybePromise<Output>
  mapError?(error: unknown, context: SkillContext): Error
}
```

硬规则：

- Adapter 必须使用 `context.signal` 响应取消；超时、重试和错误分类可被 Runtime 识别。
- 后端 DTO → 领域数据的转换留在 Adapter，不渗入通用 Skill。
- Adapter 注册为显式依赖；缺失时快速失败，不静默访问全局对象。
- 认证信息不得写入 Pipeline JSON、Context 日志或 Observer 默认 payload。

---

## 7. Observer 与 Telemetry 边界

Observer 接收 Runtime 生命周期与 Pipeline 执行事件，用于测试、日志、性能分析或外部桥接。

```ts
type SkillObserver = (event: SkillTraceEvent | SkillPipelineTraceEvent) => void
```

约束：

- 默认可无 Observer；Core 不自动输出 console 日志。
- Observer 失败不得改变 Skill / Pipeline 的业务结果。
- 默认事件只含名称、实例 / Scope ID、阶段、耗时与必要错误元数据；原始 config / payload 默认不采集。
- `createSkillConsoleObserver()` 默认不打印原始 Error；只有显式 `includeErrorDetails: true` 才输出完整错误，启用方负责额外脱敏。
- Vp Telemetry 保持**默认关闭**。未来可由独立 Observer bridge 转换事件，Skill Core 不 import `@amg-webui/telemetry`。
- 开发日志面板和 DevTools 属 SR3，不属于 SR1/SR2 完成条件。

---

## 8. Vue 集成

### 8.1 `v-skill`

```vue
<DataTable
  v-skill="{ name: 'table-search', config: searchConfig, host: tableHost }"
/>
```

- `mounted` 创建实例；`updated` 在 binding 引用变化时重绑定；原地深改 config 不会触发，调用方应替换 binding 对象；`unmounted` 必须 dispose。
- 更新时先销毁旧实例，再挂载新实例，避免两个异步执行同时写宿主。
- `host` 为显式宿主能力对象（host bridge）；省略时 `ctx.host` 为 `undefined`，不得把原生 DOM 或 Vue 私有实例隐式当作宿主能力。
- Scope 是可选项；缺少 Runtime、未知 Unit 等挂载前错误交给 binding `onError`（未提供时仅输出脱敏摘要），已开始的 Unit / Adapter 错误同时进入 Runtime Observer。
- SSR 阶段不访问 DOM；客户端 mounted 后才启动具有副作用的 Skill。

### 8.2 UI 交互契约

组件保持现有 Props / Emits / Slots / Expose。需要与 Skill 协作时，由业务侧创建标准宿主能力对象：

- 只暴露必要方法和只读状态；
- 明确版本与 capability；
- 组件销毁后调用应快速失败；
- Skill 不写 class、style 或 DOM 结构。

这保证移除 `v-skill` 后组件行为不变，也保证同一 Skill 可运行在不同组件或无 UI 环境。

---

## 9. 错误、取消与清理

- 所有未知异常统一归一化为 `SkillRuntimeError` / `SkillExecutionError` / `SkillAbortError`，保留 skill、实例与 cause 上下文。
- Abort / dispose 是控制流，不作为需要重试的普通错误。
- Runtime 自动回收 `ctx.on()` 订阅、派生 AbortController 与 `ctx.utils.sleep()`；任意自建 timer / 外部资源必须在 `teardown(ctx)` 中释放，Adapter 必须响应 `context.signal`。
- Scope / Runtime 会尝试清理全部所属句柄并汇总异常；单个 teardown 失败不阻止其余清理，错误同时进入 Observer。
- Pipeline retry 默认只处理 `SkillExecutionError`；具有外部副作用的 Skill 必须自行保证幂等或提供幂等 key。
- 并行节点失败时仍需等待或取消其他分支的清理，禁止遗留后台任务。

---

## 10. 本次交付与后续边界

### SR1 / SR2 本次范围

- `defineSkill` · `createSkillRuntime` · `createSkillPipeline` · `createSkillPipelineExecutor`
- `createSkillPlugin` · `vSkill` · `AmgSkillScope`
- Unit / Context / Runtime / Scope
- Pipeline：sequence、parallel、if、retry、fallback
- `registerCondition(name, predicate)`；禁止执行任意字符串代码
- Adapter / Observer 可插拔接口
- 独立 subpath；根入口不导出
- 生命周期、隔离、取消、错误与包导出单测

### SR3 已交付（experimental）

- 官方 built-ins：`table-search` · `dict-mapping` · `form-submit` · `table-export` · `request-wrapper`
- `registerOfficialBuiltins(runtime)`
- `createSkillInspector` · `createPipelineDebugger` · `createSkillTelemetryBridge`
- example：`/lab/skill`（Skill Lab）
- 单测：`tests/unit/skill-sr3-builtins.spec.ts`

导入：

```ts
import {
  createSkillRuntime,
  registerOfficialBuiltins,
  createSkillInspector
} from 'amg-webui/skill/core'
```

### SR4 后续范围

- Pipeline 可视化编辑器、完整 JSON Schema、迁移器与低代码集成

---

## 11. 验证记录与稳定化 DoD

### 11.1 当前基础门禁（2026-08-05）

| 验证项 | 当前结果 |
|--------|----------|
| `npx vue-tsc --noEmit` | PASS |
| `npx vitest run tests/unit/skill-runtime.spec.ts` | 20 / 20 PASS |
| `npm test` | 23 files / 180 tests PASS |
| `npm run validate:catalog` | 285 components / 8 categories PASS |
| `npm run build:skill` · `npm run build:lib` | 独立 Skill 与完整库 ESM / CJS / types 均构建通过 |
| 子路径与根入口 smoke | ESM / CJS 的 `skill`、`skill/core` 可导入；根入口无 Skill API |
| 临时消费者 smoke | 未安装 Vue 时 `skill/core` ESM / CJS 可导入；包内 23 个 `dist/skill/*`、0 个 `packages/skill/*` |
| `npm run docs:build` | PASS |

这些记录只证明 **experimental 最小基线可构建、可导入、核心行为受测**，不等于 1.0 稳定承诺。

### 11.2 stable 前必须完成

1. Core 自有公共类型禁止显式 `any` / 裸 `Function`；发布声明文件持续审计。
2. Unit 注册冲突、setup 成败、onError、幂等 dispose、迟到结果抑制、teardown 异常持续有回归测试。
3. 同一 Unit 多实例、并行 Pipeline、嵌套 `AmgSkillScope` 不串实例状态或 Scope 状态。
4. Scope 销毁、Vue 指令卸载 / 重绑定、异步 setup 竞态均完成协作式取消与清理。
5. sequence / parallel / if / retry / fallback 的成功、终态失败与取消组合形成独立矩阵，不只依赖混合 happy path。
6. 未注册 condition 被拒绝；源码与 CI 禁止 `eval` / `new Function` 路径。
7. Adapter 收到有效 `signal`；Observer 异常不改变业务结果；默认 Console Observer 与指令日志不输出原始错误详情。
8. `amg-webui/skill/core` 在无 DOM / 无 Vue 消费者环境持续可导入。
9. `amg-webui/skill` 可导入 Vue 集成；根入口持续不导出 Skill API。
10. 完整构建、发包清单、临时消费者与文档站 smoke 纳入 CI。

当前尚未宣称 stable 的主要缺口是：Pipeline 每类节点的失败 / 取消全矩阵、异步指令卸载压力用例，以及上述包形 smoke 的 CI 固化。SR4 低代码 Pipeline 编辑器仍未交付。SR3 built-ins / Inspector / Telemetry bridge / Skill Lab 已进入 experimental 基线（见 § SR3 已交付）。
