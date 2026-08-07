# @amg-webui/locale

10 语种全量 key：`zh-CN` · `zh-HK` · `en-US` · `hi-IN` · `ja-JP` · `ko-KR` · `ko-KP` · `ru-RU` · `ar-SA` · **`ug-CN`（维吾尔文）**。

- 规范：[`I18N.md`](./I18N.md)
- 强类型：`LocaleKey` / `LocaleMessages`（`message-schema.ts`，由 `extract:i18n` 生成）
- API：`LocaleKeys` · `LocaleService` · `registerLocale` · `useLocale()`（`t` / `tDyn` / `dir` / `setDirection` / `toggleDirection`）
- 提取：`npm run extract:i18n`（缺 key / 不对齐 = 失败；重生 schema）
- **语种 ≠ 方向**：`setLocale` / `?lang=` 只换文案；`setDirection` / `toggleDirection` / `?dir=` / 顶栏 LTR·RTL 控制 `html[dir]`；默认 `ltr`
- 主题镜像：`rtl.scss` + 逻辑属性（任意语种都可开 RTL）

用户可见文案禁止硬编码（含 example）。`t()` 仅接受 `LocaleKey`。
