# Changelog

## 0.1.0

试用发包（pre-1.0）。**API 可变**；正式 1.0 见 `docs/LIBRARY_PLAN.md` P4–P5。

### 合同

- 承诺组件：v0.1 子集（Core∪B1∪B2∪B3∪**B4**），见 `docs/V0_1_SUBSET.md` · `example/v0.1-subset.ts`
- **B4 Gap Batch**：ConfigProvider · MessageBox · Affix · PageHeader · Segmented · InputOTP · TimeSelect · Mention · Image · ImageViewer · Tour · InfiniteScroll
- 子集外组件：experimental，不作稳定承诺
- 发包说明：`docs/RELEASE_0.1.md`

### 包形

- `version` 修正为 `0.1.0`（原占位 `1.0.0` 撤销）
- `peerDependencies`: `vue@^3.4` · `@lucide/vue@^1.0`
- 主入口：`dist` ESM + UMD + `style.css` + types
- 子路径：`theme` · `telemetry` · `icons` · `components/base` · `components/business`

### 能力摘要

- packages 根架构：base / business · hooks · theme · locale · icons · telemetry
- 六套锁定主题；example 本地调试壳；精选 Demo 覆盖子集

---

## 历史占位（归档）

以下为仓库早期脚手架纪要，**不是** npm 1.0 发版记录。

### 脚手架纪要

- packages 根架构与业务五域
- 六套锁定主题
- example / build / scripts / docs 脚手架
