# AMG-WebUI Skill Runtime

> 状态：**experimental**。当前 API 服务于架构验证，在 1.0 前可能调整；生产项目应锁定精确版本。

Skill Runtime 是 AMG-WebUI 的可选业务逻辑运行时。它让 UI 组件继续只负责渲染与基础交互，把请求、状态、跨组件协作和流程编排放进可注册、可隔离、可回收的 Skill。

## 公开入口

```ts
// 完整入口：Core + Vue 集成
import {
  AmgSkillScope,
  createSkillPlugin,
  createSkillRuntime,
  vSkill
} from 'amg-webui/skill'

// 框架无关入口：不包含 Vue 组件与指令
import {
  createSkillPipeline,
  createSkillPipelineExecutor,
  createSkillRuntime,
  defineSkill
} from 'amg-webui/skill/core'
```

- `amg-webui/skill` 面向 Vue 应用，重新导出 Core，并提供 `createSkillPlugin`、`AmgSkillScope` 与 `vSkill`。
- `amg-webui/skill/core` 面向无 UI 任务、服务端脚本和测试，不依赖组件实现。
- 主入口 `amg-webui` 不隐式启用 Skill Runtime。未导入 Skill 入口时，不应产生运行时代码与初始化副作用。

## 设计原则

1. **UI 与逻辑分离**：Skill 不渲染 UI；组件源码不导入、不判断 Skill。
2. **显式可选**：Runtime、Scope、Pipeline 与内置 Skill 均按需导入。
3. **实例隔离**：每次 `mount` 都创建唯一上下文；注册为全局不等于状态全局共享。
4. **完整回收**：组件卸载、Scope 销毁或主动 `dispose` 都必须终止请求、定时器和事件订阅。
5. **声明式编排**：Pipeline 定义可 JSON 序列化、可校验、可审计，不执行来自 JSON 的任意代码。
6. **后端无关**：请求和响应格式由业务 Adapter 归一化，Runtime 不绑定接口协议。
7. **宿主可选**：同一 Skill 可绑定标准化组件 Expose，也可在无 UI 场景运行。
8. **安全可观测**：调试事件走可插拔 Observer；敏感入参、出参和错误信息默认不进入日志。

## 最小用法

```ts
import { createSkillRuntime, defineSkill } from 'amg-webui/skill/core'

const normalizeQuery = defineSkill<
  { keyword: string },
  { keyword: string }
>({
  name: 'search.normalize-query',
  setup(ctx, config) {
    const keyword = config.keyword.trim()
    ctx.state.keyword = keyword
    ctx.emit('search:query-ready', { keyword })
    return { keyword }
  },
  teardown() {
    // Runtime 仍会统一回收当前实例登记的资源。
  }
})

const runtime = createSkillRuntime()
runtime.register(normalizeQuery)

const scope = runtime.createScope('search-page')
const handle = runtime.mount(
  'search.normalize-query',
  { keyword: '  AMG  ' },
  { scope }
)

await handle.ready

// 页面或任务结束时幂等释放；重复调用不会重复 teardown。
await handle.dispose()
await scope.dispose()
await runtime.dispose()
```

`mount(name, config, options)` 返回实例句柄。`handle.ready` 表示异步 `setup` 已结束；`handle.dispose()` 是该实例唯一的释放入口。`options.host` 可传入宿主组件公开能力，`options.scope` 用于显式加入局部作用域。

## 生命周期与隔离

一次挂载遵循以下顺序：

```text
register definition
  -> mount
  -> create isolated SkillContext
  -> setup(ctx, config)
  -> ready
  -> dispose
  -> teardown exactly once
```

- `instanceId` 在 Runtime 内唯一，实例 `state` 不与其他挂载共享。
- `ctx.on(...)`、请求取消器、定时器等资源应登记到当前上下文，由 `dispose` 统一回收。
- `setup` 尚未完成时调用 `dispose`，Runtime 也必须阻止迟到结果写回，并继续完成回收。
- `onError` 负责单 Skill 的降级或上报；未处理错误仍由实例句柄和 Pipeline 明确暴露，禁止静默伪造成功。
- Global 只共享 Skill 注册表；Scope 可显式共享事件与 Scope 状态；组件实例状态始终独立。
- 同名 Skill 的重复注册、重复活动实例 ID、未知 Skill 与已销毁 Scope 都应快速失败，而不是隐式覆盖或复活。

## Vue：Scope 与 `v-skill`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import {
  createSkillPlugin,
  createSkillRuntime,
  defineSkill
} from 'amg-webui/skill'

const runtime = createSkillRuntime()
runtime.register(defineSkill({
  name: 'form.audit-change',
  setup(ctx, config: { field: string }) {
    ctx.emit('form:changed', config)
  },
  teardown() {}
}))

createApp(App)
  .use(createSkillPlugin({ runtime }))
  .mount('#app')
```

安装插件后可使用局部 Scope 和指令：

```vue
<template>
  <AmgSkillScope v-slot="{ scope }">
    <input
      v-skill="{
        name: 'form.audit-change',
        config: { field: 'keyword' },
        scope
      }"
    />
  </AmgSkillScope>
