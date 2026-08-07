# 组件库总计划

权威：[LIBRARY_PLAN.md](./LIBRARY_PLAN.md) · 愿景：[VISION.md](./VISION.md) · 超车：[OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md)

**口号：对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

六大维度深度超车（Vapor / Headless / 信创微前端 / 业务·低代码·AI / 双虚拟滚动 / A11Y）—— 禁止 EP 换皮路线。

**企业基建追加**：[TELEMETRY.md](./TELEMETRY.md) — 默认关闭的 UI 交互观测内核（习惯 / 告警 / 错误分析）。

**差异化逻辑运行时追加**：`packages/skill/README.md` — Skill Runtime 保持 experimental、独立可选；公开入口锁定为 `amg-webui/skill` 与 `amg-webui/skill/core`，根入口 `amg-webui` 不导出。

当前阶段：SR1 / SR2 experimental 最小基线已实现并通过当前类型、单测、构建和包形基础门禁；稳定化 DoD 继续推进。SR3 官方 built-ins 与 example 调试页尚未实现，后续按“实现 + 测试 + 文档”闭环推进。

近期落地摘要见 [LIBRARY_PLAN.md «近期落地»](./LIBRARY_PLAN.md) · [CHANGELOG.md](./CHANGELOG.md) · [COMPONENT_HARDENING.md](./COMPONENT_HARDENING.md)。
