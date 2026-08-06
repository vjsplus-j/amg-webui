# Changelog

## 0.1.0

试用发包（pre-1.0）。**API 可变**；正式 1.0 见 `docs/LIBRARY_PLAN.md` P4–P5。

### 仓库卫生

- 移除根目录组件规范草稿、阶段验收报告与杂项产物（`exampleDoc.ts` / `missing-components.txt` / `test-results`）。
- 精简 `scripts/`：仅保留长期工程工具（create / entry / i18n / catalog / maturity / vitepress-api / classify-mvp / check-coverage）；一次性 patch/upgrade/fix 脚本已删除。
- 同步更新 `README` · `docs/ENGINEERING.md` · `docs/components/index.md` · `packages/*/README.md`。

### 合同

- 承诺组件：v0.1 子集（Core∪B1∪B2∪B3∪**B4**），见 `docs/V0_1_SUBSET.md` · `example/v0.1-subset.ts`
- **B4 Gap Batch**：ConfigProvider · MessageBox · Affix · PageHeader · Segmented · InputOTP · TimeSelect · Mention · Image · ImageViewer · Tour · InfiniteScroll
- 子集外组件：experimental，不作稳定承诺
- 发包说明：`docs/RELEASE_0.1.md`

### 包形

- `version` 修正为 `0.1.0`（原占位 `1.0.0` 撤销）
- `peerDependencies`: `vue@^3.4` · `@lucide/vue@^1.0`
- 主入口：`dist` ESM + UMD + `style.css` + types
- 子路径：`theme` · `telemetry` · `icons` · `components/base` · `components/business` · experimental `skill` / `skill/core`

### Skill Runtime（experimental）

- 新增独立可选 `packages/skill`：Unit / Context / Runtime / Scope、Adapter、Observer 与幂等资源回收。
- 新增 Pipeline JSON v1：顺序、并行、注册条件、有限重试与 fallback；禁止执行配置字符串。
- 新增 Vue 接入：`createSkillPlugin`、`AmgSkillScope`、`v-skill`；根入口不导出 Skill。
- 新增 `build:skill` 与 `dist/skill` ESM/CJS/types 产物；官方 built-ins、DevTools 与 example Skill Lab 留待 SR3。
- 补齐迟到 setup 抑制、并发 dispose、Scope 释放、并行 retry 隔离、fallback 错误分类与默认日志脱敏；当前仍为 experimental 最小基线。

### 实验组件补强

- Barcode 支持 17 种标准一维码制：EAN-13/EAN-8、UPC-A/UPC-E、ITF-14、GS1-128、ISBN/ISSN、GS1 DataBar、Code 128/39/93、Interleaved 2 of 5、Codabar、MSI 与 Pharmacode。
- Qrcode 从伪矩阵升级为标准 QR Code 编码，新增国标 GB/T 18284、国际 ISO/IEC 18004、日本 JIS X 0510 与美标 AIM ISS QR Code profile，支持纠错等级与静区控制。
- MatrixCode 新增 34 种二维/堆叠式码制：QR/Micro QR/rMQR/GS1/HIBC/Swiss QR、Data Matrix/DMRE/GS1/HIBC、PDF417/MicroPDF417/HIBC、Aztec、MaxiCode、Han Xin、Code One、DotCode、Code 49、Code 16K、Codablock F、Ultracode 等，补齐矩阵式、堆叠式与行业 profile 条码演示。

### 能力摘要

- packages 根架构：base / business · hooks · theme · locale · icons · telemetry · optional skill
- 六套锁定主题；example 本地调试壳；精选 Demo 覆盖子集

---

## 历史占位（归档）

以下为仓库早期脚手架纪要，**不是** npm 1.0 发版记录。

### 脚手架纪要

- packages 根架构与业务五域
- 六套锁定主题
- example / build / scripts / docs 脚手架