</template>
```

- `AmgSkillScope` 负责后代 Skill 的局部所有权与统一销毁，可用于“搜索表单 ↔ 表格”“弹窗提交 ↔ 列表刷新”等协作。
- 组合式代码可通过 `useSkillScope()` 注入 Scope；指令绑定应像上例一样显式传入 `scope`，避免读取 Vue 私有实例。
- `v-skill` 在挂载时创建实例、binding 引用变化时重挂载、元素卸载时释放实例；原地深改 config 不会触发更新，应替换 binding 对象。
- 指令只把公开宿主能力交给上下文，不读取 Vue 私有实例，也不要求组件源码感知 Skill。
- 复杂流程优先使用 Scope + Pipeline；单宿主增强使用 `v-skill`。

## Pipeline JSON v1

`createSkillPipeline` 接受 `version: 1` 的声明式定义。顶层 `items` 按顺序执行；节点支持 Skill、并行、条件、重试与降级。

下例名称均是假设业务已经 `runtime.register(...)` 的示意 Skill，不代表 SR3 官方 built-ins 已交付。

```ts
import {
  createSkillPipeline,
  createSkillPipelineExecutor
} from 'amg-webui/skill/core'

const definition = createSkillPipeline({
  version: 1,
  items: [
    {
      type: 'skill',
      name: 'request-wrapper',
      config: { resource: 'orders' }
    },
    {
      type: 'parallel',
      items: [
        { type: 'skill', name: 'dict-mapping', config: { dictionary: 'status' } },
        { type: 'skill', name: 'table-search', config: { pageSize: 20 } }
      ]
    },
    {
      type: 'if',
      condition: 'can-export-orders',
      then: [
        {
          type: 'retry',
          max: 2,
          item: { type: 'skill', name: 'table-export', config: { format: 'csv' } }
        }
      ],
      else: []
    },
    {
      type: 'fallback',
      item: { type: 'skill', name: 'form-submit', config: {} },
      fallback: { type: 'skill', name: 'request-wrapper', config: { mode: 'offline' } }
    }
  ]
})

const executor = createSkillPipelineExecutor(runtime)
executor.registerCondition('can-export-orders', ({ scope }) =>
  scope.state.permissions === 'export'
)

const run = executor.start(definition, { scope })
try {
  await run.ready
} finally {
  await run.dispose()
}
```

JSON 等价形态：

```json
{
  "version": 1,
  "items": [
    { "type": "skill", "name": "table-search", "config": { "pageSize": 20 } },
    {
      "type": "if",
      "condition": "can-export-orders",
      "then": [{ "type": "skill", "name": "table-export", "config": { "format": "csv" } }],
      "else": []
    }
  ]
}
```

### v1 节点语义

| 节点 | 语义 |
|------|------|
| `skill` | 从 Runtime 注册表解析名称并挂载一个 Skill。 |
| `parallel` | 并行启动 `items`；失败策略由执行器契约统一处理。 |
| `if` | 通过已注册条件名选择 `then` 或 `else`；JSON 内不放函数。 |
| `retry` | 总计最多尝试 `max` 次；默认只重试 `SkillExecutionError`，Skill 必须自行保证副作用可重入或幂等。 |
| `fallback` | `item` 产生 `SkillExecutionError` 后执行 `fallback`；取消、未知注册和配置错误不降级。 |

Pipeline 定义本身只包含 JSON 值。`Date`、`Map`、`Set`、`BigInt`、函数、DOM 节点、Vue Ref、Error 实例和循环引用都不属于 v1 配置。

## 安全与限制

- Pipeline 不是 JavaScript 沙箱。只有应用显式注册的可信 Skill 才能执行。
- 条件字段只引用 `registerCondition(name, fn)` 注册的谓词；实现不得对 JSON 字符串使用 `eval`、`Function` 或模板代码执行。
- `retry.max` 表示总尝试次数，必须是 `1–10` 的整数；禁止用重试制造无限请求。
- 请求必须接受当前上下文的取消信号；销毁一个 Scope 不得取消其他 Scope 的请求。
- Adapter 应校验外部响应并映射为 Skill 的稳定输入/输出；不得把后端字段形状泄漏进通用 Skill。
- Observer、开发日志和 DevTools 默认不记录完整 payload；密码、令牌、Cookie、个人信息和业务密钥不得写进 Pipeline JSON。
- `host` 是运行时引用，不参与序列化。Skill 只能调用宿主公开 Expose，禁止访问 `$`、`_` 开头的 Vue 私有字段。
- `v-skill` 不会把 DOM 或 Vue 私有实例隐式作为 host；需要宿主能力时必须显式传入版本化 bridge。
- Core 不提供 UI 渲染、隐式网络请求、全局状态库或 AI 模型能力。AI 可以由业务方作为自定义 Skill 接入。
- SSR/无 DOM 环境应使用 `amg-webui/skill/core`；需要 DOM 的行为只能放在 Vue 集成或业务 Adapter 中，并做环境守卫。

## 当前范围与后续内置 Skill

当前 experimental 阶段聚焦最小运行时契约：

- Skill 定义、注册、挂载、错误与幂等销毁
- 独立 Context、Runtime Scope 和作用域事件协作
- `v-skill`、`AmgSkillScope` 与 Vue 插件
- Pipeline JSON v1 及顺序、并行、条件、重试、降级执行
- Adapter / Observer 扩展点的稳定边界

后续阶段将逐项提供官方内置 Skill；在对应实现、测试和文档完成前，不应把这些名称视为稳定 API：

| Skill | 目标能力 |
|-------|----------|
| `table-search` | 查询、分页、刷新与加载状态协作 |
| `dict-mapping` | 字典加载、缓存、翻译与格式化 |
| `form-submit` | 校验、提交、loading、成功后重置 |
| `table-export` | 导出数据准备与格式 Adapter，不直接渲染下载 UI |
| `request-wrapper` | 取消、超时、有限重试与统一错误映射 |

内置 Skill 仍遵守同一边界：不导入组件源码、不绑定后端协议、不参与 UI 渲染，并可被自定义 Skill 或 Pipeline 替换。
