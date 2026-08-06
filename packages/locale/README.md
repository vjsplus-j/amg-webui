# @amg-webui/locale

8 语种全量 key：`zh-CN` · `zh-TW` · `en-US` · `ja-JP` · `ko-KR` · `ko-KP` · `ru-RU` · **`ar-SA`（RTL / 独立阿语包）**。

- 规范：[`I18N.md`](./I18N.md)
- 强类型：`LocaleKey` / `LocaleMessages`（`message-schema.ts`，由 `extract:i18n` 生成）
- API：`LocaleKeys` · `LocaleService` · `registerLocale` · `useLocale()`（hooks：`t` / `tDyn` / `dir` / `setDirection`）
- 提取：`npm run extract:i18n`（缺 key / 不对齐 = 失败；重生 schema）
- RTL：`LOCALE_META.dir` · `setDirection` · 主题 `rtl.scss`

用户可见文案禁止硬编码（含 example）。`t()` 仅接受 `LocaleKey`。
