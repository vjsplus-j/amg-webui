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

**通用基础 / 展示阶段清单：已全部 ready，可正式验收。**  
**下一阶段（表单）wave1：Switch / Radio / RadioGroup / Checkbox / CheckboxGroup** — 见验收审核报告「下一阶段-表单 wave1」。  
全库其余 shell / beta 仍属多迭代工作，**不能**在一次会话里「一口气」全部晋升。

## FAQ（本阶段范围）

**Q: 本阶段还有没有必须再做的缺口？**  
A: 没有。P0/P1（Empty / Highlight / Ellipsis / Divider / ButtonGroup / Space / Tabs / 基建）与 P2（Icon 满分、Spin→ready）均已关闭；docs 本阶段薄 stub + FAQ 边界已齐。

**Q: 能不能一口气做完全库？**  
A: **不能。** 当前 catalog 为 **285** 项；启发式成熟度快照为 stub **0** / shell **6** / beta **32** / ready **247**。评分只用于排队，不等于 API 稳定性或完整验收；子集外仍按 experimental 管理。

**Q: 为什么 docs 没有每个组件的完整 FAQ？**  
A: 本阶段明确将深度 Demo / FAQ 放在 example 调试壳；对外 docs 保证本阶段关键与整改组件有可检索 API stub。完整 FAQ 列入下一阶段。

**Q: Telemetry / 事件总线 / 动画总开关是否已建成？**  
A: Telemetry 存在且**默认关闭**；全局 `EventService`（`@amg-webui/utils`）与 `AnimationService`（`@amg-webui/animations`，运动默认开启、显式 `disable`）已落地最小可用契约。详见验收审核报告 §3.3 / §5；联调页 `example` → `lab/utils`。

**Q: Icon 能否与 Button / Link 同口径宣称「满分闭环」？**  
A: 可以。Icon 已具备 `useIcon`、交互态（`interactive` / `@click`）、键盘与 a11y、curated demo + 薄 docs stub；成熟度评分与 Button / Link 同属满分档。

**Q: Spin 与 Skeleton / Button loading 如何选型？**  
A: Spin 用于区域 / 全屏遮罩加载；Skeleton 用于内容占位骨架；按钮内忙碌态用 `Button` 的 `loading`。Spin 尊重 `AnimationService` 总开关，且**不**走 Telemetry。
