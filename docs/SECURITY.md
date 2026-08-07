# 安全防护层（Vp Security）

企业基建独家赛道：HTML 白名单消毒、链接协议拦截、表单危险输入过滤、开发态告警。

对标 [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)「安全防护层」。包：`packages/security`（见仓库内 `packages/security/README.md`）。

## Principles

- **输出侧编码 / 注入点消毒 / 后端校验**：普通文本输入默认不改写；XSS 在 HTML 注入点与链接出口处理
- **白名单优于黑名单**：`sanitizeHtml` 只保留允许标签 / 属性
- **协议拦截**：`javascript:` / `data:` / `vbscript:` / `file:` 拒绝；相对路径默认允许
- **零第三方依赖**：不引入 DOMPurify（信创 / 离线）
- **告警旁路**：`SecurityService.alert` 失败不影响 UI；默认不保存原文（`detailHash` / `detailLength` / `matchedRule`）
- **SSR 安全**：无 `document` 时 `sanitizeHtml` → `escapeHtml`

## Quick start

```ts
import {
  sanitizeHtml,
  isSafeHref,
  sanitizeUrl,
  filterDangerousInput,
  escapeHtml,
  SecurityService
} from '@amg-webui/security'
// 或从根入口：import { sanitizeHtml } from 'amg-webui'

SecurityService.configure({ appId: 'my-app', warnOnStrip: true })

const html = sanitizeHtml(userProvidedHtml)
const href = sanitizeUrl(userHref) // unsafe → undefined
// Opt-in field filter (usernames / search) — not XSS defense:
const field = filterDangerousInput(formValue)
```

### Secure preset (opt-in)

`sanitizeInput` stays **default off**. For registration / admin forms that must strip dangerous fragments:

```ts
import { SECURE_FORM_KIT } from '@amg-webui/security'
import { Form, InputText } from '@amg-webui/form'

// Form: submit-boundary deep filter
<Form v-bind="SECURE_FORM_KIT" :model="model" @submit="onSubmit">…</Form>

// Field: blur-phase filter (pair with SECURE_FORM_KIT or use alone)
<InputText v-bind="SECURE_FORM_KIT" v-model="model.name" />
```

`SECURE_INPUT_PRESET` · `SECURE_FORM_PRESET` · `SECURE_FORM_KIT` live in `packages/security/presets.ts`.

## API

| API | 作用 |
|-----|------|
| `escapeHtml` / `unescapeHtml` | 文本转义（SSR 安全） |
| `isSafeHref` / `sanitizeUrl` | 链接协议策略 |
| `sanitizeHtml` / `safeHtml` | 富文本白名单消毒 |
| `filterDangerousInput` | 可配置表单字段过滤（剥标签 / 危险协议片段）；**不是**默认 XSS 防御 |
| `applySanitizeInput` / `sanitizeModelStrings` | 输入控件相位过滤 · 表单提交深过滤（均需显式开启） |
| `SECURE_INPUT_PRESET` / `SECURE_FORM_PRESET` / `SECURE_FORM_KIT` | 文档化安全预设（默认仍关；opt-in 组合 blur 输入 + 提交过滤） |
| `SecurityService` | `configure` · `alert` · `subscribe` · `getRecentAlerts` |
| `hashDetail` | 告警原文 FNV-1a 哈希（SSR 可用） |

### `sanitizeHtml` 默认白名单

标签：`p br strong b em i u s ul ol li a span div h1–h4 blockquote code pre hr sub sup`  
`a` 属性：`href title target rel`；`target=_blank` 自动补 `rel=noopener noreferrer`。

### 告警脱敏契约

`SecurityService.alert` 归一化后：

| 字段 | 默认 |
|------|------|
| `detailHash` · `detailLength` · `matchedRule` | 有 `rawDetail` 时写入 |
| `detail` | **不写入**；仅 `configure({ includeDetail: true })` 时保留截断原文 |

监听器 / `getRecentAlerts` / 控制台默认只看到哈希与规则，避免 Token / PII / 恶意载荷进日志。

## 组件接入

| 组件 | 行为 |
|------|------|
| `Link` / `Button` | `href` 经 `isSafeHref`；不安全时不渲染可导航 `<a>` |
| `RichText` | 读写 / 粘贴 / sync / history **统一** `sanitizeHtml(value, sanitizeOptions)`；插入链接走 `sanitizeUrl`；**不使用** `document.execCommand` |
| `InputText` / `Textarea` / `Password` | `sanitizeInput` **默认 `false`**；显式 `true`/`'blur'`/`'input'` 才走 `filterDangerousInput` |
| `Form` | `sanitizeOnSubmit` → `sanitizeModelStrings`（默认关，提交边界显式开启） |
| `CodeEditor` | 高亮 HTML：`escapeHtml` + `sanitizeHtml` 白名单 span |

## 边界（诚实）

- **不替代 CSP / HTTP 安全头**；库侧负责 DOM 写入与链接出口
- `unescapeHtml` **仅实体解码**，禁止用 DOM `innerHTML` 解析（防 XSS）
- SSR：无 `document` 时 `sanitizeHtml` 退化为整段 `escapeHtml`（与客户端白名单 HTML **不等价**）；SSR 预览请用同构 DOM 或仅输出转义文本
- 手写消毒器 ≠ DOMPurify 级审计深度；持续扩充 fuzz 语料，业务仍应在信任边界再过滤
- `RichText sanitize=false` 会触发 `SecurityService` 告警，**不建议**用于不可信 HTML
- `packages/skill/core` **禁止**依赖本包
- 外部值写入 `v-html` 必须先 `sanitizeHtml`
- 普通文本框合法内容（如 `<device-id>`、`data:` 说明、`javascript:` 文案）不应默认被剥除——需要过滤时再开 `sanitizeInput`

## example

本地调试：`lab/security`（`example/pages/lab/SecurityLabPage.vue`）— **不上线**。
