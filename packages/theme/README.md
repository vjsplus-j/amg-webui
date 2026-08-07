# @amg-webui/theme

六套 designmd 锁定主题 + **WeChat（WeUI）/ Alipay（antd-mobile）** 官方语义复刻 · Design Token · Theme Core（SSR / 微前端宿主）· 主色色阶 · Theme Studio 导出契约。

- 规范：[`SPEC.md`](./SPEC.md) · [`TOKENS.md`](./TOKENS.md)
- 权威产品说明：[`docs/THEME_STUDIO.md`](../../docs/THEME_STUDIO.md) · [`docs/theme/index.md`](../../docs/theme/index.md)

## 分层

| 层 | 入口 | 说明 |
|----|------|------|
| **Core** | `amg-webui/theme/core` | 无 DOM / 无 `localStorage`；`createThemeRuntime` + Host / Storage；`generatePrimaryScale`；SSR style 序列化 |
| **Services** | `amg-webui/theme` | `ThemeService` · Font · Icon（**应用默认单例** + document host）· `THEME_RUNTIME_KEY` |
| **Vue 局部** | base `ThemeProvider` / `ConfigProvider` | 同页多实例；`useThemeRuntime()` inject 优先 |
| **CSS** | `amg-webui/theme/style.css` | 预编译 Token + 品牌样式 |

组件 / 页面只消费语义变量（`--ds-*` · `--theme-*` · spacing / type / radius），禁止硬编码色值尺寸。

## 快速用法

```ts
import { ThemeService } from 'amg-webui/theme'
import 'amg-webui/theme/style.css'

ThemeService.init()
ThemeService.setDesign('porsche')
ThemeService.setPrimary('#3b82f6')
```

### 同页多主题（推荐）

```vue
<ThemeProvider design="mercedes">…</ThemeProvider>
<ThemeProvider design="porsche" primary="#3b82f6">…</ThemeProvider>
```

不要用 `ThemeService.configure` 在同一页抢单例。

### SSR / 无闪屏

```ts
import { createThemeRuntime, createNullHost, createMemoryStorage, themeBootScriptTag } from 'amg-webui/theme/core'

const runtime = createThemeRuntime({ host: createNullHost(), storage: createMemoryStorage() })
runtime.init({ overrides: { design: 'linear', scheme: 'dark' } })
runtime.setPrimary('#ef4444')
const attrs = runtime.serializeAttrs()
const styleTag = runtime.toStyleTag()
// ${themeBootScriptTag()}
```

### Shadow host

```ts
import { createShadowHost, createThemeRuntime, createMemoryStorage } from 'amg-webui/theme/core'

const shadow = host.attachShadow({ mode: 'open' })
const runtime = createThemeRuntime({
  host: createShadowHost(shadow),
  storage: createMemoryStorage(),
  persist: false
})
runtime.init({ overrides: { design: 'linear' } })
```

构建：`npm run build:theme` → `dist/theme/`（随 `build:lib` 一并产出）。
