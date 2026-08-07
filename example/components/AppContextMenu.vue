<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { LocaleKeys, type LocaleKey } from '@amg-webui/locale'
import { useLocale } from '@amg-webui/hooks'

type ShellCommand = 'copy' | 'paste' | 'select' | 'selectAll' | 'inspect'

interface MenuEntry {
  command: ShellCommand
  labelKey: LocaleKey
  shortcut?: string
  dividerBefore?: boolean
}

const { t } = useLocale()

const open = ref(false)
const pos = ref({ x: 0, y: 0 })
const panelRef = ref<HTMLElement | null>(null)
const hitEl = shallowRef<HTMLElement | null>(null)
const savedSelectionText = ref('')
const savedRange = shallowRef<Range | null>(null)
let inspectTimer: ReturnType<typeof setTimeout> | undefined

const entries = computed<MenuEntry[]>(() => [
  { command: 'copy', labelKey: LocaleKeys.chrome.contextCopy, shortcut: 'Ctrl+C' },
  { command: 'paste', labelKey: LocaleKeys.chrome.contextPaste, shortcut: 'Ctrl+V' },
  { command: 'select', labelKey: LocaleKeys.chrome.contextSelect },
  { command: 'selectAll', labelKey: LocaleKeys.chrome.contextSelectAll, shortcut: 'Ctrl+A' },
  {
    command: 'inspect',
    labelKey: LocaleKeys.chrome.contextInspect,
    dividerBefore: true
  }
])

function isEditable(el: Element | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return true
  return el.isContentEditable === true
}

function resolveEditable(from: HTMLElement | null): HTMLElement | null {
  if (!from) return null
  if (isEditable(from)) return from
  return from.closest('input, textarea, [contenteditable="true"]') as HTMLElement | null
}

function snapshotSelection() {
  const sel = window.getSelection()
  savedSelectionText.value = sel?.toString() ?? ''
  savedRange.value = null
  if (sel && sel.rangeCount > 0) {
    try {
      savedRange.value = sel.getRangeAt(0).cloneRange()
    } catch {
      savedRange.value = null
    }
  }
}

function restoreSelection(): boolean {
  const range = savedRange.value
  if (!range) return false
  const sel = window.getSelection()
  if (!sel) return false
  try {
    sel.removeAllRanges()
    sel.addRange(range)
    return true
  } catch {
    return false
  }
}

async function writeClipboard(text: string): Promise<boolean> {
  if (!text) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for environments without clipboard permission
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }
}

async function readClipboard(): Promise<string> {
  try {
    return await navigator.clipboard.readText()
  } catch {
    return ''
  }
}

function insertIntoEditable(editable: HTMLElement, text: string) {
  editable.focus()
  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    const start = editable.selectionStart ?? editable.value.length
    const end = editable.selectionEnd ?? editable.value.length
    const next = editable.value.slice(0, start) + text + editable.value.slice(end)
    const proto = Object.getOwnPropertyDescriptor(
      editable instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype,
      'value'
    )
    proto?.set?.call(editable, next)
    const caret = start + text.length
    editable.setSelectionRange(caret, caret)
    editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: text }))
    editable.dispatchEvent(new Event('change', { bubbles: true }))
    return
  }

  if (!document.execCommand('insertText', false, text)) {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(text))
    range.collapse(false)
  }
}

async function onCopy() {
  const fromSnapshot = savedSelectionText.value
  if (fromSnapshot) {
    await writeClipboard(fromSnapshot)
    return
  }

  restoreSelection()
  const live = window.getSelection()?.toString() ?? ''
  if (live) {
    await writeClipboard(live)
    return
  }

  const editable = resolveEditable(hitEl.value)
  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    const start = editable.selectionStart ?? 0
    const end = editable.selectionEnd ?? 0
    if (end > start) {
      await writeClipboard(editable.value.slice(start, end))
      return
    }
    if (editable.value) await writeClipboard(editable.value)
  }
}

async function onPaste() {
  const editable =
    resolveEditable(hitEl.value) ??
    (isEditable(document.activeElement) ? (document.activeElement as HTMLElement) : null)
  if (!editable || !isEditable(editable)) return
  const text = await readClipboard()
  if (!text) return
  insertIntoEditable(editable, text)
}

function onSelect() {
  const el = hitEl.value
  if (!el) return

  const editable = resolveEditable(el)
  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    editable.focus()
    const value = editable.value
    let start = editable.selectionStart ?? 0
    let end = editable.selectionEnd ?? 0
    if (end === start) {
      let left = start
      let right = start
      while (left > 0 && /\S/.test(value[left - 1]!)) left -= 1
      while (right < value.length && /\S/.test(value[right]!)) right += 1
      if (right > left) editable.setSelectionRange(left, right)
      else editable.select()
    }
    return
  }

  // Prefer expanding the saved caret into a word; else select the hit node text
  const sel = window.getSelection()
  if (!sel) return

  if (savedRange.value) {
    try {
      sel.removeAllRanges()
      sel.addRange(savedRange.value.cloneRange())
      // Expand to word boundaries when collapsed
      if (sel.isCollapsed && sel.anchorNode && sel.anchorNode.nodeType === Node.TEXT_NODE) {
        const text = sel.anchorNode.textContent ?? ''
        let left = sel.anchorOffset
        let right = sel.anchorOffset
        while (left > 0 && /\S/.test(text[left - 1]!)) left -= 1
        while (right < text.length && /\S/.test(text[right]!)) right += 1
        if (right > left) {
          const range = document.createRange()
          range.setStart(sel.anchorNode, left)
          range.setEnd(sel.anchorNode, right)
          sel.removeAllRanges()
          sel.addRange(range)
          return
        }
      }
      if (!sel.isCollapsed) return
    } catch {
      /* fall through */
    }
  }

  const range = document.createRange()
  range.selectNodeContents(el)
  sel.removeAllRanges()
  sel.addRange(range)
}

