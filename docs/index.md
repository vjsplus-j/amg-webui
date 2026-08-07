# Docs（VitePress）— 对外官方文档站点

**docs = 给业务开发者查阅的官方站点**：标准示例、API 参数、使用教程。  
可打包部署线上。与 **example（仅本地调试）** 严格区分，见 [APP_WORKFLOW.md §0](./APP_WORKFLOW.md)。

## 0.1 试用（Release Step 4）

| 文档 | 说明 |
|------|------|
| [安装](./guide/installation) | npm 安装与子路径 |
| [快速开始](./guide/quick-start) | 最小接入 |
| [RELEASE_0.1.md](./RELEASE_0.1.md) | 0.1.0 试用发包合同 |
| [V0_1_SUBSET.md](./V0_1_SUBSET.md) | 承诺组件子集（Core ∪ B1–B4） |

| | example | docs |
|--|------|------|
| 受众 | 库作者 | 业务开发者 |
| 部署 | **不上线** | **可上线** |
| 内容 | 半成品 / 压测 / bug 复现 / 边界 | 简洁标准示例 + API + 教程 |

```bash
npm run docs:dev          # 本地编写
# 部署：vitepress build docs（产物上线；切勿部署 example / example-dist）
```

## Skill Runtime（experimental）

Skill Runtime 位于 `packages/skill/`，只通过可选子路径 `amg-webui/skill` 与 `amg-webui/skill/core` 接入；根入口 `amg-webui` 不导出它。SR1 / SR2 experimental 最小基线已通过当前类型、单测、构建及包形基础门禁，但仍未进入 stable。SR3 官方内置 Skill 与 example 调试页尚未实现，不属于当前能力清单。

契约、最小用法与安全边界见 [SKILL_RUNTIME.md](./SKILL_RUNTIME.md)。该 API 仍为 experimental，不纳入 0.1 稳定承诺。

## 规范索引

| 文档 | 说明 |
|------|------|
| [VISION.md](./VISION.md) | 愿景口号 |
| [OVERTAKE_ELEMENT_PLUS.md](./OVERTAKE_ELEMENT_PLUS.md) | 六大维度深度超车 |
| [LIBRARY_PLAN.md](./LIBRARY_PLAN.md) | 大型库总计划 |
| [COMPONENT_HARDENING.md](./COMPONENT_HARDENING.md) | **300 组件治理** · Inventory / verify / Stable |
| [EXAMPLE_DOCUMENTATION.md](./EXAMPLE_DOCUMENTATION.md) | example 文档化方向（Track C） |
| [TELEMETRY.md](./TELEMETRY.md) | **Vp Telemetry** 交互观测内核 |
| [SKILL_RUNTIME.md](./SKILL_RUNTIME.md) | **Skill Runtime** 实验性契约、生命周期与安全编排 |
| [THEME_STUDIO.md](./THEME_STUDIO.md) | 自定义主题生成工具 |
| [ENGINEERING.md](./ENGINEERING.md) | 自动化脚本 · 性能包形 · 别名 |
| [APP_WORKFLOW.md](./APP_WORKFLOW.md) | example 调试工程 · **example↔docs 区分** |
| [CHANGELOG.md](./CHANGELOG.md) | 近期变更札记 |
| [workflow.md](./workflow.md) · [i18n.md](./i18n.md) · [tokens.md](./tokens.md) · [design-specs.md](./design-specs.md) | 捷径 |

源码：`packages/README.md`。调试壳：`example/README.md`（不上线，勿部署）。
