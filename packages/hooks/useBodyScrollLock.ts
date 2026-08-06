import { onUnmounted, watch, type Ref } from "vue";
import { getDocument, getWindow } from "@amg-webui/utils/env";

interface ScrollLockState {
  count: number;
  rootOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
}

const states = new WeakMap<Document, ScrollLockState>();

function acquire(doc: Document) {
  const current = states.get(doc);
  if (current) {
    current.count += 1;
    return;
  }

  const win = getWindow();
  const scrollbarWidth = Math.max(
    0,
    (win?.innerWidth ?? 0) - doc.documentElement.clientWidth,
  );
  const state: ScrollLockState = {
    count: 1,
    rootOverflow: doc.documentElement.style.overflow,
    bodyOverflow: doc.body.style.overflow,
    bodyPaddingRight: doc.body.style.paddingRight,
  };

  states.set(doc, state);
  doc.documentElement.style.overflow = "hidden";
  doc.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const currentPadding =
      Number.parseFloat(win?.getComputedStyle(doc.body).paddingRight ?? "0") ||
      0;
    doc.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
}

function release(doc: Document) {
  const state = states.get(doc);
  if (!state) return;
  state.count -= 1;
  if (state.count > 0) return;

  doc.documentElement.style.overflow = state.rootOverflow;
  doc.body.style.overflow = state.bodyOverflow;
  doc.body.style.paddingRight = state.bodyPaddingRight;
  states.delete(doc);
}

/**
 * Reference-counted document scroll locking for nested drawers and dialogs.
 * Every consumer restores the exact inline styles that existed before the
 * first overlay opened.
 */
export function useBodyScrollLock(active: Ref<boolean>, enabled: Ref<boolean>) {
  let ownsLock = false;

  function sync() {
    const doc = getDocument();
    if (!doc) return;
    const shouldLock = active.value && enabled.value;
    if (shouldLock && !ownsLock) {
      acquire(doc);
      ownsLock = true;
    } else if (!shouldLock && ownsLock) {
      release(doc);
      ownsLock = false;
    }
  }

  watch([active, enabled], sync, { immediate: true });
  onUnmounted(() => {
    const doc = getDocument();
    if (doc && ownsLock) release(doc);
    ownsLock = false;
  });
}
