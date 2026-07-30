# 业务模块

AMG-WebUI 提供 **五大业务域套件**（`packages/components/business/`），每个域为页面级复合模块，只依赖 base / hooks / theme / utils，**不**反向依赖其他 business 域。

> 0.1 对外 docs 为概览 + 导入路径；完整页面联调在本地 **example**（`meta.group: 'biz'`），不上线。

## 五大模块

| 域 | 路径 | 典型导出 | 场景 |
| --- | --- | --- | --- |
| **login** | `@amg-webui/components/business/login` | `BizLogin` · `BizRegister` · `BizForgotPassword` · `BizCaptcha` · `useLoginForm` | 登录 / 注册 / 找回密码 / 验证码 |
| **users** | `@amg-webui/components/business/users` | 用户列表、角色、权限面板 | 组织与用户管理 |
| **orders** | `@amg-webui/components/business/orders` | 订单列表、详情、状态流 | 交易 / 工单 |
| **content** | `@amg-webui/components/business/content` | 内容条目、分类、发布流 | CMS / 运营内容 |
| **settings** | `@amg-webui/components/business/settings` | 系统设置、偏好、安全项 | 管理后台设置 |

## 使用方式

```ts
import { BizLogin } from '@amg-webui/components/business/login'
import 'amg-webui/style.css'
```

各域 `index.ts` 导出 Vue SFC + composables + types；按需深路径 import 利于 tree-shake。

## 与 base 组件关系

```
business/<domain>  →  base（Button / Form / DataTable / …）
                   →  hooks / theme / utils
                   ✗  其他 business 域
```

## 0.1 SLA

业务模块属 **biz 赛道**（对标 Element Plus 空白区）；0.1 承诺边界以 [V0_1_SUBSET.md](../V0_1_SUBSET.md) 的 **base 子集**为主。biz 套件随库发布，API 在 pre-1.0 阶段**可变**，详见 [RELEASE_0.1.md](../RELEASE_0.1.md)。

## 本地调试

```bash
npm run dev   # example → 专区 biz
```

勿将 example 业务调试页部署为对外官网。
