# Overlay Runtime（UI 弹层内核）

> 与 Theme CSS-var **overlay**（`applyCustom` / `replaceCustom`）无关。本文档专指 Dialog / Drawer / Popover 等浮层的统一运行时。

## 状态

**已交付**：`packages/runtime` → 公开入口 `amg-webui/runtime`；Vue 接入 `useOverlay`（`amg-webui/hooks`）。

已接入组件：Dialog · Drawer · Mask · Confirm · ConfirmDialog · MessageBox · ImageViewer · Popover · Tooltip · Dropdown · Menu（popup）· Popconfirm · Tour · ContextMenu · StatusModal（internal）· GbsAlarmModal。

Loading 仅 scroll-lock（非模态栈成员，不走 Escape/trap）。

## 模块

| 模块 | 职责 |
|------|------|
| `app-context` | 默认 `teleportTo` / `zIndexBase` / `namespace` |
| `overlay-manager` | 开/关层、栈、策略默认值 |
| `z-index-manager` | kind 基线 + 递增；显式 `zIndex` 覆盖 |
| `scroll-lock-manager` | **引用计数**锁 + scrollbar gutter |
| `focus-manager` / `focus-trap` | 记录先前焦点、Tab 陷阱、`focusInitial` |
| `escape-stack` | 单例 capture Escape，**仅顶层**处理 |
| `teleport-manager` | 解析 Teleport 目标（SSR 安全） |
| `click-outside` | 栈顶 pointerdown outside |
| `positioning` | 再导出 `domPanel` floating/fixed API |

## 用法

```ts
import { createOverlayRuntime, configureDefaultOverlayRuntime } from 'amg-webui/runtime'
import { useOverlay } from 'amg-webui/hooks'

// 应用级：ConfigProvider 的 zIndex 会写入默认 Runtime 的 zIndexBase
configureDefaultOverlayRuntime({ zIndexBase: 2000, teleportTo: 'body' })
```

组件内（推荐）：

```ts
const panelRef = ref<HTMLElement | null>(null)
const overlay = useOverlay({
  visible: () => props.visible,
  kind: 'modal',
  container: panelRef,
  modal: true,
  lockScroll: true,
  trapFocus: true,
  closeOnEscape: true,
  onEscape: () => emit('update:visible', false),
  teleportTo: () => props.teleportTo,
  zIndex: () => props.zIndex
})
// Teleport :to="overlay.teleportTo"
// 标题 :id="overlay.titleId" · aria-labelledby
```

## 契约要点

- **多 Dialog 标题 id**：组件用 Vue `useId()`（经 `useOverlay.titleId`），禁止写死 `vp-dialog-title`。
- **Scroll lock**：两层同时打开时关一层不得解锁；由引用计数保证。
- **Escape**：多实例不得各自 `document.addEventListener`；走 Escape 栈。
- **aria-modal**：跟随 `modal` prop，非恒 `true`。
- 根入口 `amg-webui` **不**强制拉入 runtime；按需 `amg-webui/runtime`。

## 微前端

```ts
import { createOverlayRuntime, OVERLAY_RUNTIME_KEY } from 'amg-webui/runtime'
import { provide } from 'vue'

const rt = createOverlayRuntime({ zIndexBase: 3000, namespace: 'mfe-a', teleportTo: '#mfe-root' })
provide(OVERLAY_RUNTIME_KEY, rt)
// 或 <ConfigProvider :overlay-runtime="rt" overlay-teleport-to="#mfe-root" :z-index="3000" namespace="mfe-a" />
// useOverlay 解析顺序：options.runtime → inject(OVERLAY_RUNTIME_KEY) → getDefaultOverlayRuntime()
```

`namespace` 写入 AppContext（存储 / 调试隔离）；栈与 Escape 仍按 **Runtime 实例** 隔离，勿跨 MFE 共用同一 default singleton。

详见 `packages/runtime/index.ts` · Cursor：`vue3-amg-webui-engineering.mdc`。
