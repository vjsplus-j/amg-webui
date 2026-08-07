# 愿景 / 超车捷径

**Enterprise Vue Web Application UI Platform** — 面向企业 Vue Web 应用的基础设施层：foundation / form / data / overlay 运行时、主题与 i18n、可选 Telemetry / Security / Lowcode / Skill，而非 Element Plus 换皮或组件数量竞赛。

- 口号与决策原则：[VISION.md](./VISION.md)
- 六大维度深度超车：[OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)
- 差异化逻辑运行时：`packages/skill/README.md`（experimental）

**对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

## 稳定口径（诚实）

- 映射库存约 **287** 个 Public 组件目录（不以凑满 300 为目标）。
- **Stable 仅以 Hardening 门禁 `verifiedStable` 为准**（见 `component-hardening/dashboard/component-dashboard.json` · `gates.verifiedStable`），**不得**把目录总数或 contract `productMaturity` 误报为全部 Stable。
- `depthScore` / 成熟度标签 **≠** Stable 证明。

Skill Runtime 的愿景是让 UI 保持纯粹、业务逻辑可插拔且可编排。它只通过 `amg-webui/skill` 与 `amg-webui/skill/core` 显式接入，根入口不导出。SR1 / SR2 experimental 最小基线已通过当前基础门禁，稳定化仍按专属 DoD 推进；SR3 官方 built-ins 与 example 尚未实现。
