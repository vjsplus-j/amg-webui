# Vp Security（安全防护层）

企业基建独家赛道：HTML 白名单消毒、链接协议拦截、表单危险输入过滤、开发态告警。

完整契约见 [`docs/SECURITY.md`](../../docs/SECURITY.md) · 对标 [`docs/OVERTAKE_ELEMENT_PLUS.md`](../../docs/OVERTAKE_ELEMENT_PLUS.md)「安全防护层」。

## Principles

- **输出侧编码 / 注入点消毒**：普通文本输入默认不改写；`filterDangerousInput` 为可配置字段过滤器
- **白名单优于黑名单**：`sanitizeHtml` 只保留允许的标签 / 属性
- **协议拦截**：`javascript:` / `data:` / `vbscript:` / `file:` 一律拒绝；相对路径默认允许
- **零第三方依赖**：不引入 DOMPurify，信创 / 离线友好
- **告警旁路**：`SecurityService.alert` 失败不影响 UI；默认只存 `detailHash` / `detailLength` / `matchedRule`
- **SSR 安全**：无 `document` 时 `sanitizeHtml` 退化为 `escapeHtml`

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

SecurityService.configure({ appId: 'my-app', warnOnStrip: true })

const html = sanitizeHtml(userHtml)
const href = sanitizeUrl(userHref) // undefined when blocked
const name = filterDangerousInput(formField)
```

### Secure preset (opt-in)

See [`docs/SECURITY.md`](../../docs/SECURITY.md) — `SECURE_INPUT_PRESET` · `SECURE_FORM_PRESET` · `SECURE_FORM_KIT`.

## Used by

- `Link` / `Button` — `isSafeHref`
- `RichText` — 统一 `sanitizeHtml(value, sanitizeOptions)`（sync / paste / commit / history）
- `InputText` / `Textarea` / `Password` — `sanitizeInput` 默认关
- Apps may call APIs directly for `v-html` / markdown preview

## Package boundary

- Alias：`@amg-webui/security` · 发包子路径 `amg-webui/security`
- 也可从根 `amg-webui` 导入（与 Telemetry 相同）
- **不得**被 `packages/skill/core` 依赖
