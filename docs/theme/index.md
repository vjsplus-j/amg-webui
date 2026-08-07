# 主题体系

> Token 合同：`packages/theme/TOKENS.md` · 布局密度：`packages/theme/SPEC.md` · Core API：`packages/theme/core.ts`

主题层不是「换皮肤 class」，而是三层 Token + `data-*` 属性轴，并由 **Theme Core（无 DOM）+ Host 适配器** 驱动运行时。

## 包入口

| 路径 | 用途 |
| --- | --- |
| `amg-webui/theme` | `ThemeService` / Font / Icon + `THEME_RUNTIME_KEY` + 规格常量 |
| `amg-webui/theme/core` | SSR 安全 Core：`createThemeRuntime`、Host / Storage、色阶、boot / style 序列化 |
| `amg-webui/theme/style.css` | 预编译主题 CSS（Token + 六品牌） |

```bash
npm run build:theme   # → dist/theme/
```

## 架构分层

| 层 | 职责 |
| --- | --- |
| **Theme Core** | 多实例 `createThemeRuntime`；不碰 `document` / `localStorage`（仅 Host / Storage 适配器） |
| **ThemeService** | 应用默认**单例**门面（example boot / 存量 API） |
| **ThemeProvider / ConfigProvider** | 同页局部主题：自建 Runtime + `provide(THEME_RUNTIME_KEY)` |
| **useThemeRuntime()** | inject 优先，否则回落到默认单例 |

**同页多主题禁止**用 `ThemeService.configure` 抢全局单例——请用 `ThemeProvider` 或自建 `createThemeRuntime`。嵌套 Scope 由 `useThemeScope` 管理：仅本地主题轴才绑定宿主；卸载 / 撤轴会 `dispose` 并清掉宿主上的 `data-*` 与自定义 CSS 变量，避免泄漏到 `documentElement` 或父级 Runtime。

## ThemeService（应用默认）

```ts
import { ThemeService } from 'amg-webui/theme'
import 'amg-webui/theme/style.css'

ThemeService.init({ overrides: { design: 'linear', scheme: 'light' } })
ThemeService.setDesign('mercedes')
ThemeService.setScheme('dark')
ThemeService.applyCustom({ '--ds-accent': '#3b82f6' }) // 增量合并
ThemeService.replaceCustom({ '--ds-accent': '#3b82f6' }) // 全量替换（缺 key 会从宿主移除）
ThemeService.setPrimary('#3b82f6') // → --primary-50…900 + 语义桥
```

写入宿主的属性轴：`data-design` · `data-scheme` · `data-font` · `data-icon-style`（语种仍由 `LocaleService` 写 `data-locale`）。

## 局部主题（同页双品牌 / 微前端）

```vue
<ThemeProvider design="mercedes"> … </ThemeProvider>
<ThemeProvider design="porsche" primary="#3b82f6"> … </ThemeProvider>

<!-- 或 ConfigProvider 直接带 design / tokens / primary -->
<ConfigProvider design="apple" scheme="light"> … </ConfigProvider>
```

```ts
import { useThemeRuntime } from '@amg-webui/hooks'

const runtime = useThemeRuntime() // 最近 ThemeProvider / ConfigProvider 作用域
runtime.setPrimary('#22c55e')
```

example 验证页：`lab/micro-fe`。

## Theme Core（SSR / Shadow / 色阶）

```ts
import {
  createThemeRuntime,
  createNullHost,
  createMemoryStorage,
  createShadowHost,
  generatePrimaryScale,
  themeBootScriptTag
} from 'amg-webui/theme/core'

const runtime = createThemeRuntime({
  host: createNullHost(),
  storage: createMemoryStorage()
})
runtime.init({ overrides: { design: 'apple', scheme: 'light' } })
runtime.setPrimary('#ef4444')

const attrs = runtime.serializeAttrs()   // → html data-*
const style = runtime.toStyleTag()       // → <style id="amg-theme-ssr">…</style>
const boot = themeBootScriptTag({ namespace: 'amg-webui' })

// Shadow：属性与 CSS 变量写在 shadow host 元素（文档级 [data-design] 可命中 host）
const shadow = hostEl.attachShadow({ mode: 'open' })
runtime.bindHost(createShadowHost(shadow))
```

纯函数色阶：`generatePrimaryScale('#3b82f6')` → `--primary-50…900` · `--ds-accent` · `--ds-focus-ring` 等（非法色 fail-soft 返回 `{}`）。

## 诚实限制（本波）

- **Teleport 挂 `body`** 的弹层可能逃出局部主题根；`getPopupContainer` 强制挂主题根为 follow-up。
- Shadow 内**完整品牌 SCSS** `adoptedStyleSheets` 注入未做；当前依赖 host 上的 CSS 变量继承。
- Theme Studio 可视化编辑器仍属后续（见 `THEME_STUDIO.md`）；本波交付色阶纯函数 + Provider overlay。

## 官方主题（只读）

| Design | 参考 |
| --- | --- |
| mercedes · linear · porsche · lamborghini · ferrari · apple | designmd 锁定源 |

源码锁定于 `packages/theme/styles/design/`，**不可**被业务直接 fork 覆盖；自定义主题走 CSS 变量 overlay（`applyCustom` / `setPrimary` / Theme Studio）。

## 明暗 scheme

仅部分主题支持：`linear` · `apple`。

```ts
ThemeService.setScheme('light') // | 'dark'
ThemeService.toggleScheme()
```

## 无闪屏约定

1. HTML 首屏带默认 `data-design` / `data-scheme` / `data-font` / `data-icon-style`
2. `<head>` 尽早内联 `themeBootScriptTag()`（或等价脚本），在应用 JS 前把 storage 同步到属性
3. SSR 可额外注入 `runtime.toStyleTag()`（customTokens / 色阶）
4. 再加载 `amg-webui/theme/style.css`（或主包 `style.css`）

example 调试壳已按 boot 契约接入（见 `example/index.html`）。
