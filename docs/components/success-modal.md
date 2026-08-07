# SuccessModal

SuccessModal：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

SuccessModal：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { SuccessModal } from 'amg-webui/overlay'`

```vue
<script setup>
import { SuccessModal } from 'amg-webui/overlay'
</script>

<template>
  <SuccessModal />
</template>
```

Curated demo：`example/demos/SuccessModal/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| （无公开 Props） | | | |

### Public Types

- `SuccessModalProps`
- `SuccessModalEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SuccessModal uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SuccessModal RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SuccessModal client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/overlay` |
| metadata | `component-metadata/SuccessModal.json` |
| API extract | `generated/component-api/SuccessModal.json` |

> 完整 Demo 见 `example/demos/SuccessModal`（example 本地调试，不上线）。

