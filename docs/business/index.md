# 业务模块

AMG-WebUI 提供 **五大业务域套件**（`packages/components/business/`），每个域为页面级复合模块，只依赖 base / hooks / theme / utils，**不**反向依赖其他 business 域。

> 对外 docs：概览 + DoD 对照 + 导入路径。完整页面联调在本地 **example**（`meta.group: 'biz'`），不上线。

## 架构

```
Host / example
  ├── adapter? (BizCrudAdapter)     ← 网络与持久化属宿主
  ├── access? (BizAccess)           ← UI 门控，非真实 ACL 引擎
  ├── slots / $attrs                ← 插槽化与属性透传
  └── Biz* SFC → base 组件
```

- **有 adapter**：列表分页 / CRUD 走 `list` · `get` · `create` · `update` · `remove`。
- **无 adapter**：受控 `rows` / `total` / `page` + emits（`update:*` · 域事件）。
- 域间 **禁止** 互相 import。
- 共享契约：`packages/components/business/_shared/`（经 `@amg-webui/components/business` 再导出）。

### 共享类型与钩子

| 符号 | 作用 |
|------|------|
| `BizPageQuery` / `BizPageResult` | 分页查询契约 |
| `BizAsyncState` | loading / error |
| `BizAccess` / `DEFAULT_BIZ_ACCESS` | UI 动作门控 |
| `BizCrudAdapter` | 宿主数据适配器 |
| `useBizAsync` | adapter 驱动的分页异步状态 |
| `BIZ_SLOT_NAMES` | 标准槽名：`toolbar` · `filters` · `table` · `list` · `detail` · `empty` · `error` · `loading` · `actions` |

## 五大模块

| 域 | 路径 | 主导出 | APP_WORKFLOW 场景 |
| --- | --- | --- | --- |
| **login** | `business/login` | `BizLogin` · `BizRegister` · `BizForgotPassword` · `BizCaptcha` | 多方式登录 |
| **users** | `business/users` | `BizUsers` | 头像 / 角色权限 / 列表详情 |
| **orders** | `business/orders` | `BizOrders` | 详情 / 退款 / 批量 |
| **content** | `business/content` | `BizContent` | 分类树 / 编辑 / 草稿上下架 |
| **settings** | `business/settings` | `BizSettings` | 主题 / 语言 / 安全 / 全局参数 |

```ts
import { BizLogin, BizUsers, useBizAsync } from '@amg-webui/components/business'
// 或深路径
import { BizOrders } from '@amg-webui/components/business/orders'
import 'amg-webui/style.css'
```

按需也可消费 `amg-webui/es/components/business/<domain>`（见 [ENGINEERING.md](../ENGINEERING.md) on-demand 构建）。

## DoD 对照表（实现验收）

与 `docs/LIBRARY_PLAN.md` / `docs/APP_WORKFLOW.md` 对齐；下列项须可在 example biz 专区跑通。

| 域 | 必达能力 | 状态 |
| --- | --- | --- |
| **_shared** | `BizPageQuery` · `BizCrudAdapter` · `useBizAsync` · 标准槽名 | 已实现 |
| **users** | Avatar；详情 Dialog 与编辑 Dialog 分离；权限展示/门控；Pagination；`empty`/`error`；标准插槽；表单校验；可选 adapter | 已实现 |
| **orders** | 详情 Drawer；状态筛选；退款；批量取消；Pagination；标准插槽；可选 adapter；文案走 i18n | 已实现 |
| **content** | 分类 Tree + 列表；编辑 Dialog + `#editor` 槽；草稿 / 发布 / 归档；Pagination；标准插槽 | 已实现 |
| **settings** | 主题切换；locale；改密（security）；全局 params（`v-model`/emit）；profile 由 props 注入（无写死资料） | 已实现 |
| **login** | password + sms 双模；`#qr` / `#oauth` 槽；必填校验；模式切换 | 已实现 |
| **五域共性** | 标准插槽（含 `loading`）+ `$attrs` 透传；loading / empty / error 可替换；列表域无 adapter 时客户端分页切片（`total` 未传） | 已实现 |

### 验收清单（人工 / CI）

1. `npx vue-tsc --noEmit` 通过。
2. `npm run dev` → example 专区 **biz**：五页覆盖上表场景行。
3. users / orders / content：分页可翻页；有 adapter 时列表来自 mock store。
4. orders：打开详情 → 退款 / 批量取消可触发宿主事件或 adapter 副作用。
5. content：树节点筛选列表；编辑 Dialog 默认或 `#editor` 槽可见；发布/归档可点。
6. settings：切换 locale / 改密 / 改 params 有 emit；无硬编码账号资料。
7. login：password ↔ sms；未填必填项不可提交；`#qr` / `#oauth` 可被宿主替换。
8. 本文档表格与实现一致（改 API 须同步本页）。

## example 联调

```bash
npm run dev   # → meta.group: 'biz'
```

Mock adapters：`example/mock/biz/adapters.ts`（users / orders / content 真分页 CRUD；settings / login 走 props+emits）。沙箱：`example/components/BusinessExampleSandbox.vue`。

**禁止**将 example 业务调试页部署为对外官网。

## 与 base 组件关系

```
business/<domain>  →  base（DataTable / Pagination / Dialog / Drawer / Avatar / Tree / Empty / Form* / Tag / …）
                   →  hooks / theme / utils / locale
                   ✗  其他 business 域
                   ✗  Skill Runtime / Telemetry 硬依赖
```

## 版本边界

业务模块属 **biz 赛道**（对标 Element Plus 空白区）。pre-1.0 API **可变**；0.1 承诺边界以 [V0_1_SUBSET.md](../V0_1_SUBSET.md) 的 **base 子集**为主，见 [RELEASE_0.1.md](../RELEASE_0.1.md)。
