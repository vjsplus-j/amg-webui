# 主题体系

> Token 合同：`packages/theme/TOKENS.md` · 布局密度：`packages/theme/SPEC.md` · Core API：`packages/theme/core.ts`

主题层不是「换皮肤 class」，而是三层 Token + `data-*` 属性轴，并由 **Theme Core（无 DOM）+ Host 适配器** 驱动运行时。

## 包入口

| 路径 | 用途 |
| --- | --- |
| `amg-webui/theme` | `ThemeService` / Font / Icon + 规格常量（预编译 JS） |
| `amg-webui/theme/core` | SSR 安全 Core：`createThemeRuntime`、Host / Storage、boot 脚本 |
| `amg-webui/theme/style.css` | 预编译主题 CSS（Token + 六品牌） |

```bash
npm run build:theme   # → dist/theme/
```

## ThemeService

```ts
import { ThemeService } from 'amg-webui/theme'
import 'amg-webui/theme/style.css'

ThemeService.init({ overrides: { design: 'linear', scheme: 'light' } })
ThemeService.setDesign('mercedes')
ThemeService.setScheme('dark')
ThemeService.applyCustom({ '--ds-accent': '#3b82f6' }) // 热更新，不重挂树
```

写入宿主的属性轴：`data-design` · `data-scheme` · `data-font` · `data-icon-style`（语种仍由 `LocaleService` 写 `data-locale`）。

## Theme Core（SSR）

```ts
import {
  createThemeRuntime,
  createNullHost,
  createMemoryStorage,
  serializeThemeAttrs,
  themeBootScriptTag
} from 'amg-webui/theme/core'

const runtime = createThemeRuntime({
  host: createNullHost(),
  storage: createMemoryStorage()
})
runtime.init({ overrides: { design: 'apple', scheme: 'light' } })

// SSR：把 serializeThemeAttrs() 打进 <html>
const attrs = runtime.serializeAttrs()

// 无闪屏：在首屏 CSS 之前内联 boot 脚本
const boot = themeBootScriptTag({ namespace: 'amg-webui' })
```

## 微前端隔离

默认单例写 `document.documentElement` + `amg-webui-*` storage keys。子应用可：

```ts
ThemeService.configure({
  root: document.querySelector('#subapp')!,
  storageNamespace: 'orders-mfe'
})
```

或自建 `createThemeRuntime({ host, storage, storageNamespace })`，避免抢全局。

## 官方主题（只读）

| Design | 参考 |
| --- | --- |
| mercedes · linear · porsche · lamborghini · ferrari · apple | designmd 锁定源 |

源码锁定于 `packages/theme/styles/design/`，**不可**被业务直接 fork 覆盖；自定义主题走 CSS 变量 overlay（`applyCustom` / Theme Studio）。

## 明暗 scheme

仅部分主题支持：`linear` · `apple`。

```ts
ThemeService.setScheme('light') // | 'dark'
ThemeService.toggleScheme()
```

## 无闪屏约定

1. HTML 首屏带默认 `data-design` / `data-scheme` / `data-font` / `data-icon-style`  
2. `<head>` 尽早内联 `themeBootScriptTag()`（或等价脚本），在应用 JS 前把 storage 同步到属性  
3. 再加载 `amg-webui/theme/style.css`（或主包 `style.css`）

example 调试壳已按此契约接入（见 `example/index.html`）。
