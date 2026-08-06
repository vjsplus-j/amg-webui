# 安装

> 0.1 试用包合同见 [RELEASE_0.1.md](../RELEASE_0.1.md) · 承诺组件子集见 [V0_1_SUBSET.md](../V0_1_SUBSET.md)。

## 环境要求

- **Node.js** ≥ 18
- **Vue** ^3.4
- **@lucide/vue** ^1.0（图标 peer）

## 安装包

```bash
npm install amg-webui@0.1.0
npm install vue@^3.4.0 @lucide/vue@^1.0.0
```

## 引入样式

全量样式（推荐起步）：

```ts
import 'amg-webui/style.css'
// 或
import 'amg-webui/dist/style.css'
```

## 子路径导出

| 路径 | 用途 |
| --- | --- |
| `amg-webui` | 主入口（ESM / UMD + types） |
| `amg-webui/style.css` | 全量样式 |
| `amg-webui/button` · `amg-webui/data-table` · … | 按需组件（kebab → `dist/es`） |
| `amg-webui/theme` | `ThemeService` 等（`dist/theme`） |
| `amg-webui/theme/core` | Theme Core（SSR 安全） |
| `amg-webui/theme/style.css` | 预编译主题 CSS |
| `amg-webui/security` · `telemetry` · `lowcode` | 子系统（`dist/<pkg>/`，非源码） |
| `amg-webui/icons` · `hooks` · `utils` · `locale` | 运行时包 / 深路径 |
| `amg-webui/components/base` | 域 barrel（编译 re-export） |
| `amg-webui/components/business` | 五大业务域套件 |

> 公共子路径一律指向编译产物；消费者不需要仓库 alias / 编译 Vue SFC。

## 本地打库（库作者）

```bash
npm run build:lib       # → dist 主库 + runtime + on-demand + skill + theme + exports
npm run test:consumers  # → vite / webpack / nuxt fixture 安装并构建
```

## 与 example 区分

- **docs（本站）**：标准 API + 薄示例，可部署上线。
- **example**：库作者本地调试壳，**禁止**当官网或线上 demo。
