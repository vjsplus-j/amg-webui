# packages/

库源码主战场（无路由、无 mock 页）。统一入口：`packages/index.ts` → npm 发包 `dist/`。

## 包一览

| 包 / 目录 | 别名 | 说明 |
|-----------|------|------|
| `components/base` | `@amg-webui/components/base` | 纯 UI 原语；**禁止**依赖 business |
| `components/business` | `@amg-webui/components/business` | 五大域：`login` · `users` · `orders` · `content` · `settings` |
| `telemetry` | `@amg-webui/telemetry` | Vp Telemetry 交互观测内核（**默认关闭**） |
| `theme` | `@amg-webui/theme` | 六套 designmd 主题 · Token · Theme Studio |
| `locale` | `@amg-webui/locale` | 7 语种 · `LocaleKeys` · `LocaleService` |
| `hooks` | `@amg-webui/hooks` | `useTheme` / `useLocale` / `useTrackedEmit` … |
| `icons` | `@amg-webui/icons` | Lucide / SVG 目录 |
| `animations` | `@amg-webui/animations` | 过渡 · motion · neon · shimmer |
| `utils` · `types` · `constants` | `@amg-webui/utils` 等 | 工具、公共类型、常量 |

根再导出：`import { Button, TelemetryService } from 'amg-webui'`（或子路径 `amg-webui/telemetry`）。

## 分层硬规则

- **base → 不可 import business**
- **business → 只吃 base / hooks / theme / utils / locale / telemetry（旁路）**
- 类名前缀 **`vp-`**；样式只消费语义 Token（`--ds-*` · `--theme-*` · spacing / type / radius）
- 用户可见文案只走 i18n key（7 语种齐套）
- 列表类组件：**虚拟滚动默认开启**

## 通用分类（catalog `general`）

Avatar · AvatarGroup · Badge · Button · ButtonGroup · Card · **CardWidgets** · Collapse · **CopyText** · Divider · Ellipsis · Empty · FloatButton · Highlight · Icon · Link · Progress · Skeleton · Space · **Spin** · Statistic · Tag · Typography

交互件旁路接入 `trackEmit`（见 [`docs/TELEMETRY.md`](../docs/TELEMETRY.md)）；纯展示件（Divider / Space / Skeleton / Spin / …）不伪造交互事件。

## 新增组件

```bash
npm run create:component -- base Foo
npm run generate:entry
npm run extract:i18n
```

详见 [`docs/ENGINEERING.md`](../docs/ENGINEERING.md)。
