import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { getDocument } from "@amg-webui/utils/env";

/** Auto-dismiss timer with hover/focus and document-visibility pause support. */
export function useAutoDismiss(
  active: Ref<boolean>,
  duration: Ref<number>,
  onTimeout: () => void,
) {
  const paused = ref(false);
  const remaining = ref(Math.max(0, duration.value));
  let timer: ReturnType<typeof setTimeout> | null = null;
  let startedAt = 0;

  function clear() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function arm(ms = remaining.value) {
    clear();
    remaining.value = Math.max(0, ms);
    if (!active.value || paused.value || remaining.value <= 0) return;
    startedAt = Date.now();
    timer = setTimeout(() => {
      timer = null;
      remaining.value = 0;
      onTimeout();
    }, remaining.value);
  }

  function restart() {
    paused.value = false;
    arm(Math.max(0, duration.value));
  }

  function pause() {
    if (paused.value) return;
    paused.value = true;
    if (timer)
      remaining.value = Math.max(0, remaining.value - (Date.now() - startedAt));
    clear();
  }

  function resume() {
    if (!paused.value) return;
    paused.value = false;
    arm();
  }

  function onVisibilityChange() {
    if (getDocument()?.hidden) pause();
    else resume();
  }

  watch(
    [active, duration],
    ([isActive]) => {
      if (isActive) restart();
      else clear();
    },
    { immediate: true },
  );

  onMounted(() =>
    getDocument()?.addEventListener("visibilitychange", onVisibilityChange),
  );
  onUnmounted(() => {
    clear();
    getDocument()?.removeEventListener("visibilitychange", onVisibilityChange);
  });

  return { paused, remaining, pause, resume, restart, clear };
}
