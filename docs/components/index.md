# 组件文档（v0.1 核心）

本阶段对外 VitePress 文档以**薄 API stub**为主；完整交互、边界与代码高亮预览在本地 **example curated demos**（不上线）。

## v0.1 核心 API（Release Step 4）

| 组件 | Docs | Example |
| --- | --- | --- |
| Button | [button](./button) | `example/demos/Button/` |
| Select | [select](./select) | `example/demos/Select/` |
| DataTable | [data-table](./data-table) | `example/demos/DataTable/` |
| Tree | [tree](./tree) | `example/demos/Tree/` |
| Form | [form](./form) | `example/demos/Form/` |
| Dialog | [dialog](./dialog) | `example/demos/Dialog/` |
| InputText | [input-text](./input-text) | `example/demos/InputText/` |
| Pagination | [pagination](./pagination) | `example/demos/Pagination/` |
| Layout | [layout](./layout) | `example/demos/Layout/` |
| Menu | [menu](./menu) | `example/demos/Menu/` |
| Tabs | [tabs](./tabs) | `example/demos/Tabs/` |
| Alert | [alert](./alert) | `example/demos/Alert/` |
| MessageBox | [message-box](./message-box) | `example/demos/MessageBox/` |
| ConfigProvider | [config-provider](./config-provider) | `example/demos/ConfigProvider/` |
| Segmented | [segmented](./segmented) | `example/demos/Segmented/` |
| Affix | [affix](./affix) | `example/demos/Affix/` |
| Image | [image](./image) | `example/demos/Image/` |
| Tour | [tour](./tour) | `example/demos/Tour/` |

生成脚本：`npm run generate:vitepress-api`（读 `types.ts` 写 stub + 更新 sidebar）。

## 本阶段已闭环子集（均 ready）

| 组件 | Docs stub | Example curated |
| --- | --- | --- |
| Empty | [empty](./empty) | `example/demos/Empty/` |
| Highlight | [highlight](./highlight) | `example/demos/Highlight/` |
| Icon | [icon](./icon) | `example/demos/Icon/` |
| Spin | [spin](./spin) | `example/demos/Spin/` |
| Divider | [divider](./divider) | `example/demos/Divider/` |
| ButtonGroup | [button-group](./button-group) | `example/demos/ButtonGroup/` |
| Space | [space](./space) | `example/demos/Space/` |
| Ellipsis | [ellipsis](./ellipsis) | `example/demos/Ellipsis/` |
| Tabs | [tabs](./tabs) | `example/demos/Tabs/` |
| **表单 wave1** Switch | [switch](./switch) | `example/demos/Switch/` |
| **表单 wave1** Radio / RadioGroup | [radio](./radio) | `example/demos/Radio/` |
| **表单 wave1** Checkbox / CheckboxGroup | [checkbox](./checkbox) | `example/demos/Checkbox/` |
| Button / Link / Tag / Avatar / Badge / Typography / Card / Collapse / Skeleton / Progress / FloatButton / … | 其余主力以 example 为准（全量 MD 属后续阶段） | `example/demos/<Name>/` |
| RichText | [rich-text](./rich-text) | `example/demos/RichText/` |
| SchemaRenderer | [schema-renderer](./schema-renderer) | `lab/lowcode` |

**通用基础 / 展示阶段清单：已全部 ready。**  
表单 wave1（Switch / Radio / RadioGroup / Checkbox / CheckboxGroup）已有 docs stub + example curated；治理节奏见 [`COMPONENT_HARDENING.md`](../COMPONENT_HARDENING.md)。  
全库其余 shell / beta 仍属多迭代工作，**不能**在一次会话里「一口气」全部晋升。

## FAQ（本阶段范围）

**Q: 本阶段还有没有必须再做的缺口？**  
A: 通用 / 展示关键子集已关闭；docs 本阶段薄 stub + FAQ 边界已齐。后续按深化计划分波推进。

**Q: 能不能一口气做完全库？**  
A: **不能。** 当前 catalog 约 **285** 是**目录库存**，不是成熟组件数，更不是 1.0。`npm run score:maturity` 产出的是**开发盘点**启发式（能力档 thin/form/interaction/composite + 深度 stub→ready），**不是**产品质量证书——静态信号（行数 / Props / 字符串 / composable 文件）不能证明键盘、多实例、竞态、SSR、泄漏、读屏、API 稳定或性能。`ready` 只表示该能力档启发式基线。子集外仍按 experimental 管理。覆盖核对：`node scripts/check-coverage.mjs`。

**Q: 为什么 docs 没有每个组件的完整 FAQ？**  
A: 本阶段明确将深度 Demo / FAQ 放在 example 调试壳；对外 docs 保证关键组件有可检索 API stub。完整 FAQ 列入后续阶段。

**Q: Telemetry / 事件总线 / 动画总开关是否已建成？**  
A: Telemetry 存在且**默认关闭**（[`TELEMETRY.md`](../TELEMETRY.md)）；全局 `EventService`（`@amg-webui/utils`）与 `AnimationService`（`@amg-webui/animations`，运动默认开启、显式 `disable`）已落地最小可用契约。联调页 `example` → `lab/telemetry` · `lab/utils`。

**Q: 安全防护层 / 低代码 Schema 现状？**  
A: 安全层见 [`SECURITY.md`](../SECURITY.md)（`@amg-webui/security`）；低代码见 [`LOWCODE.md`](../LOWCODE.md)（`@amg-webui/lowcode` + `SchemaRenderer`）。example：`lab/security` · `lab/lowcode`。
**Q: Icon 能否与 Button / Link 同口径宣称「满分闭环」？**  
A: Icon 已具备 `useIcon`、交互态、键盘与 a11y、curated demo + 薄 docs stub，可与 Button / Link 同档作为**可验收实现参照**。成熟度 JSON 的高分只是盘点信号，**不能**单独当作质量证书；闭环仍以类型检查、单测 / curated 行为与文档为准。

**Q: Spin 与 Skeleton / Button loading 如何选型？**  
A: Spin 用于区域 / 全屏遮罩加载；Skeleton 用于内容占位骨架；按钮内忙碌态用 `Button` 的 `loading`。Spin 尊重 `AnimationService` 总开关，且**不**走 Telemetry。

**Q: 组件规范草稿放哪里？**  
A: 根目录不再保留编号草稿 / 阶段验收报告。权威入口：本页 · [`V0_1_SUBSET.md`](../V0_1_SUBSET.md) · example curated demos · `packages/*/README.md`。