function onSelectAll() {
  const editable =
    resolveEditable(hitEl.value) ??
    (isEditable(document.activeElement) ? (document.activeElement as HTMLElement) : null)

  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    editable.focus()
    editable.select()
    return
  }

  if (editable?.isContentEditable) {
    editable.focus()
    const sel = window.getSelection()
    if (!sel) return
    const range = document.createRange()
    range.selectNodeContents(editable)
    sel.removeAllRanges()
    sel.addRange(range)
    return
  }

  const root = document.querySelector('.app') ?? document.body
  const sel = window.getSelection()
  if (!sel) return
  const range = document.createRange()
  range.selectNodeContents(root)
  sel.removeAllRanges()
  sel.addRange(range)
}

function clearInspectOutline() {
  document.querySelectorAll('.vp-app-inspect-outline').forEach((node) => {
    node.classList.remove('vp-app-inspect-outline')
  })
}

function onInspect() {
  clearInspectOutline()
  const el = hitEl.value
  if (!el) return
  el.classList.add('vp-app-inspect-outline')
  console.info('[example inspect]', el)
  el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  if (inspectTimer) clearTimeout(inspectTimer)
  inspectTimer = setTimeout(() => {
    el.classList.remove('vp-app-inspect-outline')
  }, 2400)
}

function hideMenu() {
  open.value = false
}

async function runCommand(command: ShellCommand) {
  hideMenu()
  // Defer so focus/selection restore after menu unmount
  await Promise.resolve()
  switch (command) {
    case 'copy':
      await onCopy()
      break
    case 'paste':
      await onPaste()
      break
    case 'select':
      onSelect()
      break
    case 'selectAll':
      onSelectAll()
      break
    case 'inspect':
      onInspect()
      break
  }
}

function onItemPointerDown(event: MouseEvent, command: ShellCommand) {
  // Prevent focus steal / selection clear before the action runs
  event.preventDefault()
  event.stopPropagation()
  void runCommand(command)
}

function clampPosition(x: number, y: number) {
  const pad = 4
  const w = panelRef.value?.offsetWidth ?? 220
  const h = panelRef.value?.offsetHeight ?? 180
  const maxX = Math.max(pad, window.innerWidth - w - pad)
  const maxY = Math.max(pad, window.innerHeight - h - pad)
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY)
  }
}

function onContextMenu(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  // Component ContextMenu demos keep their own menu
  if (target.closest('.vp-contextmenu__host')) return
  if (target.closest('.vp-contextmenu__panel')) {
    event.preventDefault()
    return
  }
  if (target.closest('.vp-app-native-menu')) {
    event.preventDefault()
    return
  }

  event.preventDefault()
  event.stopPropagation()

  snapshotSelection()
  hitEl.value = target instanceof HTMLElement ? target : target.parentElement
  pos.value = { x: event.clientX, y: event.clientY }
  open.value = true

  requestAnimationFrame(() => {
    pos.value = clampPosition(event.clientX, event.clientY)
  })
}

function onDocPointerDown(event: Event) {
  if (!open.value) return
  const t = event.target
  if (t instanceof Node && panelRef.value?.contains(t)) return
  hideMenu()
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    hideMenu()
  }
}

onMounted(() => {
  document.addEventListener('contextmenu', onContextMenu, true)
  document.addEventListener('pointerdown', onDocPointerDown, true)
  document.addEventListener('keydown', onKeydown, true)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', onContextMenu, true)
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  document.removeEventListener('keydown', onKeydown, true)
  if (inspectTimer) clearTimeout(inspectTimer)
  clearInspectOutline()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="vp-app-native-menu"
      role="menu"
      :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
      @contextmenu.prevent
    >
      <template v-for="entry in entries" :key="entry.command">
        <div v-if="entry.dividerBefore" class="vp-app-native-menu__sep" role="separator" />
        <button
          type="button"
          class="vp-app-native-menu__item"
          role="menuitem"
          @pointerdown="onItemPointerDown($event, entry.command)"
        >
          <span class="vp-app-native-menu__label">{{ t(entry.labelKey) }}</span>
          <span v-if="entry.shortcut" class="vp-app-native-menu__shortcut">{{ entry.shortcut }}</span>
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
/* Chromium / OS-like shell menu — system colors, not theme chrome */
.vp-app-native-menu {
  position: fixed;
  z-index: 10000;
  min-width: 200px;
  max-width: min(320px, calc(100vw - 8px));
  padding: 4px 0;
  margin: 0;
  box-sizing: border-box;
  background: Canvas;
  color: CanvasText;
  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
  border-radius: 6px;
  box-shadow:
    0 2px 6px color-mix(in srgb, CanvasText 12%, transparent),
    0 8px 24px color-mix(in srgb, CanvasText 16%, transparent);
  font-family: system-ui, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  line-height: 1.35;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.vp-app-native-menu__sep {
  height: 1px;
  margin: 4px 8px;
  background: color-mix(in srgb, CanvasText 14%, transparent);
}

.vp-app-native-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  width: 100%;
  margin: 0;
  padding: 6px 12px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: default;
}

.vp-app-native-menu__item:hover,
.vp-app-native-menu__item:focus-visible {
  background: Highlight;
  color: HighlightText;
  outline: none;
}

.vp-app-native-menu__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
}

.vp-app-native-menu__shortcut {
  flex-shrink: 0;
  opacity: 0.55;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.vp-app-native-menu__item:hover .vp-app-native-menu__shortcut,
.vp-app-native-menu__item:focus-visible .vp-app-native-menu__shortcut {
  opacity: 0.8;
}
</style>
