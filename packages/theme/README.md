# @amg-webui/theme

六套 designmd 锁定主题 · Design Token · Theme Core（SSR / 微前端宿主）· Theme Studio 导出契约。

- 规范：[`SPEC.md`](./SPEC.md) · [`TOKENS.md`](./TOKENS.md)
- 权威产品说明：[`docs/THEME_STUDIO.md`](../../docs/THEME_STUDIO.md) · [`docs/theme/index.md`](../../docs/theme/index.md)

## 分层

| 层 | 入口 | 说明 |
|----|------|------|
| **Core** | `amg-webui/theme/core` | 无 DOM / 无 `localStorage`；`createThemeRuntime` + Host / Storage 适配器 |
| **Services** | `amg-webui/theme` | `ThemeService` · `FontService` · `IconStyleService`（默认单例 + document host） |
| **CSS** | `amg-webui/theme/style.css` | 预编译 Token + 品牌样式（亦可随主包 `amg-webui/style.css`） |

组件 / 页面只消费语义变量（`--ds-*` · `--theme-*` · spacing / type / radius），禁止硬编码色值尺寸。

## 快速用法

```ts
import { ThemeService } from 'amg-webui/theme'
import 'amg-webui/theme/style.css'

ThemeService.init()
ThemeService.setDesign('porsche')
ThemeService.applyCustom({ '--ds-accent': '#3b82f6' })
```

### SSR / 无闪屏

```ts
import { createThemeRuntime, createNullHost, createMemoryStorage, themeBootScriptTag } from 'amg-webui/theme/core'

// 服务端：只算状态与属性，不碰 document
const runtime = createThemeRuntime({ host: createNullHost(), storage: createMemoryStorage() })
runtime.init({ overrides: { design: 'linear', scheme: 'dark' } })
const attrs = runtime.serializeAttrs() // → html 属性

// 客户端 head：内联 boot 脚本，在首屏 CSS 前同步 localStorage → data-*
// ${themeBootScriptTag()}
```

### 微前端隔离

```ts
import { ThemeService } from 'amg-webui/theme'

ThemeService.configure({
  root: document.querySelector('#subapp-root')!,
  storageNamespace: 'subapp-orders'
})
ThemeService.init()
```

构建：`npm run build:theme` → `dist/theme/`（随 `build:lib` 一并产出）。
