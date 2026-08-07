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
| `overlay-manager` | 开/关层、**本 Runtime 栈**、策略默认值；向 Document Coordinator 注册 |
| `document-overlay-coordinator` | **Document 级** Escape / ClickOutside / FocusTrap / ScrollLock；按全局最高 z-index 派发 |
| `z-index-manager` | kind 基线 + 递增；显式 `zIndex` 覆盖（per Runtime） |
| `scroll-lock-manager` | **引用计数**锁 + scrollbar gutter；owner 带 `runtimeId:layerId` |
| `focus-manager` / `focus-trap` | 记录先前焦点、`focusInitial`；Tab 陷阱由 Coordinator 激活 |
| `escape-stack` | 底层 LIFO 工具（单 Runtime 场景仍可直接用） |
| `teleport-manager` | 解析 Teleport 目标（SSR 安全） |
| `click-outside` | 底层 pointer 工具 |
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
- **Scroll lock**：两层同时打开时关一层不得解锁；由引用计数保证。`runtime.dispose()` **只释放本 Runtime 的 owner**，不得 `reset()` 共享锁。
- **Escape / ClickOutside / FocusTrap**：Document 上各 **至多一个** listener；由 `DocumentOverlayCoordinator` 按 **全局最高 z-index** 层派发（跨 MFE Runtime 正确）。
- **嵌套焦点恢复**：关闭子 Dialog 时，若 `previouslyFocused` 仍在父层 `container` 内，则 restore 到触发按钮（即使父层仍 `trapFocus`）。
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

`namespace` 写入 AppContext（存储 / 调试隔离）。**栈归属**按 Runtime 实例；**Document 物理资源**（Escape / pointer / focus trap / scroll）由 Coordinator 统一协调。卸载 MFE 时 `rt.dispose()` 只清本 Runtime 登记，不会拆掉其他 MFE 的 scroll lock。

详见 `packages/runtime/index.ts` · Cursor：`.cursor/rules/11-component-engineering.mdc`。
