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
| `amg-webui/theme` | `ThemeService` 等（`dist/theme` 预编译） |
| `amg-webui/theme/core` | Theme Core（SSR 安全，无 DOM） |
| `amg-webui/theme/style.css` | 预编译主题 CSS |
| `amg-webui/telemetry` | 交互观测（**默认关闭**） |
| `amg-webui/icons` | 图标 catalog / resolver |
| `amg-webui/components/base` | 按需深路径（利于 tree-shake） |
| `amg-webui/components/business` | 五大业务域套件 |

## 本地打库（库作者）

```bash
npm run build:lib   # → dist/amg-webui.js · .umd.cjs · style.css · *.d.ts
```

## 与 example 区分

- **docs（本站）**：标准 API + 薄示例，可部署上线。
- **example**：库作者本地调试壳，**禁止**当官网或线上 demo。
